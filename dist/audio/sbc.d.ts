/** Raw SBC frames, without a WAV/A2DP/HID container. */
export type SbcInput = Blob | ArrayBuffer | Uint8Array;
export interface SbcFrame {
    length: number;
    sampleRate: number;
    channels: number;
    samples: number;
    blocks: number;
    subbands: number;
    mode: number;
    bitpool: number;
}
/** Take a snapshot: callers retain ownership, including subarray boundaries. */
export declare function readSbcInput(input: SbcInput): Promise<Uint8Array<ArrayBuffer>>;
export declare function readSbcFrame(data: Uint8Array, offset: number): SbcFrame;
/** Validate the whole input before decoding or sending any of it. */
export declare function inspectSbc(data: Uint8Array, maxFrameLength?: number): {
    sampleRate: number;
    channels: number;
    samples: number;
    frames: number;
};
