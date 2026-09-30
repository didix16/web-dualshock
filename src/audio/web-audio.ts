/** Prepare copied channel arrays, leaving the caller's AudioBuffer untouched. */
export async function prepareAudio(input: Blob | AudioBuffer): Promise<Float32Array<ArrayBuffer>[]> {
  if (typeof OfflineAudioContext === "undefined") throw new Error("Conversion requires Web Audio");
  let audio: AudioBuffer;
  if (input instanceof Blob) {
    if (!input.size) throw new Error("Audio file is empty");
    try {
      // decodeAudioData already resamples to the context's sample rate.
      const context = new OfflineAudioContext(2, 1, 32000);
      audio = await context.decodeAudioData(await input.arrayBuffer());
    } catch (cause) {
      throw new Error("Cannot decode audio: invalid file or format unsupported by this browser", { cause });
    }
  } else if (typeof AudioBuffer !== "undefined" && input instanceof AudioBuffer) {
    audio = input;
  } else {
    throw new TypeError("Expected an audio Blob or AudioBuffer");
  }
  if (!audio.length) throw new Error("Audio has no samples");
  if (audio.sampleRate !== 32000 || audio.numberOfChannels !== 2) {
    const context = new OfflineAudioContext(2, Math.ceil(audio.length * 32000 / audio.sampleRate), 32000);
    const source = context.createBufferSource();
    source.buffer = audio;
    // Explicit speaker mixing duplicates mono and downmixes surround to stereo.
    const mix = context.createGain();
    mix.channelCount = 2;
    mix.channelCountMode = "explicit";
    mix.channelInterpretation = "speakers";
    source.connect(mix).connect(context.destination);
    source.start();
    audio = await context.startRendering();
  }
  return [new Float32Array(audio.getChannelData(0)), new Float32Array(audio.getChannelData(1))];
}
