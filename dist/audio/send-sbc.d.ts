import { type SbcPlaybackClock } from "./playback-clock";
export interface SbcPlaybackOptions {
    /** Estimated audio to keep ahead of playback (0–64 ms, default 64).
     * This is a sender-side estimate, not a measurement of the controller FIFO.
     */
    bufferAheadMs?: number;
    /** Prefer direct WebHID writes in a dedicated worker. Default: auto.
     * auto falls back only if worker setup fails before any audio is submitted.
     */
    transport?: "auto" | "worker" | "main-thread";
    /** Optional same-origin URL of the bundled playback worker. */
    workerURL?: string | URL;
}
export interface SbcPlaybackStats {
    transport: "worker" | "main-thread";
    workerFallbackReason?: string;
    bufferAheadMs: number;
    packetsSent: number;
    audioDurationMs: number;
    elapsedMs: number;
    maxSchedulingDelayMs: number;
    /** Lateness on waking from a timer, excluding time awaiting a previous write. */
    maxTimerDelayMs: number;
    maxWriteDurationMs: number;
    maxReportGapMs: number;
    /** Wake-ups while waiting for packet deadlines or the final audio tail. */
    inputReportWakeups: number;
    timerWakeups: number;
    /** Times completed writes fell behind the estimated end of queued audio.
     * WebHID does not acknowledge playback: these are not confirmed audible cuts.
     */
    estimatedStarvations: number;
    maxEstimatedStarvationMs: number;
}
/** Send complete frames, preserving the DS4 Bluetooth report layout. */
export declare function sendSbc(device: Pick<HIDDevice, "sendReport"> & Partial<Pick<EventTarget, "addEventListener" | "removeEventListener">>, data: Uint8Array, options?: SbcPlaybackOptions, clock?: SbcPlaybackClock): Promise<SbcPlaybackStats>;
