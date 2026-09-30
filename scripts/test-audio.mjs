import { build } from "vite";
import { spawnSync } from "node:child_process";

// Use the project's existing TS bundler and Node's test runner; no unit-test runtime.
await build({
  configFile: false,
  build: {
    outDir: ".audio-test", emptyOutDir: false, minify: false,
    lib: { entry: "tests/audio/unit.test.ts", formats: ["es"], fileName: () => "audio.test.mjs" },
    rollupOptions: { external: [/^node:/] },
  },
});
const result = spawnSync(process.execPath, ["--test", ".audio-test/audio.test.mjs"], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
