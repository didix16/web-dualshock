/**
 * DeviceManager singleton class to manage devices.
 * It handles the connection and disconnection of devices,
 * and provides methods to get the list of connected devices.
 * It also provides methods to get a device by its ID or index.
 */
import DualShock4 from "./ds4";
import Emitter from "./emitter";
export default class DeviceManager extends Emitter {
    protected devices: Array<DualShock4>;
    constructor();
    requestDevice(): this;
    /**
     * Get the list of connected devices.
     * @returns {Array<DualShock4>} The list of connected devices.
     */
    getDevices(): Array<DualShock4>;
    getDeviceAtIndex(index: number): DualShock4 | null;
}
