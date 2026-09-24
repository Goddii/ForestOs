// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`CapitalPosition`, `CapitalAllocation`, `ProgrammeFunding`,
// `CapitalTimelineStep`) for the shapes this file implements.
import { EXPENDITURES } from './expenditures'
import { cumulativeByQuarter, summarizeCategories, sumAmounts } from '../../lib/investor/capitalLedger'

// Budget categories. `budget` is the planned share of the commitment and
// `allocated` the portion formally assigned to work so far; the committed
// and allocated headlines are these values summed. Deployed and verified are
// NOT declared here — they're derived from the ledger below.
// `outputs` are what the category's spend has produced (drawn from the
// evidence records it's linked to) and `outcomeIds` the CORE_OUTCOMES it
// contributes to: the Capital → Activity → Output → Outcome results chain.
const CATEGORIES = [
  {
    id: 'conservation-operations',
    category: 'Conservation operations',
    budget: 12_000_000,
    allocated: 11_000_000,
    percentage: 24,
    outputs: ['Buffer-zone patrols across the full project boundary', 'Sector 4 compliance audit — 214 plot checks'],
    outcomeIds: ['conservation', 'compliance'],
  },
  {
    id: 'farmer-incentives',
    category: 'Farmer & community incentives',
    budget: 10_000_000,
    allocated: 9_000_000,
    percentage: 20,
    outputs: ['Farmers onboarded with GPS-mapped plots', 'Q2 and Q3 incentive tranches paid to verified participants'],
    outcomeIds: ['participation', 'compliance'],
  },
  {
    id: 'restoration',
    category: 'Restoration',
    budget: 8_000_000,
    allocated: 6_400_000,
    percentage: 16,
    outputs: ['Block E nursery established', 'Seedlings outplanted in Block E'],
    outcomeIds: ['conservation'],
  },
  {
    id: 'monitoring-verification',
    category: 'Monitoring & verification',
    budget: 7_000_000,
    allocated: 6_600_000,
    percentage: 14,
    outputs: ['Conservation boundary re-surveyed (v3)', 'H1 independent verification signed off'],
    outcomeIds: ['conservation', 'evidence-coverage'],
  },
  {
    id: 'technology-data',
    category: 'Technology & data',
    budget: 7_000_000,
    allocated: 5_600_000,
    percentage: 14,
    outputs: ['Canopy composite across the monitored landscape', 'Field data capture app in use'],
    outcomeIds: ['landscape', 'evidence-coverage'],
  },
  {
    id: 'programme-management',
    category: 'Programme management',
    budget: 6_000_000,
    allocated: 5_400_000,
    percentage: 12,
    outputs: ['Programme coordination and reporting'],
    outcomeIds: [],
  },
]

const sumBy = (rows, key) => rows.reduce((total, row) => total + row[key], 0)

/** @type {import('./types').CapitalAllocation[]} */
export const USE_OF_FUNDS = summarizeCategories(CATEGORIES, EXPENDITURES)

/** @type {import('./types').CapitalPosition} */
export const CAPITAL_POSITION = {
  // Derived from the categories, like deployed/verified are from the ledger,
  // so no headline figure can drift from its own breakdown.
  committed: sumBy(CATEGORIES, 'budget'),
  allocated: sumBy(CATEGORIES, 'allocated'),
  deployed: sumAmounts(EXPENDITURES),
  verified: sumAmounts(EXPENDITURES.filter((row) => row.status === 'verified')),
  currency: 'KSh',
}

// Cumulative deployed capital by quarter, straight from the ledger — feeds
// the Overview hero's sparkline and the "deployed this period" figure.
export const DEPLOYMENT_TREND = cumulativeByQuarter(EXPENDITURES)

// Who funds the whole programme. Impact is reported gross (the whole
// programme) and attributed (this fund's share) — GIIN IRIS+ LP-reporting
// practice — with the attribution method stated rather than implied. The
// co-funders are generic placeholders, not real organisations.
/** @type {import('./types').ProgrammeFunding} */
export const PROGRAMME_FUNDING = {
  sources: [
    { label: 'This fund', type: 'Investment', amount: CAPITAL_POSITION.committed, isInvestor: true },
    { label: 'Co-funder A', type: 'Blended-finance grant', amount: 18_000_000, isInvestor: false },
    { label: 'Co-funder B', type: 'County government, in kind', amount: 12_000_000, isInvestor: false },
  ],
  attributionMethod: 'Pro-rata by committed capital across all programme funders',
}

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
