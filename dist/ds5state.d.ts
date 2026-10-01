import { ControllerReport } from "./report";
/**
 * Controller State
 *
 * Stores information about the current controller state, and its components.
 */
export interface DualShock5State {
    /** Interface used for communication (USB/Bluetooth) */
    interface: DualShock5Interface;
    /** Battery Level (0-100) */
    battery: number;
    /**
     * Is the battery fully charged?
     */
    batteryFull: boolean;
    /** Is the battery being charged? */
    charging: boolean;
    controllerType: number;
    headphones: boolean;
    microphone: boolean;
    /** Audio state */
    audio: string;
    /** Report List */
    reports: ControllerReport[];
    /** Analog positions */
    axes: DualShock5AnalogState;
    /** Buttons pressed */
    buttons: DualShock5ButtonState;
    /** Touchpad */
    touchpad: DualShock5Touchpad;
    /** Timestamp of the last report */
    timestamp: number;
}
/**
 * Button State
 *
 * Stores information about the buttons that are currently being held.
 */
export interface DualShock5ButtonState {
    /** Triangle Button */
    triangle: boolean | number;
    /** Circle Button */
    circle: boolean | number;
    /** Cross Button */
    cross: boolean | number;
    /** Square Button */
    square: boolean | number;
    /** D-Pad Up */
    dPadUp: boolean | number;
    /** D-Pad Right */
    dPadRight: boolean | number;
    /** D-Pad Down */
    dPadDown: boolean | number;
    /** D-Pad Left */
    dPadLeft: boolean | number;
    /** L1 Button */
    l1: boolean | number;
    /** L2 Trigger (non-analog value) */
    l2: boolean | number;
    /** L3 Button */
    l3: boolean | number;
    /** R1 Button */
    r1: boolean | number;
    /** R2 Trigger (non-analog value) */
    r2: boolean | number;
    /** R3 Button */
    r3: boolean | number;
    /** Options Button */
    options: boolean | number;
    /** Share Button */
    create: boolean | number;
    /** PS Button */
    playStation: boolean | number;
    /** Touchpad Button */
    touchPadClick: boolean | number;
    /** Mute Button */
    mute: boolean | number;
    /** DualSense Left Function Button */
    leftFunction: boolean;
    /** DualSense Right Function Button */
    rightFunction: boolean;
    /** DualSense Left Paddle Button */
    leftPaddle: boolean;
    /** DualSense Right Paddle Button */
    rightPaddle: boolean;
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
export interface DualShock5AnalogState {
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
    /** L2 force state */
    l2State: number;
    /** R2 force state */
    r2State: number;
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
export interface DualShock5Touchpad {
    /** Current touches */
    touches: DualShock5TouchpadTouch[];
}
/**
 * Touchpad Touch Information
 *
 * The touchpad's resolution is 1920x943.
 */
export interface DualShock5TouchpadTouch {
    touchActive: boolean;
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
export declare enum DualShock5Interface {
    Disconnected = "none",
    /** The controller is connected over USB */
    USB = "usb",
    /** The controller is connected over BT */
    Bluetooth = "bt"
}
/**
 * Controller Type
 */
export declare enum DualShock5ControllerType {
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
export declare const defaultState: DualShock5State;
