---
name: ForestOS QR Landing
description: A single scroll conservation record — a cinematic descent through canopy video into verified, mock-data proof of what one batch of tea protected.
colors:
  forest-950: "#08140e"
  forest-900: "#0c1f16"
  forest-850: "#10261b"
  forest-800: "#14301f"
  forest-700: "#1d3e2a"
  forest-600: "#2c5a3c"
  slate-deep: "#161c1a"
  slate-700: "#232b28"
  sage-500: "#8fa98a"
  sage-300: "#b7c9ae"
  sage-200: "#cdd9c4"
  bone: "#f3eee3"
  bone-300: "#ddd6c6"
  bone-500: "#c3bba6"
  amber-500: "#ce8e4e"
  amber-400: "#e8a85c"
  amber-700: "#7c5322"
  river-500: "#6fa5a0"
  emerald-100: "#d1fae5"
  emerald-400: "#34d399"
  emerald-500: "#10b981"
  emerald-600: "#059669"
  emerald-700: "#047857"
  emerald-800: "#065f46"
  emerald-900: "#064e3b"
  emerald-950: "#022c22"
  paper: "#f7f5f0"
  paper-sunk: "#e7e3d6"
  card: "#ffffff"
  line: "#e0dbcb"
  line-strong: "#d1cab8"
  ink: "#17251c"
  ink-muted: "#4f5c52"
  ink-faint: "#5b6960"
typography:
  display:
    fontFamily: "'Instrument Serif', ui-serif, Georgia, 'Times New Roman', serif"
    fontFamilyPortal: "'Newsreader', ui-serif, Georgia, 'Times New Roman', serif  # .dash subtree only"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.018em"
  body:
    fontFamily: "'Archivo', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "'Archivo', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "12px-13px"
    fontWeight: 400
    lineHeight: 1.5
    note: "Caption / dense-card body — chip and card sub-copy, HUD detail lines, footer module labels."
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', 'Liberation Mono', monospace"
    fontSize: "10px-13px"
    fontWeight: 500
    letterSpacing: "0.12em-0.3em"
    textTransform: "uppercase"
rounded:
  pill: "9999px"
  card: "16px"
  card-lg: "24px"
spacing:
  section-x: "1.5rem"
  section-x-sm: "2rem"
  section-max-w: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.amber-400}"
    textColor: "{colors.forest-950}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.amber-500}"
  segmented-toggle-active:
    backgroundColor: "{colors.amber-400}"
    textColor: "{colors.forest-950}"
    rounded: "{rounded.pill}"
  segmented-toggle-inactive:
    textColor: "{colors.sage-300}"
    rounded: "{rounded.pill}"
---

# Design System: ForestOS QR Landing

## Overview

**Creative North Star: "The Canopy Descent"**

The system stages one continuous, cinematic drop: a scanned QR code lands the viewer inside a dark-green forest, and the page reads as a descent through canopy into verified ground truth. A fixed, full-viewport forest video sits behind everything at the top of the page and is scrubbed by scroll position rather than played on a timer, so the first gesture the visitor makes (scrolling) is what moves the world. Later sections are opaque grounds that scroll up and physically cover the fixed video, which is the mechanism, not a metaphor — depth is conveyed by literal layering of fixed vs. scrolling content, not by shadow.

The palette is a single dark forest-green ground (`forest-950` → `forest-600`) carrying warm bone text and one warm accent (amber) for action and provenance, with a cool `river-500` as the second, data-only accent (verification readouts). The macro home also introduces `slate-deep`/`slate-700` as a deliberate one-way bridge: the last section before the B2B dashboard fades from forest into these cool neutrals so the palette hands off without a hard seam. Typography pairs an Instrument Serif display face (numbers, headlines — the "human" register) against Archivo for UI/body and JetBrains Mono for every measurement, timestamp, coordinate, and status string (the "instrument" register). This serif/sans/mono split is the core character: prose is warm, data is cold and monospaced.

The video-bleed motif recurs as a named, reusable pattern rather than a one-off hero device. On the batch view it is two sections (Impact, Passport Footer); on the macro home it is a three-beat "Farm → Cup → Export" sequence (Impact totals over a tea-farm clip, the sponsoring-brand section over a tea-pour clip, corporate gateway over a cargo-ship clip), each wash tuned so adjacent sections meet on opaque `forest-950` with no visible horizontal line. The batch view also carries a fourth, video-free brand beat (`BrandBeatSection`) between Impact and Passport Footer — a plain `forest-950` ground because the warm product plate carries it.

**Key Characteristics:**
- Fixed cinematic video ground, scroll-scrubbed at the top, replaced by opaque forest (video-bleed) sections beneath
- One warm accent (amber) for action and provenance; one cool accent (`river-500`) for verification data only; nothing else off the neutral axis
- Serif for humanized numbers and headlines; mono for every timestamp, ID, coordinate, and unit
- No fabricated liveness — a pulsing "live" indicator is only for something that is actually live; mock figures read as totals, not tickers
- Pill-shaped controls and rounded (16-24px) glass cards; no sharp corners anywhere
- Reduced-motion is a first-class rendering path, not an afterthought (every animated primitive has a static fallback)

## Colors

Dark-ground: one deep forest-green scale carries almost every background, sage and bone carry all text, amber is the one warm accent, and `river-500` is a narrow cool accent used only for verification data.

### Primary
- **Amber** (`#e8a85c` / `#ce8e4e`): the single warm accent. Used only on the primary CTA pill (`amber-400`, hover `amber-500`), the active state of a segmented toggle (era switch, belt region tabs), hotspot pins and their glow, the map-pin icon, and numerals that represent money/premium paid directly to the farmer. Also the browser `::selection` and `:focus-visible` outline color.

### Secondary (data only)
- **River** (`river-500` `#6fa5a0`): the cool verification accent. Applied narrowly to measured/verification readouts only — the plot telemetry drawer's coordinates and "0% deforestation" indicator, and the belt-block HUD's `{counties} · {hectares}` line and impact-strip trend line. Never on an interactive control, a heading, or narrative copy; those stay on the amber/forest/bone/sage axis.

### Neutral
- **Forest ground** (`forest-950` `#08140e` → `forest-600` `#2c5a3c`): the entire background system. `forest-950` is the body base and deepest wash; `forest-900`/`forest-850` are section and card grounds; `forest-700`/`600` appear only as scrollbar and border-adjacent chrome.
- **Slate** (`slate-deep` `#161c1a`, `slate-700` `#232b28`): cool structural neutrals used **only** in the macro home's corporate-gateway footer — its gradient fades forest → slate as a one-way palette bridge toward the B2B portal handoff, and the "premium portal" card fills with `slate-deep/55` glass. Not a general background; never used above that section. (The portal it opens into is itself a light console — see "The ESG Portal" — so the footer reads as the dusk before that switch, not a colour match.)
- **Bone** (`#f3eee3`, `bone-300` `#ddd6c6`, `bone-500` `#c3bba6`): primary text (`bone`), secondary body copy (`bone-300`), and the most muted disclaimers/footnotes (`bone-500`).
- **Sage** (`sage-500` `#8fa98a`, `sage-300` `#b7c9ae`, `sage-200` `#cdd9c4`): mono labels and secondary copy sitting directly on the forest ground — dividers between metadata fields, inactive toggle state, section metadata lines under an H2. `sage-300` when the label sits over a bright video frame rather than an opaque ground.

### Named Rules
**The One Warm Accent Rule.** Amber is the only *warm* color used for action and emphasis; `river-500` is the only *cool* one and is data-only (see Secondary). Everything else sits on the forest/bone/sage neutral axis — never add a third accent hue.

## Typography

**Display Font:** Instrument Serif (with ui-serif, Georgia fallback)
**Body Font:** Archivo (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** A warm, human serif for headlines and quantified outcomes set against a clinical, tracked-uppercase mono for every unit of measurement, coordinate, and timestamp — the pairing performs the site's own argument: a personal cup of tea backed by instrument-grade verification.

### Hierarchy
- **Display** (400, `text-4xl`–`text-6xl` / clamps to `text-3xl`–`text-5xl` on section heads, line-height 1.05-1.08, letter-spacing -0.018em): H1/H2 headlines and the large tabular-figure numerals (hectares, canopy %, premium paid). Always Instrument Serif.
- **Title** (400, `text-2xl`–`text-3xl`): card and sub-section headings (e.g. farmer/transparency card titles).
- **Body** (400, 14px-15px, line-height ~1.6, Archivo): descriptive copy, capped at roughly 44-60ch measure per paragraph.
- **Label** (500, 10px-11px, letter-spacing 0.14em-0.3em, uppercase, JetBrains Mono): every metadata line — batch/plot IDs, timestamps, coordinates, section eyebrisms-as-status, toggle labels, scroll cue. Tabular numerals (`.tnum`, `font-variant-numeric: tabular-nums`) apply wherever a mono number needs to hold column width.

### Named Rules
**The Instrument Register Rule.** Any value that is measured, timestamped, or identifies a record (IDs, coordinates, KES/kg, hectares, dates, plot refs) renders in JetBrains Mono, uppercase-tracked when it's a label. Any value that is narrated (headlines, body copy, captions) renders in Archivo or Instrument Serif. Never mix the two roles on the same string.

## Layout

Single-column, no grid system beyond a `max-w-6xl` (72rem) centered container with `px-6`/`sm:px-8` gutters — identical container width reused across every section. The Hero is the one departure: a `h-[100svh]` section that a GSAP `ScrollTrigger` pins and extends by `+=150%`, scrubbing the fixed video and drifting the overlay out before releasing into flow. Under `prefers-reduced-motion` the hero instead grows to its content (`min-h-[100svh]`, flex column, bottom-anchored) and the mid-dive narrative renders as a static list.

Card grids: the Impact strip is a four-up figure row (`lg:grid-cols-4`); the macro sponsoring-brand section (`PartnerShowcase`) is a stacked composition — a lead-brand feature panel (`lg:grid-cols-[1.15fr_1fr]` plate + text), then the Conservation Impact League table, then the COP32 milestone, then the enabling-partners strip; the batch Impact section keeps its 12-column `lg:grid-cols-12` layout. Everywhere else content stacks in a single column and reflows at `sm:`/`lg:`. Section vertical rhythm: `py-20`/`sm:py-28` standard, `py-14`/`sm:py-20` for the compact impact strip and footer.

## Elevation & Depth

The system is flat by construction but layered in the z-axis: depth comes from a fixed video plane (`-z-10`) sitting under everything, opaque section grounds (`z-10`) scrolling over it, and, within those sections, glass panels (`backdrop-blur`, semi-transparent forest fill) sitting over their own local looping video. Shadow is not used for structural hierarchy. The build has three soft, non-structural shadow exceptions: the amber glow on the hotspot pin dot (`shadow-[0_0_14px_2px_rgba(232,168,92,0.55)]`), the ambient drop shadow under the hotspot's popover card (`shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)]`), and one ambient shadow under the macro footer's "premium portal" card (`shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]`) — a single deliberate lift on the page's terminal call to action, never repeated elsewhere.

### Named Rules
**The Video-Bleed Section Rule.** A section can carry its own full-bleed, muted, looping background video (via the shared `LoopingVideo` component: `autoPlay`, `loop`, `muted`, `playsInline`, paused on `prefers-reduced-motion`, optional `playbackRate` for a slowed feel) behind a dark wash. The section is `relative z-10 overflow-hidden bg-forest-950`; the video is `absolute inset-0 object-cover` (no negative z — it paints above the section's own background box); one `absolute inset-0` wash sits over it; content sits in a `relative` layer above the wash. The wash is a flat `bg-forest-950/80` scrim or a vertical gradient. On the macro home the three video-bleed sections run as a "Farm → Cup → Export" sequence, and each gradient wash is tuned to be near-opaque `forest-950` at its top and bottom edge so adjacent sections meet with no visible horizontal line — the corporate-gateway wash then ramps to `slate-deep` at its base for the dashboard handoff. Cards over a bled video use the glass treatment (`bg-forest-950/40` + `backdrop-blur-md` + `border-bone/15`), never an opaque fill, so motion stays visible through the UI. Confirmed across five sections; a core pattern, not a hero effect.

**The Glass Card Rule.** Cards that sit over video or the ambient forest ground use `bg-forest-950/40`, `border border-bone/15`, and `backdrop-blur-sm` (heavier panels like the globe HUD use `bg-forest-950/78` with `backdrop-blur-md`). Opacity and blur scale with how much motion is behind the card: lighter blur when video shows through (Impact), heavier fill+blur when the panel must stay legible over a live 3D scene (Globe HUD).

## Shapes

Every interactive control and card uses a rounded, soft-edged vocabulary — there are no square corners in the build. Controls that are pill-like in function (buttons, the era toggle, its track) use `rounded-full`; cards and panels use `rounded-xl`/`rounded-2xl` (12-16px visually, 24px on larger footer/impact cards). Circles are used deliberately for spatial markers (the hotspot dot, its pulse ring, and its 12px inner rings) to read as map pins rather than UI chrome. Borders are hairline and translucent (`border-bone/10`–`/15`), used to separate a glass surface from what's behind it, never as a heavy structural rule.

## Components

### Buttons
- **Shape:** fully rounded pill (`rounded-full`)
- **Primary:** `bg-amber-400` fill, `text-forest-950` label, `px-6 py-3.5`, `font-sans text-sm font-semibold`. Used for the two primary calls to action in the build (scroll-to-proof CTA, passport PDF download).
- **Hover / Focus:** background shifts to `amber-500` over `duration-200`; icon glyph (Lucide arrow/download) nudges via a `group-hover:translate-y-0.5` transform. Focus ring is the global `:focus-visible` treatment (2px amber outline, 3px offset), not a button-local style.

### Segmented Toggle / Region Tabs
- **Era switch (batch):** pill track (`rounded-full border border-bone/15 bg-forest-950/70 backdrop-blur`) with two pill buttons; `role="radiogroup"`/`role="radio"`.
- **Belt region tabs (macro):** a row of standalone pill `<button aria-pressed>` (`Whole Belt` + five short block names), one horizontal `overflow-x-auto` row on mobile so they never blanket the map, wrapping from `sm:`. Selection is parent-controlled so a partner card elsewhere on the page can drive it.
- **State (both):** active is solid `bg-amber-400 text-forest-950 border-amber-400`; inactive is `bg-forest-950/70` glass, `text-sage-300` → `text-bone` on hover. Labels mono, uppercase, tracked. Never use a translucent amber tint for the active state — it must read unambiguously over live imagery.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (16px) standard, `rounded-2xl` at 24px-equivalent scale on larger footer/impact panels.
- **Background:** glass over video/ground (`bg-forest-950/40` to `/78`), never a fully opaque fill.
- **Shadow Strategy:** none by default; see Elevation & Depth for the three confirmed exceptions (hotspot dot glow, hotspot popover, macro-footer portal card).
- **Border:** hairline `border-bone/12`–`/15`, always present on glass cards to separate them from the ground behind.
- **Internal Padding:** `p-6`/`sm:p-7`–`p-8`, consistent across all card variants.

### Status / Metadata Line
A small mono, uppercase, tracked line pairs with load-bearing record data — batch ID + buffer zone above the Hero H1, the `dt`/`dd` metadata pairs in Impact's transparency card and the Footer, and the macro home's section metadata lines (`940 KM · 5 WATER TOWERS · 16 COUNTIES`; `5 BLOCKS · 14,250 HA · 5 WATER TOWERS`). It always carries a real, specific value (an ID, a coordinate, a count, a span) rather than a decorative label; it is a data/provenance readout, not a section-eyebrow convention, and never a bare generic tag over a heading with no data payload. Color: `sage-500` on an opaque ground, `sage-300` over a bright video frame; never amber (amber stays on action).

### Navigation
- **Batch view:** no persistent nav bar; the only navigational element is a skip-link (`sr-only focus:not-sr-only`, pill-shaped, amber, appears top-left on focus) jumping to `#proof`.
- **Macro home:** a `fixed` top bar (`MacroNav`) — the one persistent-nav exception, justified because the macro page is long and multi-audience. Transparent over the hero, then `bg-forest-950/85 backdrop-blur-md` after ~120px; it hides on scroll-down and returns on scroll-up so it never blankets the belt globe. Left: `Leaf` + wordmark → `/`. Right: two mono section anchors (`sm:` and up only — they are in-page jumps, dropped on mobile) plus the loud amber "Offtaker & Brand Login" pill → `/dashboard` ("Login" on mobile). Anchored sections carry `scroll-mt-20` to clear the bar.

### Signature Component: Spatial Hotspot
A 12px amber dot inside two concentric rings (translucent bone ring + itself), with a `motion-safe:animate-ping` amber halo, positioned absolutely by percentage over the fixed hero video. Tapping opens a `role="dialog"` glass popover (blur-settle-in via Framer Motion: `opacity`/`y`/`filter: blur` transition, `ease: [0.16,1,0.3,1]`) with a mono label, serif title, and body copy; closes on outside click or Escape. This is the build's one bespoke interaction pattern and should be reused verbatim for any future spatial point-of-interest marker rather than reinvented.

### Sponsoring brands, the Impact League, and the batch brand beat

`src/lib/brands.js` is the single source of truth for the brands that adopt belt blocks. `BRANDS` is keyed by `brandId` (one per block via `BELT_BLOCKS[].brandId`, and referenced by the literal `brandId` on each `batchChain` record); `STANDINGS` joins each brand to its block and ranks them by trees funded; `COP32` is the shared milestone. Only **Nyashinski Tea** (the Majani × Nyashinski collaboration, `blockId: 'mau'`) is a real brand with a product line, artist quote, campaign, product photography, and a per-pack conservation contribution; the other four are league-only placeholders.

The macro home's `PartnerShowcase` renders, inside the tea-pour video bleed: (1) `BrandFeature` — the lead brand as an asymmetric editorial panel, a warm product plate (`/media/brand/nyashinski-tin`, framed `rounded-2xl border-bone/15` inside the glass card) beside the name, the artist line as an Instrument Serif italic pull-quote, and an amber `#1 this quarter` pill; (2) `ImpactLeague` — every brand ranked, one `<button>` row each that flies the belt globe to that block (same parent-controlled `onExplore` path the old bento cards used), the leader carried by a faint `bg-amber-400/[0.06]` wash and an amber rank numeral + bar (not a `border-left`), everyone else on `bg-sage-500` bars; (3) `Cop32Milestone` — a countdown to a real fixed date (`useCountdown`, hourly tick) plus an amber pack-progress bar; (4) `EnablingPartners` — NTZDC / M-PESA Foundation / Sentinel-2 / Carrefour named in plain `dl` text, no logos.

The public batch view adds `BrandBeatSection` after Impact (see the video-bleed note): a `SectionIntro` head, then the brand identity (name + product +, when present, the artist quote), a "what this pack holds open" covenant readout with a `#proof` anchor back to the globe, a per-pack conservation-contribution figure row (distinct from the picker premium in `ImpactSection`), and `Cop32Milestone compact` with a one-line standings tie-in. A batch whose brand has no rich profile (e.g. the reference Rift Valley batch `802`) renders the lighter variant automatically — identity + covenant readout only, no plate, no contribution row, no milestone. `toLegacyBatch` carries `brandId`/`brand`/`product` and a `block` subset so the public batch object can drive all of this. The `/dashboard` buyer account stays "Rift Valley Tea Co." and its portfolio is unchanged; the Nyashinski demo lives at `/batch/921`.

## The ESG Portal (B2B dashboard)

The `/dashboard/*` route (`B2BDashboard` shell + `DashboardSidebar` + the routed
per-role modules) is the system's **one light surface** — an "operations console"
for the offtaker/brand account, deliberately distinct from the cinematic dark public
site so it reads as a working tool rather than a landing page. It is the inverse
of the forest ground, not a new palette: the same amber action accent, the same
`river-500` data accent, the same serif/sans/mono split. Only the ground flips.

**Scope & tokens.** The shell adds `.dash` to its root and `dash-root` to
`<html>` (so overscroll and short pages show paper, not the forest body base).
All light tokens live in `@theme` and are used only inside `.dash`:

- `paper` `#f7f5f0` — canvas (the module area and the top strip).
- `paper-sunk` `#e7e3d6` — nested wells, inset cards, hovered rows, the schematic
  map grounds.
- `card` `#ffffff` — panels (`Panel`) and KPI tiles (`StatTile`).
- `line` `#e0dbcb` / `line-strong` `#d1cab8` — hairline borders; `line-strong`
  also fills every meter/progress track so it reads on both white and paper-sunk.
- `ink` `#17251c` / `ink-muted` `#4f5c52` / `ink-faint` `#5b6960` — primary,
  secondary, and mono-label/tertiary text. **All three clear WCAG AA (≥4.5:1) on
  paper, card, and paper-sunk** — `ink-faint` was darkened from `#8a948a` in the
  post-critique pass because every functional mono label lands on it.
- `emerald-100 #d1fae5 · 400 #34d399 · 500 #10b981 · 600 #059669 · 700 #047857 ·
  800 #065f46 · 900 #064e3b · 950 #022c22` — canonical Tailwind emerald, declared
  as `@theme` tokens so the literal classes (`bg-emerald-700`, `text-emerald-950`,
  …) and the portal's own usage read from one place. This is the portal's action
  + data-viz green (see roles below).
- `amber-700` `#7c5322` — the accessible cut of amber for text and detail on
  white. Amber is **warnings only** now — see roles.
- `--shadow-card` — one soft ambient lift (`0 1px 2px` + `0 2px 10px -3px`
  rgba(23,37,28,…)) on panels and KPI tiles. This is the portal's single
  structural shadow; the dark site's "no structural shadow" rule does not cross
  into `.dash`.

**Colour roles inside the portal.**

- **Green is the portal's action + data accent** (the role amber plays on the
  dark public site): `emerald-700` primary CTA buttons
  (`bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm`, replacing the
  amber pill — "Export full GeoJSON", "Download Executive PDF", "Audit
  Certificate"); `emerald-950` page headers (`Overview`, `EUDR & Plot
  Compliance Suite`, …); `emerald-600` progress-bar fills, KPI sparkline stroke,
  the soft `emerald-500/15 → transparent` gradient area under every sparkline,
  positive `▲` delta pills, `text-emerald-700` positive KPI figures, "clear /
  compliant" pills, active list rows, and the QR scan / dwell / campaign visuals;
  the active nav row is `border-l-4 border-emerald-400` (bright) +
  `bg-emerald-900/60` + `text-white`.
- **Amber / orange is reserved strictly for semantic warnings**: `warn`-tone KPI
  tiles (Watch / Flagged) with their leading dot, the `watch` / `flagged` status
  pills, the flagged plot polygon on the sector map, encroachment-alert icons
  and pills, and the `PlotInspector` "current below baseline" canopy bar. Never
  a button, a header, a standard progress bar, or a neutral data mark.
- **`river-500`** stays data-only — now just the "coverage" meter tone in Fair
  Pay and the "current canopy, no loss" tone.
- Large KPI figures are `ink` or `emerald-700` only — never amber or river as
  text on white.

**Roles & navigation.** The portal is **multi-role** — `src/lib/dashboard/roles.js`
defines six views: **Brand / Offtaker** (default, at `/dashboard/*`), **Buyer /
Brand** (`/dashboard/buyer/*`), **Creator & Artist** (`/dashboard/creator/*`),
**NTZDC Operations** (`/dashboard/ops/*`), **NTZDC Management**
(`/dashboard/management/*`), **ESG Capital Manager** (`/dashboard/capital/*`). The
active role is **derived from the URL path** (`roleFromPath`, which matches the
most specific non-`/dashboard` `base` that prefixes the path), not React state;
the sidebar's "Role View" `<select>` simply `navigate()`s to a role's `base`.
Each role carries its own identity (`org`), scope label, and ordered module list;
`B2BDashboard` routes a flat union of every module across all roles, plus a `*` →
`/dashboard` redirect. Every role's index route resolves to `role.base` with **no
trailing slash** so `NavLink end` matching works. New non-Brand modules are built
from the shared `DashboardKit` primitives (`ModuleHeader`, `StatTile` row,
`Panel`, `BarMeter`, `Sparkline`, `DataTable`, `StatusPill`) + a per-role
mock-data file (`src/lib/dashboard/{buyer,creator,ntzdc,ntzdcManagement,esg}.js`);
the ESG "Satellite Recovery" and Buyer "Batch Lookup" modules both re-mount the
full `SectorFocusView` (`variant="ndvi"`).

**Buyer / Brand & the shared batch chain.** The Buyer role (`org.scope`
"Direct-sold volume", `scopeLabel` "Active sourcing") is scoped to a brand's own
direct-sold batches — **auction-pool volume is never shown** (`channel: 'auction'`
records are filtered out everywhere, and Batch Lookup rejects a search that
resolves to one). No farmer names, phone numbers, or IDs appear in this view;
only aggregate `farmers` / `pluckers` counts. Its three modules:
- **Conservation Passport** (`/dashboard/buyer`) — a four-up KPI row (volume
  verified, active passports, farmers represented, buffer hectares attributed)
  over content `Panel`s for sourcing, conservation activity, community impact
  (aggregate-only), environmental data (`Sparkline` on `SATELLITE.ndvi`),
  verification records, and the headline batch's full chain.
- **Batch Lookup** (`/dashboard/buyer/batches`) — search by id, a branded-batch
  picker, `BatchProvenanceChain`, evidence downloads (GeoJSON / audit cert /
  passport PDF via the existing `geojson.js` + `passportPdf.js` helpers), and the
  reused `SectorFocusView` map.
- **ESG Report Export** (`/dashboard/buyer/reports`) — hectares protected, carbon
  stored, verification status; a per-block `DataTable` and PDF + CSV export
  (`src/lib/esgReport.js`, same client-side hand-rolled PDF technique as
  `passportPdf.js`).

The batch chain is defined once. **`src/lib/batchChain.js`** holds the canonical
records (Land → Block → Plot → Harvest → Batch → Processing, plus a `channel`
tag and Field + Satellite verification), `redactBatchRecord(record, level)`
(`'public'` | `'buyer'` — coordinate precision, harvest/lot-ID detail, reference
truncation), and `toLegacyBatch(record)`. **`src/lib/mock.js` no longer hand-maintains
its own `BATCH`** — it projects `BATCH_CHAIN[0]` (and `resolveBatch` looks the id
up in the chain, branded-only) so the public QR site and the buyer dashboard read
one source. **`src/components/batch/BatchProvenanceChain.jsx`** is the shared
renderer for `redactBatchRecord` output — currently styled with the light `.dash`
tokens for its buyer-dashboard mount; a future dark public-site mount needs a
tone variant, but the data contract does not change.

**NTZDC Operations vs. Management.** The two NTZDC roles share a visual language
and the `ntzdc*` data files but differ in scope. **Operations**
(`org.scope` "Kiptunga Block operations", `scopeLabel` "Operating zone") is the
single-block console — Operations & QC Hub, Verification Queue, Problem Reports,
Quality & Rejections, Price Configurator, Farmer Training Alerts, Buffer
Maintenance. **Management** (`org.scope` "All zones", `scopeLabel` "Coverage",
`org.code` "NTZDC-NAT") is the org-wide roll-up across every operating zone, its
data in `ntzdcManagement.js` (a `zones` array plus `zoneTotalPay()` and a
`managementRollup()` that intake-weights every rate). Its three modules:
- **Landscape Overview** (`/dashboard/management`) — a six-up KPI row (zones,
  blocks, farmers & workers, season intake vs last, aggregate reject rate,
  buffer hectares) over a `BarMeter` "season intake by zone" panel and a
  sortable "zones at a glance" `DataTable`.
- **Zone Comparison** (`/dashboard/management/zones`) — the pay-disparity screen.
  One `DataTable`, rows **pre-sorted by pay gap descending** (widest gap to the
  top-paying zone first) so regional disparity surfaces without interaction; the
  Pay column renders a `PayStack` — base / quality-premium / conservation-premium
  segments (`emerald-900 / 600 / 400`) on one shared scale (the top payer), with
  the three figures repeated in a mono line beneath because the premium slivers
  are genuinely small. Pay-gap deltas are `amber-700` (a tracked disparity is a
  standing concern). `csvName="ForestOS-zone-pay-comparison"`.
- **Buffer & Conservation Rollup** (`/dashboard/management/buffer`) — the
  `BufferMaintenanceModule` pattern rolled up: a KPI row (intake-weighted
  boundary integrity, combined patrols, total buffer ha, zone-mean NDVI with a
  `MiniSparkline`), `BarMeter` panels for boundary integrity and patrol activity
  by zone (amber under the 88% integrity floor), and an equal-weighted org-wide
  NDVI `Sparkline` reading the same Sentinel-2 composite as ESG Satellite
  Recovery.

**Sidebar** (`DashboardSidebar`, takes a `role` prop). A **dark rich-emerald
panel** (`bg-emerald-950`, `border-emerald-800/50`) against the parchment
content — the one dark surface in the light portal. At `lg` it is
`sticky top-0 h-screen w-64 overflow-y-auto`, so the emerald ground stays
continuous full-height while the main column scrolls; below `lg` it collapses to
a full-width top section with a horizontal-scroll module row. Top to bottom:
`Leaf` (emerald-400) + `ForestOS` wordmark (white) → `/`; the **Role View**
switcher (native `<select>`, `bg-emerald-900/60`, chevron); the **scope badge**
in a dark transparent card (`bg-emerald-900/40 border border-emerald-800/50`) —
label `emerald-400`, value white, the copy driven by `role.scopeLabel` /
`role.org.scope`; a `MODULES` mono label; the nav list — inactive
`text-emerald-100/70`, hover `bg-emerald-900/50 text-white`, active
`border-l-4 border-emerald-400 + bg-emerald-900/60 + text-white`; and a pinned
"signed in as" card + "back to public site" link.

The Role View control is a real labelled `<select id="role-view" name="role-view">`
with a one-line "Switches the entire module set for this account." helper, so the
mode change is stated before interaction and autofill/SR have a name.
**Focus rings inside the sidebar are white** (`.dash aside :focus-visible`) — the
parchment-side `emerald-700` outline is invisible on `emerald-950` and fails
WCAG 2.4.11.

**Shell.** `B2BDashboard` root is `flex min-h-screen flex-col bg-paper lg:flex-row`
(faithful to a `flex min-h-screen` brief but column-stacked on mobile so the
sidebar is not a 256px squeeze). `bg-paper` is `#f7f5f0`. The module column is
`max-w-6xl` centred.

**Card framing.** Every white `Panel`, `StatTile`, and the Sector Focus /
activity-stream containers carry a `border border-emerald-900/10` hairline (a
barely-there green frame) plus `--shadow-card`. `warn`-tone tiles swap it for
`border-amber-700/25`.

**Console top strip.** A slim `border-b` bar above the module area:
`<role label> / <scope>` left, `AS OF <date>` right, both mono uppercase
`ink-faint`.

**Portal display face.** The dashboard subtree overrides `--font-display` to
**Newsreader** (an editorial "of record" serif — Production Type, `opsz 6..72`),
scoped to `.dash` so the public landing site keeps its cinematic Instrument
Serif. `.dash .font-display` sets `font-optical-sizing: auto`, `letter-spacing:
-0.017em`, `font-weight: 420`. Everywhere this section says "Instrument Serif
figure/headline", read it as Newsreader inside the portal. The mono/sans roles
(JetBrains Mono, Archivo) are unchanged.

**KPI tiles** (`StatTile`). `card` fill, `border-emerald-900/10`, `--shadow-card`,
`rounded-lg`. Mono uppercase 11px `ink-faint` label (with a leading **amber** dot
only when `tone="warn"`); a crisp Instrument Serif figure (`text-[2rem]`, tabular)
in `ink` or, for `tone="positive"`, `emerald-700`; and a **right slot that always
carries something** — a `trend` `MiniSparkline` (84×26, emerald stroke +
`emerald-500/16 → transparent` area fill; amber only on a `warn` tile) or, when
there is no series, a `share` (0–1) progress mark — so a tile is never a lone
figure in an empty box. Footer: an optional `DeltaPill` (Lucide `ArrowUp` /
`ArrowDown` + `sr-only` direction word + label, emerald tint up / amber tint
down) and/or a plain `ink-muted` unit caption.

**Charts.** `BarMeter` — one bar, one value; tracks `line-strong`; fills
`emerald-600` (default), `river-500` (coverage / verification), `ink-faint/60`
(`muted`), `amber-500` only for a warning. `BulletBar` — target-vs-actual on one
row: the fill is the actual, an `ink` tick is the target, the bar turns amber
when behind. Use it whenever two quantities are being compared (ESG deployed vs
target, the price stack) instead of two `BarMeter` lists. `Sparkline` /
`MiniSparkline` draw a soft gradient area under the line via an inline
`<linearGradient>` keyed by React `useId`.

**Per-role hero visualisations.** Each role's primary module leads with one
authored chart before the KPI-and-table body:
- **Brand** — the Sector Focus 3D map (EUDR / Satellite).
- **Creator** — `CreatorDropTimeline`: an SVG release calendar, each drop a node
  on a date axis with a sell-through ring and a `TODAY` marker. Campaign Drops
  also carries `CampaignSellThrough` (one segmented bar across every launched
  edition series, units sold vs. total run, upcoming inventory noted as a
  footnote) and a royalty/units/AOV/trees KPI row. Audience QR Scans carries
  `CreatorMessageBoard` — a prototype note composer (280-char cap, emerald
  "Publish to audience" CTA) above a `divide-y` list of published notes, each
  stamped with date, id, and accrued scan reach.
- **NTZDC** — `NtzdcCentreBoard`: one tile per collection centre with a half-
  circle intake gauge against target, moisture against the accepted band, and
  last-pickup time — a board, not a table.
- **ESG** — the `BulletBar` deployed-vs-target chart on Fund Allocation.

**`DataTable`** now takes `sortable` (headers become buttons that cycle asc →
desc, with `aria-sort`) and `csvName` (adds a Download CSV action). Where a
module previously rendered a table *and* the same numbers as a `BarMeter` list,
the bar is folded into a table cell instead.

**NTZDC pipeline modules.** Two Operations modules track work through a named
pipeline and reuse the shared primitives rather than adding chrome:

- **Verification Queue** (`/dashboard/ops/verification`) — a KPI row (pending
  review, verified this week, avg time to verify, flagged/rejected) over a
  `divide-y` list of conservation claims, each a full-width `<button>` row
  showing claim type, `VC-` id, plot/block, reported date and a `StatusPill` for
  the pipeline stage (Reported → Field verified → Evidence attached → Satellite
  cross-check → Verified, or Rejected). Selecting a claim swaps the whole module
  for `VerificationClaimDetail` (local `useState`, a mono "← Back to queue"
  control, no route change) — a `PipelineStepper`, the original submission as a
  `dl`, an editable officer-observations `textarea`, a dashed photo/GPS evidence
  well, an NDVI cross-check that reads the same `SATELLITE.ndvi` composite as ESG
  Satellite Recovery (baseline-vs-current `BarMeter` pair + `Sparkline` + the
  `ESG.recovery` sector mean), and an Approve / Request more evidence / Reject
  decision row with an `aria-live` prototype confirmation.
- **Problem Reports** (`/dashboard/ops/problems`) — a KPI row (open, avg response
  time, resolved this month, overdue) over a sortable `DataTable` with
  `csvName="ForestOS-problem-reports"`: farmer id, centre, problem type,
  severity and status as `StatusPill`s (severity forced to `warn` at High /
  Critical; an `overdue` mono tag trails an unclosed status), assigned officer.

The verification stage keywords (`verified`, `outcome recorded`) were added to
`StatusPill`'s `STATUS_TONE` map so both modules resolve pipeline pills without
per-call tone props; the pill classes are unchanged and still match the
`CATEGORY_TONE` tags on Impact Audit Logs.

**The QR / audience scatter panels** render on `paper-sunk` with
`rgba(23,37,28,0.07)` grid lines, carry a `role="img"` summary label, and print
the same city figures as a plain sorted list beneath — the bubble field is
decoration over a real list, not the only representation.

**The Sector Focus View** (`components/dashboard/sector/`). The EUDR and
Satellite modules replace a flat schematic with a real 3D map scoped to the
account's one covenant block (`SECTOR` in `dashboardData.js` — South West Mau /
Kiptunga Block). It reuses the public site's Cesium/Resium stack (`lib/cesium`
bootstrap, Esri World Imagery, the same dark scene grade) behind a `React.lazy`
boundary, so Cesium only downloads when one of those two modules opens. Pieces:

- **`SectorFocusMap`** — the Cesium `Viewer`, framed by `SECTOR.flight` (high
  tilt → resting 3/4 view; jumps under reduced motion). The WebGL canvas is
  `tabindex="-1"` + `aria-hidden` — it captures arrow keys and would trap
  keyboard users; the plot rail below the map (a row of focusable status-dotted
  plot-ID buttons) is the keyboard / screen-reader path to every plot's
  inspector. Three toggleable layers:
  `audit` (per-plot polygons, slightly extruded, coloured `#3ba552` cleared /
  `#e8a85c` watch / `#df5a26` flagged, selected plot extruded taller with a bone
  outline), `ndvi` (a 9×6 translucent graded field on the fixed NDVI ramp
  `#a9641d` bare → `#c9a24a` → `#4a9e3f` → `#1f7d38` canopy — these four are the
  only sanctioned NDVI-map colours and never leave the satellite scene),
  `pins` (amber `PinBuilder` billboards for the collection centres). Clicking a
  polygon or pin flies the camera and selects.
- **`SectorLayerToggle`** — top-right dark-glass toggle group. Dark chrome is
  correct **only here**, floating over the satellite scene.
- **`PlotInspector`** — a right-edge slide-over HUD card (dark glass, Framer
  Motion slide / fade under reduced motion): plot ID + coordinates, EUDR status
  badge, baseline-vs-current canopy bars, NDVI, and `GeoJSON` + `Audit
  Certificate` download CTAs (`plotToAuditCert` / `downloadCert`).
- **`AuditActivityStream`** — a light `Panel`-styled feed below the map,
  headed **"Audit Activity"** (never "Live") with a static `SIMULATED FEED` pill
  (no pulsing dot — the public-site "no fabricated liveness" rule holds here).
  It adds one paced entry every ~15s from `AUDIT_ACTIVITY`; reduced motion
  renders the whole log at once. Plot IDs are click-through to the inspector.

**What does not change.** The mono/serif register rule, the "never a bare
decorative eyebrow" status-line rule, `rounded` vocabulary, and reduced-motion
expectations all hold inside the portal. The "no third accent hue" rule holds in
spirit: the portal's `emerald-*` ramp is a saturated cut of the same forest
green, not a new hue — green, amber (warnings), `river-500` (data), and the
bone/ink neutrals are still the whole set. What the portal *does* change from the
dark site is the **role assignment**: green takes over action + emphasis, and
amber retreats to warnings only.

## Do's and Don'ts

### Do:
- **Do** keep the mono/serif split absolute: measured or identifying values in JetBrains Mono, narrated copy in Archivo/Instrument Serif.
- **Do** use the video-bleed + wash + glass-card pattern (see Named Rules) when a section needs to reprise the cinematic-descent feeling at a smaller scale — it is an established, repeated system pattern, not a hero-only device.
- **Do** honor `prefers-reduced-motion` for every animated primitive (video autoplay, scroll-scrub, reveal, hotspot ping, popover transition) by falling back to a static, legible state — every component in the build already does this and new components must match.
- **Do** keep amber to CTAs, active states, and provenance/money numerals; everything else stays on the forest/bone/sage neutral axis.

### Don't:
- **Don't** introduce a decorative kicker/eyebrow — a mono label above a heading purely for label effect, with no data payload of its own. A mono line above a heading is valid only when it carries a real, specific value (a count, a span, an ID, a status), and it renders in sage, never amber. `SectionIntro`'s `eyebrow` prop is for exactly this kind of readout.
- **Don't** add hard-offset/neobrutalist shadows or sharp corners. On the dark public site the system has exactly three soft glow/ambient shadow exceptions (hotspot dot, hotspot popover, macro-footer portal card) and no structural drop-shadow elevation elsewhere; inside the `.dash` ESG portal, `--shadow-card` is the one sanctioned ambient lift on panels and KPI tiles.
- **Don't** carry the light `.dash` tokens (`paper`, `card`, `ink`, `line`, …) or the light console treatment outside `/dashboard/*`, and don't bring the forest ground into the portal. The two surfaces are deliberately opposite grounds of the same palette.
- **Don't** use dark surfaces in the portal outside the two sanctioned places: the **rich-emerald sidebar** (`bg-emerald-950`), and dark-glass chrome floating **over the Sector Focus satellite viewport** (layer toggle, legends, plot inspector). Every other surface is light `card` / `paper`.
- **Don't** let the Sector Focus map's data-viz reds/greens (`#df5a26` flagged, `#3ba552` cleared, the NDVI ramp) leak into UI chrome — they are map encodings on a dark satellite scene, not additions to the forest/amber/river accent system. `STATUS_CSS` (`sectorMapStyle.js`) holds the darker CSS mirrors used for the inspector badge and legend so the HTML chrome stays legible.
- **Don't** set a large KPI figure in amber or `river-500` on the light portal — as text on white they fail contrast. Figures are `ink` or `emerald-700`; amber survives only as a warning fill/border/dot/icon, and `amber-700` is its text cut.
- **Don't** put amber/orange on anything in the portal that is not a semantic warning. Buttons, headers, standard progress bars, positive deltas, and neutral data marks are all green now; orange means Watch / Flagged / alert / regression.
- **Don't** widen `river-500` past verification data. It is the cool data accent (coordinates, "0% deforestation", HUD/impact metric lines) — never put it on a button, a heading, or narrative copy, and never add a third accent hue.
- **Don't** spread `slate-deep`/`slate-700` beyond the macro corporate-gateway footer. They exist only as the one-way forest → dashboard palette bridge; every other ground is the forest scale.
- **Don't** use glyph icon fonts, Unicode arrows, or system display fonts; all icons and directional glyphs are Lucide SVG components (`ArrowRight`, `ArrowDown`, `ArrowUpRight`), and both display and label type are the two loaded webfonts.
