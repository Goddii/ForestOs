// ── Adoptable plots — the return hook (brief 5.6) ───────────────────────────
// "Plot Adoption: adopt one named plot and watch it change at each satellite
// refresh (ILLUSTRATIVE cadence), a reason to return grounded in real data."
//
// One plot per stamp series, so a visitor's collection and their commitment
// point at the same piece of landscape. Every figure here is ILLUSTRATIVE, and
// the canopy readings stand in for the NDVI-style checks a production build
// would pull from the verification engine — they are not real measurements.

/** Illustrative cadence between satellite checks, in days (roughly quarterly). */
export const REFRESH_CADENCE_DAYS = 90

/** Canopy baseline a plot has to stay above to keep its covenant (ILLUSTRATIVE). */
export const COVENANT_CANOPY_PCT = 40

export const PLOTS = [
  {
    id: 'mar-014',
    name: 'Mariashoni Ridge',
    blockName: 'South West Mau',
    series: 'Mau Ridge',
    hectares: 3.2,
    lastRefreshISO: '2026-09-12',
    officerNote:
      'Seedling survival is holding above the covenant floor; the fog-belt replanting took on the south face.',
    refreshes: [
      { label: '2025 Q4', canopyPct: 41 },
      { label: '2026 Q1', canopyPct: 44 },
      { label: '2026 Q2', canopyPct: 46 },
      { label: '2026 Q3', canopyPct: 48 },
    ],
  },
  {
    id: 'kip-009',
    name: 'Kiptunga Edge',
    blockName: 'South West Mau',
    series: 'Tea Belt',
    hectares: 2.6,
    lastRefreshISO: '2026-08-30',
    officerNote:
      'Buffer strip is legible along the whole boundary; the two retired plots are still clearing.',
    refreshes: [
      { label: '2025 Q4', canopyPct: 38 },
      { label: '2026 Q1', canopyPct: 39 },
      { label: '2026 Q2', canopyPct: 43 },
      { label: '2026 Q3', canopyPct: 45 },
    ],
  },
  {
    id: 'abr-027',
    name: 'Aberdare Waterline',
    blockName: 'Aberdare Ridge',
    series: 'Water Towers',
    hectares: 4.1,
    lastRefreshISO: '2026-07-18',
    officerNote:
      'Waterline replanting is establishing; invasive removal on the lower slope is due next quarter.',
    refreshes: [
      { label: '2025 Q4', canopyPct: 44 },
      { label: '2026 Q1', canopyPct: 43 },
      { label: '2026 Q2', canopyPct: 44 },
      { label: '2026 Q3', canopyPct: 47 },
    ],
  },
]

export function resolvePlot(plotId) {
  return PLOTS.find((plot) => plot.id === plotId) ?? null
}
