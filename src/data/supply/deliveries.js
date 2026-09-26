// DEMO DATA — see src/lib/contracts/offtaker.js (`DeliveryReconciliation`)
// and `DayLot` / `SignOff` in src/lib/contracts/shapes.js.
//
// The centre → factory handover for each batch: the physically weighed leaf
// against the sum of its weigh-in tickets. This is the seam where
// traceability either holds or fails (leaf bought in from outside the buffer
// would show up as a gap), so a flagged variance is shown to the buyer as an
// exception, not smoothed away. Ticket, worker and supervisor ids stay
// internal; the buyer sees totals, the variance and who signed the period off.
import { BATCH_CHAIN } from '../../lib/batchChain'
import { intakeForBatch } from './intake'
import { reviewed, submitted, underReview } from './events'

// Shown with the variance so the rule is visible, not implied. This is the
// reconciliation tolerance NTZDC's own sign-off applies to its day lots — an
// internal operating rule, not a regulatory threshold.
export const VARIANCE_TOLERANCE_PCT = 1

const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

// [traceId, varianceKg (weighed − tickets), signOffId | null]
const SEED = [
  ['TL-2026-00482', -18, 'SGN-SWMAU-2026-08'],
  ['TL-2026-00461', 12, 'SGN-SWMAU-2026-08'],
  ['TL-2026-00521', -9, 'SGN-SWMAU-2026-08'],
  ['TL-2026-00604', 7, 'SGN-CHER-2026-08'],
  ['TL-2026-00388', -4, 'SGN-ABD-2026-08'],
  ['TL-2026-00327', 15, 'SGN-MTKE-2026-07'],
  ['TL-2026-00611', -11, 'SGN-SWMAU-2026-09'],
  ['TL-2026-00624', 6, 'SGN-SWMAU-2026-09'],
  ['TL-2026-00630', -14, null],
  ['TL-2026-00637', 9, 'SGN-MTKE-2026-09'],
  // Flagged: 2.4% short of the tickets, beyond tolerance. The zone manager
  // accepted the lot after a recount found one day's lot mis-tagged at the
  // centre; the reconciliation stays flagged on the record.
  ['TL-2026-00645', -99, 'SGN-SWMAU-2026-09'],
]

/** @type {import('../../lib/contracts/offtaker').DeliveryReconciliation[]} */
export const DELIVERY_RECONCILIATIONS = SEED.map(([traceId, varianceKg, signOffId]) => {
  const record = BATCH_CHAIN.find((entry) => entry.traceId === traceId)
  const ticketsTotalKg = intakeForBatch(traceId).acceptedKg
  const weighedKg = ticketsTotalKg + varianceKg
  const closed = record.harvest.window.split(' – ')[1]
  const withinTolerance = Math.abs(varianceKg) / ticketsTotalKg <= VARIANCE_TOLERANCE_PCT / 100
  return {
    id: `DLV-${traceId.slice(3)}`,
    batchTraceId: traceId,
    dayLots: 7,
    ticketsTotalKg,
    weighedKg,
    varianceKg,
    varianceStatus: withinTolerance ? 'within_tolerance' : 'flagged',
    dispatchedAt: closed,
    receivedAt: addDays(closed, 1),
    signOffId,
    verification: signOffId
      ? reviewed(addDays(closed, 1), addDays(closed, 2), addDays(closed, 3), { role: 'Zone manager', submitterRole: 'Factory weighbridge clerk' })
      : [submitted(addDays(closed, 1), 'Factory weighbridge clerk'), underReview(addDays(closed, 2), 'Zone manager')],
  }
})

export function deliveryForBatch(traceId) {
  return DELIVERY_RECONCILIATIONS.find((delivery) => delivery.batchTraceId === traceId) ?? null
}
