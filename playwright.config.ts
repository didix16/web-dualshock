import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/audio",
  testMatch: "browser.spec.ts",
  workers: 1,
  timeout: 30_000,
  use: { browserName: "chromium", headless: true },
  projects: [
    { name: "source", use: { baseURL: "http://127.0.0.1:4173" } },
    { name: "esm", use: { baseURL: "http://127.0.0.1:4174" } },
    { name: "umd", use: { baseURL: "http://127.0.0.1:4174" } },
  ],
  webServer: [
    { command: "yarn vite --host 127.0.0.1 --port 4173 --strictPort", url: "http://127.0.0.1:4173/tests/audio/browser.html" },
    { command: "node scripts/serve-audio-test.mjs", url: "http://127.0.0.1:4174" },
  ],
});
