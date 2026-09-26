/**
 * What a brand may say about its tea, decided from the records rather than
 * the brand's copy. A brand writes a statement and says what kind of fact it
 * asserts; this module looks at the verified records for the lots the
 * product is packed from and returns a verdict, the reason, the evidence and
 * the wording those records support. Pure: nothing here mutates its inputs.
 *
 * Verdicts:
 *  - `approved`       the records support the statement as written
 *  - `reword`         the records support a narrower statement; use the approved wording
 *  - `in_review`      the supporting records exist but are not verified yet
 *  - `not_supported`  no record supports it, or no agreed method exists to support it
 */

import { currentState } from '../programme/verificationState'

/**
 * Conservation work a brand can connect to its tea: planting and protecting
 * the buffer (the same set the Offtaker Portal shows buyers). Livelihood
 * and onboarding records are programme records, not brand claims.
 */
export const BRAND_RELEVANT_INTERVENTIONS = new Set([
  'it-tea-infill',
  'it-fuelwood',
  'it-indigenous',
  'it-patrol',
  'it-audit',
  'it-disturbance',
  'it-boundary',
])

/** How each metric reads in a sentence. Indicators not listed here are not offered to brands. */
const METRIC_PHRASES = {
  'ind-seedlings': (v) => `${v} indigenous tree seedlings planted`,
  'ind-restored-ha': (v) => `${v} ha of indigenous forest cover restored`,
  'ind-tea-ha': (v) => `${v} ha of gaps in the tea buffer infilled`,
  'ind-fuelwood-ha': (v) => `${v} ha of fuelwood plantation established`,
  'ind-patrols': (v) => `${v} forest buffer patrols completed`,
  'ind-plots-audited': (v) => `${v} plots checked in a buffer compliance audit`,
}

const WHERE = 'in the Nyayo Tea Zone buffer where this tea is grown'

/** Order metrics are offered in: what a customer grasps fastest first (trees before audits). */
const METRIC_ORDER = Object.keys(METRIC_PHRASES)

const formatValue = (value) => value.toLocaleString('en-US', { maximumFractionDigits: 1 })
const unique = (items) => [...new Set(items)]

/** The sentence a brand may use for a metric at a given value. */
export function metricWording(indicatorId, value) {
  const phrase = METRIC_PHRASES[indicatorId]
  return phrase ? `${phrase(formatValue(value))} ${WHERE}.` : null
}

function sumOutputs(activities) {
  const totals = new Map()
  for (const activity of activities) {
    for (const output of activity.outputs) {
      if (!METRIC_PHRASES[output.indicatorId]) continue
      const entry = totals.get(output.indicatorId) ?? { value: 0, evidenceIds: [], activityIds: [] }
      totals.set(output.indicatorId, {
        value: entry.value + output.value,
        evidenceIds: unique([...entry.evidenceIds, ...activity.evidenceIds]),
        activityIds: [...entry.activityIds, activity.id],
      })
    }
  }
  return totals
}

function toMetrics(totals, indicatorLabel) {
  return [...totals.entries()]
    .sort(([a], [b]) => METRIC_ORDER.indexOf(a) - METRIC_ORDER.indexOf(b))
    .map(([id, entry]) => ({
    id,
    label: indicatorLabel(id),
    value: entry.value,
    wording: metricWording(id, entry.value),
    evidenceIds: entry.evidenceIds,
    activityIds: entry.activityIds,
  }))
}

/**
 * Everything the verified record says about the landscape behind a set of
 * lots: the centres they came from, the conservation activities in the
 * buffer segments linked to those centres (split by verification state) and
 * the metrics a brand may quote.
 *
 * @param {Array<{ traceId: string, block: { id: string, name: string }, land: { name: string, region: string }, verification: { status: string } }>} lots
 * @param {Array<import('../contracts/programme').ActivityRecord>} activities
 * @param {{ centreForBatch: (lot: any) => ({ id: string, name: string, segmentIds: string[] } | null), indicatorLabel: (id: string) => string }} deps
 */
export function buildEvidenceBase(lots, activities, { centreForBatch, indicatorLabel }) {
  const centres = [...new Map(lots.map(centreForBatch).filter(Boolean).map((centre) => [centre.id, centre])).values()]
  const segmentIds = new Set(centres.flatMap((centre) => centre.segmentIds))
  const linked = activities.filter(
    (activity) => BRAND_RELEVANT_INTERVENTIONS.has(activity.interventionTypeId) && segmentIds.has(activity.segmentId),
  )
  const verified = linked.filter((activity) => currentState(activity.verification) === 'verified')
  const pendingStates = new Set(['submitted', 'under_review', 'correction_required'])
  const pending = linked.filter((activity) => pendingStates.has(currentState(activity.verification)))
  const verifiedTotals = sumOutputs(verified)

  return {
    lots,
    centres,
    segmentIds: [...segmentIds],
    verified,
    pending,
    metrics: toMetrics(verifiedTotals, indicatorLabel),
    pendingMetrics: toMetrics(sumOutputs(pending), indicatorLabel).filter((metric) => !verifiedTotals.has(metric.id)),
  }
}

const verdict = (status, reason, { approvedWording = null, evidenceIds = [] } = {}) => ({ status, reason, approvedWording, evidenceIds })

/** The landscape sentence: the place, then its two largest verified outputs. */
function landscapeWording(base) {
  if (base.metrics.length === 0) return null
  const places = unique(base.lots.map((lot) => lot.block.name)).join(' and ')
  const forest = unique(base.lots.map((lot) => lot.land.name)).join(' and ')
  const highlights = base.metrics
    .slice(0, 2)
    .map((metric) => METRIC_PHRASES[metric.id](formatValue(metric.value)))
    .join(' and ')
  return `This tea is grown on the ${places} buffer of the ${forest}, where ${highlights} have been verified.`
}

function assessOrigin(base) {
  if (base.lots.length === 0) return verdict('not_supported', 'No lot is connected to this product yet, so there is no origin to verify.')
  const unverified = base.lots.filter((lot) => lot.verification.status !== 'Verified')
  const blocks = unique(base.lots.map((lot) => lot.block.name)).join(', ')
  const regions = unique(base.lots.map((lot) => lot.land.region)).join(', ')
  if (unverified.length > 0) {
    return verdict('in_review', `${unverified.length} of ${base.lots.length} connected lots are still being verified against the 2020 forest baseline.`)
  }
  return verdict('approved', `Every connected lot passed the field check and the satellite check against the 2020 forest baseline.`, {
    approvedWording: `Grown on the ${blocks} (${regions}), checked deforestation-free against the 2020 forest baseline.`,
  })
}

function assessLandscape(base) {
  if (base.verified.length > 0) {
    return verdict('approved', `${base.verified.length} verified conservation records in the buffer segments linked to this tea support it. ForestOS recommends the more specific wording.`, {
      approvedWording: landscapeWording(base),
      evidenceIds: unique(base.verified.flatMap((activity) => activity.evidenceIds)),
    })
  }
  if (base.pending.length > 0) return verdict('in_review', 'Conservation work is recorded where this tea grows, but none of it is verified yet.')
  const centres = base.centres.map((centre) => centre.name).join(', ') || 'this tea’s collection centre'
  return verdict('not_supported', `No verified conservation work is linked to ${centres} yet, so the tea cannot be connected to protecting the landscape.`)
}

function assessIntervention(asserts, base) {
  const types = new Set(asserts.interventionTypeIds ?? [])
  const done = base.verified.filter((activity) => types.has(activity.interventionTypeId))
  if (done.length > 0) {
    return verdict('approved', `${done.length} verified record${done.length === 1 ? '' : 's'} of this work in the buffer where this tea grows.`, {
      evidenceIds: unique(done.flatMap((activity) => activity.evidenceIds)),
    })
  }
  if (base.pending.some((activity) => types.has(activity.interventionTypeId))) {
    return verdict('in_review', 'This work is recorded where this tea grows but is not verified yet.')
  }
  return verdict('not_supported', 'No record of this work exists in the buffer segments linked to this tea.')
}

function assessMetric(asserts, base) {
  const metric = base.metrics.find((entry) => entry.id === asserts.indicatorId)
  if (!metric) {
    const pending = base.pendingMetrics.some((entry) => entry.id === asserts.indicatorId)
    return pending
      ? verdict('in_review', 'The records behind this figure are not verified yet.')
      : verdict('not_supported', 'No verified record of this output exists where this tea grows.')
  }
  const options = { approvedWording: metric.wording, evidenceIds: metric.evidenceIds }
  if (asserts.byBrand) {
    return verdict('reword', 'The work was done and verified by NTZDC’s buffer programme, not by the brand. Describe the landscape your tea comes from rather than claiming the work.', options)
  }
  if (asserts.value > metric.value) {
    return verdict('reword', `Verified records support ${formatValue(metric.value)}, not ${formatValue(asserts.value)}.`, options)
  }
  return verdict('approved', `Verified records support ${formatValue(metric.value)}.`, options)
}

/**
 * @param {import('../../data/brand/claims').ClaimAssertion} asserts
 * @param {ReturnType<typeof buildEvidenceBase>} base
 * @returns {{ status: 'approved' | 'reword' | 'in_review' | 'not_supported', reason: string, approvedWording: string | null, evidenceIds: string[] }}
 */
export function assessClaim(asserts, base) {
  switch (asserts.type) {
    case 'origin':
      return assessOrigin(base)
    case 'landscape_support':
      return assessLandscape(base)
    case 'intervention':
      return assessIntervention(asserts, base)
    case 'metric':
      return assessMetric(asserts, base)
    case 'per_unit':
      return verdict('not_supported', 'No agreed method ties planting or protection to an individual pack or cup. ForestOS can support a statement about the landscape, not per unit.', {
        approvedWording: landscapeWording(base),
      })
    case 'carbon':
      return verdict('not_supported', 'ForestOS holds no carbon methodology, baseline or verifier for this tea, so no carbon claim can be made.')
    default:
      return verdict('not_supported', 'ForestOS cannot check this kind of statement.')
  }
}

/** @param {Array<{ status: string }>} assessments */
export function summariseAssessments(assessments) {
  const counts = { approved: 0, reword: 0, in_review: 0, not_supported: 0 }
  for (const { status } of assessments) counts[status] += 1
  return counts
}
