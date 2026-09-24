// Most urgent first: an unverified payment shows the most urgent state
// among the activities it paid for.
const URGENCY = ['rejected', 'correction_required', 'under_review']

/**
 * One status per ledger payment, combining the payment's own verification
 * with the state of the activities it paid for, so a row never carries two
 * competing badges:
 * - `verified` — the payment's work has been verified;
 * - `rejected` / `correction_required` / `under_review` — the most urgent
 *   decision state among its activities;
 * - `awaiting_evidence` — nothing decided and no evidence submitted yet;
 * - `awaiting_verification` — evidence submitted, no decision yet.
 *
 * @param {{ status: string, evidenceIds: string[], activityIds?: string[] }} row
 * @param {(activityId: string) => string | undefined} stateOf - an activity's current verification state
 * @returns {'verified' | 'rejected' | 'correction_required' | 'under_review' | 'awaiting_evidence' | 'awaiting_verification'}
 */
export function paymentStatus(row, stateOf) {
  if (row.status === 'verified') return 'verified'
  const states = new Set((row.activityIds ?? []).map(stateOf))
  const urgent = URGENCY.find((state) => states.has(state))
  if (urgent) return urgent
  return row.evidenceIds.length === 0 ? 'awaiting_evidence' : 'awaiting_verification'
}
