// High-level API for DualShock 4/5 using WebHID and Gamepad API
// Inspired by https://github.com/madgooselabs/WebHID-DS4 but with no external dependencies

export type DualShockState = {
  buttons: Record<string, boolean>;
  axes: Record<string, number>;
  timestamp: number;
};

export class DualShock {
  public state: DualShockState = {
    buttons: {},
    axes: {},
    timestamp: 0,
  };
  private _hidDevice: HIDDevice | null = null;
  private _gamepadIndex: number | null = null;

  async init() {
    if ("hid" in navigator) {
      await this._initWebHID();
    } else {
      this._initGamepadAPI();
    }
  }

  private async _initWebHID() {
    const filters = [{ vendorId: 0x054c }];
    const [device] = await (navigator as any).hid.requestDevice({ filters });
    if (!device) throw new Error("No device selected");
    this._hidDevice = device;
    await device.open();
    device.addEventListener("inputreport", (e: any) => {
      // Here you would parse the real controller buffer
      this.state = {
        ...this.state,
        buttons: { ...this.state.buttons, raw: true },
        axes: { ...this.state.axes, raw: 0 },
        timestamp: Date.now(),
      };
    });
  }

  private _initGamepadAPI() {
    const poll = () => {
      const gamepads = navigator.getGamepads();
      for (const [i, gp] of Array.from(gamepads).entries()) {
        if (gp && gp.id.match(/(Wireless Controller|DualSense|DualShock)/i)) {
          this._gamepadIndex = i;
          this.state = {
            buttons: Object.fromEntries(
              gp.buttons.map((b, idx) => [idx, b.pressed])
            ),
            axes: Object.fromEntries(gp.axes.map((a, idx) => [idx, a])),
            timestamp: gp.timestamp,
          };
        }
      }
      requestAnimationFrame(poll);
    };
    poll();
  }
}
