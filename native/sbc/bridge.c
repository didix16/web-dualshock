/* web-dualshock SBC bridge. MIT; libsbc is Apache-2.0 (see third_party). */
#include <sbc.h>

/* Fixed scratch buffers keep WASM memory independent of song duration.
 * Channels are planar, with room for 128 samples each. */
static sbc_t encoder, decoder;
static int16_t pcm[2 * SBC_MAX_SAMPLES];
static uint8_t data[1024];
static struct sbc_frame decoded;
static const struct sbc_frame profile = {
    .freq = SBC_FREQ_32K, .mode = SBC_MODE_STEREO,
    .bam = SBC_BAM_LOUDNESS, .nblocks = 16, .nsubbands = 8, .bitpool = 50
};

void codec_reset(void) {
    sbc_reset(&encoder);
    sbc_reset(&decoder);
}
int16_t *codec_pcm(void) { return pcm; }
uint8_t *codec_data(void) { return data; }

int codec_encode(void) {
    if (sbc_encode(&encoder, pcm, 1, pcm + SBC_MAX_SAMPLES, 1,
                  &profile, data, sizeof(data)) < 0) return -1;
    return sbc_get_frame_size(&profile);
}

int codec_decode(unsigned size) {
    if (size < SBC_HEADER_SIZE || size > sizeof(data) || data[0] != 0x9c)
        return -1;
    if (sbc_decode(&decoder, data, size, &decoded,
                   pcm, 1, pcm + SBC_MAX_SAMPLES, 1) < 0) return -1;
    return decoded.nblocks * decoded.nsubbands;
}
