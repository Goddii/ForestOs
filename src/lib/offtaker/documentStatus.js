import { currentState } from '../programme/verificationState'

/**
 * How far ahead of expiry the portal starts flagging a document. A portal
 * notice window, not a regulatory rule — change it here.
 */
export const EXPIRY_NOTICE_DAYS = 60

export const DOCUMENT_STATUS_LABELS = {
  valid: 'Valid',
  expiring: 'Expiring soon',
  expired: 'Expired',
  pending: 'Pending verification',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

const DAY_MS = 86_400_000

/**
 * @param {string} from ISO date
 * @param {string} to ISO date
 * @returns {number} whole days from `from` to `to`
 */
export function daysBetween(from, to) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS)
}

/**
 * One status per document, in priority order: withdrawn beats everything, an
 * unverified document is pending whatever its dates, then expiry.
 *
 * @param {import('../contracts/offtaker').ComplianceDocument} document
 * @param {string} asOf ISO date
 * @returns {keyof typeof DOCUMENT_STATUS_LABELS}
 */
export function documentStatus(document, asOf) {
  if (document.withdrawnReason) return 'withdrawn'
  const state = currentState(document.verification)
  if (state === 'rejected') return 'rejected'
  if (state !== 'verified') return 'pending'
  if (!document.expiryDate) return 'valid'
  const remaining = daysBetween(asOf, document.expiryDate)
  if (remaining < 0) return 'expired'
  if (remaining <= EXPIRY_NOTICE_DAYS) return 'expiring'
  return 'valid'
}

/**
 * A document the buyer is still waiting on: one it needs (`requiredForBuyers`)
 * that is not currently usable.
 *
 * @param {import('../contracts/offtaker').ComplianceDocument} document
 * @param {string} asOf
 * @returns {boolean}
 */
export function isOutstanding(document, asOf) {
  if (!document.requiredForBuyers) return false
  return ['expired', 'pending', 'rejected'].includes(documentStatus(document, asOf))
}
