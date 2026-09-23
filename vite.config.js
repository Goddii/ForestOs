import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cesium ships large static assets (Workers, Assets, Widgets, ThirdParty).
// They are copied to /public/cesium by scripts/copy-cesium.mjs (pre-dev / pre-build)
// and served from CESIUM_BASE_URL = '/cesium/' (set in src/lib/cesium.js).
//
// A prior version of this config aliased the bare `cesium` specifier to
// Cesium's prebuilt UMD bundle (Build/Cesium/Cesium.js) to dodge an esbuild
// OOM risk (see below), then included it in optimizeDeps so esbuild's
// CJS-interop would convert that UMD bundle into real named ESM exports.
// That interop only ran for whatever import graph Vite's cold-start crawl
// actually reached — imports behind a `React.lazy()` boundary (every module
// in this dashboard) aren't part of that crawl, so the generated chunk was
// missing exports (`Cartesian3`, `default`, …) depending on which lazy route
// loaded first, and every Cesium-dependent module threw at import time.
// Cesium's own package.json already points the bare `import` condition at
// `Source/Cesium.js` — a REAL ESM barrel (1,352 genuine `export` statements,
// re-exporting from `@cesium/engine` / `@cesium/widgets`), so removing the
// alias entirely and letting that resolve natively is both correct (real
// named exports, not UMD-interop guessing) and safe: the OOM risk below is
// specifically about esbuild *bundling* that dependency graph, which
// `optimizeDeps.exclude` avoids altogether by serving it as native,
// unbundled ES modules instead (slower first paint on a map screen, many
// small requests, no bundling memory spike).
// https://vite.dev/config/
const cesiumWidgetsCss = fileURLToPath(
  new URL('./node_modules/cesium/Build/Cesium/Widgets/widgets.css', import.meta.url)
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // `cesium`'s package.json `exports` map (a "./Build/*" pattern with a
      // sibling "./Build/*.js": null exclusion) failed to resolve this CSS
      // deep import ("Failed to resolve import ... Does the file exist?"
      // even though it does). Point straight at the file to skip that
      // exports-map lookup entirely.
      'cesium/Build/Cesium/Widgets/widgets.css': cesiumWidgetsCss,
    },
  },
  optimizeDeps: {
    // Never let esbuild bundle Cesium's real source graph (`@cesium/engine` /
    // `@cesium/widgets`, thousands of small modules) — that bundling attempt
    // is what drove node's RSS past several GB and got the dev server
    // OOM-killed on memory-constrained machines. Excluding all three means
    // Vite serves them natively instead, unbundled.
    exclude: ['cesium', '@cesium/engine', '@cesium/widgets'],
    // Home -> GlobeSection -> Globe is a two-level-deep lazy() chain
    // (routes/Home.jsx is itself lazy-loaded from App.jsx). Listing resium
    // here folds it into the cold-start pre-bundle instead of leaving it to
    // be discovered from a live request. resium is small and genuinely CJS
    // (`resium.cjs`), so pre-bundling it (unlike Cesium itself) is safe.
    //
    // `@cesium/engine` / `@cesium/widgets` are real ESM (excluded above) but
    // several of their own dependencies are small legacy CommonJS packages
    // with no genuine ESM entry — some (`nosleep.js`) even declare a
    // `module` field that points at a file that's still plain
    // `module.exports = X` underneath, so the field alone can't be trusted.
    // Native unbundled ESM resolution can't import a default export from any
    // of these directly. Listing them here runs just their own CJS-to-ESM
    // interop, which is cheap (each is a single small file); it does not
    // touch the big Cesium graph that caused the OOM.
    include: [
      'resium',
      'mersenne-twister',
      'draco3d',
      'bitmap-sdf',
      'grapheme-splitter',
      'lerc',
      'protobufjs',
      'urijs',
      'nosleep.js',
    ],
  },
  server: {
    // TEMPORARILY DISABLED (Sept 2026) — this machine is memory-constrained
    // and the current work is entirely on /investor, which never touches
    // Cesium/resium/three.js (verified: zero references anywhere under
    // src/components/investor, src/routes/InvestorView.jsx, src/lib/investor).
    // This warmup exists purely to avoid an OOM race when someone visits the
    // Home page's globe (see the comment that used to sit here, restored
    // below) — with Home not in use right now, it's pure overhead: it forces
    // Vite to eagerly pre-bundle the whole three.js/r3f/postprocessing graph
    // on every dev-server start whether or not anyone visits `/`.
    //
    // Re-enable (uncomment) before testing the home page / globe again — the
    // OOM race this guards against is real once Home is actually loaded:
    //
    // warmup: {
    //   // A real page load fires several requests into the Home -> GlobeSection
    //   // -> Globe lazy chain within milliseconds of each other (React's
    //   // Suspense boundary resolves, then the browser fetches Globe.jsx,
    //   // cesiumBootstrap.js, globeCamera.js, etc. concurrently). If those all
    //   // land while the dep optimizer is still mid-discovery, several
    //   // overlapping re-optimize passes can fire at once instead of being
    //   // coalesced into one — each holding its own copy of the already-large
    //   // three.js/r3f/postprocessing bundle in memory, which was enough to
    //   // push the dev server's RSS past 6GB and into the OOM killer.
    //   // Warming these files up front makes Vite resolve the whole chain
    //   // once, deterministically, before any client request can race it.
    //   clientFiles: [
    //     './src/routes/Home.jsx',
    //     './src/sections/GlobeSection.jsx',
    //     './src/components/Globe.jsx',
    //   ],
    // },
  },
  build: {
    // Cesium is heavy; it is already isolated via a lazy import in App.jsx.
    chunkSizeWarningLimit: 4000,
  },
})
