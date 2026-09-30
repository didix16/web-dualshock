import type { DecodedPcm } from "./codec-engine";

export type CodecRequest = { id: number; wasmURL: string } & (
  | { operation: "encode"; channels: Float32Array[] }
  | { operation: "decode"; data: Uint8Array }
);
export type CodecResponse = { id: number } & (
  | { operation: "encode"; data: Uint8Array<ArrayBuffer> }
  | { operation: "decode"; pcm: DecodedPcm }
  | { error: string }
);
