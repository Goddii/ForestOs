// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`Expenditure`) for the shape; this is the proposed hand-off contract for
// the backend's disbursement ledger.
//
// The expenditure ledger is the single source of truth for deployed and
// verified capital: `USE_OF_FUNDS` per-category `deployed`/`verified` and
// `CAPITAL_POSITION.deployed`/`.verified` are all *computed* from these rows
// (src/lib/investor/capitalLedger.js), so the accountability chain, use of
// funds and the overview can never disagree with each other.
//
// Every row points at the evidence records for the activity it paid for —
// the Capital → Activity → Evidence link a fund manager follows. A row is
// `verified` only once that evidence has been reviewed; `pending_verification`
// rows are deployed capital still waiting on it.

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
  },
  {
    id: 'exp-co-2',
    date: '2026-08-31',
    categoryId: 'conservation-operations',
    description: 'Buffer-zone patrol teams — Jul–Aug',
    amount: 2_740_000,
    status: 'verified',
    evidenceIds: ['ev-007'],
  },
  {
    id: 'exp-co-3',
    date: '2026-09-03',
    categoryId: 'conservation-operations',
    description: 'Sector 4 conservation compliance audit',
    amount: 2_380_000,
    status: 'verified',
    evidenceIds: ['ev-003'],
  },
  {
    id: 'exp-co-4',
    date: '2026-09-18',
    categoryId: 'conservation-operations',
    description: 'Sector 7 disturbance response',
    amount: 520_000,
    status: 'pending_verification',
    evidenceIds: ['ev-010'],
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
  },
  {
    id: 'exp-fi-2',
    date: '2026-06-15',
    categoryId: 'farmer-incentives',
    description: 'Q2 conservation incentive tranche',
    amount: 2_100_000,
    status: 'verified',
    evidenceIds: ['ev-006'],
  },
  {
    id: 'exp-fi-3',
    date: '2026-09-15',
    categoryId: 'farmer-incentives',
    description: 'Q3 conservation incentive tranche',
    amount: 4_200_000,
    status: 'verified',
    evidenceIds: ['ev-008'],
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
  },
  {
    id: 'exp-re-2',
    date: '2026-08-30',
    categoryId: 'restoration',
    description: 'Seedling outplanting — Block E',
    amount: 1_160_000,
    status: 'verified',
    evidenceIds: ['ev-005'],
  },
  {
    id: 'exp-re-3',
    date: '2026-09-12',
    categoryId: 'restoration',
    description: 'Kilombe ridge restoration site preparation',
    amount: 640_000,
    status: 'pending_verification',
    evidenceIds: [],
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
  },
  {
    id: 'exp-mv-2',
    date: '2026-07-28',
    categoryId: 'monitoring-verification',
    description: 'Independent verification partner — H1 review',
    amount: 2_400_000,
    status: 'verified',
    evidenceIds: ['ev-009'],
  },
  {
    id: 'exp-mv-3',
    date: '2026-09-03',
    categoryId: 'monitoring-verification',
    description: 'Sector 4 field audit logistics',
    amount: 1_700_000,
    status: 'verified',
    evidenceIds: ['ev-003'],
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
  },
  {
    id: 'exp-te-2',
    date: '2026-08-14',
    categoryId: 'technology-data',
    description: 'Satellite imagery and canopy processing',
    amount: 1_600_000,
    status: 'verified',
    evidenceIds: ['ev-001'],
  },
  {
    id: 'exp-te-3',
    date: '2026-08-20',
    categoryId: 'technology-data',
    description: 'Canopy-change alerting — Kiptunga block',
    amount: 440_000,
    status: 'verified',
    evidenceIds: ['ev-001'],
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
  },
  {
    id: 'exp-pm-2',
    date: '2026-06-30',
    categoryId: 'programme-management',
    description: 'Programme coordination — Q2',
    amount: 590_000,
    status: 'verified',
    evidenceIds: ['ev-009'],
  },
  {
    id: 'exp-pm-3',
    date: '2026-09-15',
    categoryId: 'programme-management',
    description: 'Programme coordination — Q3 to date',
    amount: 440_000,
    status: 'pending_verification',
    evidenceIds: [],
  },
]
