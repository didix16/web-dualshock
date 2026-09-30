# web-dualshock

TypeScript library to manage PS4/PS5 controllers in the browser using WebHID and the Gamepad API.

## Development workflow

- **Hot reload development:**
  - Run `yarn dev:demo` to start Vite with hot reload and open the demo (`demo/index.dev.html`).
  - The demo imports the library source directly, so any changes in `src/web-dualshock.ts` are reflected instantly.

- **Production build and deploy:**
  - Run `yarn build` to build the library into `dist/`.
  - Run `yarn prepare:demo` to copy the build into `demo/dist` and set up `demo/index.html` for production (copied from `index.prod.html`).
  - Run `yarn preview:demo` to serve the production demo with the bundled library.
  - Run `yarn deploy` to build, prepare, and deploy the demo (with the library) to GitHub Pages. The workflow ensures `index.html` is always correct for GitHub Pages.

## Main scripts

- `yarn dev:demo`: Hot reload development demo (source import).
- `yarn build`: Builds the library into `dist/`.
- `yarn prepare:demo`: Copies `dist/` into `demo/` and sets up `index.html` for production.
- `yarn preview:demo`: Serves the production demo with the built library included.
- `yarn deploy`: Builds, prepares, and deploys the demo (with library) to GitHub Pages.

## Structure

- `src/web-dualshock.ts`: Library source code.
- `src/webhid.d.ts`: WebHID type definitions (for compatibility).
- `demo/index.dev.html`: Demo for hot reload development (imports source).
- `demo/index.prod.html`: Demo for production (uses UMD bundle).
- `demo/index.html`: Generated for deploy (copied from `index.prod.html`).
- `dist/`: Library build output (ESM and UMD bundles).

## GitHub Pages deployment

The workflow `.github/workflows/gh-pages.yml` automatically publishes the demo and the library to GitHub Pages on every push to `main`.

## Development with Yarn Berry (v4) and PnP

- The project is ready for VS Code and PnP.
- If you have type issues, run `yarn dlx @yarnpkg/sdks vscode`.

## What works

- Connecting to PS4 controllers via WebHID and Gamepad API using USB and Bluetooth.
- Accessing and controlling lightbar, rumble, and speaker features.
- Reading gamepad state (buttons, axes, touches, etc.) in real-time.
- Converting MP3 and other browser-supported audio to SBC with Web Audio and a small WASM codec.
- Decoding SBC to an AudioBuffer for playback or inspection.
- Sending SBC bytes or files to the PS4 controller over Bluetooth. Timing still depends on browser scheduling, especially in background tabs.

## Installation

```sh
npm install web-dualshock
# or
yarn add web-dualshock
```

## Usage (ESM/TypeScript)

```ts
import "./dist/web-dualshock.umd.js"; // or web-dualshock.es.js

const dm = new DeviceManager();
dm.requestDevice();

let ds = null;
dm.$on("deviceconnected", async(device) => {
  // device connected

  // initialize the device
  device.init();
  ds = device;

  // access to lightbar. values goes from 0 to 255
  ds.lightbar.r = 255;
  ds.lightbar.g = 0;
  ds.lightbar.b = 0;

  //or. values goes from 0 to 255
  await ds.setLightBarColor(red: [0-255], green: [0-255], blue: [0-255]);

  // access to rumble. values goes from 0 to 255
  ds.rumble.light = 255;
  ds.rumble.heavy = 0;

  //or
  await ds.setRumbleIntensity(light: [0-255], heavy: [0-255]);

  // Speaker
  await ds.setVolume(
    leftVolume: [0-255],
    rightVolume: [0-255],
    micVolume: [0-255],
    speakerVolume: [0-79],
  );

  // Send music to the controller. Set speakerVolume to 79. I have not tested on headsets.
  // Accepts an SBC File, ArrayBuffer or Uint8Array. Convert MP3 with audioToSbc.
  await ds.sendMusic(sbcData);

  // get gamepad state (buttons, gyroscope, touchpad,etc...) read only use
  console.log(ds.state);
  {
    interface: 'none' | 'bt' | 'usb',
    battery: number,
    charging: boolean,
    controllerType: number,
    headphones: boolean,
    microphone: boolean,
    extension: boolean,

    audio: string,

    reports: [],

    axes: {
      leftStickX: number,
      leftStickY: number,
      rightStickX: number,
      rightStickY: number,

      l2: number,
      r2: number,

      accelX: number,
      accelY: number,
      accelZ: number,

      gyroX: number,
      gyroY: number,
      gyroZ: number,
    },

    buttons: {
      triangle: boolean,
      circle: boolean,
      cross: boolean,
      square: boolean,

      dPadUp: boolean,
      dPadRight: boolean,
      dPadDown: boolean,
      dPadLeft: boolean,

      l1: boolean,
      l2: boolean | number,
      l3: boolean,

      r1: boolean,
      r2: boolean | number,
      r3: boolean,

      options: boolean,
      share: boolean,
      playStation: boolean,
      touchPadClick: boolean,
    },

    touchpad: {
      touches: [],
    },

    timestamp: -1,
  }
  //  example to get square pushed:
  if (ds.state.buttons.square) {
    console.log("Square button is pressed");
  }
});
```

- All types (including WebHID globals) are included automatically.
- For browser UMD usage, use the bundle in `dist/`.

## Browser audio: MP3 to SBC and back

```ts
import { audioToSbc, sbcToAudioBuffer } from "web-dualshock";

// file is a File from <input type="file">. AudioBuffer is also accepted.
const sbc = await audioToSbc(file);
await ds.sendMusic(sbc);

// Reuse the same bytes, with no second conversion.
await ds.sendMusic(sbc);
const decoded = await sbcToAudioBuffer(sbc);
```

The API is browser-only. `audioToSbc(Blob | AudioBuffer)` returns a
`Promise<Uint8Array>` containing raw SBC frames at 32000 Hz, stereo, 16 blocks,
8 subbands, loudness allocation, bitpool 50 (224 kbit/s). A File is a Blob.
Web Audio decodes the input and resamples/mixes it to stereo; other input
formats depend on the browser's decoders. MP3 decoding is tested in Chromium.

`sbcToAudioBuffer(Blob | ArrayBuffer | Uint8Array)` decodes SBC at its original
frequency and channel count. SBC CRC, frame boundaries and a constant frequency
and channel count are required. mSBC and containerized audio are not accepted by
this function. Decoder and encoder run in a Web Worker. The compiled codec is
9,642 bytes (about 5.2 KB gzip); the worker is about 3.1 KB before compression.
No audio is uploaded and no FFmpeg runtime is used.

To listen to the decoded SBC, create/resume an AudioContext from a user gesture:

```ts
// Inside a click handler:
const context = new AudioContext();
await context.resume();
const source = context.createBufferSource();
source.buffer = await sbcToAudioBuffer(sbc);
source.connect(context.destination);
source.onended = () => { void context.close(); };
source.start();
```

`ds.sendMusic(File | ArrayBuffer | Uint8Array)` still accepts existing `.sbc`
files and now also accepts in-memory bytes (including Buffer and subarray
views). Inputs are copied; their buffers are not detached. The promise rejects
on malformed SBC, USB, a closed device, concurrent playback on the same
controller or a failed HID write. It resolves after the last packet's nominal
audio duration; there is no hardware acknowledgment of audible completion.
It validates the complete input before sending any audio. CRC protects SBC
headers and scale factors, not every compressed audio bit.

The complete input is decoded in memory before playback. Conversion is not a
streaming API; long recordings require proportionally more memory. Encoding
preserves the filter tail and pads the last frame. Raw SBC has no original-length
metadata, so decoding retains a few milliseconds of codec delay/padding.
Playback is supported on the PS4 over Bluetooth; generated SBC uses the profile
of the included demo files. Other SBC profiles and physical sound quality need
controller testing. Browser timers can still cause glitches in background tabs.

### Hosting the worker and WASM

Run `yarn build` and distribute **all of `dist/`**, keeping `assets/` and `audio/`
next to the JS bundles. URLs resolve relative to the bundle, including when
hosted in a subdirectory. The worker and WASM load only on the first conversion;
sending existing SBC does not start the codec. Serve over HTTP(S), not file URLs.
The default worker must be served from the same origin as the page.

For UMD script usage, exports are available on `WebDualShock`:

```html
<script src="./dist/web-dualshock.umd.js"></script>
<script>
  // Inside your file-selection handler:
  // const sbc = await WebDualShock.audioToSbc(file);
  // await ds.sendMusic(sbc);
</script>
```

When a consumer bundler moves resources, copy `dist/audio/sbc.wasm` and the
built `dist/assets/sbc.worker-*.js` to a public directory and configure their
actual URLs before conversion:

```ts
import { configureSbcCodec, disposeSbcCodec } from "web-dualshock";
configureSbcCodec({
  wasmURL: "/audio/sbc.wasm",
  workerURL: "/audio/sbc-worker.js", // copy/rename the generated worker here
});
// Later, release the worker and WASM memory (rejects pending worker jobs).
disposeSbcCodec();
// The next conversion loads the codec again.
```

For a Content Security Policy, allow the worker origin (`worker-src`) and
WASM loading (`connect-src` and the browser's WebAssembly compilation policy,
typically `script-src 'wasm-unsafe-eval'`). SharedArrayBuffer and cross-origin
isolation are not needed.

### Building and testing the audio codec

The precompiled WASM is checked in; ordinary library builds need only Yarn/Node.
To rebuild the C sources, see [native/sbc/README.md](native/sbc/README.md).
The codec uses google/libsbc under Apache-2.0; its license is distributed in
`dist/audio/LICENSE-libsbc`. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

```sh
yarn test                       # PCM/SBC, CRC, reference fixtures and simulated HID
yarn build
yarn playwright install chromium # once, for browser tests
yarn test:browser                # Web Audio + workers, source/ESM/UMD, relocated assets
yarn prepare:demo                # regenerate production demo
```

The demo can convert audio and preview decoded SBC without a connected
controller. The separate PS4 playback button sends the prepared bytes.

## Publishing to npm

To publish the library to npm:

1. Make sure you are logged in to npm (`yarn npm login` or `npm login`).
2. Run:

   ```sh
   yarn publish:npm
   ```

```

This will build the library, generate all type definitions (including WebHID globals), and publish the package to npm with public access.

After publishing, users will get all types automatically when importing the package.

---

Inspired by:

- [madgooselabs/WebHID-DS4](https://github.com/madgooselabs/WebHID-DS4)
- [Pecacheu/dualshock](https://github.com/Pecacheu/dualshock)
```
