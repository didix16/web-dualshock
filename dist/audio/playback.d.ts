import { type SbcPlaybackOptions, type SbcPlaybackStats } from "./send-sbc";
/** Chooses the transport. The input must be an owned snapshot, safe to transfer. */
export declare function sendSbcWithTransport(device: HIDDevice, data: Uint8Array<ArrayBuffer>, options?: SbcPlaybackOptions): Promise<SbcPlaybackStats>;
