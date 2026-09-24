/**
 * Pure roll-ups over the expenditure ledger (src/data/investor/expenditures.js).
 * No data lives here — the data layer calls these to *derive* deployed and
 * verified capital, so every figure in the console traces back to ledger rows.
 */

/** DOM id of the Capital page's expenditure ledger, the scroll target for its filters. */
export const LEDGER_ID = 'expenditure-ledger'

/** @typedef {{ status: 'all' | 'verified' | 'pending_verification', categoryId: string }} LedgerFilter */

/** @type {LedgerFilter} */
export const ALL_PAYMENTS = { status: 'all', categoryId: 'all' }

/**
 * @param {Array<{ amount: number }>} rows
 * @returns {number}
 */
export function sumAmounts(rows) {
  return rows.reduce((total, row) => total + row.amount, 0)
}

/**
 * Adds ledger-derived figures to each budget category.
 *
 * @template {{ id: string, budget: number }} C
 * @param {C[]} categories
 * @param {import('../../data/investor/types').Expenditure[]} expenditures
 * @returns {Array<C & { deployed: number, verified: number, pendingVerification: number, remaining: number, expenditures: import('../../data/investor/types').Expenditure[] }>}
 */
export function summarizeCategories(categories, expenditures) {
  return categories.map((category) => {
    const rows = expenditures.filter((row) => row.categoryId === category.id)
    const deployed = sumAmounts(rows)
    const verified = sumAmounts(rows.filter((row) => row.status === 'verified'))
    return {
      ...category,
      deployed,
      verified,
      pendingVerification: deployed - verified,
      remaining: category.budget - deployed,
      expenditures: rows,
    }
  })
}

/**
 * "2026-08-14" → "2026 Q3".
 *
 * @param {string} isoDate
 * @returns {string}
 */
export function quarterOf(isoDate) {
  const [year, month] = isoDate.split('-').map(Number)
  return `${year} Q${Math.ceil(month / 3)}`
}

/**
 * Every quarter from `first` to `last` inclusive, e.g. "2026 Q3" → "2027 Q1".
 *
 * @param {string} first
 * @param {string} last
 * @returns {string[]}
 */
function quarterRange(first, last) {
  const toIndex = (period) => {
    const [year, quarter] = period.split(' Q').map(Number)
    return year * 4 + (quarter - 1)
  }
  const periods = []
  for (let index = toIndex(first); index <= toIndex(last); index += 1) {
    periods.push(`${Math.floor(index / 4)} Q${(index % 4) + 1}`)
  }
  return periods
}

/**
 * Cumulative deployed capital at the end of every quarter from the first
 * spend to the last — contiguous, so a quarter with no spend still appears
 * (carrying the running total forward) rather than silently vanishing and
 * making "this quarter" or the trend sparkline skip a period.
 *
 * @param {Array<{ date: string, amount: number }>} expenditures
 * @returns {Array<{ period: string, value: number }>}
 */
export function cumulativeByQuarter(expenditures) {
  if (expenditures.length === 0) return []
  const byQuarter = new Map()
  for (const row of expenditures) {
    const period = quarterOf(row.date)
    byQuarter.set(period, (byQuarter.get(period) ?? 0) + row.amount)
  }
  const sorted = [...byQuarter.keys()].toSorted()
  let running = 0
  return quarterRange(sorted[0], sorted.at(-1)).map((period) => {
    running += byQuarter.get(period) ?? 0
    return { period, value: running }
  })
}
