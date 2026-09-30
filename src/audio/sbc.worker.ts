import { createCodec } from "./codec-engine";
import type { CodecRequest, CodecResponse } from "./worker-protocol";

// Keep worker types local so WebWorker and DOM global declarations don't clash.
const scope = self as unknown as {
  onmessage: (event: MessageEvent<CodecRequest>) => void;
  postMessage: (message: CodecResponse, transfer: Transferable[]) => void;
};
let codec: ReturnType<typeof createCodec> | undefined;
let queue = Promise.resolve();

async function loadCodec(url: string) {
  if (!codec) {
    codec = (async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Cannot load SBC WASM: HTTP ${response.status}`);
      return createCodec(await response.arrayBuffer());
    })();
    codec.catch(() => { codec = undefined; });
  }
  return codec;
}

scope.onmessage = ({ data: request }) => {
  // Serialize initialization and jobs so two callers cannot share codec state.
  queue = queue.then(async () => {
    try {
      const engine = await loadCodec(request.wasmURL);
      if (request.operation === "encode") {
        const data = engine.encode(request.channels);
        scope.postMessage({ id: request.id, operation: "encode", data }, [data.buffer]);
      } else {
        const pcm = engine.decode(request.data);
        scope.postMessage({ id: request.id, operation: "decode", pcm }, pcm.channels.map(c => c.buffer));
      }
    } catch (error) {
      scope.postMessage({ id: request.id, error: error instanceof Error ? error.message : String(error) }, []);
    }
  });
};
