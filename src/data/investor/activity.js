// DEMO DATA — illustrative only. Feeds OverviewPage's "Field Intelligence"
// section (design-review brief §13) — a snapshot of recent operational
// activity framed as a live feed, not an actual live feed. Each item links
// to the page that explains it. The capital item is computed from the
// expenditure ledger so it can't drift from the Capital page.
import { DEPLOYMENT_TREND } from './capital'
import { EXPENDITURES } from './expenditures'
import { quarterOf } from '../../lib/investor/capitalLedger'
import { formatCurrencyShort } from '../../lib/investor/format'

const CURRENT_QUARTER = DEPLOYMENT_TREND.at(-1)
const PREVIOUS_TOTAL = DEPLOYMENT_TREND.at(-2)?.value ?? 0
const DEPLOYED_THIS_QUARTER = CURRENT_QUARTER.value - PREVIOUS_TOTAL
const LARGEST_THIS_QUARTER = EXPENDITURES.filter((row) => quarterOf(row.date) === CURRENT_QUARTER.period).reduce(
  (largest, row) => (row.amount > largest.amount ? row : largest),
)

/**
 * @typedef {Object} ActivityItem
 * @property {string} id
 * @property {string} when - short, feed-style timestamp (e.g. "09:42", "Yesterday", "18 Sept")
 * @property {string} category
 * @property {string} headline
 * @property {string} detail
 * @property {string} to
 */

/** @type {ActivityItem[]} */
export const RECENT_ACTIVITY = [
  {
    id: 'act-001',
    when: '09:42',
    category: 'Field verification',
    headline: '214 plots audited in Sector 4',
    detail: '198 passed on first visit; 16 returned for a follow-up visit.',
    to: '/investor/evidence',
  },
  {
    id: 'act-002',
    when: 'Yesterday',
    category: 'Conservation activity',
    headline: '41 patrol runs logged in August',
    detail: '3 encroachment flags raised and escalated to the risk register.',
    to: '/investor/evidence',
  },
  {
    id: 'act-003',
    when: '18 Sept',
    category: 'Monitoring',
    headline: '1 zone flagged for review',
    detail: 'Sector 7 satellite pass shows an unconfirmed canopy-cover change.',
    to: '/investor/landscape',
  },
  {
    id: 'act-004',
    when: '18 Sept',
    category: 'Capital',
    headline: `${formatCurrencyShort(DEPLOYED_THIS_QUARTER)} deployed in ${CURRENT_QUARTER.period}`,
    detail: `Largest payment: ${LARGEST_THIS_QUARTER.description} (${formatCurrencyShort(LARGEST_THIS_QUARTER.amount)}).`,
    to: '/investor/capital',
  },
  {
    id: 'act-005',
    when: '17 Sept',
    category: 'Reporting',
    headline: 'Q3 impact report ready',
    detail: 'Covers all core outcomes, impact metrics and the evidence summary.',
    to: '/investor/reports',
  },
]
