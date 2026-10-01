import { type SbcInput } from "./sbc";
export { configureSbcCodec, disposeSbcCodec } from "./sbc-codec";
export type { SbcCodecOptions } from "./sbc-codec";
export type { SbcInput } from "./sbc";
export type { SbcPlaybackOptions, SbcPlaybackStats } from "./send-sbc";
/** Convert browser-supported audio to DS4 SBC (32 kHz, stereo, 224 kbit/s).
 * The complete file is decoded in memory. Encoding runs in a lazy-loaded worker.
 */
export declare function audioToSbc(input: Blob | AudioBuffer): Promise<Uint8Array<ArrayBuffer>>;
/** Decode raw SBC to PCM at its original frequency and channel count.
 * Preserves codec delay and frame padding; raw SBC has no original-length metadata.
 */
export declare function sbcToAudioBuffer(input: SbcInput): Promise<AudioBuffer>;
