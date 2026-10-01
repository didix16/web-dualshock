/** Prepare copied channel arrays, leaving the caller's AudioBuffer untouched. */
export declare function prepareAudio(input: Blob | AudioBuffer): Promise<Float32Array<ArrayBuffer>[]>;
