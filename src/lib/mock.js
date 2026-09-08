// All data on this page is mocked — there is no ForestOS backend yet.
// Values, coordinates, hashes and timestamps are illustrative placeholders.

import { BATCH_CHAIN, findBatchRecord, isNonAuction, toLegacyBatch } from './batchChain'

// The public QR page only ever renders a branded / direct-sold retail batch —
// never an auction lot — so its resolver ignores auction records.
function findPublicBatch(batchId) {
  const record = findBatchRecord(batchId)
  return record && isNonAuction(record.channel) ? record : null
}

// The reference batch, projected from the shared canonical chain
// (`lib/batchChain.js`) that also feeds the buyer dashboard. The flat shape
// here is the public-site contract the QR sections read.
export const BATCH = toLegacyBatch(BATCH_CHAIN[0])

// Camera target: South West Mau, above the Kiptunga / Kilombe ridge line.
export const MAU_VIEW = {
  lon: 35.56,
  lat: -0.62,
  height: 185000,
  pitchDeg: -52,
  headingDeg: 12,
}

// Scroll-triggered camera flight for the #proof section: a high, near-vertical
// look at the Great Rift Valley that dives to a tilted framing of Kiptunga.
export const PROOF_FLIGHT = {
  start: { lon: 35.8, lat: -0.5, height: 200000, pitchDeg: -85, headingDeg: 0 },
  target: { lon: 35.72, lat: -0.245, height: 8500, pitchDeg: -35, headingDeg: 15 },
  durationSec: 2.5,
}

// Interactive focus points shown as chips over the globe HUD. Each carries the
// tilted camera framing used on click plus mock "live" plot telemetry.
export const GLOBE_FOCI = [
  {
    id: 'collection-centre',
    icon: 'pin',
    label: 'Collection Centre',
    view: { lon: 35.618, lat: -0.415, height: 5200, pitchDeg: -38, headingDeg: 8 },
    telemetry: {
      elevation: '2,120 m ASL',
      place: 'Mau Forest Escarpment',
      coordinates: '0.415° S · 35.618° E',
      group: 'Kiptunga Community Forest Association',
      monitor: '0% Deforestation Detected',
      source: 'Sentinel-2 L2A · 2026-08-29',
    },
  },
  {
    id: 'reforestation-plot-4',
    icon: 'trees',
    label: 'Reforestation Plot #4',
    view: { lon: 35.735, lat: -0.688, height: 4200, pitchDeg: -34, headingDeg: 22 },
    telemetry: {
      elevation: '2,405 m ASL',
      place: 'Retired plot MAU-KPT-04, South West Mau',
      coordinates: '0.688° S · 35.735° E',
      group: 'Kiptunga CFA — Plot 4 restoration crew',
      monitor: '0% Deforestation Detected',
      source: 'Sentinel-2 L2A · 2026-08-27',
    },
  },
  {
    id: 'water-catchment',
    icon: 'droplet',
    label: 'Water Catchment Headwaters',
    view: { lon: 35.6, lat: -0.3, height: 6000, pitchDeg: -36, headingDeg: -6 },
    telemetry: {
      elevation: '2,760 m ASL',
      place: 'Fog belt — Mara & Sondu headwaters',
      coordinates: '0.300° S · 35.600° E',
      group: 'Enapuiyapui swamp catchment guard',
      monitor: '0% Deforestation Detected',
      source: 'Sentinel-2 L2A · 2026-08-28',
    },
  },
]

// Rough ring around the South West Mau block used for the recovery overlay.
export const MAU_BLOCK_RING = [
  35.30, -0.30,
  35.78, -0.24,
  35.98, -0.66,
  35.74, -1.02,
  35.30, -0.92,
  35.14, -0.58,
]

// Mosaic patches that flip from cleared ground (2015) to regrown canopy (today).
export const RECOVERY_PATCHES = [
  { id: 'p1', ring: [35.40, -0.40, 35.56, -0.37, 35.58, -0.55, 35.41, -0.58] },
  { id: 'p2', ring: [35.60, -0.33, 35.78, -0.35, 35.75, -0.53, 35.59, -0.49] },
  { id: 'p3', ring: [35.46, -0.60, 35.65, -0.63, 35.62, -0.84, 35.44, -0.80] },
  { id: 'p4', ring: [35.66, -0.58, 35.82, -0.60, 35.80, -0.80, 35.65, -0.77] },
  { id: 'p5', ring: [35.30, -0.55, 35.42, -0.53, 35.44, -0.72, 35.31, -0.74] },
]

export const ERAS = {
  2015: {
    key: '2015',
    label: '2015',
    caption: 'Encroachment front — cleared plots along the block boundary.',
    canopyCoverPct: 41,
  },
  today: {
    key: 'today',
    label: 'Today',
    caption: 'Regrowth on retired plots after the buffer covenant.',
    canopyCoverPct: 63,
  },
}

export const HOTSPOTS = [
  {
    id: 'water-tower',
    x: 27,
    y: 29,
    label: 'FOG BELT · 2,600 m',
    title: 'Water Tower Ecosystem',
    body: 'Feeds 5 major rivers — the Mara, Sondu, Njoro, Ewaso Ng’iro and Yala.',
  },
  {
    id: 'canopy',
    x: 69,
    y: 44,
    label: 'CONTIGUOUS CANOPY',
    title: 'Mau Forest Buffer',
    body: '940 km contiguous protection belt along the forest edge.',
  },
  {
    id: 'farms',
    x: 84,
    y: 66,
    label: 'BUFFER-EDGE FARMS',
    title: 'Smallholder Tea Line',
    body: '1,240 pluckers farm the 3 km strip that keeps the forest boundary legible.',
  },
]

/**
 * Resolve a `:batchId` route param to a batch record. There is only one mock
 * batch, so an unknown id reuses its figures under the scanned id rather than
 * 404-ing — the prototype has no backend to look anything up in.
 */
export function resolveBatch(batchId) {
  if (!batchId || batchId === BATCH.id) return BATCH
  const record = findPublicBatch(batchId)
  if (record) return toLegacyBatch(record)
  const id = batchId.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16) || BATCH.id
  return {
    ...BATCH,
    id,
    verification: { ...BATCH.verification, plotId: `MAU-KPT-${id}` },
  }
}

export const IMPACT = {
  preserved: {
    value: '3.2',
    unit: 'hectares',
    headline: '3.2 hectares preserved in Batch #802',
    body: 'Held under a conservation covenant on the South West Mau boundary for the life of this batch.',
    ofFarmHectares: 5.0,
  },
  farmer: {
    headline: 'Direct plucker premium paid',
    body: 'KES 14 per kilo above the Mombasa auction clearing price — paid to the picker, not recovered at the auction discount.',
    flow: ['Plucker', 'Cooperative', 'Your cup'],
    bypass: 'Auction discount',
  },
  transparency: {
    badge: 'EUDR Deforestation-Free — Verified',
    body: 'Geolocated plot checked against the 2020 forest baseline.',
    timestamp: '2026-08-29 14:02 EAT',
    plotId: 'MAU-KPT-0802',
    reference: '0x7b4c9e1a2f8d6035',
  },
}
