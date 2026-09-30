import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createCodec } from "../../src/audio/codec-engine";
import { inspectSbc, readSbcFrame, readSbcInput } from "../../src/audio/sbc";
import { sendSbc } from "../../src/audio/send-sbc";
import DualShock4 from "../../src/ds4";
import { DualShock4Interface } from "../../src/ds4state";

const wasm = new Uint8Array(readFileSync("src/audio/generated/sbc.wasm"));
const makeCodec = () => createCodec(wasm);
const stereo = (length = 3200) => [440, 880].map(hz =>
  Float32Array.from({ length }, (_, i) => 0.6 * Math.sin(2 * Math.PI * hz * i / 32000)));

function snr(actual: Float32Array, expected: Float32Array, delay: number) {
  let signal = 0, noise = 0;
  for (let i = 128; i < expected.length; i++) {
    signal += expected[i] ** 2;
    noise += (actual[i + delay] - expected[i]) ** 2;
  }
  return 10 * Math.log10(signal / noise);
}

test("distributed WASM matches its pinned build manifest", () => {
  const manifest = JSON.parse(readFileSync("src/audio/generated/build.json", "utf8"));
  assert.equal(createHash("sha256").update(wasm).digest("hex"), manifest.sha256);
  assert.equal(wasm.length, manifest.bytes);
  assert.ok(wasm.length < 100_000, "Keep the dedicated codec below 100 KB");
});

test("encodes the DS4 profile and decodes independent stereo channels with useful fidelity", async () => {
  const codec = await makeCodec();
  const input = stereo();
  const encoded = codec.encode(input);
  assert.deepEqual([...encoded.subarray(0, 3)], [0x9c, 0x79, 50]);
  const info = inspectSbc(encoded);
  assert.equal(info.sampleRate, 32000);
  assert.equal(info.channels, 2);
  assert.equal(info.frames, Math.ceil((input[0].length + 80) / 128));
  const decoded = codec.decode(encoded);
  // SBC implementations differ slightly in their filter delay; measure alignment.
  for (let channel = 0; channel < 2; channel++) {
    const best = Math.max(...Array.from({ length: 100 }, (_, delay) => snr(decoded.channels[channel], input[channel], delay)));
    assert.ok(best > 25, `SBC fidelity: ${best.toFixed(1)} dB`);
  }
  assert.deepEqual(codec.encode(input), encoded, "state resets between files");
  assert.deepEqual(codec.decode(encoded), decoded, "decoder state resets too");
});

test("preserves short inputs and the last samples through the filter tail", async () => {
  const codec = await makeCodec();
  for (const length of [1, 47, 48, 127, 128, 129, 512]) {
    const channels = [new Float32Array(length), new Float32Array(length)];
    channels[0][length - 1] = 0.8;
    const result = codec.decode(codec.encode(channels));
    assert.ok(result.channels[0].length >= length + 80);
    assert.ok(result.channels[0].some(sample => Math.abs(sample) > 0.02), `missing tail for ${length} samples`);
    assert.ok(result.channels[1].every(sample => Math.abs(sample) < 0.002));
  }
});

test("clips PCM, sanitizes non-finite input, rejects malformed channel arrays", async () => {
  const codec = await makeCodec();
  const input = [Float32Array.of(-4, 4, NaN, Infinity), Float32Array.of(0, 0, 0, 0)];
  const expected = [Float32Array.of(-1, 1, 0, 0), input[1]];
  assert.deepEqual(codec.encode(input), codec.encode(expected));
  assert.throws(() => codec.encode([]), /stereo/);
  assert.throws(() => codec.encode([new Float32Array(), new Float32Array()]), /nonempty/);
  assert.throws(() => codec.encode([new Float32Array(1), new Float32Array(2)]), /stereo/);
});

test("decodes existing SBC assets and rejects bad CRC, truncation, format changes and empty inputs", async () => {
  const codec = await makeCodec();
  for (const name of ["digimon", "ramstain"]) {
    const bytes = new Uint8Array(readFileSync(`demo/${name}.sbc`));
    const info = inspectSbc(bytes);
    const decoded = codec.decode(bytes);
    assert.equal(decoded.channels[0].length, info.samples);
    assert.ok(decoded.channels[0].some(v => Math.abs(v) > 0.01));
  }
  const good = codec.encode(stereo(256));
  const bad = good.slice(); bad[4] ^= 1;
  assert.throws(() => codec.decode(bad), /CRC/);
  assert.throws(() => codec.decode(good.subarray(0, good.length - 1)), /truncated/);
  assert.throws(() => inspectSbc(new Uint8Array()), /empty/);
  assert.throws(() => readSbcFrame(Uint8Array.of(0, 0, 0, 0), 0), /syncword/);
  const bitpool = good.slice(); bitpool[2] = 1;
  assert.throws(() => inspectSbc(bitpool), /bitpool/);
  assert.throws(() => inspectSbc(good, 111), /capacity/);
  assert.deepEqual(codec.encode(stereo(256)), good, "failure doesn't poison the next operation");
});

test("buffer views are copied with their exact boundaries and ownership preserved", async () => {
  const backing = Uint8Array.of(99, 1, 2, 3, 88);
  const view = backing.subarray(1, 4);
  const copy = await readSbcInput(view);
  backing[2] = 9;
  assert.deepEqual([...copy], [1, 2, 3]);
  assert.deepEqual([...await readSbcInput(new Blob([copy]))], [1, 2, 3]);
  assert.deepEqual([...await readSbcInput(copy.buffer)], [1, 2, 3]);
});

test("decoder interoperates with independently encoded SBC and reference PCM", async () => {
  const encoded = new Uint8Array(readFileSync("tests/audio/fixtures/reference.sbc"));
  const reference = readFileSync("tests/audio/fixtures/reference.f32le");
  const decoded = (await makeCodec()).decode(encoded);
  assert.equal(decoded.channels[0].length * 2 * 4, reference.length);
  let error = 0;
  for (let i = 0; i < decoded.channels[0].length; i++) {
    for (let c = 0; c < 2; c++) {
      error = Math.max(error, Math.abs(decoded.channels[c][i] - reference.readFloatLE((i * 2 + c) * 4)));
    }
  }
  assert.ok(error < 0.005, `Reference decoder disagreement ${error}`);
});

test("decoder preserves source frequency/channels and handles short SBC frames", async () => {
  const codec = await makeCodec();
  for (const [name, rate, channels] of [["mono16", 16000, 1], ["short48", 48000, 2]] as const) {
    const data = new Uint8Array(readFileSync(`tests/audio/fixtures/${name}.sbc`));
    const info = inspectSbc(data);
    const decoded = codec.decode(data);
    assert.equal(decoded.sampleRate, rate);
    assert.equal(decoded.channels.length, channels);
    assert.equal(decoded.channels[0].length, info.samples);
    assert.ok(decoded.channels[0].some(v => Math.abs(v) > 0.01));
  }
  const stereo32 = codec.encode(stereo(128));
  for (const name of ["mono16", "short48"]) {
    const other = readFileSync(`tests/audio/fixtures/${name}.sbc`);
    const mixed = new Uint8Array(stereo32.length + other.length);
    mixed.set(stereo32); mixed.set(other, stereo32.length);
    assert.throws(() => codec.decode(mixed), /remain constant/);
  }
});

// Independent bitwise CRC32 oracle for the HID report (including 0xa2, 0x18).
function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

test("HID packets retain frames, sequence, CRC and timing, including the final partial packet", async () => {
  const codec = await makeCodec();
  const sbc = codec.encode(stereo(512)); // Five 4 ms frames: 4 + 1 in two packets.
  const reports: Uint8Array[] = [];
  const started = performance.now();
  await sendSbc({ sendReport: async (id, payload) => {
    assert.equal(id, 0x18);
    const report = new Uint8Array(527);
    report.set([0xa2, id]);
    report.set(new Uint8Array((payload as Uint8Array).buffer, (payload as Uint8Array).byteOffset, (payload as Uint8Array).byteLength), 2);
    reports.push(report);
  } }, sbc);
  assert.ok(performance.now() - started >= 19, "must wait for audio duration");
  assert.equal(reports.length, 2);
  assert.equal(reports[0][4], 0); assert.equal(reports[1][4], 4);
  for (const report of reports) assert.equal(new DataView(report.buffer).getUint32(523, true), crc32(report.subarray(0, 523)));
  assert.deepEqual(reports[0].subarray(7, 455), sbc.subarray(0, 448));
  assert.deepEqual(reports[1].subarray(7, 119), sbc.subarray(448));
  assert.ok(reports[1].subarray(119, 523).every(v => v === 0));
});

class TestController extends DualShock4 {
  constructor(device: HIDDevice, connection = DualShock4Interface.Bluetooth) {
    super(device);
    this.state = { ...this.state, interface: connection };
  }
}

test("sendMusic awaits HID, propagates failure, unlocks and rejects concurrency/USB/closed devices", async () => {
  const sbc = (await makeCodec()).encode(stereo(1));
  let rejectWrite: (reason: Error) => void;
  const device = { opened: true, sendReport: () => new Promise<void>((_, reject) => { rejectWrite = reject; }) } as unknown as HIDDevice;
  const controller = new TestController(device);
  let settled = false;
  const first = controller.sendMusic(sbc);
  first.then(() => { settled = true; }, () => { settled = true; });
  await Promise.resolve();
  assert.equal(settled, false);
  await assert.rejects(controller.sendMusic(sbc), /already playing/);
  rejectWrite!(new Error("HID disconnected"));
  await assert.rejects(first, /HID disconnected/);
  device.sendReport = async () => {};
  await controller.sendMusic(new File([sbc], "test.sbc"));
  await controller.sendMusic(sbc.buffer);
  await assert.rejects(new TestController(device, DualShock4Interface.USB).sendMusic(sbc), /Bluetooth/);
  await assert.rejects(new TestController({ ...device, opened: false } as HIDDevice).sendMusic(sbc), /initialized/);
});

test("invalid data anywhere in a song produces zero HID writes", async () => {
  const bytes = (await makeCodec()).encode(stereo(1024));
  bytes[bytes.length - 112 + 3] ^= 1;
  let writes = 0;
  await assert.rejects(sendSbc({ sendReport: async () => { writes++; } }, bytes), /CRC/);
  assert.equal(writes, 0);
});
