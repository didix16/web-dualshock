import { ControllerReport } from "./report";
/**
 * Controller State
 *
 * Stores information about the current controller state, and its components.
 */
export interface DualShock4State {
    /** Interface used for communication (USB/Bluetooth) */
    interface: DualShock4Interface;
    /** Battery Level (0-100) */
    battery: number;
    /** Is the battery being charged? */
    charging: boolean;
    controllerType: number;
    headphones: boolean;
    microphone: boolean;
    extension: boolean;
    /** Audio state */
    audio: string;
    /** Report List */
    reports: ControllerReport[];
    /** Analog positions */
    axes: DualShock4AnalogState;
    /** Buttons pressed */
    buttons: DualShock4ButtonState;
    /** Touchpad */
    touchpad: DualShock4Touchpad;
    /** Timestamp of the last report */
    timestamp: number;
}
/**
 * Button State
 *
 * Stores information about the buttons that are currently being held.
 */
export interface DualShock4ButtonState {
    /** Triangle Button */
    triangle: boolean;
    /** Circle Button */
    circle: boolean;
    /** Cross Button */
    cross: boolean;
    /** Square Button */
    square: boolean;
    /** D-Pad Up */
    dPadUp: boolean;
    /** D-Pad Right */
    dPadRight: boolean;
    /** D-Pad Down */
    dPadDown: boolean;
    /** D-Pad Left */
    dPadLeft: boolean;
    /** L1 Button */
    l1: boolean;
    /** L2 Trigger (non-analog value) */
    l2: boolean;
    /** L3 Button */
    l3: boolean;
    /** R1 Button */
    r1: boolean;
    /** R2 Trigger (non-analog value) */
    r2: boolean;
    /** R3 Button */
    r3: boolean;
    /** Options Button */
    options: boolean;
    /** Share Button */
    share: boolean;
    /** PS Button */
    playStation: boolean;
    /** Touchpad Button */
    touchPadClick: boolean;
}
/**
 * Analog State
 *
 * Stores information for analog axes.
 *
 * - Values for thumbsticks are stored using the range **-1.0** (left, top) to **1.0** (right, bottom).
 *
 * - Values for triggers use the range **0.0** (released) to **1.0** (pressed)
 *
 * - Values for accelerometer and gyroscope use the raw input from the sensors.
 */
export interface DualShock4AnalogState {
    /** Left Stick Horizontal position. */
    leftStickX: number;
    /** Left Stick Vertical position. */
    leftStickY: number;
    /** Right Stick Horizontal position. */
    rightStickX: number;
    /** Right Stick Vertical position. */
    rightStickY: number;
    /** Left trigger analog value */
    l2: number;
    /** Right trigger analog value */
    r2: number;
    /** Accelerometer X */
    accelX: number;
    /** Accelerometer Y */
    accelY: number;
    /** Accelerometer Z */
    accelZ: number;
    /** Angular velocity X */
    gyroX: number;
    /** Angular velocity Y */
    gyroY: number;
    /** Angular velocity Z */
    gyroZ: number;
}
/** Touchpad State */
export interface DualShock4Touchpad {
    /** Current touches */
    touches: DualShock4TouchpadTouch[];
}
/**
 * Touchpad Touch Information
 *
 * The touchpad's resolution is 1920x943.
 */
export interface DualShock4TouchpadTouch {
    /** Touch ID. Changes with every new touch. */
    touchId: number;
    /** X Position. */
    x: number;
    /** Y Position. */
    y: number;
}
/**
 * Current Interface
 */
export declare enum DualShock4Interface {
    Disconnected = "none",
    /** The controller is connected over USB */
    USB = "usb",
    /** The controller is connected over BT */
    Bluetooth = "bt"
}
/**
 * Controller Type
 */
export declare enum DualShock4ControllerType {
    Gamepad = 0,
    Guitar = 1,
    Drums = 2,
    Wheel = 6,
    Fightstick = 7,
    HOTAS = 8
}
/**
 * Default / Initial State
 * @ignore
 */
export declare const defaultState: DualShock4State;
export default defaultState;
