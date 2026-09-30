import defaultWasmURL from "virtual:sbc-wasm";
import defaultWorkerURL from "./sbc.worker?worker&url";
import type { DecodedPcm } from "./codec-engine";
import type { CodecRequest, CodecResponse } from "./worker-protocol";

export interface SbcCodecOptions {
  /** Absolute or page-relative URL of a self-hosted sbc.wasm. */
  wasmURL?: string | URL;
  /** Absolute or page-relative URL of the bundled SBC worker (same origin). */
  workerURL?: string | URL;
}

let options: SbcCodecOptions = {};
let worker: Worker | undefined;
let nextId = 0;
const pending = new Map<number, {
  resolve: (value: CodecResponse) => void;
  reject: (error: Error) => void;
}>();

/** Configure resources before the next conversion. Does not load the codec. */
export function configureSbcCodec(value: SbcCodecOptions): void {
  if (pending.size) throw new Error("Cannot configure SBC while a conversion is running");
  disposeSbcCodec();
  options = { ...value };
}

/** Release worker/WASM memory; rejects in-flight work. The next call reloads it. */
export function disposeSbcCodec(): void {
  worker?.terminate();
  worker = undefined;
  for (const request of pending.values()) request.reject(new Error("SBC codec was disposed"));
  pending.clear();
}

function getWorker(): Worker {
  if (worker) return worker;
  if (typeof Worker === "undefined") throw new Error("SBC conversion requires Web Workers");
  // The URL import is evaluated while the UMD script is loading, when
  // document.currentScript still identifies the bundle's actual directory.
  const current = new Worker(new URL(options.workerURL ?? defaultWorkerURL, document.baseURI), { type: "module" });
  current.onmessage = ({ data }: MessageEvent<CodecResponse>) => {
    const request = pending.get(data.id);
    if (!request) return;
    pending.delete(data.id);
    if ("error" in data) request.reject(new Error(data.error));
    else request.resolve(data);
  };
  const fail = () => {
    for (const request of pending.values()) request.reject(new Error("SBC worker failed to load or execute"));
    pending.clear();
    current.terminate();
    if (worker === current) worker = undefined;
  };
  current.onerror = fail;
  current.onmessageerror = fail;
  worker = current;
  return current;
}

function callWorker(request: Omit<Extract<CodecRequest, { operation: "encode" }>, "id" | "wasmURL"> |
  Omit<Extract<CodecRequest, { operation: "decode" }>, "id" | "wasmURL">,
  transfer: Transferable[]): Promise<CodecResponse> {
  return new Promise((resolve, reject) => {
    const current = getWorker();
    const id = nextId++;
    pending.set(id, { resolve, reject });
    try {
      current.postMessage({
        ...request, id,
        wasmURL: new URL(options.wasmURL ?? defaultWasmURL, document.baseURI).href,
      } satisfies CodecRequest, transfer);
    } catch (error) {
      pending.delete(id);
      reject(error);
    }
  });
}

export async function encodePcm(channels: Float32Array<ArrayBuffer>[]): Promise<Uint8Array<ArrayBuffer>> {
  const result = await callWorker({ operation: "encode", channels }, channels.map(c => c.buffer));
  if (!("operation" in result) || result.operation !== "encode") throw new Error("Unexpected SBC worker response");
  return result.data;
}

export async function decodeSbc(data: Uint8Array<ArrayBuffer>): Promise<DecodedPcm> {
  const result = await callWorker({ operation: "decode", data }, [data.buffer]);
  if (!("operation" in result) || result.operation !== "decode") throw new Error("Unexpected SBC worker response");
  return result.pcm;
}
