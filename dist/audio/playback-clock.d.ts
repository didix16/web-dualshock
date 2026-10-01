export type PlaybackWakeSource = "timer" | "inputreport";
/** Internal clock seam for deterministic transport tests. */
export interface SbcPlaybackClock {
    now(): number;
    sleep(milliseconds: number): Promise<PlaybackWakeSource | void>;
}
export interface PlaybackTimers {
    now(): number;
    setTimeout(callback: () => void, milliseconds: number): unknown;
    clearTimeout(handle: unknown): void;
}
/** HID input is a push event, so it can wake a due write even when a hidden
 * page's timers are throttled. Timers remain a fallback if input stops.
 * Neither path guarantees progress when the page or OS is suspended.
 */
export declare function createPlaybackClock(device: Partial<Pick<EventTarget, "addEventListener" | "removeEventListener">>, timers?: PlaybackTimers): SbcPlaybackClock & {
    dispose(): void;
};
