import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isGithubPages =
  process.env.GITHUB_PAGES === "true" ||
  process.env.NODE_ENV === "gh-pages" ||
  process.env.CI === "true";

export default defineConfig({
  base: isGithubPages ? "/web-dualshock/" : "/",
  build: {
    lib: {
      entry: resolve(__dirname, "src/web-dualshock.ts"),
      name: "WebDualShock",
      fileName: (format) => `web-dualshock.${format}.js`,
      formats: ["es", "umd"],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
});
