// ── Nyashinski × Majani × ForestOS — cultural campaign experience ──────────
// The data layer for `/majani/nyashinski` (`src/routes/MajaniNyashinski.jsx`).
// Isolated from the other three systems already covering related ground in
// this repo (`src/qrExperience/`, `src/nyashinski/`, `src/routes/
// TenantPassportView.jsx` + `src/lib/tenants.js`'s `TENANTS.majani`) —
// this file does not import from or modify any of them. It sources the same
// underlying real records directly instead, so this route's fate is not
// coupled to the demo-only `nyashinski-forest` prototype.
//
// Every figure below is either a real, already-approved project fact
// (traced to `findBatchRecord`, `BRANDS.nyashinski`, `BELT_BLOCKS`, `COP32`)
// or explicitly marked `demo: true` where no real backend counter exists yet
// (community/guardian participation counts). Nothing here is invented and
// presented as fact — see each section's comment for its source.

import { findBatchRecord } from '../lib/batchChain'
import { BRANDS, COP32 } from '../lib/brands'
import { BELT_BLOCKS } from '../lib/platformData'

const batch = findBatchRecord('921')
const brand = BRANDS.nyashinski
const mauBlock = BELT_BLOCKS.find((b) => b.id === 'mau')

// The one verified real link for this campaign — reused verbatim from
// `src/qrExperience/data.js` and `src/nyashinski/data.js`, where it's
// already confirmed as Nyashinski's real Spotify artist profile. No specific
// track/song title exists anywhere in this repo's data, so none is invented
// here — the "listen" beat points at the artist page, not a fake single.
export const SPOTIFY_ARTIST_URL = 'https://open.spotify.com/artist/7KY9NaOVRmptl8vlpVomi6'

/** @type {import('./types').NyashinskiExperience} */
export const experienceData = {
  artist: {
    name: 'Nyashinski',
    line: brand.line, // "Good music grows better forests."
    campaign: brand.campaign, // "Road to COP32"
    spotifyUrl: SPOTIFY_ARTIST_URL,
    // No real narration/track audio file exists in this repo (confirmed:
    // zero .mp3/.wav/.m4a anywhere). Framed honestly as a message, matching
    // the same honest pattern `src/nyashinski/AudioToggle.jsx` established
    // — never presented as in-app streaming.
    messageLabel: "Nyashinski's message",
  },

  track: {
    // Deliberately no invented song title — see `artist.spotifyUrl` above.
    product: brand.product, // "I.D TAICHI — The Guardian Edition"
    retail: brand.retail, // "Carrefour Kenya"
  },

  origin: {
    batchId: batch.id,
    traceId: batch.traceId,
    product: batch.product,
    landmark: batch.land.name, // "Mau Forest Complex"
    region: batch.land.region, // "South West Mau"
    waterTowers: batch.land.waterTowers,
    block: batch.block.name, // "Mariashoni Block"
    collectionCentre: batch.plot.centre,
    farmersRepresented: batch.community.farmersRepresented,
    harvestWindow: batch.harvest.window,
    originPhoto: '/media/forests/mau.webp',
    originPhotoFallback: '/media/forests/mau.jpg',
  },

  conservation: {
    hectaresPreserved: batch.hectaresPreserved,
    carbonTonnesCo2: batch.carbonTonnesCo2,
    covenantHa: batch.block.covenantHa,
    patrolsThisMonth: batch.block.patrolsThisMonth,
    seedlingsPlanted: batch.block.seedlingsPlanted,
    canopyBaselinePct: batch.plot.canopyBaseline2020Pct,
    canopyNowPct: batch.plot.canopyNowPct,
  },

  verification: {
    standard: batch.verification.standard, // "EUDR — Deforestation-Free"
    status: batch.verification.status,
    reference: batch.verification.reference,
    verifiedAt: batch.verification.timestamp,
    field: batch.verification.field,
    satellite: batch.verification.satellite,
    proofUrl: `/batch/${batch.id}`, // the real, already-built full proof map
  },

  climate: {
    // COP32 is context ForestOS/Nyashinski are working toward, not a
    // confirmed official partnership — see COPY.climateDisclaimer below,
    // which every climate-facing screen must carry.
    host: COP32.label, // "Addis Ababa, Ethiopia"
    dateLabel: COP32.dateLabel, // "November 2027" — no specific day is confirmed
    packsGoal: COP32.packsGoal,
    packsNow: COP32.packsNow,
    treesAtGoal: COP32.treesAtGoal,
    treesFundedSoFar: brand.treesFunded,
  },

  community: {
    // Real: total trees funded by this brand, and the real counties behind
    // its block (same source `src/nyashinski/data.js`'s leaderboard uses).
    treesFunded: brand.treesFunded,
    counties: mauBlock?.counties ?? [],
    // Demo: no scan/guardian counter exists in this repo yet — no backend.
    // Every field below is illustrative and rendered with a visible demo
    // marker; never presented as a live count.
    demo: true,
    demoScans: 8_412,
    demoGuardians: 1_926,
    demoConservationActions: 214,
    demoTopGuardianRegions: (mauBlock?.counties ?? []).slice(0, 3).map((county, i) => ({
      region: county,
      // Same illustrative-split convention as `getShinskiForestLeaderboard`
      // in `src/nyashinski/data.js` — a plausible share of the real total,
      // not a real per-county ledger (none exists).
      guardians: Math.round([420, 310, 190][i] ?? 0),
    })),
  },

  guardian: {
    tierLabel: 'Guardian', // matches the real product name "...Guardian Edition"
    editionName: 'The Guardian Edition',
  },
}

// Participation model — structure only, per the build brief: point values
// are recorded here so a future full gamification pass has a stable shape
// to build against, but the first build surfaces them lightly (a single
// "how you become a Guardian" list), not a scored ledger.
export const PARTICIPATION_POINTS = {
  scan: 1,
  joinCommunity: 5,
  conservationEvent: 20,
  verifiedConservationAction: 50,
}

export const COPY = {
  climateDisclaimer:
    'Inspired by the road to COP32 — not an official COP32 or Spotify partnership.',
}
