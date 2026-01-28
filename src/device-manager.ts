/**
 * DeviceManager singleton class to manage devices.
 * It handles the connection and disconnection of devices,
 * and provides methods to get the list of connected devices.
 * It also provides methods to get a device by its ID or index.
 */
import DualShock4 from "./ds4";
import Emitter from "./emitter";
export default class DeviceManager extends Emitter {
  protected devices: Array<DualShock4> = [];

  constructor() {
    // High-level API for DualShock 4/5 using WebHID and Gamepad API
    // Inspired by https://github.com/madgooselabs/WebHID-DS4 but with no external dependencies

    // check if browser supports WebHID
    if (typeof navigator.hid === "undefined") {
      alert("WebHID is not supported in this browser");
      throw new Error("WebHID is not supported in this browser");
    }

    // check if browser supports Gamepad API
    if (typeof navigator.getGamepads === "undefined") {
      alert("Gamepad API is not supported in this browser");
      throw new Error("Gamepad API is not supported in this browser");
    }

    super();

    // listen for a gamepad available event
    window.addEventListener("gamepadconnected", (event) => {
      console.log("Gamepad connected:", event.gamepad);

      // Check if the connected gamepad is a DualShock
      // to do so, find the substring "Wireless Controller" or "DualShock 4" or "DualSense" in the gamepad id
      if (
        event.gamepad.id.includes("Wireless Controller") ||
        event.gamepad.id.includes("DualShock 4") ||
        event.gamepad.id.includes("DualSense")
      ) {
        console.log("DualShock gamepad connected:", event.gamepad);
        // get vendor and product IDs from the gamepad ID
        const gamepadId = event.gamepad.id;
        const IDS = gamepadId.match(/(0x)?([0-9a-fA-F]{4})/g);
        const vendorId = IDS ? IDS[0] : null;
        const productId = IDS ? IDS[1] : null;
        if (vendorId && productId) {
          console.log(`Vendor ID: ${vendorId}, Product ID: ${productId}`);
          // request the gamepad using WebHID
          navigator.hid
            .requestDevice({
              filters: [
                {
                  vendorId: parseInt(vendorId, 16),
                  productId: parseInt(productId, 16),
                },
              ],
            })
            .then((devices) => {
              if (devices.length > 0) {
                const device = devices[0];
                console.log("DualShock device found:", device);
                const ds = new DualShock4(device, event.gamepad);
                this.devices.push(ds);
                this.$emit("deviceconnected", ds);
              } else {
                console.error("No DualShock device found");
              }
            })
            .catch((error) => {
              console.error("Failed to request DualShock device:", error);
            });
        } else {
          console.error(
            "Could not extract vendor and product IDs from gamepad ID",
          );
        }
      }
    });
  }

  requestDevice(): this {
    navigator.hid
      .requestDevice({
        filters: [
          // Official Sony Controllers
          { vendorId: 0x054c, productId: 0x0ba0 },
          { vendorId: 0x054c, productId: 0x05c4 },
          { vendorId: 0x054c, productId: 0x09cc },
          { vendorId: 0x054c, productId: 0x05c5 },
          // Razer Raiju
          { vendorId: 0x1532, productId: 0x1000 },
          { vendorId: 0x1532, productId: 0x1007 },
          { vendorId: 0x1532, productId: 0x1004 },
          { vendorId: 0x1532, productId: 0x1009 },
          // Nacon Revol
          { vendorId: 0x146b, productId: 0x0d01 },
          { vendorId: 0x146b, productId: 0x0d02 },
          { vendorId: 0x146b, productId: 0x0d08 },
          // Other third party controllers
          { vendorId: 0x0f0d, productId: 0x00ee },
          { vendorId: 0x7545, productId: 0x0104 },
          { vendorId: 0x2e95, productId: 0x7725 },
          { vendorId: 0x11c0, productId: 0x4001 },
          { vendorId: 0x0c12, productId: 0x57ab },
          { vendorId: 0x0c12, productId: 0x0e16 },
          { vendorId: 0x0f0d, productId: 0x0084 },
        ],
      })
      .then((devices) => {
        if (devices.length > 0) {
          const device = devices[0];
          console.log("DualShock device found:", device);
          const ds = new DualShock4(device);
          this.devices.push(ds);
          this.$emit("deviceconnected", ds);
        } else {
          console.error("No DualShock device found");
        }
      })
      .catch((error) => {
        console.error("Failed to request DualShock device:", error);
      });

    return this;
  }

  /**
   * Get the list of connected devices.
   * @returns {Array<DualShock4>} The list of connected devices.
   */
  getDevices(): Array<DualShock4> {
    return this.devices;
  }

  getDeviceAtIndex(index: number): DualShock4 | null {
    if (index < 0 || index >= this.devices.length) {
      return null;
    }
    return this.devices[index];
  }
}
