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

- Connecting to PS4/PS5 controllers via WebHID and Gamepad API.
- Accessing and controlling lightbar, rumble, and speaker features.
- Reading gamepad state (buttons, axes, etc.) in real-time.
- Bluetooth connectivity though webhid
- Sending audio to the controller (requires SBC encoding) (Only via bluetooth)
  - The sound can be a little cranky. It's difficult to adjust the SBC packets timing using promises

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
  // The file you send it must be an SBC file. (explained below)
  await sendMusic(musicFile: File)

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

## Transform MP3 music file to SBC file

```sh
ffmpeg -i path/to/music.mp3 -ac 2 -ar 32k -c:a sbc -b:a 224k output.sbc
```

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
