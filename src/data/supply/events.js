// Shared verification-event builders for the supply-side seed. Same
// `VerificationEvent` shape (and the same state machine) as the programme's
// activity records in `data/funder/activities.js`: roles, never names.

const NTZDC = 'org-ntzdc'

/** @returns {import('../../lib/contracts/programme').VerificationEvent} */
export const submitted = (at, byRole = 'Collection centre clerk', byOrgId = NTZDC) => ({
  state: 'submitted',
  at,
  byRole,
  byOrgId,
  independence: 'self',
})

/** @returns {import('../../lib/contracts/programme').VerificationEvent} */
export const underReview = (at, byRole = 'Zone quality officer', byOrgId = NTZDC) => ({
  state: 'under_review',
  at,
  byRole,
  byOrgId,
  independence: 'internal_separate',
})

/** @returns {import('../../lib/contracts/programme').VerificationEvent} */
export const verifiedBy = (at, byRole = 'Zone quality officer', byOrgId = NTZDC, independence = 'internal_separate', method = 'field') => ({
  state: 'verified',
  at,
  byRole,
  byOrgId,
  independence,
  method,
})

/** submitted → under review → verified, the common happy path. */
export const reviewed = (submittedAt, reviewAt, verifiedAt, reviewer = {}) => [
  submitted(submittedAt, reviewer.submitterRole, reviewer.submitterOrgId),
  underReview(reviewAt, reviewer.role, reviewer.orgId),
  verifiedBy(verifiedAt, reviewer.role, reviewer.orgId, reviewer.independence, reviewer.method),
]
