// Mock data for the B2B Corporate / ESG portal. Illustrative only — there is
// no ForestOS backend and none of these figures are real.

export const DASHBOARD_NAV = [
  { to: '', label: 'Overview', end: true },
  { to: 'eudr', label: 'EUDR Compliance' },
  { to: 'passports', label: 'Conservation Passports' },
  { to: 'fairpay', label: 'Fair Pay Telemetry' },
  { to: 'satellite', label: 'Satellite Analytics' },
  { to: 'qr', label: 'QR Scan Analytics' },
]

export const ORG = {
  name: 'Rift Valley Tea Co.',
  role: 'Offtaker & Brand',
  sector: 'South West Mau Sector',
  sectorCode: 'SW-MAU',
  since: '2024',
}

// ── Sector geography — the account's assigned covenant area ────────────────
// Everything the Sector Focus View renders is scoped to this one block of the
// South West Mau, framed for a tilted 3D Cesium camera.
export const SECTOR = {
  name: 'South West Mau Sector',
  code: 'SW-MAU',
  block: 'Kiptunga Block',
  center: { lon: 35.642, lat: -0.472 },
  bbox: { west: 35.508, south: -0.606, east: 35.776, north: -0.338 },
  flight: {
    start: { lon: 35.642, lat: -0.56, height: 52000, pitchDeg: -80, headingDeg: 0 },
    target: { lon: 35.642, lat: -0.516, height: 16500, pitchDeg: -63, headingDeg: 8 },
  },
}

// Collection-centre pins inside the sector.
export const COLLECTION_CENTRES = [
  { id: 'CC-KPT', name: 'Kiptunga Collection Centre', lon: 35.618, lat: -0.415, pluckers: 1240 },
  { id: 'CC-NES', name: 'Nessuit Collection Centre', lon: 35.702, lat: -0.523, pluckers: 880 },
  { id: 'CC-MAR', name: 'Mariashoni Collection Centre', lon: 35.548, lat: -0.552, pluckers: 610 },
  { id: 'CC-TIN', name: 'Tinet Collection Centre', lon: 35.741, lat: -0.436, pluckers: 430 },
]

// ── Module 1 — EUDR & plot compliance ──────────────────────────────────────
const SECTOR_CENTRES = [
  'Kiptunga', 'Nessuit', 'Mariashoni', 'Tinet',
  'Kilombe', 'Teret', 'Sururu', 'Likia',
]

// Deterministic 0..1 hash so the scatter is stable across reloads.
function unit(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function makePlots() {
  const { west, south, east, north } = SECTOR.bbox
  const spanLon = east - west
  const spanLat = north - south
  const cols = 5
  const rows = 4
  const pad = 0.13
  return Array.from({ length: 18 }, (_, i) => {
    const centre = SECTOR_CENTRES[i % SECTOR_CENTRES.length]
    const gx = i % cols
    const gy = Math.floor(i / cols)
    const jx = (unit(i + 1) - 0.5) * 0.72
    const jy = (unit(i + 41) - 0.5) * 0.72
    const fx = pad + ((gx + 0.5 + jx) / cols) * (1 - 2 * pad)
    const fy = pad + ((gy + 0.5 + jy) / rows) * (1 - 2 * pad)
    const lon = +(west + fx * spanLon).toFixed(4)
    const lat = +(south + fy * spanLat).toFixed(4)
    const canopy2020 = 58 + ((i * 7) % 30)
    const drift = ((i * 13) % 11) - 3
    const canopyNow = Math.min(97, canopy2020 + drift)
    const loss = Math.max(0, canopy2020 - canopyNow)
    const status = loss >= 3 ? 'flagged' : loss > 0 ? 'watch' : 'clear'
    const hectares = +(1.2 + (i % 5) * 0.6).toFixed(1)
    const half = 0.0017 + hectares * 0.0007 // ring half-edge, degrees
    const ndvi = +(0.42 + (canopyNow / 100) * 0.46).toFixed(2)
    return {
      id: `${centre.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
      centre,
      lat,
      lon,
      hectares,
      canopy2020,
      canopyNow,
      loss,
      status,
      ndvi,
      // Schematic quad around the centroid (flat [lon,lat,...] for Cesium).
      ring: [
        lon - half, lat - half,
        lon + half, lat - half * 0.82,
        lon + half * 0.9, lat + half,
        lon - half * 0.95, lat + half * 0.78,
      ],
    }
  })
}

const EUDR_PLOTS = makePlots()

// Coarse NDVI field across the sector bbox — greener toward the forest core,
// thinner at the settled edges. Rendered as translucent graded cells.
function makeNdviGrid() {
  const cols = 9
  const rows = 6
  const { west, south, east, north } = SECTOR.bbox
  const dLon = (east - west) / cols
  const dLat = (north - south) / rows
  const cells = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const w = west + c * dLon
      const s = south + r * dLat
      const cx = (c + 0.5) / cols - 0.5
      const cy = (r + 0.5) / rows - 0.42
      const core = 1 - Math.min(1, Math.hypot(cx, cy) * 1.55)
      const jitter = (((r * 7 + c * 13) % 5) - 2) * 0.015
      const ndvi = Math.max(0.22, Math.min(0.88, +(0.34 + core * 0.5 + jitter).toFixed(2)))
      cells.push({ id: `n${r}${c}`, ndvi, ring: [w, s, w + dLon, s, w + dLon, s + dLat, w, s + dLat] })
    }
  }
  return cells
}

export const NDVI_GRID = makeNdviGrid()

export const EUDR = {
  baselineDate: '2020-12-31',
  plots: EUDR_PLOTS,
  summary: {
    total: EUDR_PLOTS.length,
    clear: EUDR_PLOTS.filter((p) => p.status === 'clear').length,
    watch: EUDR_PLOTS.filter((p) => p.status === 'watch').length,
    flagged: EUDR_PLOTS.filter((p) => p.status === 'flagged').length,
    hectares: +EUDR_PLOTS.reduce((sum, p) => sum + p.hectares, 0).toFixed(1),
  },
}

// Simulated audit / verification feed for the sector. Not live — the Sector
// Focus View ticks through these entries to show the shape of the pipeline.
export const AUDIT_ACTIVITY = [
  { id: 'a01', kind: 'satellite', plotId: null, text: 'Sentinel-2 pass ingested · 12 tiles · 4.1% cloud' },
  { id: 'a02', kind: 'polygon', plotId: 'KIP-01', text: 'Audit polygon re-verified against Dec 2020 baseline' },
  { id: 'a03', kind: 'batch', plotId: null, text: 'Batch #802 conservation passport generated' },
  { id: 'a04', kind: 'polygon', plotId: 'NES-02', text: 'Canopy delta recomputed · −1 pp · within tolerance' },
  { id: 'a05', kind: 'alert', plotId: 'TIN-04', text: 'Edge-clearing signal flagged · 0.4 ha · ranger queued' },
  { id: 'a06', kind: 'cert', plotId: 'MAR-03', text: 'EUDR audit certificate issued · rev C' },
  { id: 'a07', kind: 'satellite', plotId: null, text: 'NDVI composite refreshed · sector mean 0.71' },
  { id: 'a08', kind: 'polygon', plotId: 'KIL-05', text: 'Plot geometry snapped to updated survey trace' },
  { id: 'a09', kind: 'batch', plotId: null, text: 'Weekly plucker settlement file sealed · 1,240 payees' },
  { id: 'a10', kind: 'polygon', plotId: 'KIP-09', text: 'Canopy density current 71% · cleared' },
  { id: 'a11', kind: 'satellite', plotId: null, text: 'Planet SkySat tasking confirmed for flagged plots' },
  { id: 'a12', kind: 'cert', plotId: 'NES-02', text: 'Audit certificate counter-signed by verifier node' },
  { id: 'a13', kind: 'alert', plotId: 'TIN-04', text: 'Ground team ack · site visit scheduled 2026-09-09' },
  { id: 'a14', kind: 'polygon', plotId: 'SUR-07', text: 'Baseline vs current recomputed · +4 pp recovery' },
]

// ── Module 2 — Digital Conservation Passport vault ─────────────────────────
function mpesaCodes(seed, n) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  return Array.from({ length: n }, (_, k) => {
    let code = ''
    let x = seed * 97 + k * 31
    for (let i = 0; i < 10; i += 1) {
      x = (x * 1103515245 + 12345) & 0x7fffffff
      code += alphabet[x % alphabet.length]
    }
    return code
  })
}

export const PASSPORTS = [
  { id: '802', centre: 'Kiptunga Collection Centre', block: 'Mau Forest Complex' },
  { id: '774', centre: 'Nessuit Collection Centre', block: 'Mau Forest Complex' },
  { id: '618', centre: 'Wanjohi Collection Centre', block: 'Aberdare Range' },
  { id: '540', centre: 'Kangaita Collection Centre', block: 'Mt. Kenya Forest' },
  { id: '331', centre: 'Kapsara Collection Centre', block: 'Cherangany Hills' },
].map((base, i) => ({
  ...base,
  lat: +(-0.5 + i * 0.28).toFixed(3),
  lon: +(35.6 + i * 0.42).toFixed(3),
  volumeKg: 1840 - i * 210,
  canopy2015: 39 + i * 3,
  canopyNow: 61 + i * 2,
  premiumKesPerKg: 18.4 - i * 0.4,
  issued: `2026-0${8 - (i % 3)}-${12 + i}`,
  mpesaAudit: mpesaCodes(i + 1, 3),
}))

// ── Module 3 — Fair Pay & Plucker telemetry ───────────────────────────────
export const FAIR_PAY = {
  auctionBaselineKesPerKg: 210,
  premiumBreakdown: [
    { label: 'Mombasa auction clearing price', kes: 210, base: true },
    { label: 'ForestOS conservation premium', kes: 14 },
    { label: 'Deforestation-free verification bonus', kes: 3 },
    { label: 'Prompt-settlement uplift', kes: 1.4 },
  ],
  totalPremiumKesPerKg: 18.4,
  regionalParity: [
    { belt: 'Western belt', blocks: 'Mau · Cherangany · Elgon', premiumKesPerKg: 18.4, settlementDays: 7, coveragePct: 94 },
    { belt: 'Eastern belt', blocks: 'Aberdares · Mt. Kenya', premiumKesPerKg: 16.9, settlementDays: 9, coveragePct: 88 },
  ],
  demographics: [
    { label: 'Women pluckers supported', value: 61 },
    { label: 'Youth pluckers (under 35)', value: 44 },
    { label: 'Paid via mobile money', value: 100 },
    { label: 'Settled within the same week', value: 92 },
  ],
  monthlyPremiumKesM: [12.1, 13.4, 13.9, 15.2, 16.0, 16.8, 17.5, 18.4],
}

// ── Module 4 — ESG & environmental satellite analytics ────────────────────
export const SATELLITE = {
  ndvi: {
    current: 0.71,
    baseline: 0.58,
    series: [0.55, 0.57, 0.56, 0.6, 0.63, 0.62, 0.66, 0.69, 0.71],
    quarters: ['Q1·24', 'Q2·24', 'Q3·24', 'Q4·24', 'Q1·25', 'Q2·25', 'Q3·25', 'Q4·25', 'Q1·26'],
  },
  carbon: {
    sinkTonnesCo2: 486000,
    perHectareTonnes: 34.1,
    note: 'Above-ground biomass, allometric estimate across the belt covenant area.',
  },
  water: {
    catchmentYieldMcm: 1240,
    changePct: 7.4,
    note: 'Modelled annual yield across the five tower catchments vs. the 2018 baseline.',
  },
  encroachmentAlerts: [
    { id: 'ALERT-2291', block: 'Mau — Tinet edge', distanceM: 320, detected: '2026-09-06 04:12 EAT', areaHa: 0.4, status: 'Ranger dispatched' },
    { id: 'ALERT-2288', block: 'Aberdare — Wanjohi spur', distanceM: 460, detected: '2026-09-04 22:41 EAT', areaHa: 0.2, status: 'Under review' },
    { id: 'ALERT-2280', block: 'Cherangany — Kapsara', distanceM: 190, detected: '2026-08-30 11:07 EAT', areaHa: 0.7, status: 'Resolved — replanted' },
  ],
}

// ── Module 5 — Consumer engagement & QR analytics ─────────────────────────
export const QR_ANALYTICS = {
  totalScans: 48210,
  scanRangeLabel: 'last 90 days',
  // x / y are percentages on the schematic world panel.
  scanCities: [
    { city: 'London', country: 'United Kingdom', scans: 14820, x: 46, y: 30 },
    { city: 'Amsterdam', country: 'Netherlands', scans: 4970, x: 49.5, y: 29 },
    { city: 'Cairo', country: 'Egypt', scans: 7210, x: 55.5, y: 41 },
    { city: 'Dubai', country: 'UAE', scans: 11340, x: 62.5, y: 45 },
    { city: 'Nairobi', country: 'Kenya', scans: 9870, x: 57.5, y: 58 },
  ],
  dwell: [
    { stage: 'Canopy dive (hero)', seconds: 21 },
    { stage: '3D proof map', seconds: 47 },
    { stage: 'Impact records', seconds: 33 },
    { stage: 'Passport download', seconds: 12 },
  ],
  attribution: [
    { campaign: 'Origin Story — IG Reels', creator: '@leaf.and.ridge', scans: 8120, conversions: 690 },
    { campaign: 'EUDR explainer — LinkedIn', creator: 'ForestOS', scans: 3400, conversions: 410 },
    { campaign: 'In-store shelf tag', creator: 'Rift Valley Tea Co.', scans: 12600, conversions: 980 },
    { campaign: 'Museum tasting pop-up', creator: 'Highland Leaf', scans: 2200, conversions: 320 },
  ],
  scanTrendK: [3.1, 3.6, 4.0, 4.4, 5.2, 6.0, 6.4, 7.0],
}

// ── Overview — trend series behind the four top-of-portal KPI cards ────────
// Each series is the metric's own recent history (8 monthly points); the
// delta is measured against the first point or a stated baseline.
export const OVERVIEW_TRENDS = {
  compliance: {
    series: [11, 12, 12, 13, 13, 14, 14, EUDR.summary.clear],
    delta: { label: '+2 vs Q1', dir: 'up' },
  },
  premium: {
    series: FAIR_PAY.monthlyPremiumKesM,
    delta: { label: '+8.2% vs Q1', dir: 'up' },
  },
  ndvi: {
    series: SATELLITE.ndvi.series,
    delta: { label: '+0.13 vs baseline', dir: 'up' },
  },
  scans: {
    series: QR_ANALYTICS.scanTrendK,
    delta: { label: '+18% MoM', dir: 'up' },
  },
}
