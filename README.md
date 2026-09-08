# ForestOS — QR Conservation Landing Page

Consumer-facing landing page reached by scanning the QR code on a pack of tea.
It proves the conservation effort behind a single batch along Kenya's 940 km Mau
Forest buffer line.

**Prototype.** There is no ForestOS backend yet — every figure, coordinate,
verification reference and the 3D recovery overlay is illustrative mock data
(`src/lib/mock.js`).

## Stack

- **Vite** + **React 19**
- **Tailwind CSS v4** (`@tailwindcss/vite`, theme tokens in `src/index.css`)
- **GSAP + ScrollTrigger** — scroll-scrubbed hero video ("descent through the canopy")
- **Framer Motion** — section reveals, hotspot cards
- **Cesium + Resium** — token-free 3D globe (Esri World Imagery, WGS84 ellipsoid)
- **lucide-react** — icons

## Running it

```bash
npm install
npm run dev      # predev copies Cesium assets into public/cesium
```

`npm run build` runs the same Cesium copy step, then `vite build`.

### Cesium assets

Cesium's runtime files (`Workers`, `Assets`, `Widgets`, `ThirdParty`) are copied
to `public/cesium/` by `scripts/copy-cesium.mjs` (wired to `predev` / `prebuild`).
`CESIUM_BASE_URL` is set to `/cesium/` in `src/lib/cesium.js`. The globe needs
no Cesium Ion account.

### The background video

`public/media/forest1.webm` is the cinematic hero background. Replace it with any
`.webm`/`.mp4` of the same name to change the footage.

## Page structure

| Section | File | Notes |
| --- | --- | --- |
| Hero | `src/sections/Hero.jsx` | Fixed full-viewport video, scroll-scrubbed via `useScrubVideo`; 3 pulsing spatial hotspots; headline + CTA |
| 3D Proof | `src/sections/GlobeSection.jsx`, `src/components/Globe.jsx` | Resium globe on the Mau block, "2015 vs. Today" recovery toggle, mock Collection Centre pin |
| Impact | `src/sections/ImpactSection.jsx` | Three differentiated records: hectares preserved, plucker premium, EUDR verification |
| Passport | `src/sections/PassportFooter.jsx` | Batch ID + volume + "Download Verified Conservation Passport (PDF)" — generates a small valid PDF client-side (`src/lib/passportPdf.js`) |

## Design

Mobile-first (primary viewport is a phone at a QR code). Earthy premium palette:
deep forest greens and dark slate grounds, muted sage for secondary text, warm
bone off-white, a single amber accent for calls to action and map pins, cool
river teal for verification data. Display face is Instrument Serif; UI is Archivo;
measurements and identifiers are set in JetBrains Mono.

`prefers-reduced-motion` disables the video scrub, entrance motion and hotspot
pulse.
