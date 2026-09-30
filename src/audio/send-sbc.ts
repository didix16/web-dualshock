import { crc32 } from "../crc.js";
import { inspectSbc, readSbcFrame } from "./sbc";

const PAYLOAD_END = 523;
const PAYLOAD_START = 7;

async function waitUntil(deadline: number): Promise<void> {
  let remaining: number;
  while ((remaining = deadline - performance.now()) > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, remaining));
  }
}

/** Send complete frames, preserving the DS4 Bluetooth report layout. */
export async function sendSbc(device: Pick<HIDDevice, "sendReport">, data: Uint8Array): Promise<void> {
  inspectSbc(data, PAYLOAD_END - PAYLOAD_START);
  let position = 0, sequence = 0;
  let deadline = performance.now();
  while (position < data.length) {
    const report = new Uint8Array(527);
    report.set([0xa2, 0x18, 0x48, 0xa2, sequence & 0xff, sequence >>> 8, 0x02]);
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
    // After a long browser suspension, restart the clock instead of sending
    // an unbounded burst of reports to catch up with the old deadline.
    if (performance.now() - deadline > duration) deadline = performance.now();
    await device.sendReport(0x18, report.subarray(2));
    sequence = (sequence + frames) & 0xffff;
    deadline += duration;
    await waitUntil(deadline);
  }
}
