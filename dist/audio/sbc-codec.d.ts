import type { DecodedPcm } from "./codec-engine";
export interface SbcCodecOptions {
    /** Absolute or page-relative URL of a self-hosted sbc.wasm. */
    wasmURL?: string | URL;
    /** Absolute or page-relative URL of the bundled SBC worker (same origin). */
    workerURL?: string | URL;
}
/** Configure resources before the next conversion. Does not load the codec. */
export declare function configureSbcCodec(value: SbcCodecOptions): void;
/** Release worker/WASM memory; rejects in-flight work. The next call reloads it. */
export declare function disposeSbcCodec(): void;
export declare function encodePcm(channels: Float32Array<ArrayBuffer>[]): Promise<Uint8Array<ArrayBuffer>>;
export declare function decodeSbc(data: Uint8Array<ArrayBuffer>): Promise<DecodedPcm>;
