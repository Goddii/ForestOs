// DEMO DATA — illustrative only. Feeds OverviewPage's "What is happening
// now" — a snapshot of recent operational activity framed as a feed, not an
// actual live feed. Each item links to the workspace page that explains it.
// The money item is computed from the funder's own ledger rows, so it can't
// drift from the Funding page.
import { quarterOf } from '../../lib/investor/capitalLedger'
import { formatCurrencyShort } from '../../lib/investor/format'

/**
 * @typedef {Object} ActivityItem
 * @property {string} id
 * @property {string} when - short, feed-style timestamp (e.g. "09:42", "Yesterday", "18 Sept")
 * @property {string} category
 * @property {string} headline
 * @property {string} detail
 * @property {string} to
 */

const PROGRAMME_FEED = [
  {
    id: 'act-001',
    when: '09:42',
    category: 'Field verification',
    headline: '214 plots audited in Sector 4',
    detail: '198 passed on first visit; 16 returned for a follow-up visit.',
    page: 'evidence',
  },
  {
    id: 'act-002',
    when: 'Yesterday',
    category: 'Conservation activity',
    headline: '41 patrol runs logged in August',
    detail: '3 encroachment flags raised and escalated to the risk register.',
    page: 'evidence',
  },
  {
    id: 'act-003',
    when: '18 Sept',
    category: 'Monitoring',
    headline: '1 zone flagged for review',
    detail: 'Sector 7 satellite pass shows an unconfirmed canopy-cover change.',
    page: 'landscape',
  },
]

/**
 * @param {import('../funder/workspace').FunderWorkspace} workspace
 * @returns {ActivityItem[]}
 */
export function getRecentActivity(workspace) {
  const { trend, expenditures, position } = workspace.capital
  const current = trend.at(-1)
  const items = PROGRAMME_FEED.map(({ page, ...item }) => ({ ...item, to: `${workspace.basePath}/${page}` }))
  if (!current) return items

  const spentThisQuarter = current.value - (trend.at(-2)?.value ?? 0)
  const largest = expenditures
    .filter((row) => quarterOf(row.date) === current.period)
    .reduce((top, row) => (!top || row.amount > top.amount ? row : top), null)

  return [
    ...items,
    {
      id: 'act-money',
      when: current.period,
      category: 'Funding',
      headline: `${formatCurrencyShort(spentThisQuarter, position.currency)} of ${workspace.terms.yours} spent in ${current.period}`,
      detail: largest
        ? `Largest payment: ${largest.description} (${formatCurrencyShort(largest.amount, position.currency)}).`
        : 'No payments recorded this quarter.',
      to: `${workspace.basePath}/funding`,
    },
  ]
}
