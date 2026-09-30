import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const version = "4.0.15";
// Set EMCC to emcc.py to avoid shell quoting on Windows; use EMSDK's Python.
const emcc = process.env.EMCC || (process.env.EMSDK
  ? resolve(process.env.EMSDK, "upstream/emscripten/emcc.py") : "emcc");
const python = process.env.EMSDK_PYTHON || (process.platform === "win32" ? "python" : "python3");
const command = emcc.endsWith(".py") ? python : emcc;
const prefix = emcc.endsWith(".py") ? [emcc] : [];
function run(args) {
  const result = spawnSync(command, [...prefix, ...args], {
    cwd: root, encoding: "utf8", env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout;
}
if (!run(["--version"]).includes(` ${version} `)) {
  throw new Error(`Rebuild with Emscripten ${version}; see native/sbc/README.md`);
}
mkdirSync(new URL("../src/audio/generated/", import.meta.url), { recursive: true });
run([
  "native/sbc/bridge.c", "third_party/libsbc/src/sbc.c", "third_party/libsbc/src/bits.c",
  "-Ithird_party/libsbc/include", "-std=c11", "-Oz", "-flto", "-fwrapv",
  "--no-entry", "-sSTANDALONE_WASM=1", "-sFILESYSTEM=0",
  "-sINITIAL_MEMORY=131072", "-sSTACK_SIZE=32768",
  '-sEXPORTED_FUNCTIONS=["_codec_reset","_codec_pcm","_codec_data","_codec_encode","_codec_decode"]',
  "-o", "src/audio/generated/sbc.wasm",
]);
const bytes = readFileSync(new URL("../src/audio/generated/sbc.wasm", import.meta.url));
writeFileSync(new URL("../src/audio/generated/build.json", import.meta.url), JSON.stringify({
  emscripten: version,
  libsbc: "6e505650145c9973d08a0bdd5e5f5e1914305e40",
  bytes: bytes.length,
  sha256: createHash("sha256").update(bytes).digest("hex"),
}, null, 2) + "\n");
console.log(`SBC encoder + decoder: ${bytes.length} bytes`);
