import type { SbcPlaybackStats } from "./send-sbc";

export interface PlaybackDeviceIdentity {
  vendorId: number;
  productId: number;
  productName: string;
  collections: string;
}

// WebHID devices are not transferable and expose no serial number. Refuse
// ambiguous matches rather than choosing an arbitrary controller in a worker.
export function playbackDeviceIdentity(device: HIDDevice): PlaybackDeviceIdentity {
  return {
    vendorId: device.vendorId, productId: device.productId,
    productName: device.productName, collections: JSON.stringify(device.collections),
  };
}

export function matchingPlaybackDevices(devices: HIDDevice[], identity: PlaybackDeviceIdentity): HIDDevice[] {
  return devices.filter(device => device.vendorId === identity.vendorId &&
    device.productId === identity.productId && device.productName === identity.productName &&
    JSON.stringify(device.collections) === identity.collections);
}

export type PlaybackRequest =
  | { type: "prepare"; identity: PlaybackDeviceIdentity }
  | { type: "play"; data: Uint8Array<ArrayBuffer>; bufferAheadMs?: number };

export type PlaybackResponse =
  | { type: "ready" }
  | { type: "unavailable"; reason: string }
  | { type: "complete"; stats: SbcPlaybackStats }
  | { type: "error"; reason: string };
