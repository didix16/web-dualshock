#!/usr/bin/env node
// prepare-gh-pages.mjs
// Cross-platform script to copy dist into demo/dist and index.prod.html to index.html (ESM)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demoDir = path.join(__dirname, "demo");
const distDir = path.join(__dirname, "dist");
const demoDistDir = path.join(demoDir, "dist");
const prodHtml = path.join(demoDir, "index.prod.html");
const indexHtml = path.join(demoDir, "index.html");

if (fs.existsSync(demoDistDir)) {
  fs.rmSync(demoDistDir, { recursive: true, force: true });
}
copyRecursiveSync(distDir, demoDistDir);

// Copy index.prod.html to index.html (cross-platform)
fs.copyFileSync(prodHtml, indexHtml);

console.log(
  "dist copied to demo/dist and index.prod.html copied to index.html"
);
