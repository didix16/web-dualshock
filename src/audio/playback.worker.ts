import { sendSbc } from "./send-sbc";
import { matchingPlaybackDevices, type PlaybackRequest, type PlaybackResponse } from "./playback-protocol";

const scope = self as unknown as {
  navigator: { hid?: { getDevices(): Promise<HIDDevice[]> } };
  onmessage: (event: MessageEvent<PlaybackRequest>) => void;
  postMessage(message: PlaybackResponse): void;
};
let device: HIDDevice | undefined;
let phase: "new" | "preparing" | "ready" | "playing" | "done" = "new";

async function closeDevice() {
  const opened = device;
  device = undefined;
  if (opened?.opened) await opened.close().catch(() => {});
}

scope.onmessage = async ({ data: request }) => {
  if (request.type === "prepare" && phase === "new") {
    phase = "preparing";
    try {
      if (!scope.navigator.hid) throw new Error("WebHID is unavailable in dedicated workers");
      const matches = matchingPlaybackDevices(await scope.navigator.hid.getDevices(), request.identity);
      if (matches.length !== 1) throw new Error("Cannot identify a unique controller in the playback worker");
      device = matches[0];
      await device.open();
      phase = "ready";
      scope.postMessage({ type: "ready" });
    } catch (error) {
      await closeDevice();
      phase = "done";
      scope.postMessage({ type: "unavailable", reason: error instanceof Error ? error.message : String(error) });
    }
  } else if (request.type === "play" && phase === "ready" && device) {
    phase = "playing";
    let response: PlaybackResponse;
    try {
      const stats = await sendSbc(device, request.data, { bufferAheadMs: request.bufferAheadMs });
      response = { type: "complete", stats: { ...stats, transport: "worker" } };
    } catch (error) {
      response = { type: "error", reason: error instanceof Error ? error.message : String(error) };
    }
    await closeDevice();
    phase = "done";
    scope.postMessage(response);
  }
};
