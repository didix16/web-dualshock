import { DualShock4State } from "./ds4state";
import LightbarDevice from "./lightbar";
import RumbleDevice from "./rumble";
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
    protected state: DualShock4State;
    /** Allows lightbar control */
    protected lightbar: LightbarDevice;
    /** Allows rumble control */
    protected rumble: RumbleDevice;
    protected miscData?: string;
    protected volume: number[];
    constructor(device: HIDDevice, gamepad?: Gamepad);
    init(): Promise<void>;
    /**
     * Parses a report sent from the controller and updates the state.
     *
     * This function is called internally by the library each time a report is received.
     *
     * @param report - HID Report sent by the controller.
     */
    private processControllerReport;
    /**
     * Updates the controller state using normalized data from the last report.
     *
     * This function is called internally by the library each time a report is received.
     *
     * @param data - Normalized data from the HID report.
     */
    private updateState;
    /**
     * Sends the local rumble and lightbar state to the controller.
     *
     * This function is called automatically in most cases.
     *
     * **Currently broken over Bluetooth, doesn't do anything**
     */
    sendLocalState(): Promise<void>;
    /**
     * Set the volume levels for the controller.
     * leftVolume - The volume level for the left speaker (0-255).
     * rightVolume - The volume level for the right speaker (0-255).
     * micVolume - The volume level for the microphone (0-255).
     * speakerVolume - The volume level for the speaker (0-79).
     */
    setVolume(leftVolume: number, rightVolume: number, micVolume: number, speakerVolume: number): Promise<void>;
    /**
     * Sets the color for the light bar.
     * @param red
     * @param green
     * @param blue
     */
    setLightBarColor(red: number, green: number, blue: number): Promise<void>;
    /**
     * Sets the rumble light and heavy intensity.
     * @param light 0 - 255
     * @param heavy 0 - 255
     */
    setRumbleIntensity(light: number, heavy: number): Promise<void>;
    /**
     *
     * @param musicFile SRC Music file
     * Given a SRC music file, send over the controller
     */
    sendMusic(musicFile: File): Promise<void>;
    getName(): string;
}
