import LightbarDevice from "./lightbar";
import { ControllerReport } from "./report";
import RumbleDevice from "./rumble";
declare global {
    interface Window {
        crcTable?: number[];
    }
}
export default class DualSense {
    static USAGE_PAGE_GENERIC_DESKTOP: number;
    static USAGE_ID_GD_GAMEPAD: number;
    /** Internal WebHID device */
    protected device: HIDDevice;
    /** Internal Gamepad instance */
    protected gamepad?: Gamepad;
    /** Allows lightbar control */
    protected lightbar: LightbarDevice;
    /** Allows rumble control */
    protected rumble: RumbleDevice;
    /** Raw contents of the last HID Report sent by the controller. */
    lastReport?: ArrayBuffer;
    /** Raw contents of the last HID Report sent to the controller. */
    lastSentReport?: ArrayBuffer;
    /** Current controller state */
    state: import("./ds5state").DualShock5State;
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
    constructor(device: HIDDevice, gamepad?: Gamepad);
    readFeatureReport05(): Promise<void>;
    init(): Promise<void>;
    onInputReport(event: HIDInputReportEvent): void;
    handleUsbInputReport01(report: DataView): void;
    handleBluetoothInputReport01(report: DataView): void;
    handleBluetoothInputReport31(report: DataView): void;
    sendLocalState(): Promise<boolean>;
    getName(): string;
}
