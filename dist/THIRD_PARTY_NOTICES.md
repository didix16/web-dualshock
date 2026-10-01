# Audio codec

The distributed SBC WebAssembly module incorporates google/libsbc.
Copyright 2022 Google LLC. Licensed under the Apache License, Version 2.0.
The full license is in third_party/libsbc/LICENSE (also copied to dist/audio).

Source: https://github.com/google/libsbc
Pinned revision: 6e505650145c9973d08a0bdd5e5f5e1914305e40

The upstream sources are unmodified. The MIT-licensed adapter and build scripts
in this project compile the portable encoder and decoder to WebAssembly.
