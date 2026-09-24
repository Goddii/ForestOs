import { currentState } from './verificationState'

/**
 * Output indicators are computed from activity records, never typed in
 * (audit §12 rule 5). "Verified" counts only activities whose current state
 * is verified; "reported" is everything claimed and not rejected. Funder
 * attribution is direct — through the activity's allocation — not a
 * pro-rata share of the whole programme.
 */

const NOT_REPORTED = new Set(['draft', 'rejected'])

/**
 * @param {number} value
 * @param {?number} target
 * @returns {?number} 0–100, or null when there is no target
 */
export function progressPct(value, target) {
  if (!target) return null
  return Math.min(100, Math.round((value / target) * 100))
}

/**
 * @param {import('../contracts/programme').Indicator} indicator
 * @param {import('../contracts/programme').ActivityRecord[]} activities
 * @param {Set<string>} fundedAllocationIds - this funder's allocation ids
 */
export function summarizeIndicator(indicator, activities, fundedAllocationIds) {
  const rows = activities
    .map((activity) => {
      const output = activity.outputs.find((entry) => entry.indicatorId === indicator.id)
      return output ? { activity, value: output.value, state: currentState(activity.verification) } : null
    })
    .filter((row) => row && row.state !== 'draft')

  const sum = (predicate) => rows.filter(predicate).reduce((total, row) => total + row.value, 0)
  const isFunded = (row) => fundedAllocationIds.has(row.activity.allocationId)
  const isReported = (row) => !NOT_REPORTED.has(row.state)
  const isVerified = (row) => row.state === 'verified'

  return {
    indicator,
    target: indicator.target,
    reported: sum(isReported),
    verified: sum(isVerified),
    fundedReported: sum((row) => isFunded(row) && isReported(row)),
    fundedVerified: sum((row) => isFunded(row) && isVerified(row)),
    activities: rows,
  }
}
