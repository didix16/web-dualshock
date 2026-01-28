/**
 * Stores and manages the rumble state.
 */
export default class RumbleDevice {
    private controller;
    /** @ignore */
    constructor(controller: any);
    /** @ignore */
    private _light;
    /** @ignore */
    private _heavy;
    /**
     * Sends rumble data to the controller.
     * @ignore
     */
    updateRumble(): any;
    /** Light Rumble Intensity (0-255) */
    get light(): number;
    set light(value: number);
    /** Heavy Rumble Intensity (0-255) */
    get heavy(): number;
    set heavy(value: number);
    /**
     * Set the rumble intensity
     * @param light - Light rumble intensity (0-255)
     * @param heavy - Heavy rumble intensity (0-255)
     */
    setRumbleIntensity(light: number, heavy: number): Promise<any>;
}
