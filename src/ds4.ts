import { Buffer } from "buffer";
import { readSbcInput } from "./audio/sbc";
import type { SbcPlaybackOptions, SbcPlaybackStats } from "./audio/send-sbc";
import { sendSbcWithTransport } from "./audio/playback";
//import crc32 from "crc/crc32";
import { crc32 as crc } from "./crc.js";
import {
  defaultState,
  DualShock4ControllerType,
  DualShock4Interface,
  DualShock4State,
} from "./ds4state";
import LightbarDevice from "./lightbar";
import RumbleDevice from "./rumble";
import { buf2view } from "./util/buffer";
import { normalizeThumbstick, normalizeTrigger } from "./util/normalize";

export default class DualShock4 {
  /** Internal WebHID device */
  protected device: HIDDevice;
  /** Internal Gamepad instance */
  protected gamepad?: Gamepad;

  /** Raw contents of the last HID Report sent by the controller. */
  protected lastReport?: ArrayBuffer;
  /** Raw contents of the last HID Report sent to the controller. */
  protected lastSentReport?: ArrayBuffer;

  /** Current controller state */
  protected state: DualShock4State = defaultState;

  /** Allows lightbar control */
  protected lightbar: LightbarDevice = new LightbarDevice(this);
  /** Allows rumble control */
  protected rumble: RumbleDevice = new RumbleDevice(this);

  protected miscData?: string = "";

  protected volume: number[] = [0x38, 0x38, 0x00, 0x4f];

  constructor(device: HIDDevice, gamepad?: Gamepad) {
    this.device = device;
    this.gamepad = gamepad;
  }

  /* getNameOfControllerType(controllerType: Number): any {
    return DualShock4ControllerType[controllerType]
      ? DualShock4ControllerType[controllerType]
      : `Unknown Type: 0x${controllerType.toString(16).padStart(2, "0")}`;
  } */

  async init() {
    if (this.device.opened) return;

    // Open the device
    await this.device.open();
    this.device.oninputreport = (report) =>
      this.processControllerReport(report);
  }

  /**
   * Parses a report sent from the controller and updates the state.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param report - HID Report sent by the controller.
   */
  private processControllerReport(report: HIDInputReportEvent) {
    const { data } = report;
    this.lastReport = data.buffer as ArrayBuffer;

    // Raw input and gamepad state remain live during playback. Avoid formatting
    // diagnostic strings on every report while audio needs timely HID writes.
    if (!this.musicPlaying) {
      this.miscData = `HID:\n${buf2view(
        data.buffer.slice(0, 9) as ArrayBuffer,
      )}\n\nData:\n${buf2view(data.buffer.slice(10) as ArrayBuffer)}`;
    }

    // Interface is unknown
    if (this.state.interface === DualShock4Interface.Disconnected) {
      if (data.byteLength === 63) {
        this.state.interface = DualShock4Interface.USB;
      } else {
        this.state.interface = DualShock4Interface.Bluetooth;
        // Enable the full Bluetooth input reports once during detection.
        this.device.receiveFeatureReport(0x02).catch((error) =>
          console.error("Failed to enable full DS4 Bluetooth reports", error),
        );
        return;
      }
      // Player 1 Color
      this.lightbar.setColorRGB(0, 0, 64).catch((e) => console.error(e));
    }

    this.state.timestamp = report.timeStamp;

    // USB Reports
    if (
      this.state.interface === DualShock4Interface.USB &&
      report.reportId === 0x01
    ) {
      this.updateState(data);
    }
    // Bluetooth Reports
    else if (
      this.state.interface === DualShock4Interface.Bluetooth &&
      report.reportId === 0x11
    ) {
      this.updateState(new DataView(data.buffer, 2));
    }
  }

  /**
   * Updates the controller state using normalized data from the last report.
   *
   * This function is called internally by the library each time a report is received.
   *
   * @param data - Normalized data from the HID report.
   */
  private updateState(data: DataView) {
    // Update thumbsticks
    this.state.axes.leftStickX = normalizeThumbstick(data.getUint8(0));
    this.state.axes.leftStickY = normalizeThumbstick(data.getUint8(1));
    this.state.axes.rightStickX = normalizeThumbstick(data.getUint8(2));
    this.state.axes.rightStickY = normalizeThumbstick(data.getUint8(3));

    // Update main buttons
    const buttons1 = data.getUint8(4);
    this.state.buttons.triangle = !!(buttons1 & 0x80);
    this.state.buttons.circle = !!(buttons1 & 0x40);
    this.state.buttons.cross = !!(buttons1 & 0x20);
    this.state.buttons.square = !!(buttons1 & 0x10);
    // Update D-Pad
    const dPad = buttons1 & 0x0f;
    this.state.buttons.dPadUp = dPad === 7 || dPad === 0 || dPad === 1;
    this.state.buttons.dPadRight = dPad === 1 || dPad === 2 || dPad === 3;
    this.state.buttons.dPadDown = dPad === 3 || dPad === 4 || dPad === 5;
    this.state.buttons.dPadLeft = dPad === 5 || dPad === 6 || dPad === 7;
    // Update additional buttons
    const buttons2 = data.getUint8(5);
    this.state.buttons.l1 = !!(buttons2 & 0x01);
    this.state.buttons.r1 = !!(buttons2 & 0x02);
    this.state.buttons.l2 = !!(buttons2 & 0x04);
    this.state.buttons.r2 = !!(buttons2 & 0x08);
    this.state.buttons.share = !!(buttons2 & 0x10);
    this.state.buttons.options = !!(buttons2 & 0x20);
    this.state.buttons.l3 = !!(buttons2 & 0x40);
    this.state.buttons.r3 = !!(buttons2 & 0x80);
    const buttons3 = data.getUint8(6);
    this.state.buttons.playStation = !!(buttons3 & 0x01);
    this.state.buttons.touchPadClick = !!(buttons3 & 0x02);

    switch (this.state.controllerType) {
      case DualShock4ControllerType.Gamepad:
        // Update Triggers
        this.state.axes.l2 = normalizeTrigger(data.getUint8(7));
        this.state.axes.r2 = normalizeTrigger(data.getUint8(8));

        // Update battery level
        this.state.charging = !!(data.getUint8(29) & 0x10);
        if (this.state.charging) {
          this.state.battery = Math.min(
            Math.floor(((data.getUint8(29) & 0x0f) * 100) / 11),
          );
        } else {
          this.state.battery = Math.min(
            100,
            Math.floor(((data.getUint8(29) & 0x0f) * 100) / 8),
          );
        }

        this.state.headphones = !!(data.getUint8(29) & 0x20);
        this.state.microphone = !!(data.getUint8(29) & 0x40);
        this.state.extension = !!(data.getUint8(29) & 0x80);

        if (this.state.headphones && this.state.microphone) {
          this.state.audio = "headset";
        } else if (this.state.headphones && !this.state.microphone) {
          this.state.audio = "headphones";
        } else if (!this.state.headphones && this.state.microphone) {
          this.state.audio = "microphone";
        } else {
          this.state.audio = "volume-high";
        }

        // Update motion input
        this.state.axes.gyroX = data.getUint16(13);
        this.state.axes.gyroY = data.getUint16(15);
        this.state.axes.gyroZ = data.getUint16(17);
        this.state.axes.accelX = data.getInt16(19);
        this.state.axes.accelY = data.getInt16(21);
        this.state.axes.accelZ = data.getInt16(23);

        // Update touchpad
        this.state.touchpad.touches = [];
        if (!(data.getUint8(34) & 0x80)) {
          this.state.touchpad.touches.push({
            touchId: data.getUint8(34) & 0x7f,
            x: ((data.getUint8(36) & 0x0f) << 8) | data.getUint8(35),
            y: (data.getUint8(37) << 4) | ((data.getUint8(36) & 0xf0) >> 4),
          });
        }
        if (!(data.getUint8(38) & 0x80)) {
          this.state.touchpad.touches.push({
            touchId: data.getUint8(38) & 0x7f,
            x: ((data.getUint8(40) & 0x0f) << 8) | data.getUint8(39),
            y: (data.getUint8(41) << 4) | ((data.getUint8(40) & 0xf0) >> 4),
          });
        }
        break;
      case DualShock4ControllerType.HOTAS:
      //console.dir(data.getUint8(46)) // turn joystick
      //console.dir(data.getUint8(47)) // rudder handle
      //console.dir(data.getUint8(48)) // rudder lever
    }
  }

  /**
   * Sends the local rumble and lightbar state to the controller.
   *
   * This function is called automatically in most cases.
   *
   * **Currently broken over Bluetooth, doesn't do anything**
   */
  async sendLocalState() {
    if (!this.device)
      throw new Error(
        "Controller not initialized. You must call .init() first!",
      );

    if (this.state.interface === DualShock4Interface.USB) {
      const report = new Uint8Array(16);

      // Report ID
      report[0] = 0x05;

      // Enable Rumble (0x01), Lightbar (0x02), Lightbar Blink (0x04)
      report[1] = 0xf8 | 0x01 | 0x02 | 0x04;

      // Light rumble motor
      report[4] = this.rumble.light;
      // Heavy rumble motor
      report[5] = this.rumble.heavy;

      // Lightbar Red
      report[6] = this.lightbar.r;
      // Lightbar Green
      report[7] = this.lightbar.g;
      // Lightbar Blue
      report[8] = this.lightbar.b;
      // Lightbar Blink On
      report[9] = this.lightbar.blinkOn;
      // Lightbar Blink Off
      report[10] = this.lightbar.blinkOff;

      this.lastSentReport = report.buffer;

      return this.device.sendReport(report[0], report.slice(1));
    } else {
      console.log("sending report via bluetooth");
      const report = [
        0xa2, // Header
        0x11, // Report ID
        0xc0, // Poll Rate
        0xa0,
        0xf3,
        0x04,
        0x00,
        this.rumble.light, // Light rumble motor
        this.rumble.heavy, // Heavy rumble motor
        this.lightbar.r, // Lightbar Red
        this.lightbar.g, // Lightbar Green
        this.lightbar.b, // Lightbar Blue
        this.lightbar.blinkOn, // Lightbar Blink On
        this.lightbar.blinkOff, // Lightbar Blink Off
        0x00, // Padding
        0x00, // Padding
        0x00, // Padding
        0x00, // Padding
        0x00, // Padding
        0x00, // Padding
        0x00, // Padding
        0x00, // Padding
        this.volume[0], //LEFT VOLUME
        this.volume[1], //RIGHT VOLUME
        this.volume[2], // MIC VOLUME
        this.volume[3], // SPEAKER VOLUME
        0x85,
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
        0x00,
        0x00,
        0x00,
        0x00, // Padding
      ];
      const crc32 = crc(report);

      report[75] = crc32[0];
      report[76] = crc32[1];
      report[77] = crc32[2];
      report[78] = crc32[3];

      report.shift(); // Remove the first byte (0xA2)
      report.shift(); // Remove the second byte (0x11) and sendReport already send it
      const buff = Buffer.from(report);
      this.lastSentReport = buff.buffer;

      return this.device.sendReport(0x11, buff);
    }
  }

  /**
   * Set the volume levels for the controller.
   * leftVolume - The volume level for the left speaker (0-255).
   * rightVolume - The volume level for the right speaker (0-255).
   * micVolume - The volume level for the microphone (0-255).
   * speakerVolume - The volume level for the speaker (0-79).
   */
  async setVolume(
    leftVolume: number,
    rightVolume: number,
    micVolume: number,
    speakerVolume: number,
  ) {
    if (!this.device) {
      throw new Error(
        "Controller not initialized. You must call .init() first!",
      );
    }

    /*if (this.state.interface !== DualShock4Interface.Bluetooth) {
      throw new Error("setVolume is only supported over Bluetooth");
    }*/

    this.volume = [leftVolume, rightVolume, micVolume, speakerVolume];

    await this.sendLocalState();
  }

  /**
   * Sets the color for the light bar.
   * @param red
   * @param green
   * @param blue
   */
  async setLightBarColor(red: number, green: number, blue: number) {
    if (!this.device) {
      throw new Error(
        "Controller not initialized. You must call .init() first!",
      );
    }

    this.lightbar.setColorRGB(red, green, blue);
    await this.sendLocalState();
  }

  /**
   * Sets the rumble light and heavy intensity.
   * @param light 0 - 255
   * @param heavy 0 - 255
   */
  async setRumbleIntensity(light: number, heavy: number) {
    if (!this.device) {
      throw new Error(
        "Controller not initialized. You must call .init() first!",
      );
    }

    await this.rumble.setRumbleIntensity(light, heavy);
  }

  private musicPlaying = false;
  private audioPlaybackStats?: SbcPlaybackStats;

  /** Timing of the last successful playback; undefined during playback or after failure. */
  getAudioPlaybackStats(): SbcPlaybackStats | undefined {
    return this.audioPlaybackStats ? { ...this.audioPlaybackStats } : undefined;
  }

  /**
   * Send raw SBC frames over Bluetooth. Convert other audio with audioToSbc().
   * Resolves after the last packet's nominal duration; rejects on invalid SBC,
   * concurrent playback, a closed device, or a failed HID write.
   */
  async sendMusic(input: File | ArrayBuffer | Uint8Array, options: SbcPlaybackOptions = {}): Promise<void> {
    if (!this.device?.opened) {
      throw new Error("Controller not initialized. You must call .init() first!");
    }
    if (this.state.interface !== DualShock4Interface.Bluetooth) {
      throw new Error("sendMusic is only supported over Bluetooth");
    }
    if (this.musicPlaying) throw new Error("Music is already playing on this controller");
    this.musicPlaying = true;
    this.audioPlaybackStats = undefined;
    try {
      this.audioPlaybackStats = await sendSbcWithTransport(this.device, await readSbcInput(input), options);
    } finally {
      this.musicPlaying = false;
    }
  }

  public getName(): string {
    // Return the product name of the device
    return this.device.productName || "Unknown DualShock Device";
  }
}
