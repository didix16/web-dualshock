/// <reference path="./webhid.d.ts" />

import DeviceManager from "./device-manager";
export * from "./device-manager";

declare global {
  interface Window {
    DeviceManager: typeof DeviceManager;
  }
}

window.DeviceManager = DeviceManager;
