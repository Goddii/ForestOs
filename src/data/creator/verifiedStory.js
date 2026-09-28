// The verified ForestOS layer a creative partner receives: a simplified,
// public-safe story for one batch. Codes are issued per batch, so every
// pack opens the story of the batch it was filled from. Every value is read
// from the canonical batch record (lib/batchChain.js); nothing here is typed
// in by hand, and a creator can never edit it.
//
// Left out on purpose: anything the public record redacts (plot coordinates,
// grower identities, prices) and any figure whose method is not agreed. A
// `method_pending` figure is shown only with that status, never as verified
// (PUBLIC_CLAIM_BASIS). A batch whose verification is not complete says so,
// and pack codes on it stay blocked (lib/creator/experience.js).

import { PUBLIC_CLAIM_BASIS, findBatchRecord } from '../../lib/batchChain'

/**
 * @typedef {Object} VerifiedFact
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {'verified' | 'method_pending'} status
 * @property {string} source   where the figure comes from, in plain words
 */

const fact = (id, label, value, source, status = 'verified') => ({ id, label, value, status, source })

const listed = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0] ?? '')

/**
 * @param {string} batchId  the short batch code printed on the pack
 */
export function verifiedStoryFor(batchId) {
  const record = findBatchRecord(batchId)
  if (!record) return null
  const { land, block, plot, verification, community } = record
  const isVerified = verification.status === 'Verified'

  const landscape = [
    fact('landscape', 'Landscape', land.name, 'ForestOS landscape register'),
    fact('region', 'Region', land.region, 'ForestOS landscape register'),
    fact('block', 'Forest block', block.name, 'ForestOS landscape register'),
    fact('source-location', 'Source location', plot.centre, 'Batch record, collection centre'),
  ]
  const activity = [
    fact('patrols', 'Forest patrols this month', String(block.patrolsThisMonth), 'Block patrol log'),
    fact('seedlings', 'Indigenous seedlings planted', block.seedlingsPlanted.toLocaleString('en-GB'), 'Block planting log'),
    fact('canopy', 'Canopy cover, 2020 to now', `${plot.canopyBaseline2020Pct}% to ${plot.canopyNowPct}%`, `Satellite check, ${verification.satellite.source}`),
    fact('growers', 'Growers represented', String(community.farmersRepresented), 'Batch record'),
  ]
  const pending =
    record.hectaresPreserved == null
      ? []
      : [
          fact(
            'hectares',
            'Hectares preserved for this batch',
            `${record.hectaresPreserved} ha`,
            PUBLIC_CLAIM_BASIS.hectaresPreserved.method,
            PUBLIC_CLAIM_BASIS.hectaresPreserved.status,
          ),
        ]

  const statements = isVerified
    ? [
        { id: 'st-origin', text: `This tea was grown beside the ${land.name}, which feeds the ${listed(land.waterTowers)}.`, basis: 'landscape' },
        { id: 'st-patrols', text: `Rangers patrolled the ${block.name} ${block.patrolsThisMonth} times this month.`, basis: 'patrols' },
        { id: 'st-seedlings', text: `${block.seedlingsPlanted.toLocaleString('en-GB')} indigenous seedlings have been planted in the block this tea comes from.`, basis: 'seedlings' },
        {
          id: 'st-canopy',
          text: `Satellite checks show canopy cover in this block rising from ${plot.canopyBaseline2020Pct}% in 2020 to ${plot.canopyNowPct}% today.`,
          basis: 'canopy',
        },
      ]
    : []

  return {
    batchId: record.id,
    traceId: record.traceId,
    proofUrl: `/batch/${record.id}`,
    isVerified,
    sealedAt: record.batch.sealedAt,
    madeTeaKg: record.batch.madeTeaKg,
    verification: {
      standard: verification.standard,
      status: verification.status,
      fieldCheck: `Field check ${verification.field.status.toLowerCase()} by ${verification.field.by}, ${verification.field.date}`,
      satelliteCheck: `Satellite check ${verification.satellite.status.toLowerCase()}, ${verification.satellite.source}${verification.satellite.date === '—' ? '' : `, ${verification.satellite.date}`}`,
    },
    landscape,
    activity,
    pending,
    statements,
  }
}

/** Things a creator is told plainly they will not see, so the gap is not a surprise. */
export const WITHHELD_FROM_CREATORS = [
  'Exact plot locations and boundaries',
  'Grower names, phone numbers and payments',
  'Prices, contracts and buyer details',
  'Field reports that are still under review',
]
