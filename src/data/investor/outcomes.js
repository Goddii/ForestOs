// DEMO DATA — illustrative only. Primary overview metrics — see
// src/data/investor/types.js (`ConservationMetric`).

// The compact summary shown over/beside the Landscape Intelligence map
// (design-review brief §8). `activeConservationHa` matches the sum of the
// two conservation-zone `areaHa` values in landscape.js (5,180 + 3,240) so
// the map, the drawer and this summary never disagree with each other.
export const LANDSCAPE_SUMMARY = {
  // Landscape context only: a vegetation trend across the whole monitored
  // area, NOT an outcome the programme claims to have caused.
  conditionIndicator: 67,
  conditionLabel: 'up since 2024 · context, not attributed',
  activeConservationHa: 8_420,
  fieldVerificationRecords: 312,
  lastVerified: '2026-09-18',
  evidenceCoveragePct: 96,
  sources: ['Satellite', 'GIS', 'Field', 'Operations'],
}

/** @type {import('./types').ConservationMetric[]} */
export const CORE_OUTCOMES = [
  {
    id: 'landscape',
    eyebrow: 'LANDSCAPE',
    label: 'Under monitoring',
    value: 12_840,
    unit: 'ha',
    confidence: 'satellite_verified',
    evidenceId: 'ev-001',
  },
  {
    id: 'conservation',
    eyebrow: 'CONSERVATION',
    label: 'Under active conservation',
    value: 8_420,
    unit: 'ha',
    confidence: 'field_verified',
    evidenceId: 'ev-002',
  },
  {
    id: 'participation',
    eyebrow: 'PARTICIPATION',
    label: 'Participating farmers',
    value: 1_842,
    unit: '',
    confidence: 'verified',
    evidenceId: 'ev-006',
  },
  {
    id: 'compliance',
    eyebrow: 'COMPLIANCE',
    label: 'Verified conservation compliance',
    value: 87,
    unit: '%',
    confidence: 'field_verified',
    evidenceId: 'ev-003',
  },
  {
    id: 'field-activity',
    eyebrow: 'FIELD ACTIVITY',
    label: 'Verified field activities',
    value: 3_420,
    unit: '',
    confidence: 'field_verified',
    evidenceId: 'ev-007',
  },
  {
    id: 'evidence-coverage',
    eyebrow: 'EVIDENCE',
    label: 'Records with supporting evidence',
    value: 96,
    unit: '%',
    confidence: 'verified',
    evidenceId: 'ev-009',
  },
]

// Neutral performance-over-time series — one value per year, one metric per
// line. Labeled as an "indicator", not a scientific finding: the methodology
// behind these numbers is not modeled in this prototype, so the UI must not
// imply a calculated percentage change unless that calculation actually
// exists (see build brief §11 / §32).
export const CONSERVATION_PERFORMANCE = [
  {
    id: 'landscape-condition',
    label: 'Landscape condition indicator',
    unit: 'index (0–100)',
    scaleMax: 100,
    methodology: 'Composite NDVI trend, unweighted, not yet peer-reviewed',
    series: [
      { year: '2024', value: 58 },
      { year: '2025', value: 63 },
      { year: '2026', value: 67 },
    ],
  },
  {
    id: 'conservation-area',
    label: 'Conservation area',
    unit: 'ha',
    methodology: 'GIS boundary register, RTK-GPS ground survey',
    series: [
      { year: '2024', value: 6_180 },
      { year: '2025', value: 7_460 },
      { year: '2026', value: 8_420 },
    ],
  },
  {
    id: 'farmer-participation',
    label: 'Farmer participation',
    unit: 'farmers',
    methodology: 'Community liaison register, reconciled quarterly',
    series: [
      { year: '2024', value: 1_120 },
      { year: '2025', value: 1_540 },
      { year: '2026', value: 1_842 },
    ],
  },
  {
    id: 'conservation-compliance',
    label: 'Conservation compliance',
    unit: '%',
    scaleMax: 100,
    methodology: 'Field audit pass rate, structured checklist',
    series: [
      { year: '2024', value: 71 },
      { year: '2025', value: 80 },
      { year: '2026', value: 87 },
    ],
  },
]
