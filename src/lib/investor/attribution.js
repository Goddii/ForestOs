/**
 * Gross vs. attributed impact (GIIN IRIS+ LP-reporting practice): the whole
 * programme's outcome, and the share of it this fund can claim given every
 * funder's committed capital. Pure — the method is stated alongside the
 * numbers in the UI (`PROGRAMME_FUNDING.attributionMethod`).
 */

/**
 * This fund's share of total programme funding, 0–1.
 *
 * @param {import('../../data/investor/types').ProgrammeFunding} funding
 * @returns {number}
 */
export function fundShare(funding) {
  const total = funding.sources.reduce((sum, source) => sum + source.amount, 0)
  const own = funding.sources
    .filter((source) => source.isInvestor)
    .reduce((sum, source) => sum + source.amount, 0)
  return total > 0 ? own / total : 0
}

/**
 * The portion of a gross outcome attributed to this fund.
 *
 * @param {number} grossValue
 * @param {number} share - 0–1
 * @returns {number}
 */
export function attributedValue(grossValue, share) {
  return grossValue * share
}

/**
 * This fund's deployed capital per attributed unit of outcome — an average
 * over everything deployed, not a marginal or per-category cost.
 *
 * @param {number} deployed - KSh
 * @param {number} attributed
 * @returns {number | null} null when there is no attributed outcome to divide by
 */
export function costPerAttributedUnit(deployed, attributed) {
  return attributed > 0 ? deployed / attributed : null
}
