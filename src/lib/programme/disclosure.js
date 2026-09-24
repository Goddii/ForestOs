/**
 * Audience projections (audit §9, §14). A funder sees activity-level detail
 * but never internal staff ids, free-text notes (which can carry names) or
 * household counts small enough to identify a family. Pure — returns new
 * objects, never mutates the source record.
 */

/**
 * @param {?{ households: number, womenHeaded: number }} beneficiaries
 * @param {number} floor
 */
function projectBeneficiaries(beneficiaries, floor) {
  if (!beneficiaries) return null
  if (beneficiaries.households < floor) return { households: null, womenHeaded: null, suppressed: true }
  return { ...beneficiaries, suppressed: false }
}

/**
 * @param {import('../contracts/programme').VerificationEvent} event
 */
function withoutNote(event) {
  const copy = { ...event }
  delete copy.note
  return copy
}

/**
 * @param {import('../contracts/programme').ActivityRecord} activity
 * @param {import('../contracts/programme').DisclosurePolicy} policy
 */
export function projectActivity(activity, policy) {
  const projected = {
    ...activity,
    beneficiaries: projectBeneficiaries(activity.beneficiaries, policy.householdFloor),
    verification: activity.verification.map(withoutNote),
  }
  delete projected.recordedBy
  return projected
}
