// DEMO DATA — illustrative only. Feeds OverviewPage's "Field Intelligence"
// section (design-review brief §13) — a snapshot of recent operational
// activity framed as a live feed, not an actual live feed. Each item links
// to the page that explains it.

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
    headline: '18 records verified this week',
    detail: 'Sector 4 field audit closed 214 plot checks, 16 returned for follow-up.',
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
    headline: 'KSh 7.4M deployed this period',
    detail: 'Q3 farmer incentive tranche disbursed to 1,842 verified participants.',
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
