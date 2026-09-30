import { test, expect } from "@playwright/test";
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
  await expect(page.locator("#audioStatus")).toContainText("Ready:");
  await page.getByRole("button", { name: "Listen to converted audio" }).click();
  await expect(page.locator("#audioStatus")).toContainText("Playing decoded SBC");
  await page.getByRole("button", { name: "Play on PS4 speaker" }).click();
  await expect(page.locator("#audioStatus")).toContainText("Connect a PS4 controller");
});
