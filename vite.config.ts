import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let isBuild = false;

export default defineConfig({
  plugins: [{
    name: "sbc-wasm-asset",
    configResolved(config) { isBuild = config.command === "build"; },
    resolveId(id) { if (id === "virtual:sbc-wasm") return "\0sbc-wasm"; },
    load(id) {
      if (id !== "\0sbc-wasm") return;
      if (!isBuild) {
        return 'export default "/src/audio/generated/sbc.wasm"';
      }
      const reference = this.emitFile({
        type: "asset", fileName: "audio/sbc.wasm",
        source: readFileSync(resolve(__dirname, "src/audio/generated/sbc.wasm")),
      });
      return `export default import.meta.ROLLUP_FILE_URL_${reference}`;
    },
    generateBundle() {
      for (const [fileName, sourcePath] of [
        ["audio/LICENSE-libsbc", "third_party/libsbc/LICENSE"],
        ["audio/BUILD.json", "src/audio/generated/build.json"],
        ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.md"],
      ]) {
        this.emitFile({ type: "asset", fileName, source: readFileSync(resolve(__dirname, sourcePath)) });
      }
    },
  }],
  // Library assets must resolve beside the imported bundle, including under
  // demo/dist and GitHub Pages subdirectories, not at the host's root.
  base: "./",
  optimizeDeps: { entries: ["demo/index.dev.html"], include: ["buffer"] },
  server: { watch: { ignored: ["**/.audio-tools/**", "**/.audio-test/**", "**/third_party/**"] } },
  build: {
    lib: {
      entry: resolve(__dirname, "src/web-dualshock.ts"),
      name: "WebDualShock",
      fileName: (format) => `web-dualshock.${format}.js`,
      formats: ["es", "umd"],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
});
