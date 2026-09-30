# Audio fixtures

These small synthetic tones contain no third-party recording.

- `tone.mp3`: 440 Hz mono, 44.1 kHz, 0.12 seconds before MP3 padding.
- `reference.sbc`: 660 Hz stereo, 32 kHz, 224 kbit/s, 0.04 seconds.
- `reference.f32le`: interleaved stereo float32 little-endian PCM obtained by
  decoding `reference.sbc` with an independent SBC implementation (FFmpeg).
- `mono16.sbc`: 440 Hz mono at 16 kHz / 64 kbit/s.
- `short48.sbc`: 880 Hz stereo at 48 kHz / 96 kbit/s, with a 3 ms latency target
  to exercise smaller SBC frames.

FFmpeg is used only to generate reference test data, never by the library, its
build or its tests. Fixtures are checked in so no FFmpeg installation is needed.
Generation commands:

```sh
ffmpeg -f lavfi -i 'sine=frequency=440:sample_rate=44100:duration=0.12' -c:a libmp3lame -b:a 64k tone.mp3
ffmpeg -f lavfi -i 'sine=frequency=660:sample_rate=32000:duration=0.04' -ac 2 -c:a sbc -b:a 224k -f sbc reference.sbc
ffmpeg -i reference.sbc -f f32le reference.f32le
ffmpeg -f lavfi -i 'sine=frequency=440:sample_rate=16000:duration=0.04' -ac 1 -c:a sbc -b:a 64k -f sbc mono16.sbc
ffmpeg -f lavfi -i 'sine=frequency=880:sample_rate=48000:duration=0.04' -ac 2 -c:a sbc -b:a 96k -sbc_delay 0.003 -f sbc short48.sbc
```

The two existing demo SBC files also exercise decoding many consecutive frames.
