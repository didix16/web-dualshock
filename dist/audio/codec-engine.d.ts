export interface DecodedPcm {
    sampleRate: number;
    channels: Float32Array<ArrayBuffer>[];
}
/** Internal synchronous frame engine; production calls it only inside a worker. */
export declare function createCodec(bytes: BufferSource): Promise<{
    encode(channels: Float32Array[]): Uint8Array<ArrayBuffer>;
    decode(data: Uint8Array): DecodedPcm;
}>;
