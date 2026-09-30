import { inspectSbc, readSbcFrame } from "./sbc";

interface CodecExports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  _initialize: () => void;
  codec_reset: () => void;
  codec_pcm: () => number;
  codec_data: () => number;
  codec_encode: () => number;
  codec_decode: (length: number) => number;
}

export interface DecodedPcm {
  sampleRate: number;
  channels: Float32Array<ArrayBuffer>[];
}

/** Internal synchronous frame engine; production calls it only inside a worker. */
export async function createCodec(bytes: BufferSource) {
  const { instance } = await WebAssembly.instantiate(bytes, {});
  const api = instance.exports as CodecExports;
  api._initialize?.();
  const pcm = new Int16Array(api.memory.buffer, api.codec_pcm(), 256);
  const frameBytes = new Uint8Array(api.memory.buffer, api.codec_data(), 1024);
  const toInt16 = (value: number) => {
    if (!Number.isFinite(value)) return 0;
    value = Math.max(-1, Math.min(1, value));
    return Math.round(value * (value < 0 ? 32768 : 32767));
  };
  return {
    encode(channels: Float32Array[]): Uint8Array<ArrayBuffer> {
      if (channels.length !== 2 || !channels[0].length || channels[0].length !== channels[1].length) {
        throw new Error("Encoder requires nonempty stereo PCM at 32000 Hz");
      }
      // 80 samples cover the codec filter delay; padding ensures a complete
      // final frame and preserves the last input samples through decoding.
      const frames = Math.ceil((channels[0].length + 80) / 128);
      const result = new Uint8Array(frames * 112);
      api.codec_reset();
      try {
        for (let frame = 0; frame < frames; frame++) {
          for (let channel = 0; channel < 2; channel++) {
            for (let i = 0; i < 128; i++) {
              pcm[channel * 128 + i] = toInt16(channels[channel][frame * 128 + i] ?? 0);
            }
          }
          if (api.codec_encode() !== 112) throw new Error("SBC encoding failed");
          result.set(frameBytes.subarray(0, 112), frame * 112);
        }
        return result;
      } finally { api.codec_reset(); }
    },
    decode(data: Uint8Array): DecodedPcm {
      const info = inspectSbc(data);
      const channels = Array.from({ length: info.channels }, () => new Float32Array(info.samples));
      let position = 0;
      api.codec_reset();
      try {
        for (let offset = 0; offset < data.length;) {
          const frame = readSbcFrame(data, offset);
          frameBytes.set(data.subarray(offset, offset + frame.length));
          const samples = api.codec_decode(frame.length);
          if (samples !== frame.samples) throw new Error(`SBC decoding failed at byte ${offset}`);
          for (let channel = 0; channel < channels.length; channel++) {
            for (let i = 0; i < samples; i++) channels[channel][position + i] = pcm[channel * 128 + i] / 32768;
          }
          position += samples;
          offset += frame.length;
        }
        return { sampleRate: info.sampleRate, channels };
      } finally { api.codec_reset(); }
    },
  };
}
