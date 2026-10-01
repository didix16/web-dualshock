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

const browserTimers: PlaybackTimers = {
  now: () => performance.now(),
  setTimeout: (callback, milliseconds) => setTimeout(callback, milliseconds),
  clearTimeout: handle => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/** HID input is a push event, so it can wake a due write even when a hidden
 * page's timers are throttled. Timers remain a fallback if input stops.
 * Neither path guarantees progress when the page or OS is suspended.
 */
export function createPlaybackClock(
  device: Partial<Pick<EventTarget, "addEventListener" | "removeEventListener">>,
  timers: PlaybackTimers = browserTimers,
): SbcPlaybackClock & { dispose(): void } {
  let pending: { deadline: number; finish(source: PlaybackWakeSource): void; cancel(): void } | undefined;
  let disposed = false;
  const onInput = () => {
    if (pending && timers.now() >= pending.deadline) pending.finish("inputreport");
  };
  const hasEvents = typeof device.addEventListener === "function" && typeof device.removeEventListener === "function";
  if (hasEvents) device.addEventListener!("inputreport", onInput);
  return {
    now: () => timers.now(),
    sleep(milliseconds) {
      if (disposed) return Promise.reject(new Error("Playback clock disposed"));
      if (pending) return Promise.reject(new Error("Playback clock already waiting"));
      return new Promise<PlaybackWakeSource>((resolve, reject) => {
        const deadline = timers.now() + milliseconds;
        let settled = false;
        const clear = () => {
          settled = true;
          timers.clearTimeout(handle);
          pending = undefined;
        };
        const finish = (source: PlaybackWakeSource) => {
          if (settled) return;
          clear();
          resolve(source);
        };
        const handle = timers.setTimeout(() => finish("timer"), milliseconds);
        pending = {
          deadline,
          finish,
          cancel() {
            if (settled) return;
            clear();
            reject(new Error("Playback clock disposed"));
          },
        };
      });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (hasEvents) device.removeEventListener!("inputreport", onInput);
      pending?.cancel();
    },
  };
}
