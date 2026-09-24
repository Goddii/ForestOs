const MS_PER_DAY = 86_400_000

/**
 * Whole calendar days from `fromIso` to `toIso` (negative when `toIso` is
 * earlier). Both are "YYYY-MM-DD" dates, compared in UTC so a timezone never
 * shifts the count.
 *
 * @param {string} fromIso
 * @param {string} toIso
 * @returns {number}
 */
export function daysBetween(fromIso, toIso) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / MS_PER_DAY)
}

/**
 * The next tranche still to arrive — the first one not yet received — with
 * its 1-based position and the days from the data's as-of date to its
 * planned date. Null once every tranche has been received.
 *
 * @template {{ plannedDate: string, receivedKes: number | null }} T
 * @param {T[]} tranches
 * @param {string} asOf
 * @returns {null | { tranche: T, number: number, count: number, daysUntil: number }}
 */
export function nextTranche(tranches, asOf) {
  const index = tranches.findIndex((tranche) => !tranche.receivedKes)
  if (index === -1) return null
  const tranche = tranches[index]
  return { tranche, number: index + 1, count: tranches.length, daysUntil: daysBetween(asOf, tranche.plannedDate) }
}
