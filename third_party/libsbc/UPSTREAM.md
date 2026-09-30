# google/libsbc

Source: https://github.com/google/libsbc
Revision: 6e505650145c9973d08a0bdd5e5f5e1914305e40
License: Apache-2.0, included in LICENSE.

The portable C implementation (include/sbc.h, src/sbc.c, src/bits.c,
src/bits.h) is vendored unmodified. No assembly or command-line tools
are included. The upstream repository is archived. Changes to the integration
belong in native/sbc/bridge.c, and codec updates must rerun interoperability tests.
