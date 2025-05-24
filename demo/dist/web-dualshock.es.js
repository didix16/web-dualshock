var m = Object.defineProperty;
var d = (a, t, e) => t in a ? m(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var s = (a, t, e) => d(a, typeof t != "symbol" ? t + "" : t, e);
class p {
  constructor() {
    s(this, "state", {
      buttons: {},
      axes: {},
      timestamp: 0
    });
    s(this, "_hidDevice", null);
    s(this, "_gamepadIndex", null);
  }
  async init() {
    "hid" in navigator ? await this._initWebHID() : this._initGamepadAPI();
  }
  async _initWebHID() {
    const t = [{ vendorId: 1356 }], [e] = await navigator.hid.requestDevice({ filters: t });
    if (!e) throw new Error("No device selected");
    this._hidDevice = e, await e.open(), e.addEventListener("inputreport", (r) => {
      this.state = {
        ...this.state,
        buttons: { ...this.state.buttons, raw: !0 },
        axes: { ...this.state.axes, raw: 0 },
        timestamp: Date.now()
      };
    });
  }
  _initGamepadAPI() {
    const t = () => {
      const e = navigator.getGamepads();
      for (const [r, i] of Array.from(e).entries())
        i && i.id.match(/(Wireless Controller|DualSense|DualShock)/i) && (this._gamepadIndex = r, this.state = {
          buttons: Object.fromEntries(
            i.buttons.map((n, o) => [o, n.pressed])
          ),
          axes: Object.fromEntries(i.axes.map((n, o) => [o, n])),
          timestamp: i.timestamp
        });
      requestAnimationFrame(t);
    };
    t();
  }
}
export {
  p as DualShock
};
