/**
 * The one verification state machine for anything that can be claimed —
 * activities, observations, expenditures (audit §12). Histories are
 * append-only: nothing here mutates an existing array.
 *
 *   draft → submitted → under_review → verified | rejected | correction_required
 *   correction_required → submitted        (resubmission keeps the history)
 *   verified → under_review                 (reopened on contrary evidence, logged)
 */

/** @typedef {import('../contracts/programme').VerificationState} VerificationState */
/** @typedef {import('../contracts/programme').VerificationEvent} VerificationEvent */

const TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['under_review'],
  under_review: ['verified', 'rejected', 'correction_required'],
  correction_required: ['submitted'],
  verified: ['under_review'],
  rejected: [],
}

const DECISIONS = new Set(['verified', 'rejected', 'correction_required'])

export const STATE_LABELS = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under review',
  verified: 'Verified',
  rejected: 'Rejected',
  correction_required: 'Correction required',
}

export const INDEPENDENCE_LABELS = {
  self: 'Self-reported',
  internal_separate: 'Internal, separate reviewer',
  independent: 'Independent verifier',
  external_audit: 'External audit',
}

/**
 * @param {VerificationState} from
 * @param {VerificationState} to
 * @returns {boolean}
 */
export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to)
}

/**
 * @param {VerificationEvent[]} history
 * @returns {VerificationState}
 */
export function currentState(history) {
  return history.at(-1)?.state ?? 'draft'
}

/**
 * Problems with appending `event` after a history currently in `from`.
 *
 * @param {VerificationState} from
 * @param {VerificationEvent} event
 * @returns {string[]}
 */
function transitionErrors(from, event) {
  const errors = []
  if (!canTransition(from, event.state)) {
    errors.push(`Illegal transition ${from} → ${event.state}`)
  }
  if (event.state === 'verified' && event.independence === 'self') {
    errors.push('A record cannot be verified by the person who recorded it (independence: self)')
  }
  return errors
}

/**
 * Returns a new history with `event` appended. Throws on an illegal
 * transition or self-verification rather than recording a bad state.
 *
 * @param {VerificationEvent[]} history
 * @param {VerificationEvent} event
 * @returns {VerificationEvent[]}
 */
export function appendEvent(history, event) {
  const errors = transitionErrors(currentState(history), event)
  if (errors.length > 0) throw new Error(errors.join('; '))
  return [...history, event]
}

/**
 * @param {VerificationEvent[]} history
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateHistory(history) {
  const errors = []
  let state = 'draft'
  for (const event of history) {
    errors.push(...transitionErrors(state, event))
    state = event.state
  }
  return { valid: errors.length === 0, errors }
}

/**
 * The most recent reviewer decision (verified / rejected / correction
 * required) — what a funder sees next to the state: who decided, how
 * independently, when.
 *
 * @param {VerificationEvent[]} history
 * @returns {VerificationEvent | null}
 */
export function latestDecision(history) {
  return history.findLast((event) => DECISIONS.has(event.state)) ?? null
}
