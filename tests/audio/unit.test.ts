import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createCodec } from "../../src/audio/codec-engine";
import { inspectSbc, readSbcFrame, readSbcInput } from "../../src/audio/sbc";
import { sendSbc } from "../../src/audio/send-sbc";
import { createPlaybackClock } from "../../src/audio/playback-clock";
import { playbackDeviceIdentity, matchingPlaybackDevices } from "../../src/audio/playback-protocol";
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
  assert.deepEqual([...reports[0].subarray(0, 4)], [0xa2, 0x18, 0x48, 0xa0], "speaker output must keep normal input enabled");
  assert.equal(reports[0][4], 0); assert.equal(reports[1][4], 4);
  for (const report of reports) assert.equal(new DataView(report.buffer).getUint32(523, true), crc32(report.subarray(0, 523)));
  assert.deepEqual(reports[0].subarray(7, 455), sbc.subarray(0, 448));
  assert.deepEqual(reports[1].subarray(7, 119), sbc.subarray(448));
  assert.ok(reports[1].subarray(119, 523).every(v => v === 0));
});

// A virtual clock models host delays without timing-sensitive wall-clock tests.
async function simulatePlayback(options: {
  bufferAheadMs?: number; timerDelayMs?: number; writeDelayMs?: number;
} = {}) {
  const codec = await makeCodec();
  const sbc = codec.encode(stereo(12800 - 80)); // Exactly 100 frames / 25 reports / 400 ms.
  let now = 0, delayedTimer = false;
  const starts: number[] = [], completed: number[] = [], reports: Uint8Array[] = [];
  const stats = await sendSbc({ sendReport: async (_id, payload) => {
    starts.push(now);
    reports.push((payload as Uint8Array).slice());
    if (starts.length === 8) now += options.writeDelayMs ?? 0;
    completed.push(now);
  } }, sbc, { bufferAheadMs: options.bufferAheadMs ?? 32 }, {
    now: () => now,
    sleep: async milliseconds => {
      now += milliseconds;
      if (!delayedTimer && now >= 80) {
        now += options.timerDelayMs ?? 0;
        delayedTimer = true;
      }
    },
  });
  return { stats, starts, completed, reports, sbc };
}

test("send-ahead remains bounded and drains the final queued audio at its original rate", async () => {
  for (const bufferAheadMs of [0, 16, 32, 64]) {
    const { stats, starts, completed } = await simulatePlayback({ bufferAheadMs });
    assert.equal(stats.packetsSent, 25);
    assert.equal(stats.audioDurationMs, 400);
    assert.equal(stats.elapsedMs, 400, "the reserve must not speed up playback or truncate its tail");
    assert.equal(stats.estimatedStarvations, 0);
    assert.equal(stats.maxSchedulingDelayMs, 0);
    for (let i = 0; i < starts.length; i++) {
      const queuedAudio = (i + 1) * 16 - completed[i];
      assert.ok(queuedAudio <= bufferAheadMs + 16, "reserve cannot grow without bound");
      if (i > 0) assert.ok(starts[i] - starts[i - 1] >= 4, "no startup burst");
    }
    for (let i = 15; i < starts.length; i++) assert.equal(starts[i] - starts[i - 1], 16);
  }
});

test("reserve absorbs a late browser timer and reports it separately from HID latency", async () => {
  const buffered = await simulatePlayback({ timerDelayMs: 22 });
  assert.equal(buffered.stats.maxSchedulingDelayMs, 22);
  assert.equal(buffered.stats.maxTimerDelayMs, 22);
  assert.equal(buffered.stats.maxWriteDurationMs, 0);
  assert.equal(buffered.stats.estimatedStarvations, 0);
  assert.equal(buffered.stats.elapsedMs, 400);
  const unbuffered = await simulatePlayback({ timerDelayMs: 22, bufferAheadMs: 0 });
  assert.equal(unbuffered.stats.estimatedStarvations, 1);
  assert.equal(unbuffered.stats.maxEstimatedStarvationMs, 22);
});

test("HID latency is measured and absorbed without concurrent writes", async () => {
  const result = await simulatePlayback({ writeDelayMs: 24 });
  assert.equal(result.stats.maxWriteDurationMs, 24);
  assert.equal(result.stats.maxSchedulingDelayMs, 8, "slow HID completion delays the next submission");
  assert.equal(result.stats.maxTimerDelayMs, 0, "a slow write is not a delayed browser timer");
  assert.equal(result.stats.estimatedStarvations, 0);
  assert.equal(result.stats.elapsedMs, 400);
  for (let i = 1; i < result.starts.length; i++) assert.ok(result.starts[i] >= result.completed[i - 1]);
});

test("long timer or HID stalls re-prime with bounded writes and preserve every SBC frame", async () => {
  for (const delay of [{ timerDelayMs: 500 }, { writeDelayMs: 500 }]) {
    const { stats, starts, reports, sbc } = await simulatePlayback(delay);
    assert.equal(stats.estimatedStarvations, 1);
    assert.equal(stats.maxEstimatedStarvationMs, 468);
    assert.equal(stats.elapsedMs, 868);
    assert.equal(reports.length, 25);
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      assert.equal(report[2] | report[3] << 8, i * 4);
      assert.deepEqual(report.subarray(5, 453), sbc.subarray(i * 448, (i + 1) * 448));
      if (i > 0) assert.ok(starts[i] - starts[i - 1] >= 4, "no catch-up burst after suspension");
    }
  }
});

test("invalid send-ahead options reject before any HID write", async () => {
  const sbc = (await makeCodec()).encode(stereo(1));
  let writes = 0;
  for (const bufferAheadMs of [-1, 65, NaN, Infinity]) {
    await assert.rejects(sendSbc({ sendReport: async () => { writes++; } }, sbc, { bufferAheadMs }), /bufferAheadMs/);
  }
  assert.equal(writes, 0);
});

function controlledPlaybackClock() {
  const device = new EventTarget();
  let now = 0, nextId = 0;
  const timers = new Map<number, () => void>();
  const clock = createPlaybackClock(device, {
    now: () => now,
    setTimeout: callback => { const id = ++nextId; timers.set(id, callback); return id; },
    clearTimeout: handle => { timers.delete(handle as number); },
  });
  return { device, clock, timers, advance: (time: number) => { now = time; } };
}

test("HID input wakes only due deadlines and cancels the delayed fallback timer", async () => {
  const { device, clock, timers, advance } = controlledPlaybackClock();
  let reportsSeenByApp = 0;
  device.addEventListener("inputreport", () => { reportsSeenByApp++; });
  try {
    let settled = false;
    const wait = clock.sleep(16).then(source => { settled = true; return source; });
    const lateCallback = [...timers.values()][0];
    advance(8);
    device.dispatchEvent(new Event("inputreport"));
    await Promise.resolve();
    assert.equal(settled, false, "input must not send a packet before its deadline");
    assert.equal(timers.size, 1);
    advance(16);
    device.dispatchEvent(new Event("inputreport"));
    assert.equal(await wait, "inputreport");
    assert.equal(timers.size, 0, "no orphaned timer left behind for each HID wake-up");
    const next = clock.sleep(16);
    lateCallback(); // A queued callback for the previous wait cannot finish this one.
    assert.equal(timers.size, 1);
    advance(32);
    device.dispatchEvent(new Event("inputreport"));
    assert.equal(await next, "inputreport");
    assert.equal(reportsSeenByApp, 3, "the app's own input listener remains active");
  } finally { clock.dispose(); }
});

test("playback clock falls back to timers if input is absent and disposes cleanly", async () => {
  const { clock, timers, advance } = controlledPlaybackClock();
  const wait = clock.sleep(16);
  advance(1000);
  [...timers.values()][0]();
  assert.equal(await wait, "timer");
  assert.equal(timers.size, 0);
  const pending = clock.sleep(16);
  const rejected = assert.rejects(pending, /disposed/);
  clock.dispose();
  await rejected;
  assert.equal(timers.size, 0);
  await assert.rejects(clock.sleep(1), /disposed/);
  clock.dispose();
});

test("regular HID input sustains the entire stream even when no timer callback runs", async () => {
  const { clock, device, timers, advance } = controlledPlaybackClock();
  const sbc = (await makeCodec()).encode(stereo(12800 - 80));
  let inputTime = 0, writes = 0;
  const sleep = clock.sleep.bind(clock);
  clock.sleep = milliseconds => {
    const waiting = sleep(milliseconds);
    // Model a DS4 pushing reports at 8 ms while browser timers remain blocked.
    const deadline = clock.now() + milliseconds;
    while (inputTime < deadline) {
      inputTime += 8;
      advance(inputTime);
      device.dispatchEvent(new Event("inputreport"));
    }
    return waiting;
  };
  try {
    const stats = await sendSbc({ sendReport: async () => { writes++; } }, sbc, {}, clock);
    assert.equal(writes, 25);
    assert.equal(stats.audioDurationMs, 400);
    assert.equal(stats.elapsedMs, 400);
    assert.equal(stats.estimatedStarvations, 0);
    assert.equal(stats.timerWakeups, 0);
    assert.ok(stats.inputReportWakeups >= 24);
    assert.equal(stats.maxTimerDelayMs, 0);
    assert.equal(timers.size, 0);
  } finally { clock.dispose(); }
});

test("sendSbc releases its input listener after success or HID failure", async () => {
  const sbc = (await makeCodec()).encode(stereo(1));
  const listeners = new Set<EventListenerOrEventListenerObject>();
  const device = {
    addEventListener(_type: string, listener: EventListenerOrEventListenerObject | null) { if (listener) listeners.add(listener); },
    removeEventListener(_type: string, listener: EventListenerOrEventListenerObject | null) { if (listener) listeners.delete(listener); },
    async sendReport() {},
  };
  const success = await sendSbc(device, sbc);
  assert.ok(success.timerWakeups > 0);
  assert.equal(listeners.size, 0);
  device.sendReport = async () => { throw new Error("Device disconnected"); };
  await assert.rejects(sendSbc(device, sbc), /Device disconnected/);
  assert.equal(listeners.size, 0);
});

class TestController extends DualShock4 {
  constructor(device: HIDDevice, connection = DualShock4Interface.Bluetooth) {
    super(device);
    this.state = { ...structuredClone(this.state), interface: connection };
  }
  getDiagnostics() { return this.miscData; }
  getLeftStickX() { return this.state.axes.leftStickX; }
}

test("Bluetooth input stays live during audio without repeated feature reads or diagnostic formatting", async () => {
  let featureReads = 0;
  const device = {
    opened: false,
    async open() { this.opened = true; },
    async receiveFeatureReport(id: number) {
      assert.equal(id, 0x02);
      featureReads++;
      return new DataView(new ArrayBuffer(37));
    },
    async sendReport() {},
  } as unknown as HIDDevice;
  const controller = new TestController(device, DualShock4Interface.Disconnected);
  await controller.init();
  const input = (reportId: number, bytes: Uint8Array) => device.oninputreport!({
    device, reportId, data: new DataView(bytes.buffer), timeStamp: performance.now(),
  } as HIDInputReportEvent);
  input(0x01, new Uint8Array(9));
  const full = new Uint8Array(77);
  input(0x11, full);
  const previousDiagnostics = controller.getDiagnostics();
  const sbc = (await makeCodec()).encode(stereo(1));
  const playback = controller.sendMusic(sbc);
  full[2] = 255;
  for (let i = 0; i < 100; i++) input(0x11, full);
  assert.equal(featureReads, 1, "one setup read, no traffic for subsequent input reports");
  assert.ok(controller.getLeftStickX() > 0.99, "controls must stay live during playback");
  assert.equal(controller.getDiagnostics(), previousDiagnostics, "skip diagnostic allocations during audio");
  await playback;
  input(0x11, full);
  assert.notEqual(controller.getDiagnostics(), previousDiagnostics, "diagnostics resume after playback");
});

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
  const stats = controller.getAudioPlaybackStats()!;
  assert.equal(stats.packetsSent, 1);
  assert.equal(stats.bufferAheadMs, 64);
  stats.packetsSent = 999;
  assert.equal(controller.getAudioPlaybackStats()!.packetsSent, 1, "callers cannot change stored diagnostics");
  await controller.sendMusic(sbc, { bufferAheadMs: 16 });
  assert.equal(controller.getAudioPlaybackStats()!.bufferAheadMs, 16);
  await assert.rejects(controller.sendMusic(sbc, { bufferAheadMs: -1 }), /bufferAheadMs/);
  assert.equal(controller.getAudioPlaybackStats(), undefined, "failed playbacks must not expose stale diagnostics");
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

test("worker device matching retains all matches and distinguishes report collections", () => {
  const device = { vendorId: 0x054c, productId: 0x09cc, productName: "DS4", collections: [] } as unknown as HIDDevice;
  const duplicate = { ...device } as HIDDevice;
  const otherInterface = { ...device, collections: [{ usagePage: 1 }] } as HIDDevice;
  assert.deepEqual(matchingPlaybackDevices([device, duplicate, otherInterface], playbackDeviceIdentity(device)), [device, duplicate]);
});

test("explicit worker mode rejects unavailable environments without sending or keeping the playback lock", async () => {
  const sbc = (await makeCodec()).encode(stereo(1));
  let writes = 0;
  const controller = new TestController({ opened: true, sendReport: async () => { writes++; } } as unknown as HIDDevice);
  await assert.rejects(controller.sendMusic(sbc, { transport: "worker" }), /Worker playback requires/);
  assert.equal(writes, 0);
  await controller.sendMusic(sbc, { transport: "main-thread" });
  assert.equal(controller.getAudioPlaybackStats()!.transport, "main-thread");
  assert.equal(controller.getAudioPlaybackStats()!.workerFallbackReason, undefined);
});
