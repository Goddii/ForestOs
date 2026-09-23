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
  # Investor console (/investor/*) — its own light-neutral canvas, distinct
  # from the public site's paper/paper-sunk (cooler, less warm-cream) and
  # from the dead .dash portal. Reuses card/line/line-strong/ink/ink-muted/
  # ink-faint above (same roles, shared values).
  canvas: "#eef1ee"
  canvas-sunk: "#e4e9e3"
  forest-accent: "#176b45"
  forest-accent-dark: "#0b3d2a"
  forest-accent-soft: "#e8f2ec"
  warning: "#9a6a13"
  warning-soft: "#faf1e0"
  danger: "#b54848"
  danger-soft: "#f8e9e9"
  risk-low: "#1c8a5a"
  risk-low-soft: "#e1f2e9"
  risk-medium: "#ce8e4e"
  risk-medium-soft: "#faecdd"
  risk-high: "#c0362c"
  risk-high-soft: "#f8e1df"
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
- **Slate** (`slate-deep` `#161c1a`, `slate-700` `#232b28`): cool structural neutrals used **only** in the macro home's corporate-gateway footer — its gradient fades forest → slate, and the "premium portal" card fills with `slate-deep/55` glass. Not a general background; never used above that section. (Originally tuned as dusk before a handoff into a since-removed B2B portal CTA; the footer's own tone stands on its own now. Unrelated to the investor console's `canvas` — see "The investor console (`/investor/*`)".)
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

### Investor console (`/investor/*`) type ramp

A separate, tighter, all-sans scale — no Instrument Serif below the page
`<h1>` (see "The investor console" Named Rule). All Archivo unless noted.

- **Page H1** (400, `text-5xl`–`text-6xl`, Instrument Serif — the one serif use): the project name only.
- **Section heading** (700, `text-2xl`–`text-[1.75rem]`, `tracking-tight`): every `SectionHeading` `<h2>`.
- **Card title** (600–700, `text-xl`, or `text-[13px]` for a dense list-row title): evidence/report/governance card headings.
- **Body** (400, `text-[14px]`, line-height relaxed): descriptive copy under a heading, capped `max-w-[62ch]`.
- **Data figure** (700–800, `text-2xl`–`text-5xl`, `tabular-nums`): every `StatCard`/`MetricCard` headline number.
- **Micro label** (500–600, `text-[9px]`–`text-[13px]`, uppercase, tracked `0.1em`–`0.22em`, JetBrains Mono): metadata lines, badge text, nav items, table headers, axis labels — the console's own dense-data register, distinct from the public site's label scale but built on the same mono/uppercase/tracked idea.

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
- **Macro home:** a `fixed` top bar (`MacroNav`) — the one persistent-nav exception, justified because the macro page is long and multi-audience. Transparent over the hero, then `bg-forest-950/85 backdrop-blur-md` after ~120px; it hides on scroll-down and returns on scroll-up so it never blankets the belt globe. Left: `Leaf` + wordmark → `/`. Anchored sections carry `scroll-mt-20` to clear the bar.

  Right (`sm:` and up), structured after osapiens' persistent-nav pattern (studied for structure only — multi-column mega-dropdown, a standing CTA — never its branding or copy): two `NavMegaMenu` dropdowns — **"The Record"** (proof content: "See the proof" → 3D Proof Map / Buffer Belt / Trees Funded; "Trace it yourself" → Scan Experience / a real sample batch record, `/batch/921`) and **"Partners"** (what ForestOS offers each partner segment — see below) — followed by the CTA pill (`Request a Forest Edition` → `/launch`, the same outline-amber pill the footer already used — kept as the one *fill-free* amber CTA rather than adding a third `bg-amber-400`-filled button alongside the two the palette section already names). Deliberately narrower than osapiens' five-item nav: only as many dropdown columns as the site has real destinations for — no invented "Regulations" or "Company" sections standing in for pages that don't exist. The old plain `Partners` anchor (`#partners`, the sponsoring-brands showcase) was renamed **"Sponsoring Brands"** in the mobile drawer once "Partners" became the offerings dropdown's name, so the two don't collide.

  `NavMegaMenu` is the one generic mega-dropdown component (`src/components/home/NavMegaMenu.jsx`) — both "The Record" and "Partners" render through it with different `columns` data (`src/data/navMenus.js`), rather than each dropdown reimplementing the open/close/outside-click logic. It reuses `Hotspot.jsx`'s established floating-glass-popover contract verbatim (`rounded-2xl border-bone/12 bg-forest-900/90 backdrop-blur-md shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)]`, the same `[0.16,1,0.3,1]` blur-settle `y`/`opacity`/`filter` transition, outside-click + Escape to close) rather than inventing a second floating-panel language. A column item without a live route renders inert at `opacity-60` with a small "Soon" badge stacked *below* its label (not beside it — an inline badge collided with two-line-wrapping labels like "Conservation Passports" in an early pass) instead of linking anywhere, so the full offering plan is visible in the menu without shipping a 404.

  Below `sm:`, the hamburger opens a full-screen `role="dialog"` drawer (body-scroll locked, `overscroll-contain`, Escape closes, focus moves to its close button on open) listing every link flat — no nested accordion, there isn't enough content to need one. (The nav previously also carried an amber "Offtaker & Brand Login" pill to `/dashboard`; removed when the B2B/ESG portal moved to the separate `forestos-ops` app. That app is NTZDC-internal only now, not a partner-facing destination, so this nav doesn't link to it at all.)

### Solution / offering pages ("Partners")

Every item in the "Partners" nav dropdown is a full solution page — the osapiens-depth template (hero → belt-totals stat strip → problem/solution framing → capability deep-dive → testimonial → FAQ → cross-suite promo → final CTA), built once as a shared, content-driven template rather than per-page bespoke markup. All 12 pages across the four partner segments (Brands & Offtakers, ESG & Corporate, Buyers, Creators & Artists) are now live; "Co-Branded Editions" (Creators) deliberately keeps pointing at the real `/launch` configurator instead of getting a duplicate templated page, since a working lead-gen form beats a generic description of one.

- **These are demo/sales pages, not the product.** Per direction: onboarding a real company means giving them dashboard access to their own data, not access to this site. Every solution page's FAQ says as much explicitly ("once your organization is onboarded, your team gets dashboard access scoped to your own data") rather than implying these pages themselves are where a customer would work.
- **Template:** `src/routes/solutions/SolutionPage.jsx` composes eight section components from `src/components/solutions/` (`SolutionHero`, `SolutionImpactStats`, `SolutionProblem`, `SolutionModules`, `SolutionTestimonial`, `SolutionFaq`, `SolutionCrossPromo`, `SolutionFinalCta`) around one `content` object. A new offering page is a content data file plus a five-line route wrapper (see `src/routes/solutions/EudrCompliance.jsx` + `src/data/solutions/eudrCompliance.js`) — the pattern all 11 other pages followed.
- **Register:** the same dark forest-950/forest-900 cinematic register as the rest of the site (Instrument Serif display, Archivo body, JetBrains Mono labels, amber accent), alternating `bg-forest-950`/`bg-forest-900` section-to-section for rhythm, each page's hero photo rotated across the five real forest-block images (`mau`, `aberdares`, `mt-kenya`, `cherangany`, `mt-elgon`) rather than reusing one shot everywhere — this is a *read* page (long-form, scrolled through once), not the home page's *descend-through* cinematic sequence, so there's no fixed video or scroll-triggered globe here, just a static full-bleed hero photo.
- **Honesty rules carried over from the rest of the site:** the belt-totals stat strip reuses the exact "· illustrative figures" disclosure `ImpactTicker` established; every testimonial is explicitly labelled "Illustrative — no live customer quote yet" (`SolutionTestimonial`) rather than presented as real; and where a page describes a mechanism that has no dedicated live screen (e.g. a creator's own commission split, which is a per-deal partnership term, not a published platform rate), the copy says so plainly instead of inventing a number and presenting it as fact.
- **CTA weight:** every hero and final-CTA "Request a Forest Edition" button uses the existing outline-amber pill, not a new filled `bg-amber-400` button, across all 12 pages — same restraint as the nav CTA, keeping the two named filled-amber buttons in the palette section the only ones site-wide.
- **Cross-promo is now a real nav, not a preview.** `SolutionCrossPromo` items carry a `to` and render as a `group`-hover `Link` with an arrow affordance; every page's cross-promo links to its actual segment siblings (built simultaneously so nothing points to a stub). The exemplar, `/solutions/eudr-compliance`, was the only page ever built with "Soon"-badged inert cross-promo items — that state no longer exists anywhere on the site.
- **Interactivity, kept restrained:** every section wraps its entrance in the existing `Reveal` component (blur-settle scroll-in, staggered by a small per-item `delay`) — no new animation pattern, just the same one `PartnerShowcase`/`ImpactSection` already use, applied here. Every page's hero and belt-totals numbers animate via `CountUp` (ported from reactbits.dev's text-animations/count-up in an earlier session, already reused by `ImpactTicker`/`BeltLedger`), not re-ported per page. The one genuinely new piece is `SpotlightCard` (`src/components/ui/SpotlightCard.jsx`, ported from reactbits.dev's SpotlightCard JS+Tailwind variant, zero new dependencies) — a cursor-tracking radial glow, recoloured from the source's white/neutral-900 default to this site's amber accent on `forest-900`/`bone-12` glass, applied only to each page's `SolutionModules` capability cards. Deliberately the page's one hover-interactive flourish rather than adding motion to every element — an FAQ accordion and CTA links stay plain.

### Signature Component: Spatial Hotspot
A 12px amber dot inside two concentric rings (translucent bone ring + itself), with a `motion-safe:animate-ping` amber halo, positioned absolutely by percentage over the fixed hero video. Tapping opens a `role="dialog"` glass popover (blur-settle-in via Framer Motion: `opacity`/`y`/`filter: blur` transition, `ease: [0.16,1,0.3,1]`) with a mono label, serif title, and body copy; closes on outside click or Escape. This is the build's one bespoke interaction pattern and should be reused verbatim for any future spatial point-of-interest marker rather than reinvented.

### Sponsoring brands, the Impact League, and the batch brand beat

`src/lib/brands.js` is the single source of truth for the brands that adopt belt blocks. `BRANDS` is keyed by `brandId` (one per block via `BELT_BLOCKS[].brandId`, and referenced by the literal `brandId` on each `batchChain` record); `STANDINGS` joins each brand to its block and ranks them by trees funded; `COP32` is the shared milestone. Only **Nyashinski Tea** (the Majani × Nyashinski collaboration, `blockId: 'mau'`) is a real brand with a product line, artist quote, campaign, product photography, and a per-pack conservation contribution; the other four are league-only placeholders.

The macro home's `PartnerShowcase` renders, inside the tea-pour video bleed: (1) `BrandFeature` — the lead brand as an asymmetric editorial panel, a warm product plate (`/media/brand/nyashinski-tin`, framed `rounded-2xl border-bone/15` inside the glass card) beside the name, the artist line as an Instrument Serif italic pull-quote, and an amber `#1 this quarter` pill; (2) `ImpactLeague` — every brand ranked, one `<button>` row each that flies the belt globe to that block (same parent-controlled `onExplore` path the old bento cards used), the leader carried by a faint `bg-amber-400/[0.06]` wash and an amber rank numeral + bar (not a `border-left`), everyone else on `bg-sage-500` bars; (3) `Cop32Milestone` — a countdown to a real fixed date (`useCountdown`, hourly tick) plus an amber pack-progress bar; (4) `EnablingPartners` — NTZDC / M-PESA Foundation / Sentinel-2 / Carrefour named in plain `dl` text, no logos.

The public batch view adds `BrandBeatSection` after Impact (see the video-bleed note): a `SectionIntro` head, then the brand identity (name + product +, when present, the artist quote), a "what this pack holds open" covenant readout with a `#proof` anchor back to the globe, a per-pack conservation-contribution figure row (distinct from the picker premium in `ImpactSection`), and `Cop32Milestone compact` with a one-line standings tie-in. A batch whose brand has no rich profile (e.g. the reference Rift Valley batch `802`) renders the lighter variant automatically — identity + covenant readout only, no plate, no contribution row, no milestone. `toLegacyBatch` carries `brandId`/`brand`/`product` and a `block` subset so the public batch object can drive all of this. The Nyashinski demo lives at `/batch/921`.

## The investor console (`/investor/*`)

A second, deliberately distinct visual system lives in this repo alongside
the public cinematic site: the ESG Capital / Conservation Investment
console for institutional investors, ESG fund managers, and conservation
finance partners (`src/routes/InvestorView.jsx`, components under
`src/components/investor/`). It is not the old `.dash` B2B portal this
section used to describe — that portal, and its separate `forestos-ops`
extraction, are both dead; `.dash`/`dash-root` remain unused legacy
scoping in `src/index.css`. The investor console is a fresh, independent
surface, built and then redesigned entirely within this repo.

**Creative North Star: "The Institutional Filing Cabinet"** — a dense,
credible SaaS finance dashboard in the register of Watershed, Persefoni,
and Addepar: clean data-viz-led panels, confident whitespace, restrained
semantic color, dense but legible tables and audit trails. This was chosen
explicitly as the category standard, played straight, over three more
conceptually distinctive rolled directions (an evidentiary-dossier
regulatory-filing register, a satellite/GIS instrument console, and an
abstract calibrated-rail/spectrogram register) — see
`.impeccable/surfaces/src-routes-investorview-jsx.md` for the full
direction contract and roll history. Deliberately part of the ForestOS
family (the leaf mark, the `forest-accent` green, Archivo/JetBrains Mono
carried over) rather than an unrelated sub-brand, but does not share the
public site's dark cinematic register, its Instrument Serif body voice, or
its amber accent — this is its own room.

**Key characteristics:**
- Light, cool canvas (`canvas` `#eef1ee`) — not the public site's warmer
  `paper`, not the dark `forest-950` ground. The one dark surface is the
  persistent left nav rail (`forest-950`), which gives the light canvas
  its contrast, and the Leaflet map, kept deliberately as a dark
  scientific-instrument "window" rather than flattened light.
- Sans-serif (Archivo) for every UI control, data point, badge, table
  cell, and section heading; Instrument Serif is reserved *only* for the
  page-level `<h1>` (the project name) — never section headings, never
  drawer/detail titles, never repeated chrome. This is a deliberate,
  tighter restriction than the public site's own serif/mono split.
- Every number is `font-sans font-bold tabular-nums`; real data-viz (line
  charts, trend sparklines, horizontal budget bars) does the work that a
  decorative stat card would otherwise fake.
- `forest-accent` (`#176b45`) is the one semantic accent for
  verified/active/positive state; `warning`/`danger` (and the existing
  `risk-low/medium/high` triad) cover watch and flagged states. No
  colored `border-left` on cards, list rows, or nav items — active/status
  state is carried by fill and weight, never a side stripe.
- Every card is `rounded-2xl border border-line bg-card shadow-card` —
  one card language reused identically for every entity type (evidence
  record, risk, governance role, report), so the console reads as one
  consistent filing system rather than a decorated dashboard.
- Demo data is disclosed everywhere (a persistent "Demo environment"
  badge at every breakpoint, "Demo data" badges per record) — this is a
  product-truth requirement (see `PRODUCT.md`), not a style choice, and
  must survive any future visual pass.

### Investor console components (`src/components/investor/ui/`)

Five reusable primitives carry the whole console; extend these rather than
writing a one-off card or button.

- **`Badge`**: `verified` / `live` / `warning` / `danger` / `neutral` tone pills — `rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase`, background+text pair per tone (never bare colored text for status).
- **`ActionButton`**: `ghost` (1px border, hover fill), `primary` (filled `forest-accent` pill), or `text` variant; renders a `<Link>` when given `to`. The only sanctioned button shape on this surface.
- **`ContentCard`**: `rounded-2xl border border-line bg-card shadow-card`; `interactive` adds `cursor-pointer hover:-translate-y-0.5 hover:border-forest-accent/40`. The one card wrapper — no ad-hoc bordered `div`s.
- **`StatCard`**: the one number-display primitive (`font-sans font-bold tabular-nums`, sizes `sm`–`xl`), optionally wrapping a `CountUp` and/or a `Sparkline` as `children`.
- **`Sparkline`**: a minimal inline SVG trend line (72×24, `currentColor` stroke) for a KPI tile's own real trend series — supplements the headline number, never stands in for it; always paired with an `aria-label` reading the series as text.

## Do's and Don'ts

### Do:
- **Do** keep the mono/serif split absolute on the public site: measured or identifying values in JetBrains Mono, narrated copy in Archivo/Instrument Serif.
- **Do** use the video-bleed + wash + glass-card pattern (see Named Rules) when a section needs to reprise the cinematic-descent feeling at a smaller scale — it is an established, repeated system pattern, not a hero-only device.
- **Do** honor `prefers-reduced-motion` for every animated primitive (video autoplay, scroll-scrub, reveal, hotspot ping, popover transition) by falling back to a static, legible state — every component in the build already does this and new components must match.
- **Do** keep amber to CTAs, active states, and provenance/money numerals on the public site; everything else stays on the forest/bone/sage neutral axis.
- **Do**, on the investor console, keep serif to the page-level `<h1>` only — every section heading, card title, drawer title, and data point is sans-serif, bold where it needs weight.
- **Do**, on the investor console, carry status/severity in fill and weight (a filled `Badge` pill, `font-bold`) rather than a colored side stripe — no `border-left`/`border-right` above 1px on any card, list row, or nav item.
- **Do**, on the investor console, back every headline number with real data-viz (a line chart, a trend `Sparkline`, a horizontal budget bar) rather than a bare stat card whenever a real series exists.

### Don't:
- **Don't** introduce a decorative kicker/eyebrow — a mono label above a heading purely for label effect, with no data payload of its own. A mono line above a heading is valid only when it carries a real, specific value (a count, a span, an ID, a status), and it renders in sage (public site) or `ink-faint` (investor console), never amber. `SectionIntro`'s `eyebrow` prop, and the investor console's `SectionHeading`, are for exactly this kind of readout — never a bare category label with no value.
- **Don't** add hard-offset/neobrutalist shadows or sharp corners anywhere in this repo. On the dark public site the system has exactly three soft glow/ambient shadow exceptions (hotspot dot, hotspot popover, macro-footer portal card) and no structural drop-shadow elevation elsewhere; on the investor console, `--shadow-card` is the one sanctioned ambient lift on every card.
- **Don't** widen `river-500` past the public site's verification data. It is the cool data accent (coordinates, "0% deforestation", HUD/impact metric lines) — never put it on a button, a heading, or narrative copy, and never add a third accent hue to the public site.
- **Don't** spread `slate-deep`/`slate-700` beyond the macro corporate-gateway footer. They exist only as the one-way forest → dashboard palette bridge; every other public-site ground is the forest scale.
- **Don't** use glyph icon fonts, Unicode arrows, or system display fonts anywhere in this repo; all icons and directional glyphs are Lucide SVG components (`ArrowRight`, `ArrowDown`, `ArrowUpRight`), and type is always a loaded webfont, never a system default.
- **Don't** reintroduce the dead `.dash`/`dash-root` B2B-portal treatment (paper canvas, emerald sidebar, role-switching shell, `sectorMapStyle.js`'s satellite-viewport chrome) — that entire surface and its components were deleted from this repo. The investor console at `/investor/*` is a separate, independently-designed system; it does not reuse `.dash`'s markup or its `bg-bone` light-portal styling, only a handful of overlapping token *values* (`card`, `line`, `ink`, etc. — see "The investor console").
- **Don't** put amber/orange on the investor console for anything that is not a semantic warning (`Badge tone="warning"`). Buttons, active nav/tab states, and positive deltas are `forest-accent` green; amber/orange means Watch / Flagged / pending.
- **Don't** blur the demo-data boundary on the investor console for visual cleanliness — the "Demo environment" badge and per-record "Demo data" badges are a product-truth requirement (see `PRODUCT.md`), not decoration, and must stay visible at every breakpoint.
