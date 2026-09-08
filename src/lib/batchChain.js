// ── Canonical batch provenance ───────────────────────────────────────────────
// One source of truth for a batch's Land → Block → Plot → Harvest → Batch →
// Processing chain. Both the buyer dashboard (Batch Lookup) and the public QR
// site read from here, each through `redactBatchRecord()` at its own level, so
// the chain is defined once rather than re-modelled per surface.
//
// PRIVACY: these records carry no farmer names, phone numbers, or IDs — only
// aggregate counts (`farmers`, `pluckers`). There is nothing personal to redact;
// redaction levels differ only in how much of the operational chain is exposed.
// Illustrative mock data; there is no ForestOS backend.

export const REDACTION = {
  // The public QR scan page: provenance and verification, coarse operational detail.
  public: { coords: 2, harvestDetail: false, lotIds: false, fullReference: false },
  // The buyer dashboard: the full chain, exact references, downloadable evidence.
  buyer: { coords: 3, harvestDetail: true, lotIds: true, fullReference: true },
}

const RECORDS = [
  {
    id: '802',
    channel: 'direct', // 'direct' = direct-sold / branded; 'auction' = auction pool
    brand: 'Rift Valley Tea Co.',
    product: 'Origin Series — First Flush',
    season: '2026 main crop',
    volumeKg: 1840,
    premiumKesPerKg: 14,
    protectedPerCup: '10 m²',
    hectaresPreserved: 3.2,
    carbonTonnesCo2: 141,
    land: {
      name: 'Mau Forest Complex',
      region: 'South West Mau',
      waterTowers: ['Mara', 'Sondu', 'Njoro'],
    },
    block: {
      id: 'KPT',
      name: 'Kiptunga Block',
      bufferZone: 'Mau Forest',
      region: 'Kiptunga Block, South West Mau',
      covenantHa: 3180,
      patrolsThisMonth: 11,
      seedlingsPlanted: 4200,
    },
    plot: {
      id: 'MAU-KPT-0802',
      centre: 'Kiptunga Collection Centre',
      lat: -0.415,
      lon: 35.618,
      areaHa: 4.1,
      canopyBaseline2020Pct: 66,
      canopyNowPct: 71,
      ndvi: 0.71,
      farmers: 38,
    },
    harvest: {
      window: '2026-08-18 – 2026-08-24',
      month: 'August 2026',
      greenLeafKg: 8200,
      pluckers: 1240,
    },
    batch: { sealedAt: '2026-08-26', madeTeaKg: 1840, grade: 'BP1' },
    processing: {
      facility: 'Kiptunga Tea Factory',
      lotId: 'KTF-2026-0802',
      processedAt: '2026-08-27',
      method: 'CTC · 14 h withering',
    },
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: 'Verified',
      timestamp: '2026-08-29 14:02 EAT',
      reference: '0x7b4c9e1a2f8d6035',
      field: { status: 'Verified', date: '2026-08-20', by: 'NTZDC field officer' },
      satellite: { status: 'Verified', date: '2026-08-29', source: 'Sentinel-2 L2A', baseline: '2020-12-31' },
    },
    community: { farmersRepresented: 38, womenPluckersPct: 61, paidMobileMoneyPct: 100, settledSameWeekPct: 92 },
  },
  {
    id: '774',
    channel: 'direct',
    brand: 'Rift Valley Tea Co.',
    product: 'Origin Series — Highland Reserve',
    season: '2026 main crop',
    volumeKg: 1520,
    premiumKesPerKg: 13.6,
    protectedPerCup: '9 m²',
    hectaresPreserved: 2.6,
    carbonTonnesCo2: 118,
    land: {
      name: 'Mau Forest Complex',
      region: 'South West Mau',
      waterTowers: ['Sondu', 'Yala'],
    },
    block: {
      id: 'NES',
      name: 'Nessuit Block',
      bufferZone: 'Mau Forest',
      region: 'Nessuit Block, South West Mau',
      covenantHa: 2440,
      patrolsThisMonth: 8,
      seedlingsPlanted: 3100,
    },
    plot: {
      id: 'MAU-NES-0774',
      centre: 'Nessuit Collection Centre',
      lat: -0.523,
      lon: 35.702,
      areaHa: 3.4,
      canopyBaseline2020Pct: 61,
      canopyNowPct: 64,
      ndvi: 0.64,
      farmers: 29,
    },
    harvest: {
      window: '2026-08-11 – 2026-08-17',
      month: 'August 2026',
      greenLeafKg: 6800,
      pluckers: 880,
    },
    batch: { sealedAt: '2026-08-19', madeTeaKg: 1520, grade: 'PF1' },
    processing: {
      facility: 'Nessuit Tea Factory',
      lotId: 'NTF-2026-0774',
      processedAt: '2026-08-20',
      method: 'CTC · 16 h withering',
    },
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: 'Verified',
      timestamp: '2026-08-22 09:40 EAT',
      reference: '0x2f19ac83b7e04d5c',
      field: { status: 'Verified', date: '2026-08-13', by: 'NTZDC field officer' },
      satellite: { status: 'Verified', date: '2026-08-22', source: 'Sentinel-2 L2A', baseline: '2020-12-31' },
    },
    community: { farmersRepresented: 29, womenPluckersPct: 57, paidMobileMoneyPct: 100, settledSameWeekPct: 88 },
  },
  {
    id: '618',
    channel: 'direct',
    brand: 'Highland Leaf Collective',
    product: 'Single-Origin Aberdare',
    season: '2026 main crop',
    volumeKg: 980,
    premiumKesPerKg: 12.4,
    protectedPerCup: '8 m²',
    hectaresPreserved: 1.7,
    carbonTonnesCo2: 74,
    land: {
      name: 'Aberdare Range',
      region: 'Central Highlands',
      waterTowers: ['Tana', 'Ewaso Ng’iro'],
    },
    block: {
      id: 'WAN',
      name: 'Wanjohi Block',
      bufferZone: 'Aberdare Forest',
      region: 'Wanjohi Block, Aberdare Range',
      covenantHa: 1680,
      patrolsThisMonth: 6,
      seedlingsPlanted: 1900,
    },
    plot: {
      id: 'ABD-WAN-0618',
      centre: 'Wanjohi Collection Centre',
      lat: -0.402,
      lon: 36.612,
      areaHa: 2.2,
      canopyBaseline2020Pct: 70,
      canopyNowPct: 74,
      ndvi: 0.72,
      farmers: 21,
    },
    harvest: {
      window: '2026-08-04 – 2026-08-10',
      month: 'August 2026',
      greenLeafKg: 4300,
      pluckers: 540,
    },
    batch: { sealedAt: '2026-08-12', madeTeaKg: 980, grade: 'BP1' },
    processing: {
      facility: 'Wanjohi Tea Factory',
      lotId: 'WTF-2026-0618',
      processedAt: '2026-08-13',
      method: 'CTC · 12 h withering',
    },
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: 'Verified',
      timestamp: '2026-08-16 11:07 EAT',
      reference: '0x9d3e70c1a45f28b6',
      field: { status: 'Verified', date: '2026-08-06', by: 'NTZDC field officer' },
      satellite: { status: 'Verified', date: '2026-08-16', source: 'Sentinel-2 L2A', baseline: '2020-12-31' },
    },
    community: { farmersRepresented: 21, womenPluckersPct: 64, paidMobileMoneyPct: 100, settledSameWeekPct: 95 },
  },
  {
    id: '540',
    channel: 'direct',
    brand: 'Rift Valley Tea Co.',
    product: 'Origin Series — Mount Kenya',
    season: '2026 early crop',
    volumeKg: 1310,
    premiumKesPerKg: 12.0,
    protectedPerCup: '8 m²',
    hectaresPreserved: 2.1,
    carbonTonnesCo2: 92,
    land: {
      name: 'Mount Kenya Forest',
      region: 'Central Highlands',
      waterTowers: ['Tana', 'Ewaso Ng’iro'],
    },
    block: {
      id: 'KAN',
      name: 'Kangaita Block',
      bufferZone: 'Mount Kenya Forest',
      region: 'Kangaita Block, Mount Kenya East',
      covenantHa: 2960,
      patrolsThisMonth: 10,
      seedlingsPlanted: 2600,
    },
    plot: {
      id: 'MTK-KAN-0540',
      centre: 'Kangaita Collection Centre',
      lat: -0.489,
      lon: 37.291,
      areaHa: 3.0,
      canopyBaseline2020Pct: 63,
      canopyNowPct: 68,
      ndvi: 0.68,
      farmers: 26,
    },
    harvest: {
      window: '2026-07-21 – 2026-07-27',
      month: 'July 2026',
      greenLeafKg: 5900,
      pluckers: 720,
    },
    batch: { sealedAt: '2026-07-29', madeTeaKg: 1310, grade: 'PD' },
    processing: {
      facility: 'Kangaita Tea Factory',
      lotId: 'KGT-2026-0540',
      processedAt: '2026-07-30',
      method: 'CTC · 15 h withering',
    },
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: 'Verified',
      timestamp: '2026-08-02 08:15 EAT',
      reference: '0x51b8fe26d9c37a04',
      field: { status: 'Verified', date: '2026-07-23', by: 'NTZDC field officer' },
      satellite: { status: 'Verified', date: '2026-08-02', source: 'Sentinel-2 L2A', baseline: '2020-12-31' },
    },
    community: { farmersRepresented: 26, womenPluckersPct: 59, paidMobileMoneyPct: 100, settledSameWeekPct: 90 },
  },
  {
    // Auction-pool volume — deliberately NOT branded. Batch Lookup rejects it.
    id: 'AUC-4471',
    channel: 'auction',
    brand: null,
    product: 'Mombasa auction lot',
    season: '2026 main crop',
    volumeKg: 5400,
    premiumKesPerKg: 0,
    protectedPerCup: null,
    hectaresPreserved: null,
    carbonTonnesCo2: null,
    land: { name: 'Mixed origin', region: 'Rift Valley', waterTowers: [] },
    block: { id: 'MIX', name: 'Pooled', bufferZone: '—', region: 'Multiple blocks', covenantHa: 0, patrolsThisMonth: 0, seedlingsPlanted: 0 },
    plot: { id: '—', centre: 'Multiple', lat: 0, lon: 0, areaHa: 0, canopyBaseline2020Pct: 0, canopyNowPct: 0, ndvi: 0, farmers: 0 },
    harvest: { window: '—', month: '—', greenLeafKg: 0, pluckers: 0 },
    batch: { sealedAt: '—', madeTeaKg: 5400, grade: 'mixed' },
    processing: { facility: 'Multiple factories', lotId: '—', processedAt: '—', method: '—' },
    verification: {
      standard: '—',
      status: 'Not tracked',
      timestamp: '—',
      reference: '—',
      field: { status: 'Not tracked', date: '—', by: '—' },
      satellite: { status: 'Not tracked', date: '—', source: '—', baseline: '—' },
    },
    community: { farmersRepresented: 0, womenPluckersPct: 0, paidMobileMoneyPct: 0, settledSameWeekPct: 0 },
  },
]

export const BATCH_CHAIN = RECORDS

/** Only direct-sold / branded batches — the buyer surfaces never show auction volume. */
export function brandedBatches() {
  return RECORDS.filter((r) => r.channel === 'direct')
}

/** Case-insensitive id lookup across the whole chain (branded and auction). */
export function findBatchRecord(batchId) {
  if (!batchId) return null
  const q = String(batchId).trim().toUpperCase().replace(/^#/, '')
  return RECORDS.find((r) => r.id.toUpperCase() === q) ?? null
}

const roundCoord = (n, dp) => Number(n.toFixed(dp))
const shortRef = (ref) => (ref.length > 12 ? `${ref.slice(0, 6)}…${ref.slice(-4)}` : ref)

/**
 * Project a canonical record to one redaction level. Returns the chain as an
 * ordered list of stages (each with label, title, rows and optional verification
 * badge keys) plus a verification summary — the shape `BatchProvenanceChain`
 * renders regardless of surface.
 */
export function redactBatchRecord(record, level = 'public') {
  const cfg = REDACTION[level] ?? REDACTION.public
  const { land, block, plot, harvest, batch, processing, verification } = record
  const coords = `${Math.abs(plot.lat).toFixed(cfg.coords)}° ${plot.lat < 0 ? 'S' : 'N'}, ${plot.lon.toFixed(cfg.coords)}° E`

  const stages = [
    {
      key: 'land',
      label: 'Land',
      title: land.name,
      rows: [
        { k: 'Region', v: land.region },
        land.waterTowers.length ? { k: 'Water towers', v: land.waterTowers.join(' · ') } : null,
      ].filter(Boolean),
    },
    {
      key: 'block',
      label: 'Block',
      title: block.name,
      rows: [
        { k: 'Buffer zone', v: block.bufferZone },
        { k: 'Covenant area', v: block.covenantHa ? `${block.covenantHa.toLocaleString()} ha` : '—' },
      ],
    },
    {
      key: 'plot',
      label: 'Plot',
      title: plot.id,
      badges: ['field', 'satellite'],
      rows: [
        { k: 'Collection centre', v: plot.centre },
        { k: 'Coordinates', v: coords },
        { k: 'Plot area', v: plot.areaHa ? `${plot.areaHa} ha` : '—' },
        { k: 'Canopy 2020 → now', v: `${plot.canopyBaseline2020Pct}% → ${plot.canopyNowPct}%` },
        { k: 'Farmers on plot', v: `${plot.farmers} (count only)` },
      ],
    },
    {
      key: 'harvest',
      label: 'Harvest',
      title: cfg.harvestDetail ? harvest.window : harvest.month,
      rows: [
        { k: 'Green leaf received', v: `${harvest.greenLeafKg.toLocaleString()} kg` },
        { k: 'Pluckers', v: `${harvest.pluckers.toLocaleString()} (count only)` },
      ],
    },
    {
      key: 'batch',
      label: 'Batch',
      title: `#${record.id}`,
      rows: [
        { k: 'Sealed', v: batch.sealedAt },
        { k: 'Made tea', v: `${batch.madeTeaKg.toLocaleString()} kg` },
        { k: 'Grade', v: batch.grade },
      ],
    },
    {
      key: 'processing',
      label: 'Processing',
      title: processing.facility,
      rows: [
        cfg.lotIds ? { k: 'Lot ID', v: processing.lotId } : null,
        cfg.harvestDetail ? { k: 'Processed', v: processing.processedAt } : null,
        { k: 'Method', v: processing.method },
      ].filter(Boolean),
    },
  ]

  return {
    id: record.id,
    channel: record.channel,
    branded: record.channel === 'direct',
    brand: record.brand,
    product: record.product,
    stages,
    verification: {
      standard: verification.standard,
      status: verification.status,
      timestamp: verification.timestamp,
      reference: cfg.fullReference ? verification.reference : shortRef(verification.reference),
      field: verification.field,
      satellite: verification.satellite,
    },
  }
}

/**
 * The legacy flat `BATCH` shape the public QR sections still expect. Derived from
 * the canonical record so `lib/mock.js` no longer hand-maintains its own copy.
 */
export function toLegacyBatch(record) {
  return {
    id: record.id,
    bufferZone: record.block.bufferZone,
    region: record.block.region,
    protectedPerCup: record.protectedPerCup,
    hectaresPreserved: record.hectaresPreserved == null ? null : String(record.hectaresPreserved),
    sourcedVolumeKg: record.volumeKg,
    sourcedVolumeLabel: `${record.volumeKg.toLocaleString()} kg made tea`,
    pluckerPremiumKesPerKg: record.premiumKesPerKg,
    collectionCentre: {
      name: record.plot.centre,
      lon: roundCoord(record.plot.lon, 3),
      lat: roundCoord(record.plot.lat, 3),
      pluckers: record.harvest.pluckers,
    },
    verification: {
      standard: record.verification.standard,
      status: record.verification.status,
      timestamp: record.verification.timestamp,
      plotId: record.plot.id,
      reference: record.verification.reference,
    },
  }
}
