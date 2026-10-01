import { prepareAudio } from "./web-audio";
import { encodePcm, decodeSbc } from "./sbc-codec";
import { readSbcInput, type SbcInput } from "./sbc";

export { configureSbcCodec, disposeSbcCodec } from "./sbc-codec";
export type { SbcCodecOptions } from "./sbc-codec";
export type { SbcInput } from "./sbc";
export type { SbcPlaybackOptions, SbcPlaybackStats } from "./send-sbc";

/** Convert browser-supported audio to DS4 SBC (32 kHz, stereo, 224 kbit/s).
 * The complete file is decoded in memory. Encoding runs in a lazy-loaded worker.
 */
export async function audioToSbc(input: Blob | AudioBuffer): Promise<Uint8Array<ArrayBuffer>> {
  return encodePcm(await prepareAudio(input));
}

/** Decode raw SBC to PCM at its original frequency and channel count.
 * Preserves codec delay and frame padding; raw SBC has no original-length metadata.
 */
export async function sbcToAudioBuffer(input: SbcInput): Promise<AudioBuffer> {
  if (typeof AudioBuffer === "undefined") throw new Error("Decoding to AudioBuffer requires Web Audio");
  const pcm = await decodeSbc(await readSbcInput(input));
  const result = new AudioBuffer({
    sampleRate: pcm.sampleRate, numberOfChannels: pcm.channels.length, length: pcm.channels[0].length,
  });
  pcm.channels.forEach((channel, index) => result.copyToChannel(channel, index));
  return result;
}
