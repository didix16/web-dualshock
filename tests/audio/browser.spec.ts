import { test, expect, type Page } from "@playwright/test";
import type * as AudioApi from "../../src/audio";

declare global {
  interface Window { audioApi: typeof AudioApi; }
}

test.beforeEach(async ({ page }, info) => {
  if (process.env.DEBUG_AUDIO) {
    page.on("console", message => console.log("browser:", message.text()));
    page.on("pageerror", error => console.log("page error:", error.message));
    page.on("requestfailed", request => console.log("request failed:", request.url(), request.failure()));
    page.on("request", request => console.log("request:", request.url()));
    page.on("worker", worker => console.log("worker:", worker.url()));
  }
  const source = info.project.name === "source";
  await page.goto(source ? "/tests/audio/browser.html" : "/");
  if (info.project.name === "umd") {
    await page.addScriptTag({ url: "/nested/library/web-dualshock.umd.js" });
    await page.evaluate(() => { window.audioApi = (window as any).WebDualShock; });
  } else {
    await page.evaluate(async path => { window.audioApi = await import(path); },
      source ? "/src/web-dualshock.ts" : "/nested/library/web-dualshock.es.js");
  }
});

test("lazy codec loads only on demand, converts MP3 and survives repeated/concurrent operations", async ({ page }, info) => {
  expect(page.workers()).toHaveLength(0);
  const result = await page.evaluate(async fixture => {
    const api = window.audioApi;
    // In dev, Vite fetches a tiny ?worker&url module containing only a URL.
    const loadedInitially = performance.getEntriesByType("resource").some(r => /sbc\.wasm(?:[?#]|$)/.test(r.name));
    const file = new File([await (await fetch(fixture)).arrayBuffer()], "tone.mp3", { type: "audio/mpeg" });
    const encoded = await api.audioToSbc(file);
    const decoded = await api.sbcToAudioBuffer(encoded);
    const [a, b] = await Promise.all([api.audioToSbc(file), api.audioToSbc(file)]);
    const same = a.every((value, i) => value === b[i] && value === encoded[i]);
    const bytesIntact = encoded.byteLength;
    const left = decoded.getChannelData(0), right = decoded.getChannelData(1);
    api.disposeSbcCodec();
    const again = await api.audioToSbc(file);
    api.disposeSbcCodec();
    return {
      loadedInitially, same, bytesIntact, again: again.length,
      rate: decoded.sampleRate, channels: decoded.numberOfChannels, duration: decoded.duration,
      nonzero: left.some(v => Math.abs(v) > 0.01), monoError: Math.max(...left.map((v, i) => Math.abs(v - right[i]))),
      header: Array.from(encoded.subarray(0, 3)),
    };
  }, info.project.name === "source" ? "/tests/audio/fixtures/tone.mp3" : "/fixtures/tone.mp3");
  expect(result.loadedInitially).toBe(false);
  expect(result.header).toEqual([0x9c, 0x79, 50]);
  expect(result.rate).toBe(32000); expect(result.channels).toBe(2);
  expect(result.duration).toBeGreaterThan(0.11); expect(result.duration).toBeLessThan(0.2);
  expect(result.same).toBe(true);
  expect(result.nonzero).toBe(true);
  expect(result.monoError).toBeLessThan(0.005);
  expect(result.bytesIntact).toBeGreaterThan(0); expect(result.again).toBe(result.bytesIntact);
});

test("resamples mono/stereo/surround and preserves AudioBuffer ownership", async ({ page }) => {
  const results = await page.evaluate(async () => {
    const api = window.audioApi;
    const results = [];
    for (const [rate, channels] of [[44100, 1], [48000, 2], [32000, 2], [48000, 6]]) {
      const buffer = new AudioBuffer({ sampleRate: rate, numberOfChannels: channels, length: rate / 10 });
      for (let c = 0; c < channels; c++) {
        const pcm = buffer.getChannelData(c);
        for (let i = 0; i < pcm.length; i++) pcm[i] = 0.15 * Math.sin(2 * Math.PI * 440 * i / rate);
      }
      const original = buffer.getChannelData(0).slice();
      const decoded = await api.sbcToAudioBuffer(await api.audioToSbc(buffer));
      results.push({
        rate: decoded.sampleRate, channels: decoded.numberOfChannels, duration: decoded.duration,
        intact: original.every((v, i) => v === buffer.getChannelData(0)[i]),
        nonzero: decoded.getChannelData(0).some(v => Math.abs(v) > 0.01),
      });
    }
    api.disposeSbcCodec();
    return results;
  });
  for (const result of results) {
    expect(result.rate).toBe(32000); expect(result.channels).toBe(2);
    expect(result.duration).toBeGreaterThanOrEqual(0.1); expect(result.duration).toBeLessThan(0.107);
    expect(result.intact && result.nonzero).toBe(true);
  }
});

test("errors reject cleanly and resource URLs can be overridden/retried", async ({ page }, info) => {
  const result = await page.evaluate(async wasmURL => {
    const api = window.audioApi;
    const input = new AudioBuffer({ sampleRate: 32000, numberOfChannels: 2, length: 128 });
    const errors = [];
    try { await api.audioToSbc(new Blob(["not an mp3"])); } catch (e) { errors.push(String(e)); }
    api.configureSbcCodec({ wasmURL: "/missing-codec.wasm" });
    try { await api.audioToSbc(input); } catch (e) { errors.push(String(e)); }
    api.configureSbcCodec({ wasmURL });
    const encoded = await api.audioToSbc(input);
    const invalid = encoded.slice(); invalid[3] ^= 1;
    try { await api.sbcToAudioBuffer(invalid); } catch (e) { errors.push(String(e)); }
    const wrapped = new Uint8Array(encoded.length + 8); wrapped.set(encoded, 4);
    const decoded = await api.sbcToAudioBuffer(wrapped.subarray(4, 4 + encoded.length));
    api.disposeSbcCodec();
    return { errors, length: decoded.length, intact: wrapped.byteLength === encoded.length + 8 };
  }, info.project.name === "source" ? "/src/audio/generated/sbc.wasm" : "/nested/library/audio/sbc.wasm");
  expect(result.errors[0]).toContain("Cannot decode audio");
  expect(result.errors[1]).toContain("Cannot load SBC WASM");
  expect(result.errors[2]).toContain("CRC mismatch");
  expect(result.length).toBe(256); expect(result.intact).toBe(true);
});

test("worker URL override, disposal and pending-job rejection are recoverable", async ({ page }) => {
  await page.evaluate(async () => {
    await window.audioApi.audioToSbc(new AudioBuffer({ sampleRate: 32000, numberOfChannels: 2, length: 128 }));
  });
  const workerURL = page.workers()[0].url();
  const result = await page.evaluate(async workerURL => {
    const api = window.audioApi;
    api.configureSbcCodec({ workerURL });
    const encoded = await api.audioToSbc(new AudioBuffer({ sampleRate: 32000, numberOfChannels: 2, length: 128 }));
    const pending = api.sbcToAudioBuffer(encoded).then(() => "resolved", error => error.message);
    await Promise.resolve(); // allow the copied SBC input to reach the worker
    let configureError = "";
    try { api.configureSbcCodec({}); } catch (e) { configureError = String(e); }
    api.disposeSbcCodec();
    const disposed = await pending;
    const decoded = await api.sbcToAudioBuffer(encoded);
    api.disposeSbcCodec();
    return { configureError, disposed, length: decoded.length };
  }, workerURL);
  expect(result.configureError).toContain("conversion is running");
  expect(result.disposed).toContain("disposed");
  expect(result.length).toBe(256);
});

test("development demo converts and previews without requiring a controller", async ({ page }, info) => {
  test.skip(info.project.name !== "source", "UI test uses the development demo");
  await page.goto("/demo/index.dev.html");
  await page.locator("#musicFile").setInputFiles("tests/audio/fixtures/tone.mp3");
  await expect(page.locator("#audioBufferAhead")).toHaveValue("64");
  await expect(page.locator("#audioStatus")).toContainText("Ready:");
  await page.getByRole("button", { name: "Listen to converted audio" }).click();
  await expect(page.locator("#audioStatus")).toContainText("Playing decoded SBC");
  await page.getByRole("button", { name: "Play on PS4 speaker" }).click();
  await expect(page.locator("#audioStatus")).toContainText("Connect a PS4 controller");
});

test("HID events sustain playback with timers artificially delayed to one second", async ({ page }) => {
  const stats = await page.evaluate(async () => {
    const sbc = await window.audioApi.audioToSbc(new AudioBuffer({
      sampleRate: 32000, numberOfChannels: 2, length: 16000 - 80,
    }));
    const device = Object.assign(new EventTarget(), {
      productId: 0x09cc, productName: "Test DS4", opened: false,
      oninputreport: null as any,
      async open() { this.opened = true; },
      async receiveFeatureReport() { return new DataView(new ArrayBuffer(37)); },
      async sendReport() {},
    });
    Object.defineProperty(navigator, "hid", {
      configurable: true, value: { requestDevice: async () => [device] },
    });
    const manager = new window.DeviceManager();
    const connected = new Promise<any>(resolve => manager.$on("deviceconnected", resolve));
    manager.requestDevice();
    const controller = await connected;
    await controller.init();
    device.oninputreport({ device, reportId: 0x01, data: new DataView(new ArrayBuffer(9)), timeStamp: performance.now() });
    const originalTimeout = window.setTimeout;
    // The input source uses a separate interval. This models device events;
    // it does not claim that intervals evade real browser background throttling.
    const input = window.setInterval(() => device.dispatchEvent(new Event("inputreport")), 8);
    window.setTimeout = ((callback: TimerHandler, delay?: number, ...args: any[]) =>
      originalTimeout(callback, Math.max(1000, delay ?? 0), ...args)) as typeof window.setTimeout;
    try {
      await controller.sendMusic(sbc);
      return controller.getAudioPlaybackStats();
    } finally {
      window.setTimeout = originalTimeout;
      window.clearInterval(input);
      window.audioApi.disposeSbcCodec();
    }
  });
  expect(stats.audioDurationMs).toBe(500);
  expect(stats.packetsSent).toBe(32);
  expect(stats.inputReportWakeups).toBeGreaterThan(20);
  expect(stats.timerWakeups).toBe(0);
  expect(stats.elapsedMs).toBeLessThan(1000);
});

test("development demo sends audio and displays timing with the selected reserve", async ({ page }, info) => {
  test.skip(info.project.name !== "source", "UI test uses the development demo");
  await page.goto("/demo/index.dev.html");
  await page.evaluate(() => {
    const device = {
      productId: 0x09cc, productName: "Test DS4", opened: false,
      async open() { this.opened = true; },
      async receiveFeatureReport() { return new DataView(new ArrayBuffer(37)); },
      async sendReport() {},
      set oninputreport(handler: (event: unknown) => void) {
        queueMicrotask(() => handler({
          device: this, reportId: 0x01, data: new DataView(new ArrayBuffer(9)), timeStamp: performance.now(),
        }));
      },
    };
    Object.defineProperty(navigator, "hid", {
      configurable: true, value: { requestDevice: async () => [device] },
    });
  });
  await page.getByRole("button", { name: "Connect PS4 controller" }).click();
  await expect(page.locator("#log")).toContainText("Device connected: Test DS4");
  await page.locator("#musicFile").setInputFiles("tests/audio/fixtures/tone.mp3");
  await expect(page.locator("#audioStatus")).toContainText("Ready:");
  await page.locator("#audioBufferAhead").selectOption("16");
  await page.getByRole("button", { name: "Play on PS4 speaker" }).click();
  await expect(page.locator("#audioStatus")).toContainText("Controller playback finished");
  await expect(page.locator("#audioTiming")).toBeVisible();
  const stats = JSON.parse(await page.locator("#audioTiming").innerText());
  expect(stats.bufferAheadMs).toBe(16);
  expect(stats.packetsSent).toBeGreaterThan(1);
  expect(stats.audioDurationMs).toBeGreaterThan(100);
  expect(stats.elapsedMs).toBeGreaterThanOrEqual(stats.audioDurationMs);
  expect(stats.maxTimerDelayMs).toBeGreaterThanOrEqual(0);
  expect(stats.maxWriteDurationMs).toBeGreaterThanOrEqual(0);
  await expect(page.locator("#audioBufferAhead")).toBeEnabled();
});

// Only replace the device boundary. The real bundled worker, transport,
// MessageEvents, packetizer and timers execute in Chromium in every format.
async function mockPlaybackWorker(page: Page, mode: "slow-timers" | "open-error" | "write-error") {
  await page.route("**/*playback.worker*", async route => {
    if (route.request().url().includes("worker&url")) return route.continue();
    const response = await route.fetch();
    const prelude = `
      const writeTimes = [];
      let inputInterval;
      const fakeDevice = Object.assign(new EventTarget(), {
        vendorId: 0x054c, productId: 0x09cc, productName: "Worker test DS4", collections: [], opened: false,
        async open() {
          if (${JSON.stringify(mode)} === "open-error") throw new Error("Simulated worker open failure");
          this.opened = true;
          inputInterval = setInterval(() => this.dispatchEvent(new Event("inputreport")), 8);
        },
        async close() {
          this.opened = false;
          clearInterval(inputInterval);
          postMessage({ type: "test-trace", writeTimes, closed: true });
        },
        async sendReport(id, data) {
          if (id !== 0x18 || data[1] !== 0xa0) throw new Error("Unexpected speaker report");
          writeTimes.push(performance.timeOrigin + performance.now());
          if (writeTimes.length === 1) postMessage({ type: "test-first-write" });
          if (${JSON.stringify(mode)} === "write-error" && writeTimes.length === 3) throw new Error("Simulated HID write failure");
        },
      });
      Object.defineProperty(navigator, "hid", { value: { getDevices: async () => [fakeDevice] } });
      if (${JSON.stringify(mode)} === "slow-timers") {
        const nativeTimeout = globalThis.setTimeout;
        globalThis.setTimeout = (callback, delay, ...args) => nativeTimeout(callback, Math.max(1000, delay || 0), ...args);
      }
    `;
    await route.fulfill({ response, body: prelude + await response.text() });
  });
}

async function prepareWorkerPlaybackTest(page: Page, blockMainThread = false) {
  await page.evaluate(async block => {
    const state = (window as any).playbackTest = { mainWrites: 0, trace: null, blockStart: 0, blockEnd: 0 };
    const device = Object.assign(new EventTarget(), {
      vendorId: 0x054c, productId: 0x09cc, productName: "Worker test DS4", collections: [], opened: false,
      oninputreport: null as any,
      async open() { this.opened = true; },
      async receiveFeatureReport() { return new DataView(new ArrayBuffer(37)); },
      async sendReport() { state.mainWrites++; },
    });
    state.device = device;
    state.devices = [device];
    Object.defineProperty(navigator, "hid", { configurable: true, value: {
      requestDevice: async () => [device], getDevices: async () => state.devices,
    } });
    const manager = new window.DeviceManager();
    const connected = new Promise<any>(resolve => manager.$on("deviceconnected", resolve));
    manager.requestDevice();
    state.controller = await connected;
    await state.controller.init();
    device.oninputreport({ device, reportId: 1, data: new DataView(new ArrayBuffer(9)), timeStamp: performance.now() });
    state.sbc = await window.audioApi.audioToSbc(new AudioBuffer({
      sampleRate: 32000, numberOfChannels: 2, length: 32000 - 80,
    }));
    window.audioApi.disposeSbcCodec();
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        this.addEventListener("message", ({ data }) => {
          if (data.type === "test-trace") state.trace = data;
          if (block && data.type === "test-first-write") {
            state.blockStart = performance.timeOrigin + performance.now();
            const end = performance.now() + 350;
            while (performance.now() < end) { /* deliberate main-thread stall */ }
            state.blockEnd = performance.timeOrigin + performance.now();
          }
        });
      }
    };
  }, blockMainThread);
}

test("direct HID worker keeps sending during a blocked page and delayed worker timers", async ({ page }) => {
  await mockPlaybackWorker(page, "slow-timers");
  await prepareWorkerPlaybackTest(page, true);
  const result = await page.evaluate(async () => {
    const state = (window as any).playbackTest;
    const before = state.sbc.slice();
    await state.controller.sendMusic(state.sbc);
    return {
      stats: state.controller.getAudioPlaybackStats(), mainWrites: state.mainWrites,
      trace: state.trace, blockStart: state.blockStart, blockEnd: state.blockEnd,
      originalIntact: state.sbc.length === before.length && before.every((v: number, i: number) => state.sbc[i] === v),
      mainConnectionOpen: state.device.opened,
    };
  });
  expect(result.stats.transport).toBe("worker");
  expect(result.stats.bufferAheadMs).toBe(64);
  expect(result.stats.workerFallbackReason).toBeUndefined();
  expect(result.stats.audioDurationMs).toBe(1000);
  expect(result.stats.packetsSent).toBe(63);
  expect(result.stats.inputReportWakeups).toBeGreaterThan(50);
  expect(result.stats.timerWakeups).toBe(0);
  expect(result.mainWrites).toBe(0);
  expect(result.originalIntact && result.mainConnectionOpen && result.trace.closed).toBe(true);
  expect(result.blockEnd - result.blockStart).toBeGreaterThanOrEqual(350);
  const sentWhileBlocked = result.trace.writeTimes.filter((time: number) => time > result.blockStart && time < result.blockEnd);
  expect(sentWhileBlocked.length).toBeGreaterThan(10);
  await expect.poll(() => page.workers().length).toBe(0);
});

test("worker setup failure falls back before playback and records the reason", async ({ page }) => {
  await mockPlaybackWorker(page, "open-error");
  await prepareWorkerPlaybackTest(page);
  const result = await page.evaluate(async () => {
    const state = (window as any).playbackTest;
    await state.controller.sendMusic(state.sbc);
    return { stats: state.controller.getAudioPlaybackStats(), writes: state.mainWrites };
  });
  expect(result.stats.transport).toBe("main-thread");
  expect(result.stats.workerFallbackReason).toContain("Simulated worker open failure");
  expect(result.writes).toBe(63);
  await expect.poll(() => page.workers().length).toBe(0);
});

test("worker write failure closes its connection and never replays partial audio on the page", async ({ page }) => {
  await mockPlaybackWorker(page, "write-error");
  await prepareWorkerPlaybackTest(page);
  const result = await page.evaluate(async () => {
    const state = (window as any).playbackTest;
    let error = "";
    try { await state.controller.sendMusic(state.sbc); } catch (e) { error = String(e); }
    const afterFailure = { error, writes: state.mainWrites, stats: state.controller.getAudioPlaybackStats(), trace: state.trace };
    await state.controller.sendMusic(state.sbc, { transport: "main-thread" });
    return { ...afterFailure, retryWrites: state.mainWrites };
  });
  expect(result.error).toContain("Simulated HID write failure");
  expect(result.writes).toBe(0);
  expect(result.stats).toBeUndefined();
  expect(result.trace.closed).toBe(true);
  expect(result.trace.writeTimes).toHaveLength(3);
  expect(result.retryWrites).toBe(63);
  await expect.poll(() => page.workers().length).toBe(0);
});

test("indistinguishable controllers are never selected arbitrarily for worker playback", async ({ page }) => {
  await prepareWorkerPlaybackTest(page);
  const result = await page.evaluate(async () => {
    const state = (window as any).playbackTest;
    state.devices.push({ ...state.device });
    let error = "";
    try { await state.controller.sendMusic(state.sbc, { transport: "worker" }); } catch (e) { error = String(e); }
    const writesBeforeFallback = state.mainWrites;
    await state.controller.sendMusic(state.sbc);
    return { error, writesBeforeFallback, stats: state.controller.getAudioPlaybackStats(), writes: state.mainWrites };
  });
  expect(result.error).toContain("unique controller");
  expect(result.writesBeforeFallback).toBe(0);
  expect(result.stats.transport).toBe("main-thread");
  expect(result.stats.workerFallbackReason).toContain("unique controller");
  expect(result.writes).toBe(63);
  expect(page.workers()).toHaveLength(0);
});
