# Rebuilding the SBC module

Normal `yarn build` uses the checked-in `src/audio/generated/sbc.wasm`.
Library users need no C compiler or Emscripten. The module contains both
encoder and decoder; its fixed linear memory is 128 KiB, independently of the
song length. PCM and output arrays live in the worker's JavaScript memory.

The portable sources are pinned in `third_party/libsbc/UPSTREAM.md`.
Use Emscripten **4.0.15** to reproduce the binary:

```sh
emsdk install 4.0.15
emsdk activate 4.0.15
# Load emsdk_env.sh (or emsdk_env.bat in a Windows command prompt).
yarn build:sbc
yarn test
yarn build
yarn test:browser
```

On Windows, pass the Python entry point instead of the emcc.bat shell wrapper:

```powershell
$env:EMCC = 'C:\path\to\emsdk\upstream\emscripten\emcc.py'
$env:EM_CONFIG = 'C:\path\to\emsdk\.emscripten'
$env:EMSDK_PYTHON = 'C:\path\to\emsdk\python\version_64bit\python.exe'
yarn build:sbc
```

The build is a standalone WebAssembly library with no imports, filesystem,
threads or generated JavaScript runtime. `bridge.c` exports only fixed scratch
buffers and reset/encode/decode operations. Encoding is fixed to the DS4 profile:
32000 Hz, stereo, 16 blocks, 8 subbands, loudness, bitpool 50.

`src/audio/generated/build.json` records source revision, compiler version,
binary size and SHA-256. The unit tests check the manifest and interoperability
fixtures. Compare the hash on each rebuild before updating the committed binary.

SBC needs filter history across frames. Each job resets its own encoding/decoding
state and preserves it throughout the job. Encoding adds 80 zero samples for the
filter tail, then pads to 128 samples. Raw SBC does not record the source sample
count, so decoding preserves this small delay/padding instead of guessing a trim.
