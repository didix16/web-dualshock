// Type definitions for WebHID API (only if not available in your TypeScript version)
declare interface HIDDevice extends EventTarget {
  opened: boolean;
  vendorId: number;
  productId: number;
  productName: string;
  collections: any[];
  open(): Promise<void>;
  close(): Promise<void>;
  sendReport(reportId: number, data: BufferSource): Promise<void>;
  oninputreport: ((event: HIDInputReportEvent) => void) | null;
}
declare interface HIDInputReportEvent extends Event {
  device: HIDDevice;
  reportId: number;
  data: DataView;
}
declare interface Navigator {
  hid: {
    getDevices(): Promise<HIDDevice[]>;
    requestDevice(options: {
      filters: Array<{ vendorId?: number; productId?: number }>;
    }): Promise<HIDDevice[]>;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
  };
}
