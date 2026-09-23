// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`CapitalPosition`, `CapitalAllocation`, `CapitalTimelineStep`) for the
// shapes this file implements.

/** @type {import('./types').CapitalPosition} */
export const CAPITAL_POSITION = {
  committed: 50_000_000,
  allocated: 44_000_000,
  deployed: 31_400_000,
  verified: 29_800_000,
  currency: 'KSh',
}

// Cumulative deployed capital by quarter, matching CAPITAL_TIMELINE's own
// Q1-Q3 (Q4 is upcoming, not yet actual) — feeds the Overview KPI tiles'
// trend sparklines with a real, consistent series rather than invented noise.
export const DEPLOYMENT_TREND = [
  { period: '2026 Q1', value: 6_200_000 },
  { period: '2026 Q2', value: 18_900_000 },
  { period: '2026 Q3', value: 31_400_000 },
]

/** @type {import('./types').CapitalAllocation[]} */
export const USE_OF_FUNDS = [
  {
    category: 'Conservation operations',
    budget: 12_000_000,
    committed: 12_000_000,
    deployed: 8_760_000,
    remaining: 3_240_000,
    percentage: 24,
  },
  {
    category: 'Farmer & community incentives',
    budget: 10_000_000,
    committed: 10_000_000,
    deployed: 7_400_000,
    remaining: 2_600_000,
    percentage: 20,
  },
  {
    category: 'Restoration',
    budget: 8_000_000,
    committed: 7_200_000,
    deployed: 4_100_000,
    remaining: 3_900_000,
    percentage: 16,
  },
  {
    category: 'Monitoring & verification',
    budget: 7_000_000,
    committed: 7_000_000,
    deployed: 5_950_000,
    remaining: 1_050_000,
    percentage: 14,
  },
  {
    category: 'Technology & data',
    budget: 7_000_000,
    committed: 6_100_000,
    deployed: 3_640_000,
    remaining: 3_360_000,
    percentage: 14,
  },
  {
    category: 'Programme management',
    budget: 6_000_000,
    committed: 5_700_000,
    deployed: 1_550_000,
    remaining: 4_450_000,
    percentage: 12,
  },
]

/** @type {import('./types').CapitalTimelineStep[]} */
export const CAPITAL_TIMELINE = [
  {
    period: '2026 Q1',
    label: 'Commitment',
    detail: 'Capital commitment confirmed and allocated against the programme budget.',
    state: 'complete',
  },
  {
    period: '2026 Q2',
    label: 'Initial deployment',
    detail: 'Field team mobilized; monitoring and verification infrastructure stood up.',
    state: 'complete',
  },
  {
    period: '2026 Q3',
    label: 'Field programme',
    detail: 'Farmer onboarding, incentive disbursement and restoration activity underway.',
    state: 'active',
  },
  {
    period: '2026 Q4',
    label: 'Monitoring',
    detail: 'Full-cycle monitoring pass and independent verification review scheduled.',
    state: 'upcoming',
  },
]
