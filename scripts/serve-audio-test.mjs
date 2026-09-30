import { createServer } from "node:http";
import { cpSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";

// Serve relocated production artifacts without Vite transformations or fallbacks.
const root = resolve(".audio-test/site");
mkdirSync(root, { recursive: true });
cpSync("dist", resolve(root, "nested/library"), { recursive: true });
cpSync("tests/audio/fixtures", resolve(root, "fixtures"), { recursive: true });
cpSync("tests/audio/browser.html", resolve(root, "index.html"));
const mime = { ".js": "text/javascript", ".wasm": "application/wasm", ".html": "text/html", ".mp3": "audio/mpeg" };
createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const file = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root + sep) || !statSync(file).isFile()) throw new Error("Not found");
    response.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream" });
    response.end(readFileSync(file));
  } catch {
    response.writeHead(404).end();
  }
}).listen(4174, "127.0.0.1", () => console.log("Audio artifact tests: http://127.0.0.1:4174"));
