/**
 * Stores and manages the lightbar state.
 */
export default class LightbarDevice {
    private controller;
    /** @ignore */
    constructor(controller: any);
    /** @ignore */
    private _r;
    /** @ignore */
    private _g;
    /** @ignore */
    private _b;
    /** @ignore */
    private _blinkOn;
    /** @ignore */
    private _blinkOff;
    /**
     * Send Lightbar data to the controller.
     * @ignore
     */
    updateLightbar(): any;
    /** Red Color Intensity (0-255) */
    get r(): number;
    set r(value: number);
    /** Green Color Intensity (0-255) */
    get g(): number;
    set g(value: number);
    /** Blue Color Intensity (0-255) */
    get b(): number;
    set b(value: number);
    /** Blink Speed On (0-255) */
    get blinkOn(): number;
    set blinkOn(value: number);
    /** Blink Speed Off (0-255) */
    get blinkOff(): number;
    set blinkOff(value: number);
    /**
     * Sets the lightbar color (RGB)
     * @param r - Red color intensity (0-255)
     * @param g - Green color intensity (0-255)
     * @param b - Blue color intensity (0-255)
     */
    setColorRGB(r: number, g: number, b: number): Promise<any>;
    /**
     * Sets the lightbar color (HSL)
     * @param h - Hue
     * @param s - Saturation
     * @param l - Lightness
     */
    setColorHSL(h: number, s: number, l: number): Promise<any>;
}
