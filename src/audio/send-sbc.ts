import { crc32 } from "../crc.js";
import { inspectSbc, readSbcFrame } from "./sbc";
import { createPlaybackClock, type SbcPlaybackClock } from "./playback-clock";

const PAYLOAD_END = 523;
const PAYLOAD_START = 7;

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

async function waitUntil(deadline: number, clock: SbcPlaybackClock, stats: SbcPlaybackStats): Promise<void> {
  let remaining: number;
  while ((remaining = deadline - clock.now()) > 0) {
    const source = await clock.sleep(remaining);
    if (source === "inputreport") {
      stats.inputReportWakeups++;
    } else {
      stats.timerWakeups++;
      stats.maxTimerDelayMs = Math.max(stats.maxTimerDelayMs, clock.now() - deadline);
    }
  }
}

/** Prepare frames and checksums before starting the playback clock. */
function preparePackets(data: Uint8Array) {
  inspectSbc(data, PAYLOAD_END - PAYLOAD_START);
  const packets: { report: Uint8Array<ArrayBuffer>; duration: number }[] = [];
  let position = 0, sequence = 0;
  while (position < data.length) {
    const report = new Uint8Array(527);
    // Inbound mode A0 keeps normal controller reports active during speaker
    // output. A2 can suppress them. Keep the 8 ms Bluetooth input interval.
    report.set([0xa2, 0x18, 0x48, 0xa0, sequence & 0xff, sequence >>> 8, 0x02]);
    let offset = PAYLOAD_START, frames = 0, duration = 0;
    while (position < data.length) {
      const frame = readSbcFrame(data, position);
      if (offset + frame.length > PAYLOAD_END) break;
      report.set(data.subarray(position, position + frame.length), offset);
      offset += frame.length;
      position += frame.length;
      frames++;
      duration += frame.samples * 1000 / frame.sampleRate;
    }
    report.set(crc32(report.subarray(0, PAYLOAD_END)), PAYLOAD_END);
    packets.push({ report: report.subarray(2), duration });
    sequence = (sequence + frames) & 0xffff;
  }
  return packets;
}

/** Send complete frames, preserving the DS4 Bluetooth report layout. */
export async function sendSbc(
  device: Pick<HIDDevice, "sendReport"> & Partial<Pick<EventTarget, "addEventListener" | "removeEventListener">>,
  data: Uint8Array,
  options: SbcPlaybackOptions = {},
  clock?: SbcPlaybackClock,
): Promise<SbcPlaybackStats> {
  const bufferAheadMs = options.bufferAheadMs ?? 64;
  if (!Number.isFinite(bufferAheadMs) || bufferAheadMs < 0 || bufferAheadMs > 64) {
    throw new RangeError("bufferAheadMs must be between 0 and 64 ms");
  }
  const packets = preparePackets(data);
  const ownedClock = clock ? undefined : createPlaybackClock(device);
  clock ??= ownedClock!;
  try {
    const started = clock.now();
    const stats: SbcPlaybackStats = {
      transport: "main-thread",
      bufferAheadMs, packetsSent: 0, audioDurationMs: 0, elapsedMs: 0,
      maxSchedulingDelayMs: 0, maxTimerDelayMs: 0, maxWriteDurationMs: 0, maxReportGapMs: 0,
      inputReportWakeups: 0, timerWakeups: 0,
      estimatedStarvations: 0, maxEstimatedStarvationMs: 0,
    };
    let queuedUntil = started;
    let previousStart = started, previousDuration = 0;
    for (const { report, duration } of packets) {
      // Build a small reserve gradually. Keep writes serial and space catch-up
      // reports by at least 4 ms (or one packet for shorter SBC profiles).
      // In steady state, deadlines still advance by the actual SBC duration.
      const deadline = stats.packetsSent === 0 ? started : Math.max(
        queuedUntil - bufferAheadMs,
        previousStart + Math.min(4, previousDuration),
      );
      if (clock.now() < deadline) {
        await waitUntil(deadline, clock, stats);
      }
      const writeStarted = clock.now();
      stats.maxSchedulingDelayMs = Math.max(stats.maxSchedulingDelayMs, writeStarted - deadline);
      if (stats.packetsSent > 0) {
        stats.maxReportGapMs = Math.max(stats.maxReportGapMs, writeStarted - previousStart);
      }
      await device.sendReport(0x18, report);
      const written = clock.now();
      stats.maxWriteDurationMs = Math.max(stats.maxWriteDurationMs, written - writeStarted);
      if (stats.packetsSent === 0) {
        queuedUntil = written;
      } else if (written > queuedUntil) {
        stats.estimatedStarvations++;
        stats.maxEstimatedStarvationMs = Math.max(stats.maxEstimatedStarvationMs, written - queuedUntil);
        // The old timeline is exhausted. Re-prime from here instead of bursting
        // all reports missed during a long suspension. No SBC frames are skipped.
        queuedUntil = written;
      }
      queuedUntil += duration;
      stats.audioDurationMs += duration;
      stats.packetsSent++;
      previousStart = writeStarted;
      previousDuration = duration;
    }
    // Includes the reserve and a partial final packet. Completion is estimated.
    await waitUntil(queuedUntil, clock, stats);
    stats.elapsedMs = clock.now() - started;
    return stats;
  } finally {
    ownedClock?.dispose();
  }
}
