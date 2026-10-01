import defaultWorkerURL from "./playback.worker?worker&url";
import { sendSbc, type SbcPlaybackOptions, type SbcPlaybackStats } from "./send-sbc";
import { matchingPlaybackDevices, playbackDeviceIdentity, type PlaybackResponse } from "./playback-protocol";

class WorkerUnavailable extends Error {}

async function sendInWorker(device: HIDDevice, data: Uint8Array<ArrayBuffer>, options: SbcPlaybackOptions) {
  const identity = playbackDeviceIdentity(device);
  try {
    const matches = matchingPlaybackDevices(await navigator.hid.getDevices(), identity);
    if (matches.length !== 1 || matches[0] !== device) {
      throw new Error("Cannot identify a unique controller for worker playback");
    }
  } catch (error) {
    throw new WorkerUnavailable(error instanceof Error ? error.message : String(error));
  }
  return new Promise<SbcPlaybackStats>((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL(options.workerURL ?? defaultWorkerURL, document.baseURI), { type: "module" });
    } catch (error) {
      reject(new WorkerUnavailable(error instanceof Error ? error.message : String(error)));
      return;
    }
    let started = false, settled = false;
    const cleanup = () => {
      clearTimeout(startupTimeout);
      worker.terminate();
    };
    const fail = (reason: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      // Once data has been handed off, never replay it on the main thread:
      // the worker may already have sent some audio to the controller.
      reject(started ? new Error(reason) : new WorkerUnavailable(reason));
    };
    const startupTimeout = setTimeout(() => fail("Playback worker setup timed out"), 5000);
    worker.onerror = event => { event.preventDefault(); fail("Playback worker failed to load or execute"); };
    worker.onmessageerror = () => fail("Playback worker message could not be decoded");
    worker.onmessage = ({ data: message }: MessageEvent<PlaybackResponse>) => {
      if (settled) return;
      if (message.type === "ready" && !started) {
        clearTimeout(startupTimeout);
        started = true;
        // data is the private snapshot made by readSbcInput(), never the caller's buffer.
        try { worker.postMessage({ type: "play", data, bufferAheadMs: options.bufferAheadMs }, [data.buffer]); }
        catch (error) { fail(error instanceof Error ? error.message : String(error)); }
      } else if (message.type === "complete" && started) {
        settled = true;
        cleanup();
        resolve(message.stats);
      } else if (message.type === "error" || message.type === "unavailable") {
        fail(message.reason);
      }
    };
    try { worker.postMessage({ type: "prepare", identity }); }
    catch (error) { fail(error instanceof Error ? error.message : String(error)); }
  });
}

/** Chooses the transport. The input must be an owned snapshot, safe to transfer. */
export async function sendSbcWithTransport(
  device: HIDDevice, data: Uint8Array<ArrayBuffer>, options: SbcPlaybackOptions = {},
): Promise<SbcPlaybackStats> {
  const transport = options.transport ?? "auto";
  if (!["auto", "worker", "main-thread"].includes(transport)) throw new Error("Invalid audio transport");
  if (transport === "main-thread") return sendSbc(device, data, options);
  let reason: string;
  if (typeof Worker === "undefined" || typeof document === "undefined" ||
      typeof navigator === "undefined" || typeof navigator.hid?.getDevices !== "function") {
    reason = "Worker playback requires WebHID getDevices and dedicated workers";
  } else {
    try { return await sendInWorker(device, data, options); }
    catch (error) {
      if (!(error instanceof WorkerUnavailable)) throw error;
      reason = error.message;
    }
  }
  if (transport === "worker") throw new Error(reason);
  const stats = await sendSbc(device, data, options);
  return { ...stats, workerFallbackReason: reason };
}
