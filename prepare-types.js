#!/usr/bin/env node
// prepare-types.js
// Copies webhid.d.ts to dist/ and injects reference in web-dualshock.d.ts
import fs from "fs";
import path from "path";

const distDir = path.resolve("dist");
const srcDir = path.resolve("src");
const mainDts = path.join(distDir, "web-dualshock.d.ts");
const webhidDtsSrc = path.join(srcDir, "webhid.d.ts");
const webhidDtsDist = path.join(distDir, "webhid.d.ts");

// Copy webhid.d.ts to dist
fs.copyFileSync(webhidDtsSrc, webhidDtsDist);

// Inject reference at the top of web-dualshock.d.ts if not present
const refLine = '/// <reference path="./webhid.d.ts" />\n';
let mainDtsContent = fs.readFileSync(mainDts, "utf8");
if (!mainDtsContent.startsWith('/// <reference path="./webhid.d.ts"')) {
  mainDtsContent = refLine + mainDtsContent;
  fs.writeFileSync(mainDts, mainDtsContent, "utf8");
}

// --- REMOVE ALL PRIVATE/PROTECTED FROM TYPES ---
// Remove lines with 'private' or 'protected' from class/interface/type declarations
const cleaned = mainDtsContent
  .split("\n")
  .filter(
    (line) => !/\b(private|protected)\b/.test(line.trim()) // remove private/protected
  )
  .join("\n");
fs.writeFileSync(mainDts, cleaned, "utf8");

console.log(
  "webhid.d.ts copied to dist/ and reference injected in web-dualshock.d.ts, private/protected members removed from types."
);
