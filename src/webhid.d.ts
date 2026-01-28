// Type definitions for WebHID API (only if not available in your TypeScript version)
declare global {
  interface ReportFormat {
    reportId: number;
    usagePage: number;
    usage: number;
    type: number;
    children: ReportFormat[];
    inputReports: ReportFormat[];
    outputReports: ReportFormat[];
    featureReports: ReportFormat[];
  }

  interface HIDDevice extends EventTarget {
    opened: boolean;
    vendorId: number;
    productId: number;
    productName: string;
    collections: ReportFormat[];
    open(): Promise<void>;
    close(): Promise<void>;
    sendReport(reportId: number, data: BufferSource): Promise<void>;
    sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;
    receiveFeatureReport(reportId: number): Promise<DataView>;
    oninputreport: ((event: HIDInputReportEvent) => void) | null;
  }
  interface HIDInputReportEvent extends Event {
    device: HIDDevice;
    reportId: number;
    data: DataView;
  }
  interface Navigator {
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
}
export {};
