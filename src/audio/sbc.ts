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
export async function readSbcInput(input: SbcInput): Promise<Uint8Array<ArrayBuffer>> {
  if (input instanceof Blob) return new Uint8Array(await input.arrayBuffer());
  if (input instanceof Uint8Array) return new Uint8Array(input);
  if (input instanceof ArrayBuffer) return new Uint8Array(input.slice(0));
  throw new TypeError("Expected an SBC Blob, ArrayBuffer or Uint8Array");
}

function crcBit(crc: number, bit: number): number {
  const feedback = (crc >>> 7) ^ bit;
  return ((crc << 1) ^ (feedback ? 0x1d : 0)) & 0xff;
}

/** CRC-8 protects header parameters, joint flags and scale factors, not audio bits. */
function frameCrc(data: Uint8Array, offset: number, protectedBits: number): number {
  let crc = 0x0f;
  for (const index of [offset + 1, offset + 2]) {
    for (let bit = 7; bit >= 0; bit--) crc = crcBit(crc, (data[index] >>> bit) & 1);
  }
  for (let bit = 0; bit < protectedBits; bit++) {
    crc = crcBit(crc, (data[offset + 4 + (bit >>> 3)] >>> (7 - (bit & 7))) & 1);
  }
  return crc;
}

export function readSbcFrame(data: Uint8Array, offset: number): SbcFrame {
  const invalid = (reason: string): never => {
    throw new Error(`Invalid SBC at byte ${offset}: ${reason}`);
  };
  if (!Number.isInteger(offset) || offset < 0 || offset + 4 > data.length) {
    return invalid("truncated header");
  }
  if (data[offset] !== 0x9c) return invalid("expected SBC syncword 0x9c");
  const header = data[offset + 1];
  const sampleRate = [16000, 32000, 44100, 48000][header >>> 6];
  const blocks = [4, 8, 12, 16][(header >>> 4) & 3];
  const mode = (header >>> 2) & 3;
  const subbands = header & 1 ? 8 : 4;
  const channels = mode === 0 ? 1 : 2;
  const bitpool = data[offset + 2];
  if (bitpool < 2 || bitpool > Math.min(250, (mode < 2 ? 16 : 32) * subbands)) {
    return invalid("invalid bitpool");
  }
  const jointBits = mode === 3 ? subbands : 0;
  const scaleBits = 4 * subbands * channels;
  const audioBits = blocks * bitpool * (mode < 2 ? channels : 1);
  const length = 4 + scaleBits / 8 + Math.ceil((jointBits + audioBits) / 8);
  if (offset + length > data.length) return invalid("truncated frame");
  if (frameCrc(data, offset, scaleBits + jointBits) !== data[offset + 3]) {
    return invalid("CRC mismatch");
  }
  return { length, sampleRate, channels, samples: blocks * subbands, blocks, subbands, mode, bitpool };
}

/** Validate the whole input before decoding or sending any of it. */
export function inspectSbc(data: Uint8Array, maxFrameLength = Infinity) {
  if (!data.length) throw new Error("SBC data is empty");
  let sampleRate = 0, channels = 0, samples = 0, frames = 0;
  for (let offset = 0; offset < data.length;) {
    const frame = readSbcFrame(data, offset);
    if (frame.length > maxFrameLength) throw new Error("SBC frame exceeds the HID packet capacity");
    if (frames && (frame.sampleRate !== sampleRate || frame.channels !== channels)) {
      throw new Error("SBC frequency and channel count must remain constant");
    }
    sampleRate = frame.sampleRate;
    channels = frame.channels;
    samples += frame.samples;
    frames++;
    offset += frame.length;
  }
  return { sampleRate, channels, samples, frames };
}
