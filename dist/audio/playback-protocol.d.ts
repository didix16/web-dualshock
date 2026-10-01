import type { SbcPlaybackStats } from "./send-sbc";
export interface PlaybackDeviceIdentity {
    vendorId: number;
    productId: number;
    productName: string;
    collections: string;
}
export declare function playbackDeviceIdentity(device: HIDDevice): PlaybackDeviceIdentity;
export declare function matchingPlaybackDevices(devices: HIDDevice[], identity: PlaybackDeviceIdentity): HIDDevice[];
export type PlaybackRequest = {
    type: "prepare";
    identity: PlaybackDeviceIdentity;
} | {
    type: "play";
    data: Uint8Array<ArrayBuffer>;
    bufferAheadMs?: number;
};
export type PlaybackResponse = {
    type: "ready";
} | {
    type: "unavailable";
    reason: string;
} | {
    type: "complete";
    stats: SbcPlaybackStats;
} | {
    type: "error";
    reason: string;
};
