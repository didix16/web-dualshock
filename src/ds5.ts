import { defaultState, DualShock5Interface } from "./ds5state";
import LightbarDevice from "./lightbar";
import { ControllerReport } from "./report";
import RumbleDevice from "./rumble";

declare global {
  interface Window {
    crcTable?: number[];
  }
}

const makeCRCTable = (): number[] => {
  let c: number;
  const crcTable: number[] = [];
  for (let n = 0; n < 256; ++n) {
    c = n;
    for (let k = 0; k < 8; ++k) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  return crcTable;
};

// Compute CRC32 for `prefixBytes` concatenated with `dataView`.
const crc32 = (
  prefixBytes: Uint8Array | number[],
  dataView: DataView,
): number => {
  if (window.crcTable === undefined) window.crcTable = makeCRCTable();
  let crc = -1 >>> 0;
  for (const byte of prefixBytes)
    crc = (crc >>> 8) ^ (window.crcTable[(crc ^ byte) & 0xff] ?? 0);
  for (let i = 0; i < dataView.byteLength; ++i)
    crc =
      (crc >>> 8) ^ (window.crcTable[(crc ^ dataView.getUint8(i)) & 0xff] ?? 0);
  return (crc ^ -1) >>> 0;
};

// Given a DualSense Bluetooth output report with `reportId` and `reportData`,
// compute the CRC32 checksum and write it to the last four bytes of `reportData`.
const fillDualSenseChecksum = (reportId: number, reportData: Uint8Array) => {
  const crc = crc32(
    [0xa2, reportId],
    new DataView(reportData.buffer, 0, reportData.byteLength - 4),
  );
  reportData[reportData.byteLength - 4] = (crc >>> 0) & 0xff;
  reportData[reportData.byteLength - 3] = (crc >>> 8) & 0xff;
  reportData[reportData.byteLength - 2] = (crc >>> 16) & 0xff;
  reportData[reportData.byteLength - 1] = (crc >>> 24) & 0xff;
};

// Normalize an 8-bit thumbstick axis to the range [-1, +1].
const normalizeThumbStickAxis = (value: number) => {
  return (2 * value) / 0xff - 1.0;
};

// Normalize an 8-bit trigger axis to the range [0, +1].
const normalizeTriggerAxis = (value: number) => {
  return value / 0xff;
};

// Normalize a digital button value to the range [0, +1].
const normalizeButton = (value: number | boolean) => {
  return value ? 1.0 : 0.0;
};

const hex8 = (value: number): string => {
  return ("00" + (value >>> 0).toString(16)).substr(-2);
};
const hex16 = (value: number): string => {
  return ("0000" + (value >>> 0).toString(16)).substr(-4);
};
const hex32 = (value: number): string => {
  return ("00000000" + (value >>> 0).toString(16)).substr(-8);
};

const parseHex = (value: string): number => {
  if (value == "") return 0;

  return parseInt(value, 16);
};

export default class DualSense {
  static USAGE_PAGE_GENERIC_DESKTOP = 0x01;
  static USAGE_ID_GD_GAMEPAD = 0x05;
  /** Internal WebHID device */
  protected device: HIDDevice;
  /** Internal Gamepad instance */
  protected gamepad?: Gamepad;

  /** Allows lightbar control */
  protected lightbar: LightbarDevice = new LightbarDevice(this);
  /** Allows rumble control */
  protected rumble: RumbleDevice = new RumbleDevice(this);

  /** Raw contents of the last HID Report sent by the controller. */
  lastReport?: ArrayBuffer;
  /** Raw contents of the last HID Report sent to the controller. */
  lastSentReport?: ArrayBuffer;

  /** Current controller state */
  state = defaultState;

  selectedReport?: ControllerReport;
  lastTriggeredReport?: string;

  outputSeq_: number;
  playerLeds_: number;
  muteLed_: number;
  motorLeft_: number;
  motorRight_: number;
  l2EffectMode_: number;
  l2EffectParam1_: number;
  l2EffectParam2_: number;
  l2EffectParam3_: number;
  l2EffectParam4_: number;
  l2EffectParam5_: number;
  l2EffectParam6_: number;
  l2EffectParam7_: number;
  r2EffectMode_: number;
  r2EffectParam1_: number;
  r2EffectParam2_: number;
  r2EffectParam3_: number;
  r2EffectParam4_: number;
  r2EffectParam5_: number;
  r2EffectParam6_: number;
  r2EffectParam7_: number;
  lightbarRed_: number;
  lightbarGreen_: number;
  lightbarBlue_: number;

  constructor(device: HIDDevice, gamepad?: Gamepad) {
    if (!navigator.hid || !navigator.hid.requestDevice) {
      throw new Error("WebHID not supported by browser or not available.");
    }
    this.device = device;
    this.gamepad = gamepad;

    // Output report state.
    this.outputSeq_ = 1;
    this.playerLeds_ = 0x00;
    this.muteLed_ = 0x00;
    this.motorLeft_ = 0x00;
    this.motorRight_ = 0x00;
    this.l2EffectMode_ = 0x26;
    this.l2EffectParam1_ = 0x90;
    this.l2EffectParam2_ = 0xa0;
    this.l2EffectParam3_ = 0xff;
    this.l2EffectParam4_ = 0x00;
    this.l2EffectParam5_ = 0x00;
    this.l2EffectParam6_ = 0x00;
    this.l2EffectParam7_ = 0x00;
    this.r2EffectMode_ = 0x26;
    this.r2EffectParam1_ = 0x90;
    this.r2EffectParam2_ = 0xa0;
    this.r2EffectParam3_ = 0xff;
    this.r2EffectParam4_ = 0x00;
    this.r2EffectParam5_ = 0x00;
    this.r2EffectParam6_ = 0x00;
    this.r2EffectParam7_ = 0x00;
    this.lightbarRed_ = 0xff;
    this.lightbarGreen_ = 0xff;
    this.lightbarBlue_ = 0xff;

    this.state.interface = DualShock5Interface.Disconnected;
    for (const c of this.device.collections) {
      if (
        c.usagePage !== DualSense.USAGE_PAGE_GENERIC_DESKTOP ||
        c.usage !== DualSense.USAGE_ID_GD_GAMEPAD
      ) {
        continue;
      }

      // Compute the maximum input report byte length and compare against known values.
      let maxInputReportBytes = c.inputReports.reduce((max, report) => {
        return Math.max(
          max,
          report.items.reduce((sum, item) => {
            return sum + item.reportSize * item.reportCount;
          }, 0),
        );
      }, 0);
      if (maxInputReportBytes == 504)
        this.state.interface = DualShock5Interface.USB;
      else if (maxInputReportBytes == 616)
        this.state.interface = DualShock5Interface.Bluetooth;
    }
  }

  async readFeatureReport05() {
    // By default, bluetooth-connected DualSense only sends input report 0x01 which omits motion and touchpad data.
    // Reading feature report 0x05 causes it to start sending input report 0x31.
    //
    // Note: The Gamepad API will do this for us if it enumerates the gamepad.
    // Other applications like Steam may have also done this already.
    if (this.state.interface == DualShock5Interface.Bluetooth)
      await this.device.receiveFeatureReport(0x05);
  }

  async init() {
    if (this.device.opened) return;

    // Open the device
    this.device.open();
    this.device.oninputreport = (event) => {
      this.onInputReport(event);
    };
  }

  onInputReport(event: HIDInputReportEvent) {
    let reportId = event.reportId;
    let report = event.data;

    if (this.state.interface === DualShock5Interface.USB) {
      if (reportId == 0x01) this.handleUsbInputReport01(report);
      else return;
    } else if (this.state.interface === DualShock5Interface.Bluetooth) {
      if (reportId == 0x01) this.handleBluetoothInputReport01(report);
      else if (reportId == 0x31) this.handleBluetoothInputReport31(report);
      else return;
    } else {
      return;
    }
  }

  handleUsbInputReport01(report: DataView) {
    if (report.byteLength != 63) return;

    let axes0 = report.getUint8(0);
    let axes1 = report.getUint8(1);
    let axes2 = report.getUint8(2);
    let axes3 = report.getUint8(3);
    let axes4 = report.getUint8(4);
    let axes5 = report.getUint8(5);
    let seqNum = report.getUint8(6);
    let buttons0 = report.getUint8(7);
    let buttons1 = report.getUint8(8);
    let buttons2 = report.getUint8(9);
    let buttons3 = report.getUint8(10);
    let timestamp0 = report.getUint8(11);
    let timestamp1 = report.getUint8(12);
    let timestamp2 = report.getUint8(13);
    let timestamp3 = report.getUint8(14);
    let gyroX0 = report.getUint8(15);
    let gyroX1 = report.getUint8(16);
    let gyroY0 = report.getUint8(17);
    let gyroY1 = report.getUint8(18);
    let gyroZ0 = report.getUint8(19);
    let gyroZ1 = report.getUint8(20);
    let accelX0 = report.getUint8(21);
    let accelX1 = report.getUint8(22);
    let accelY0 = report.getUint8(23);
    let accelY1 = report.getUint8(24);
    let accelZ0 = report.getUint8(25);
    let accelZ1 = report.getUint8(26);
    let sensorTimestamp0 = report.getUint8(27);
    let sensorTimestamp1 = report.getUint8(28);
    let sensorTimestamp2 = report.getUint8(29);
    let sensorTimestamp3 = report.getUint8(30);
    // byte 31?
    let touch00 = report.getUint8(32);
    let touch01 = report.getUint8(33);
    let touch02 = report.getUint8(34);
    let touch03 = report.getUint8(35);
    let touch10 = report.getUint8(36);
    let touch11 = report.getUint8(37);
    let touch12 = report.getUint8(38);
    let touch13 = report.getUint8(39);
    // byte 40?
    let r2feedback = report.getUint8(41);
    let l2feedback = report.getUint8(42);

    this.state.axes.l2State = l2feedback & 0x0f;
    this.state.axes.r2State = r2feedback & 0x0f;

    // bytes 43-51?
    let battery0 = report.getUint8(52);
    let battery1 = report.getUint8(53);
    // bytes 54-58?
    // bytes 59-62 CRC32 checksum

    this.state.axes.leftStickX = normalizeThumbStickAxis(axes0);
    this.state.axes.leftStickY = normalizeThumbStickAxis(axes1);
    this.state.axes.rightStickX = normalizeThumbStickAxis(axes2);
    this.state.axes.rightStickY = normalizeThumbStickAxis(axes3);
    this.state.axes.l2 = normalizeTriggerAxis(axes4);
    this.state.axes.r2 = normalizeTriggerAxis(axes5);

    let dpad = buttons0 & 0x0f;
    this.state.buttons.dPadUp = normalizeButton(
      dpad === 0 || dpad === 1 || dpad === 7,
    );
    this.state.buttons.dPadDown = normalizeButton(
      dpad === 3 || dpad === 4 || dpad === 5,
    );
    this.state.buttons.dPadLeft = normalizeButton(
      dpad === 5 || dpad === 6 || dpad === 7,
    );
    this.state.buttons.dPadRight = normalizeButton(
      dpad === 1 || dpad === 2 || dpad === 3,
    );
    this.state.buttons.square = normalizeButton(buttons0 & 0x10);
    this.state.buttons.cross = normalizeButton(buttons0 & 0x20);
    this.state.buttons.circle = normalizeButton(buttons0 & 0x40);
    this.state.buttons.triangle = normalizeButton(buttons0 & 0x80);
    this.state.buttons.l1 = normalizeButton(buttons1 & 0x01);
    this.state.buttons.r1 = normalizeButton(buttons1 & 0x02);
    this.state.buttons.l2 = normalizeButton(buttons1 & 0x04);
    this.state.buttons.r2 = normalizeButton(buttons1 & 0x08);
    this.state.buttons.create = normalizeButton(buttons1 & 0x10);
    this.state.buttons.options = normalizeButton(buttons1 & 0x20);
    this.state.buttons.l3 = normalizeButton(buttons1 & 0x40);
    this.state.buttons.r3 = normalizeButton(buttons1 & 0x80);
    this.state.buttons.playStation = normalizeButton(buttons2 & 0x01);
    this.state.buttons.touchPadClick = normalizeButton(buttons2 & 0x02);
    this.state.buttons.mute = normalizeButton(buttons2 & 0x04);

    let touch0active = !(touch00 & 0x80);
    let touch0id = touch00 & 0x7f;
    let touch0x = ((touch02 & 0x0f) << 8) | touch01;
    let touch0y = (touch03 << 4) | ((touch02 & 0xf0) >> 4);
    this.state.touchpad.touches = [];
    this.state.touchpad.touches.push({
      touchActive: touch0active,
      touchId: touch0id,
      x: touch0x,
      y: touch0y,
    });

    let touch1active = !(touch10 & 0x80);
    let touch1id = touch10 & 0x7f;
    let touch1x = ((touch12 & 0x0f) << 8) | touch11;
    let touch1y = (touch13 << 4) | ((touch12 & 0xf0) >> 4);

    this.state.touchpad.touches.push({
      touchActive: touch1active,
      touchId: touch1id,
      x: touch1x,
      y: touch1y,
    });

    let gyrox = (gyroX1 << 8) | gyroX0;
    if (gyrox > 0x7fff) gyrox -= 0x10000;
    let gyroy = (gyroY1 << 8) | gyroY0;
    if (gyroy > 0x7fff) gyroy -= 0x10000;
    let gyroz = (gyroZ1 << 8) | gyroZ0;
    if (gyroz > 0x7fff) gyroz -= 0x10000;
    let accelx = (accelX1 << 8) | accelX0;
    if (accelx > 0x7fff) accelx -= 0x10000;
    let accely = (accelY1 << 8) | accelY0;
    if (accely > 0x7fff) accely -= 0x10000;
    let accelz = (accelZ1 << 8) | accelZ0;
    if (accelz > 0x7fff) accelz -= 0x10000;

    this.state.axes.gyroX = gyrox;
    this.state.axes.gyroY = gyroy;
    this.state.axes.gyroZ = gyroz;
    this.state.axes.accelX = accelx;
    this.state.axes.accelY = accely;
    this.state.axes.accelZ = accelz;

    let batteryLevelPercent = ((battery0 & 0x0f) * 100) / 8;
    let batteryFull = !!(battery0 & 0x20);
    let batteryCharging = !!(battery1 & 0x08);

    this.state.battery = batteryLevelPercent;
    this.state.batteryFull = batteryFull;
    this.state.charging = batteryCharging;
  }

  handleBluetoothInputReport01(report: DataView) {
    if (report.byteLength !== 9) return;

    let axes0 = report.getUint8(0);
    let axes1 = report.getUint8(1);
    let axes2 = report.getUint8(2);
    let axes3 = report.getUint8(3);
    let buttons0 = report.getUint8(4);
    let buttons1 = report.getUint8(5);
    let buttons2 = report.getUint8(6);
    let axes4 = report.getUint8(7);
    let axes5 = report.getUint8(8);

    this.state.axes.leftStickX = normalizeThumbStickAxis(axes0);
    this.state.axes.leftStickY = normalizeThumbStickAxis(axes1);
    this.state.axes.rightStickX = normalizeThumbStickAxis(axes2);
    this.state.axes.rightStickY = normalizeThumbStickAxis(axes3);
    this.state.axes.l2 = normalizeTriggerAxis(axes4);
    this.state.axes.r2 = normalizeTriggerAxis(axes5);

    let dpad = buttons0 & 0x0f;
    this.state.buttons.dPadUp = normalizeButton(
      dpad === 0 || dpad === 1 || dpad === 7,
    );
    this.state.buttons.dPadDown = normalizeButton(
      dpad === 3 || dpad === 4 || dpad === 5,
    );
    this.state.buttons.dPadLeft = normalizeButton(
      dpad === 5 || dpad === 6 || dpad === 7,
    );
    this.state.buttons.dPadRight = normalizeButton(
      dpad === 1 || dpad === 2 || dpad === 3,
    );
    this.state.buttons.square = normalizeButton(buttons0 & 0x10);
    this.state.buttons.cross = normalizeButton(buttons0 & 0x20);
    this.state.buttons.circle = normalizeButton(buttons0 & 0x40);
    this.state.buttons.triangle = normalizeButton(buttons0 & 0x80);
    this.state.buttons.l1 = normalizeButton(buttons1 & 0x01);
    this.state.buttons.r1 = normalizeButton(buttons1 & 0x02);
    this.state.buttons.l2 = normalizeButton(buttons1 & 0x04);
    this.state.buttons.r2 = normalizeButton(buttons1 & 0x08);
    this.state.buttons.create = normalizeButton(buttons1 & 0x10);
    this.state.buttons.options = normalizeButton(buttons1 & 0x20);
    this.state.buttons.l3 = normalizeButton(buttons1 & 0x40);
    this.state.buttons.r3 = normalizeButton(buttons1 & 0x80);
    this.state.buttons.playStation = normalizeButton(buttons2 & 0x01);
    this.state.buttons.touchPadClick = normalizeButton(buttons2 & 0x02);

    this.state.buttons.mute = false; // Bluetooth 0x01 report doesn't include mute button state
    this.state.touchpad.touches = []; // Bluetooth 0x01 report doesn't include touchpad state
    this.state.axes.gyroX = 0; // Bluetooth 0x01 report doesn't include gyro state
    this.state.axes.gyroY = 0; // Bluetooth 0x01 report doesn't include gyro state
    this.state.axes.gyroZ = 0; // Bluetooth 0x01 report doesn't include gyro state
    this.state.axes.accelX = 0; // Bluetooth 0x01 report doesn't include accel state
    this.state.axes.accelY = 0; // Bluetooth 0x01 report doesn't include accel state
    this.state.axes.accelZ = 0; // Bluetooth 0x01 report doesn't include accel state

    this.state.battery = 0; // Bluetooth 0x01 report doesn't include battery level
    this.state.batteryFull = false; // Bluetooth 0x01 report doesn't include battery full state
    this.state.charging = false; // Bluetooth 0x01 report doesn't include charging state
  }

  handleBluetoothInputReport31(report: DataView) {
    if (report.byteLength !== 77) return;

    // byte 0?
    let axes0 = report.getUint8(1);
    let axes1 = report.getUint8(2);
    let axes2 = report.getUint8(3);
    let axes3 = report.getUint8(4);
    let axes4 = report.getUint8(5);
    let axes5 = report.getUint8(6);
    // byte 7?
    let buttons0 = report.getUint8(8);
    let buttons1 = report.getUint8(9);
    let buttons2 = report.getUint8(10);
    // byte 11?
    let timestamp0 = report.getUint8(12);
    let timestamp1 = report.getUint8(13);
    let timestamp2 = report.getUint8(14);
    let timestamp3 = report.getUint8(15);
    let gyroX0 = report.getUint8(16);
    let gyroX1 = report.getUint8(17);
    let gyroY0 = report.getUint8(18);
    let gyroY1 = report.getUint8(19);
    let gyroZ0 = report.getUint8(20);
    let gyroZ1 = report.getUint8(21);
    let accelX0 = report.getUint8(22);
    let accelX1 = report.getUint8(23);
    let accelY0 = report.getUint8(24);
    let accelY1 = report.getUint8(25);
    let accelZ0 = report.getUint8(26);
    let accelZ1 = report.getUint8(27);
    // bytes 28-32?
    let touch00 = report.getUint8(33);
    let touch01 = report.getUint8(34);
    let touch02 = report.getUint8(35);
    let touch03 = report.getUint8(36);
    let touch10 = report.getUint8(37);
    let touch11 = report.getUint8(38);
    let touch12 = report.getUint8(39);
    let touch13 = report.getUint8(40);
    // byte 41?
    let r2feedback = report.getUint8(42);
    let l2feedback = report.getUint8(43);

    this.state.axes.l2State = l2feedback & 0x0f;
    this.state.axes.r2State = r2feedback & 0x0f;

    // bytes 44-52?
    let battery0 = report.getUint8(53);
    let battery1 = report.getUint8(54);
    // bytes 55-76?

    this.state.axes.leftStickX = normalizeThumbStickAxis(axes0);
    this.state.axes.leftStickY = normalizeThumbStickAxis(axes1);
    this.state.axes.rightStickX = normalizeThumbStickAxis(axes2);
    this.state.axes.rightStickY = normalizeThumbStickAxis(axes3);
    this.state.axes.l2 = normalizeTriggerAxis(axes4);
    this.state.axes.r2 = normalizeTriggerAxis(axes5);

    let dpad = buttons0 & 0x0f;
    this.state.buttons.dPadUp = normalizeButton(
      dpad === 0 || dpad === 1 || dpad === 7,
    );
    this.state.buttons.dPadDown = normalizeButton(
      dpad === 3 || dpad === 4 || dpad === 5,
    );
    this.state.buttons.dPadLeft = normalizeButton(
      dpad === 5 || dpad === 6 || dpad === 7,
    );
    this.state.buttons.dPadRight = normalizeButton(
      dpad === 1 || dpad === 2 || dpad === 3,
    );
    this.state.buttons.square = normalizeButton(buttons0 & 0x10);
    this.state.buttons.cross = normalizeButton(buttons0 & 0x20);
    this.state.buttons.circle = normalizeButton(buttons0 & 0x40);
    this.state.buttons.triangle = normalizeButton(buttons0 & 0x80);
    this.state.buttons.l1 = normalizeButton(buttons1 & 0x01);
    this.state.buttons.r1 = normalizeButton(buttons1 & 0x02);
    this.state.buttons.l2 = normalizeButton(buttons1 & 0x04);
    this.state.buttons.r2 = normalizeButton(buttons1 & 0x08);
    this.state.buttons.create = normalizeButton(buttons1 & 0x10);
    this.state.buttons.options = normalizeButton(buttons1 & 0x20);
    this.state.buttons.l3 = normalizeButton(buttons1 & 0x40);
    this.state.buttons.r3 = normalizeButton(buttons1 & 0x80);
    this.state.buttons.playStation = normalizeButton(buttons2 & 0x01);
    this.state.buttons.touchPadClick = normalizeButton(buttons2 & 0x02);
    this.state.buttons.mute = normalizeButton(buttons2 & 0x04);

    this.state.touchpad.touches = [];
    let touch0active = !(touch00 & 0x80);
    let touch0id = touch00 & 0x7f;
    let touch0x = ((touch02 & 0x0f) << 8) | touch01;
    let touch0y = (touch03 << 4) | ((touch02 & 0xf0) >> 4);

    this.state.touchpad.touches.push({
      touchId: touch0id,
      x: touch0x,
      y: touch0y,
      touchActive: touch0active,
    });

    let touch1active = !(touch10 & 0x80);
    let touch1id = touch10 & 0x7f;
    let touch1x = ((touch12 & 0x0f) << 8) | touch11;
    let touch1y = (touch13 << 4) | ((touch12 & 0xf0) >> 4);

    this.state.touchpad.touches.push({
      touchId: touch1id,
      x: touch1x,
      y: touch1y,
      touchActive: touch1active,
    });

    let gyrox = (gyroX1 << 8) | gyroX0;
    if (gyrox > 0x7fff) gyrox -= 0x10000;
    let gyroy = (gyroY1 << 8) | gyroY0;
    if (gyroy > 0x7fff) gyroy -= 0x10000;
    let gyroz = (gyroZ1 << 8) | gyroZ0;
    if (gyroz > 0x7fff) gyroz -= 0x10000;
    let accelx = (accelX1 << 8) | accelX0;
    if (accelx > 0x7fff) accelx -= 0x10000;
    let accely = (accelY1 << 8) | accelY0;
    if (accely > 0x7fff) accely -= 0x10000;
    let accelz = (accelZ1 << 8) | accelZ0;
    if (accelz > 0x7fff) accelz -= 0x10000;

    this.state.axes.gyroX = gyrox;
    this.state.axes.gyroY = gyroy;
    this.state.axes.gyroZ = gyroz;
    this.state.axes.accelX = accelx;
    this.state.axes.accelY = accely;
    this.state.axes.accelZ = accelz;

    let batteryLevelPercent = ((battery0 & 0x0f) * 100) / 8;
    let batteryFull = !!(battery0 & 0x20);
    let batteryCharging = !!(battery1 & 0x08);

    this.state.battery = batteryLevelPercent;
    this.state.batteryFull = batteryFull;
    this.state.charging = batteryCharging;
  }

  async sendLocalState() {
    const pads = navigator.getGamepads(); // force Gamepad API request 0x31 report by sending 0x05

    let reportId;
    let reportData;
    let common;
    let r2Effect;
    let l2Effect;

    if (this.state.interface == DualShock5Interface.Bluetooth) {
      reportId = 0x31;
      reportData = new Uint8Array(77);

      //seq_tag
      reportData[0] = this.outputSeq_ << 4;
      if (++this.outputSeq_ === 16) {
        this.outputSeq_ = 0;
      }

      //tag
      reportData[1] = 0x10; // DS_OUTPUT_TAG

      common = new DataView(reportData.buffer, 2, 47);
      r2Effect = new DataView(reportData.buffer, 12, 8);
      l2Effect = new DataView(reportData.buffer, 23, 8);
    } else if (this.state.interface == DualShock5Interface.USB) {
      reportId = 0x02;
      reportData = new Uint8Array(47);

      common = new DataView(reportData.buffer, 0, 47);
      r2Effect = new DataView(common.buffer, 10, 8);
      l2Effect = new DataView(common.buffer, 21, 8);
    }

    // valid_flag0
    // bit 0: COMPATIBLE_VIBRATION
    // bit 1: HAPTICS_SELECT
    common!.setUint8(0, 0xff);

    // valid_flag1
    // bit 0: MIC_MUTE_LED_CONTROL_ENABLE
    // bit 1: POWER_SAVE_CONTROL_ENABLE
    // bit 2: LIGHTBAR_CONTROL_ENABLE
    // bit 3: RELEASE_LEDS
    // bit 4: PLAYER_INDICATOR_CONTROL_ENABLE
    common!.setUint8(1, 0xf7);

    // DualShock 4 compatibility mode.
    common!.setUint8(2, this.rumble.light); // right
    common!.setUint8(3, this.rumble.heavy); // left

    // mute_button_led
    // 0: mute LED off
    // 1: mute LED on
    common!.setUint8(8, this.muteLed_);

    // power_save_control
    // bit 4: POWER_SAVE_CONTROL_MIC_MUTE
    common!.setUint8(9, this.muteLed_ ? 0x00 : 0x10);

    // Right trigger effect
    // Mode
    // 0x00: off
    // 0x01: mode1
    // 0x02: mode2
    // 0x05: mode1 + mode4
    // 0x06: mode2 + mode4
    // 0x21: mode1 + mode20
    // 0x25: mode1 + mode4 + mode20
    // 0x26: mode2 + mode4 + mode20
    // 0xFC: calibration
    r2Effect!.setUint8(0, this.r2EffectMode_);

    // Effect parameter 1
    // start of resistance section
    r2Effect!.setUint8(1, this.r2EffectParam1_);

    // Effect parameter 2
    // mode1: amount of force exerted
    // mode2: end of resistance section
    // mode4 + mode20: flags
    //   bit 2: do not pause effect when fully pressed
    r2Effect!.setUint8(2, this.r2EffectParam2_);

    // Effect parameter 3
    // mode2: force exerted
    r2Effect!.setUint8(3, this.r2EffectParam3_);

    // Effect effect parameter 4
    // mode4 + mode20: strength near release state
    r2Effect!.setUint8(4, this.r2EffectParam4_);

    // Effect parameter 5
    // mode4 + mode20: strength near middle
    r2Effect!.setUint8(5, this.r2EffectParam5_);

    // Effect parameter 6
    // mode4 + mode20: at pressed state
    r2Effect!.setUint8(6, this.r2EffectParam6_);

    // Effect parameter 7
    // mode4 + mode20: effect actuation frequency in Hz
    r2Effect!.setUint8(7, this.r2EffectParam7_);

    // Left trigger effect
    // Mode
    // 0x00: off
    // 0x01: mode1
    // 0x02: mode2
    // 0x05: mode1 + mode4
    // 0x06: mode2 + mode4
    // 0x21: mode1 + mode20
    // 0x25: mode1 + mode4 + mode20
    // 0x26: mode2 + mode4 + mode20
    // 0xFC: calibration
    l2Effect!.setUint8(0, this.l2EffectMode_);

    // Effect parameter 1
    // start of resistance section
    l2Effect!.setUint8(1, this.l2EffectParam1_);

    // Effect parameter 2
    // mode1: amount of force exerted
    // mode2: end of resistance section
    // mode4 + mode20: flags
    //   bit 2: do not pause effect when fully pressed
    l2Effect!.setUint8(2, this.l2EffectParam2_);

    // Effect parameter 3
    // mode2: force exerted
    l2Effect!.setUint8(3, this.l2EffectParam3_);

    // Effect effect parameter 4
    // mode4 + mode20: strength near release state
    l2Effect!.setUint8(4, this.l2EffectParam4_);

    // Effect parameter 5
    // mode4 + mode20: strength near middle
    l2Effect!.setUint8(5, this.l2EffectParam5_);

    // Effect parameter 6
    // mode4 + mode20: at pressed state
    l2Effect!.setUint8(6, this.l2EffectParam6_);

    // Effect parameter 7
    // mode4 + mode20: effect actuation frequency in Hz
    l2Effect!.setUint8(7, this.l2EffectParam7_);

    // valid_flag2
    // bit 1: LIGHTBAR_SETUP_CONTROL_ENABLE
    common!.setUint8(39, 0x02);

    // lightbar_setup
    // 1: Disable LEDs
    // 2: Enable LEDs
    common!.setUint8(41, 0x02);

    // player_leds
    common!.setUint8(43, this.playerLeds_);

    // Lightbar RGB
    common!.setUint8(44, this.lightbar.r);
    common!.setUint8(45, this.lightbar.g);
    common!.setUint8(46, this.lightbar.b);

    // fill CRC32
    if (this.state.interface == DualShock5Interface.Bluetooth) {
      fillDualSenseChecksum(reportId!, reportData!);
    }

    try {
      await this.device.sendReport(reportId!, reportData!);
    } catch (error) {
      console.log("Failed to write DualSense output report");
      return false;
    }

    return true;
  }

  public getName(): string {
    // Return the product name of the device
    return this.device.productName || "Unknown DualShock Device";
  }
}
