import { currentState } from '../programme/verificationState'
import { formatKg } from './format'

/**
 * "Can I source this tea with confidence?" answered as four checks, each
 * derived from the buyer's scoped workspace — never a score, and never a
 * judgement of quality levels (ForestOS sets no quality thresholds). Each
 * check says what it rests on and where to look.
 *
 * @param {import('../../data/offtaker/workspace').OfftakerWorkspace} ws
 * @returns {Array<{ key: string, title: string, status: 'verified' | 'pending' | 'flagged', headline: string, detail: string, to: string }>}
 */
export function sourcingConfidence(ws) {
  const exceptions = ws.batches.filter((batch) => batch.journey.exceptions.length > 0)
  const pendingTrace = ws.batches.filter((batch) => !batch.journey.fullyTraced && batch.journey.exceptions.length === 0)
  const { traceability } = ws.totals

  const qualityStates = ws.allocated.map((batch) => (batch.quality ? currentState(batch.quality.verification) : 'draft'))
  const qualityVerified = qualityStates.filter((state) => state === 'verified').length

  const required = ws.documents.filter((document) => document.outstanding)
  const lapsed = required.filter((document) => ['expired', 'rejected'].includes(document.status))

  const { connectedKg, allocatedKg } = ws.conservation.connection
  const unsupported = ws.conservation.claims.filter((claim) => claim.basis === 'unsupported' || claim.basis === 'method_pending').length

  return [
    {
      key: 'traceability',
      title: 'Traceability',
      status: exceptions.length ? 'flagged' : pendingTrace.length ? 'pending' : 'verified',
      headline: `${traceability.pct}% of visible volume fully traced`,
      detail: exceptions.length
        ? `${exceptions.map((batch) => batch.traceId).join(', ')} has a recorded exception. ${pendingTrace.length} more awaiting verification.`
        : pendingTrace.length
          ? `${pendingTrace.map((batch) => batch.traceId).join(', ')} still awaiting verification at one or more stages.`
          : 'Every visible batch is verified from source plot to sealed batch.',
      to: 'traceability',
    },
    {
      key: 'quality',
      title: 'Quality',
      status: qualityStates.includes('rejected') ? 'flagged' : qualityVerified === ws.allocated.length ? 'verified' : 'pending',
      headline: `${qualityVerified} of ${ws.allocated.length} of your batches have a verified quality record`,
      detail: 'Measured values and how they were measured. Your contract sets the specification, not ForestOS.',
      to: 'quality',
    },
    {
      key: 'compliance',
      title: 'Compliance',
      status: lapsed.length ? 'flagged' : required.length ? 'pending' : 'verified',
      headline: required.length ? `${required.length} required document${required.length === 1 ? '' : 's'} outstanding` : 'No required documents outstanding',
      detail: lapsed.length
        ? `${lapsed.map((document) => document.title).join('; ')}.`
        : required.length
          ? 'Awaiting verification. Counts only documents your role can open.'
          : `All ${ws.documents.length} documents visible to your role are usable.`,
      to: 'compliance',
    },
    {
      key: 'origin',
      title: 'Origin & impact',
      status: allocatedKg > 0 && connectedKg > 0 ? 'verified' : 'pending',
      headline:
        allocatedKg > 0
          ? `${formatKg(connectedKg)} of ${formatKg(allocatedKg)} from centres with verified conservation work`
          : 'No tea sourced yet',
      detail: `${unsupported} origin statement${unsupported === 1 ? '' : 's'} in circulation that ${unsupported === 1 ? 'is' : 'are'} not verified. Check before using them in claims.`,
      to: 'origin',
    },
  ]
}
