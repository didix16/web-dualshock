# web-dualshock

TypeScript library to manage PS4/PS5 controllers in the browser using WebHID and the Gamepad API.

## Development workflow

- **Hot reload development:**

  - Run `yarn dev:demo` to start Vite with hot reload and open the demo (`demo/index.dev.html`).
  - The demo imports the library source directly, so any changes in `src/web-dualshock.ts` are reflected instantly.

- **Production build and deploy:**
  - Run `yarn build` to build the library into `dist/`.
  - Run `yarn prepare:demo` to copy the build into `demo/dist` and set up `demo/index.html` for production (copied from `index.prod.html`).
  - Run `yarn preview:demo` to serve the production demo with the bundled library.
  - Run `yarn deploy` to build, prepare, and deploy the demo (with the library) to GitHub Pages. The workflow ensures `index.html` is always correct for GitHub Pages.

## Main scripts

- `yarn dev:demo`: Hot reload development demo (source import).
- `yarn build`: Builds the library into `dist/`.
- `yarn prepare:demo`: Copies `dist/` into `demo/` and sets up `index.html` for production.
- `yarn preview:demo`: Serves the production demo with the built library included.
- `yarn deploy`: Builds, prepares, and deploys the demo (with library) to GitHub Pages.

## Structure

- `src/web-dualshock.ts`: Library source code.
- `src/webhid.d.ts`: WebHID type definitions (for compatibility).
- `demo/index.dev.html`: Demo for hot reload development (imports source).
- `demo/index.prod.html`: Demo for production (uses UMD bundle).
- `demo/index.html`: Generated for deploy (copied from `index.prod.html`).
- `dist/`: Library build output (ESM and UMD bundles).

## GitHub Pages deployment

The workflow `.github/workflows/gh-pages.yml` automatically publishes the demo and the library to GitHub Pages on every push to `main`.

## Development with Yarn Berry (v4) and PnP

- The project is ready for VS Code and PnP.
- If you have type issues, run `yarn dlx @yarnpkg/sdks vscode`.

---

Inspired by [madgooselabs/WebHID-DS4](https://github.com/madgooselabs/WebHID-DS4), but using Vite and no Vue.
