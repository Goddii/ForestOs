// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`Expenditure`) for the shape; this is the proposed hand-off contract for
// the backend's disbursement ledger.
//
// The whole programme's expenditure ledger — the single source of truth for
// spent and verified money. `categoryId` is a funding-agreement allocation id
// (src/data/funder/agreements.js), so each funder's capital position, use of
// funds and ledger are *computed* from its own rows (lib/programme/funding.js)
// and can never disagree with each other.
//
// Every row links to the activity records it paid for (`activityIds`) and to
// their evidence — Funding → Allocation → Payment → Activity → Evidence. A row
// is `verified` only once that activity's evidence has been reviewed;
// `pending_verification` rows are spent money still waiting on it.

/** @type {import('./types').Expenditure[]} */
export const EXPENDITURES = [
  // Conservation operations
  {
    id: 'exp-co-1',
    date: '2026-04-30',
    categoryId: 'conservation-operations',
    description: 'Buffer-zone patrol teams — Q2',
    amount: 3_120_000,
    status: 'verified',
    evidenceIds: ['ev-007'],
    activityIds: ['act-b-03'],
  },
  {
    id: 'exp-co-2',
    date: '2026-08-31',
    categoryId: 'conservation-operations',
    description: 'Buffer-zone patrol teams — Jul–Aug',
    amount: 2_740_000,
    status: 'verified',
    evidenceIds: ['ev-007'],
    activityIds: ['act-b-03', 'act-b-04'],
  },
  {
    id: 'exp-co-3',
    date: '2026-09-03',
    categoryId: 'conservation-operations',
    description: 'Sector 4 conservation compliance audit',
    amount: 2_380_000,
    status: 'verified',
    evidenceIds: ['ev-003'],
    activityIds: ['act-b-05'],
  },
  {
    id: 'exp-co-4',
    date: '2026-09-18',
    categoryId: 'conservation-operations',
    description: 'Sector 7 disturbance response',
    amount: 520_000,
    status: 'pending_verification',
    evidenceIds: ['ev-010'],
    activityIds: ['act-b-08'],
  },

  // Farmer & community incentives
  {
    id: 'exp-fi-1',
    date: '2026-07-19',
    categoryId: 'farmer-incentives',
    description: 'Farmer onboarding and plot GPS capture',
    amount: 1_100_000,
    status: 'verified',
    evidenceIds: ['ev-004'],
    activityIds: ['act-b-02'],
  },
  {
    id: 'exp-fi-2',
    date: '2026-06-15',
    categoryId: 'farmer-incentives',
    description: 'Q2 conservation incentive tranche',
    amount: 2_100_000,
    status: 'verified',
    evidenceIds: ['ev-006'],
    activityIds: ['act-b-01'],
  },
  {
    id: 'exp-fi-3',
    date: '2026-09-15',
    categoryId: 'farmer-incentives',
    description: 'Q3 conservation incentive tranche',
    amount: 4_200_000,
    status: 'verified',
    evidenceIds: ['ev-008'],
    activityIds: [],
  },

  // Restoration
  {
    id: 'exp-re-1',
    date: '2026-05-12',
    categoryId: 'restoration',
    description: 'Block E nursery establishment',
    amount: 2_300_000,
    status: 'verified',
    evidenceIds: ['ev-005'],
    activityIds: ['act-b-06'],
  },
  {
    id: 'exp-re-2',
    date: '2026-08-30',
    categoryId: 'restoration',
    description: 'Seedling outplanting — Block E',
    amount: 1_160_000,
    status: 'verified',
    evidenceIds: ['ev-005'],
    activityIds: ['act-b-06'],
  },
  {
    id: 'exp-re-3',
    date: '2026-09-12',
    categoryId: 'restoration',
    description: 'Kilombe ridge restoration site preparation',
    amount: 640_000,
    status: 'pending_verification',
    evidenceIds: [],
    activityIds: ['act-b-07'],
  },

  // Monitoring & verification
  {
    id: 'exp-mv-1',
    date: '2026-03-28',
    categoryId: 'monitoring-verification',
    description: 'Conservation boundary re-survey (RTK GPS)',
    amount: 1_850_000,
    status: 'verified',
    evidenceIds: ['ev-002'],
    activityIds: ['act-b-09'],
  },
  {
    id: 'exp-mv-2',
    date: '2026-07-28',
    categoryId: 'monitoring-verification',
    description: 'Independent verification partner — H1 review',
    amount: 2_400_000,
    status: 'verified',
    evidenceIds: ['ev-009'],
    activityIds: [],
  },
  {
    id: 'exp-mv-3',
    date: '2026-09-03',
    categoryId: 'monitoring-verification',
    description: 'Sector 4 field audit logistics',
    amount: 1_700_000,
    status: 'verified',
    evidenceIds: ['ev-003'],
    activityIds: ['act-b-05'],
  },

  // Technology & data
  {
    id: 'exp-te-1',
    date: '2026-02-26',
    categoryId: 'technology-data',
    description: 'Field data app and GPS devices',
    amount: 1_600_000,
    status: 'verified',
    evidenceIds: ['ev-004'],
    activityIds: [],
  },
  {
    id: 'exp-te-2',
    date: '2026-08-14',
    categoryId: 'technology-data',
    description: 'Satellite imagery and canopy processing',
    amount: 1_600_000,
    status: 'verified',
    evidenceIds: ['ev-001'],
    activityIds: [],
  },
  {
    id: 'exp-te-3',
    date: '2026-08-20',
    categoryId: 'technology-data',
    description: 'Canopy-change alerting — Kiptunga block',
    amount: 440_000,
    status: 'verified',
    evidenceIds: ['ev-001'],
    activityIds: [],
  },

  // Programme management — coordination, not a field activity. Verified
  // through the independent partner's desk review of programme accounts,
  // which so far covers H1 only; Q3 waits on the H2 review.
  {
    id: 'exp-pm-1',
    date: '2026-03-31',
    categoryId: 'programme-management',
    description: 'Programme coordination — Q1',
    amount: 520_000,
    status: 'verified',
    evidenceIds: ['ev-009'],
    activityIds: [],
  },
  {
    id: 'exp-pm-2',
    date: '2026-06-30',
    categoryId: 'programme-management',
    description: 'Programme coordination — Q2',
    amount: 590_000,
    status: 'verified',
    evidenceIds: ['ev-009'],
    activityIds: [],
  },
  {
    id: 'exp-pm-3',
    date: '2026-09-15',
    categoryId: 'programme-management',
    description: 'Programme coordination — Q3 to date',
    amount: 440_000,
    status: 'pending_verification',
    evidenceIds: [],
    activityIds: [],
  },

  // ── Funder A (placeholder — ABSA) allocations ───────────────────────────────
  {
    id: 'exp-a-1',
    date: '2026-04-10',
    categoryId: 'alc-a-tea',
    description: 'Tea infilling, SEG-02 gaps: clonal plants and planting labour',
    amount: 2_450_000,
    status: 'verified',
    evidenceIds: ['ev-012', 'ev-013'],
    activityIds: ['act-a-01'],
  },
  {
    id: 'exp-a-2',
    date: '2026-04-22',
    categoryId: 'alc-a-fuelwood',
    description: 'Fuelwood establishment, Nessuit spur',
    amount: 1_900_000,
    status: 'verified',
    evidenceIds: ['ev-014'],
    activityIds: ['act-a-02'],
  },
  {
    id: 'exp-a-3',
    date: '2026-06-05',
    categoryId: 'alc-a-indigenous',
    description: 'Indigenous planting, Kilombe ridge ESA strip',
    amount: 1_450_000,
    status: 'verified',
    evidenceIds: ['ev-016', 'ev-017'],
    activityIds: ['act-a-04'],
  },
  {
    id: 'exp-a-4',
    date: '2026-07-18',
    categoryId: 'alc-a-tea',
    description: 'Tea infilling, SEG-01 second round',
    amount: 1_100_000,
    status: 'pending_verification',
    evidenceIds: ['ev-015'],
    activityIds: ['act-a-03'],
  },
  {
    id: 'exp-a-5',
    date: '2026-07-25',
    categoryId: 'alc-a-monitoring',
    description: '3-month survival counts, April plantings',
    amount: 320_000,
    status: 'verified',
    evidenceIds: ['ev-019'],
    activityIds: [],
  },
  {
    id: 'exp-a-6',
    date: '2026-08-12',
    categoryId: 'alc-a-apiary',
    description: 'Apiary kits and training, three household groups',
    amount: 980_000,
    status: 'pending_verification',
    evidenceIds: ['ev-018'],
    activityIds: ['act-a-05'],
  },
  {
    id: 'exp-a-7',
    date: '2026-08-28',
    categoryId: 'alc-a-fuelwood',
    description: 'Fuelwood establishment, Block C community edge',
    amount: 600_000,
    status: 'pending_verification',
    evidenceIds: [],
    activityIds: ['act-a-06'],
  },
]
