/// <reference path="./webhid.d.ts" />
import DeviceManager from "./device-manager";
declare global {
    interface Window {
        DeviceManager: typeof DeviceManager;
    }
}
