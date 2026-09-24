// ── Canonical batch provenance ───────────────────────────────────────────────
// A batch's Land → Block → Plot → Harvest → Batch → Processing chain, read
// through `redactBatchRecord()` at the public redaction level. This file is
// forked from the same source in `forestos-ops` (the buyer dashboard's Batch
// Lookup reads its own copy at the fuller `buyer` redaction level) — the two
// systems are allowed to diverge; nothing here syncs back.
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

// Channels the buyer / consumer surfaces are allowed to show (never 'auction').
// Per ForestOS Responses: Phase 1 priority is branded / value-added / direct-sold
// / specific-offtaker tea; auction volume is out of scope until later.
const NON_AUCTION = new Set(['direct_sold', 'branded'])
export const isNonAuction = (channel) => NON_AUCTION.has(channel)

// What each public claim rests on (audit gap #3). Data only: the public
// pages render exactly as before. `status: 'method_pending'` means the
// figure is illustrative and has no agreed allocation method yet; a public
// projection must not present it as verified until that changes. The
// per-batch carbon figure was removed: no methodology, baseline or verifier
// exists for it.
export const PUBLIC_CLAIM_BASIS = {
  hectaresPreserved: { method: 'Covenant area allocated to the batch — allocation rule not yet agreed', source: 'Demo data', status: 'method_pending' },
  protectedPerCup: { method: 'Covenant area divided by cups per batch — allocation rule not yet agreed', source: 'Demo data', status: 'method_pending' },
  premiumKesPerKg: { method: 'Conservation premium per kg — commercial split not yet agreed with NTZDC', source: 'Demo data', status: 'method_pending' },
  eudrStatus: { method: 'Requires a due-diligence statement against the 2020 forest baseline', source: 'Demo data', status: 'method_pending' },
}

const RECORDS = [
  {
    id: '802', // short retail code carried on the pack / QR
    traceId: 'TL-2026-00482', // full production trace id (dashboard + contract layer)
    sectorPlotId: 'KIP-09', // the SW-MAU sector-map plot this batch was pressed from
    channel: 'branded', // 'direct_sold' | 'branded' | 'auction'
    brand: 'Rift Valley Tea Co.',
    brandId: 'riftValley', // → lib/brands.js BRANDS (public brand-beat + belt standings)
    product: 'Origin Series — First Flush',
    season: '2026 main crop',
    volumeKg: 1840,
    premiumKesPerKg: 14,
    protectedPerCup: '10 m²',
    hectaresPreserved: 3.2,
    settlementDays: 4,
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
    traceId: 'TL-2026-00461',
    sectorPlotId: 'NES-10',
    channel: 'branded',
    brand: 'Rift Valley Tea Co.',
    brandId: 'riftValley',
    product: 'Origin Series — Highland Reserve',
    season: '2026 main crop',
    volumeKg: 1520,
    premiumKesPerKg: 13.6,
    protectedPerCup: '9 m²',
    hectaresPreserved: 2.6,
    settlementDays: 5,
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
    // The consumer / artist collaboration batch — the public QR-scan demo pairs
    // with this one (`/batch/921`). It sits in South West Mau like 802 so the
    // public globe's fixed Kiptunga dive still reads true; `sectorPlotId` is
    // null so it stays out of the dashboard's SW-MAU sector roll-up.
    id: '921',
    traceId: 'TL-2026-00521',
    sectorPlotId: null,
    channel: 'branded',
    brand: 'Nyashinski Tea',
    brandId: 'nyashinski',
    product: 'I.D TAICHI — The Guardian Edition',
    season: '2026 main crop',
    volumeKg: 1660,
    premiumKesPerKg: 15,
    protectedPerCup: '11 m²',
    hectaresPreserved: 3.0,
    settlementDays: 4,
    land: {
      name: 'Mau Forest Complex',
      region: 'South West Mau',
      waterTowers: ['Mara', 'Sondu', 'Ewaso Ng’iro'],
    },
    block: {
      id: 'MAR',
      name: 'Mariashoni Block',
      bufferZone: 'Mau Forest',
      region: 'Mariashoni Block, South West Mau',
      covenantHa: 2870,
      patrolsThisMonth: 12,
      seedlingsPlanted: 3800,
    },
    plot: {
      id: 'MAU-MAR-0921',
      centre: 'Mariashoni Collection Centre',
      lat: -0.552,
      lon: 35.548,
      areaHa: 3.7,
      canopyBaseline2020Pct: 64,
      canopyNowPct: 70,
      ndvi: 0.7,
      farmers: 33,
    },
    harvest: {
      window: '2026-08-19 – 2026-08-25',
      month: 'August 2026',
      greenLeafKg: 7400,
      pluckers: 1010,
    },
    batch: { sealedAt: '2026-08-27', madeTeaKg: 1660, grade: 'BP1' },
    processing: {
      facility: 'Mariashoni Tea Factory',
      lotId: 'MTF-2026-0921',
      processedAt: '2026-08-28',
      method: 'CTC · 14 h withering',
    },
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: 'Verified',
      timestamp: '2026-08-30 15:18 EAT',
      reference: '0x3ac41f9e7b25d086',
      field: { status: 'Verified', date: '2026-08-21', by: 'NTZDC field officer' },
      satellite: { status: 'Verified', date: '2026-08-30', source: 'Sentinel-2 L2A', baseline: '2020-12-31' },
    },
    community: { farmersRepresented: 33, womenPluckersPct: 63, paidMobileMoneyPct: 100, settledSameWeekPct: 94 },
  },
  {
    // The second tenant-owned experience (`/qr-experience/rangers`). Edwin's
    // point was that a scanner arrives as a fan, a supporter, a guest — not as
    // a "consumer" — so the prototype needs a non-music community to prove the
    // front end is swappable while this record underneath it is not.
    //
    // Kapsara Rangers FC is deliberately fictional. A real club's name and
    // badge on a mock conservation record would be a false claim about a real
    // organisation, and this prototype gets shown outside the team.
    //
    // Cherangany Hills, so the pair of consumer experiences also shows the
    // belt is more than one forest block.
    id: '733',
    traceId: 'TL-2026-00604',
    sectorPlotId: null, // Cherangany Hills — outside the SW-MAU sector map
    channel: 'branded',
    brand: 'Kapsara Rangers FC',
    brandId: null, // a tenant front end, not a belt-standings block sponsor
    product: 'Matchday Tin — Supporters’ Edition',
    season: '2026 main crop',
    volumeKg: 1180,
    premiumKesPerKg: 13,
    protectedPerCup: '9 m²',
    hectaresPreserved: 2.1,
    carbonTonnesCo2: 84,
    settlementDays: 6,
    land: {
      name: 'Cherangany Hills',
      region: 'Cherangany Escarpment',
      waterTowers: ['Nzoia', 'Kerio'],
    },
    block: {
      id: 'KAP',
      name: 'Kapsara Block',
      bufferZone: 'Cherangany Forest',
      region: 'Kapsara Block, Cherangany Escarpment',
      covenantHa: 1490,
      patrolsThisMonth: 7,
      seedlingsPlanted: 2100,
    },
    plot: {
      id: 'CHE-KAP-0733',
      centre: 'Kapsara Collection Centre',
      lat: 1.042,
      lon: 35.402,
      areaHa: 2.8,
      canopyBaseline2020Pct: 59,
      canopyNowPct: 66,
      ndvi: 0.66,
      farmers: 27,
    },
    harvest: {
      window: '2026-08-11 – 2026-08-17',
      month: 'August 2026',
      greenLeafKg: 5300,
      pluckers: 740,
    },
    batch: { sealedAt: '2026-08-20', madeTeaKg: 1180, grade: 'PF1' },
    processing: {
      facility: 'Kapsara Tea Factory',
      lotId: 'KTF-2026-0733',
      processedAt: '2026-08-21',
      method: 'CTC · 12 h withering',
    },
    verification: {
      standard: 'EUDR — Deforestation-Free',
      status: 'Verified',
      timestamp: '2026-08-24 11:02 EAT',
      reference: '0x9d17b4e2c8a05f31',
      field: { status: 'Verified', date: '2026-08-13', by: 'NTZDC field officer' },
      satellite: { status: 'Verified', date: '2026-08-24', source: 'Sentinel-2 L2A', baseline: '2020-12-31' },
    },
    community: { farmersRepresented: 27, womenPluckersPct: 58, paidMobileMoneyPct: 100, settledSameWeekPct: 91 },
  },
  {
    id: '618',
    traceId: 'TL-2026-00388',
    sectorPlotId: null, // Aberdare Range — outside the SW-MAU sector map
    channel: 'direct_sold',
    brand: 'Highland Leaf Collective',
    brandId: null, // no rich brand profile — brand-beat renders the minimal variant
    product: 'Single-Origin Aberdare',
    season: '2026 main crop',
    volumeKg: 980,
    premiumKesPerKg: 12.4,
    protectedPerCup: '8 m²',
    hectaresPreserved: 1.7,
    settlementDays: 6,
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
    traceId: 'TL-2026-00327',
    sectorPlotId: null, // Mount Kenya East — outside the SW-MAU sector map
    channel: 'branded',
    brand: 'Rift Valley Tea Co.',
    brandId: 'riftValley',
    product: 'Origin Series — Mount Kenya',
    season: '2026 early crop',
    volumeKg: 1310,
    premiumKesPerKg: 12.0,
    protectedPerCup: '8 m²',
    hectaresPreserved: 2.1,
    settlementDays: 5,
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
    traceId: null,
    sectorPlotId: null,
    channel: 'auction',
    brand: null,
    brandId: null,
    product: 'Mombasa auction lot',
    season: '2026 main crop',
    volumeKg: 5400,
    premiumKesPerKg: 0,
    protectedPerCup: null,
    hectaresPreserved: null,
    settlementDays: null,
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
  return RECORDS.filter((r) => isNonAuction(r.channel))
}

/** Case-insensitive lookup by short retail code or full trace id, across all channels. */
export function findBatchRecord(batchId) {
  if (!batchId) return null
  const q = String(batchId).trim().toUpperCase().replace(/^#/, '')
  return (
    RECORDS.find((r) => r.id.toUpperCase() === q || (r.traceId && r.traceId.toUpperCase() === q)) ??
    null
  )
}

const roundCoord = (n, dp) => Number(n.toFixed(dp))
const shortRef = (ref) => (ref.length > 12 ? `${ref.slice(0, 6)}…${ref.slice(-4)}` : ref)

/**
 * The plot a batch was pressed from. Each record carries its own plot facts
 * hand-authored above; this used to cross-reference the ops system's
 * procedural sector-map grid when a batch was linked to one, so the two
 * surfaces never disagreed. That coupling was the kind of thing the
 * landing/ops split exists to remove — the two systems are allowed to diverge
 * now, so this just returns the record's own plot.
 */
export function resolvePlot(record) {
  return record.plot
}

/**
 * Project a canonical record to one redaction level. Returns the chain as an
 * ordered list of stages (each with label, title, rows and optional verification
 * badge keys) plus a verification summary — the shape `BatchProvenanceChain`
 * renders regardless of surface.
 */
export function redactBatchRecord(record, level = 'public') {
  const cfg = REDACTION[level] ?? REDACTION.public
  const { land, block, harvest, batch, processing, verification } = record
  const plot = resolvePlot(record)
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
        cfg.lotIds && record.traceId ? { k: 'Trace id', v: record.traceId } : null,
        { k: 'Sealed', v: batch.sealedAt },
        { k: 'Made tea', v: `${batch.madeTeaKg.toLocaleString()} kg` },
        { k: 'Grade', v: batch.grade },
      ].filter(Boolean),
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
    traceId: record.traceId,
    channel: record.channel,
    branded: isNonAuction(record.channel),
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
  // `collectionCentre` is the delivery facility (a fixed location, distinct from
  // the plot), so it keeps the record's hand-authored coordinates — the public
  // globe pin does not move. `plotId` follows the resolved sector plot so the
  // downloaded passport agrees with the dashboard chain.
  return {
    id: record.id,
    brandId: record.brandId ?? null,
    brand: record.brand,
    product: record.product,
    bufferZone: record.block.bufferZone,
    region: record.block.region,
    block: {
      name: record.block.name,
      bufferZone: record.block.bufferZone,
      covenantHa: record.block.covenantHa,
      patrolsThisMonth: record.block.patrolsThisMonth,
      seedlingsPlanted: record.block.seedlingsPlanted,
    },
    protectedPerCup: record.protectedPerCup,
    hectaresPreserved: record.hectaresPreserved == null ? null : String(record.hectaresPreserved),
    sourcedVolumeKg: record.volumeKg,
    sourcedVolumeLabel: `${record.volumeKg.toLocaleString()} kg made tea`,
    pluckerPremiumKesPerKg: record.premiumKesPerKg,
    settlementDays: record.settlementDays ?? null,
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
      plotId: resolvePlot(record).id,
      reference: record.verification.reference,
      // Additive — existing consumers (the public `/batch/:id` page) don't
      // destructure these, so this doesn't change their render. Added for
      // the tenant passport's Verify stage, which needs the field-check and
      // satellite-confirm dates as two distinct real values, not one.
      field: record.verification.field,
      satellite: record.verification.satellite,
    },
  }
}
