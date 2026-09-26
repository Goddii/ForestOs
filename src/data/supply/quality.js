// DEMO DATA — see src/lib/contracts/offtaker.js (`QualityMetric`,
// `QualityAssessment`).
//
// Which metrics the quality view shows is configuration: add an entry to
// QUALITY_METRICS and a value to the assessments, and the page picks it up.
// ForestOS does not set pass/fail limits on any of them. Specification limits
// belong to the buyer's own contract with NTZDC, so the portal shows the
// measured value and how it was measured, never a verdict.
import { BATCH_CHAIN } from '../../lib/batchChain'
import { reviewed, submitted } from './events'

/** @type {import('../../lib/contracts/offtaker').QualityMetric[]} */
export const QUALITY_METRICS = [
  {
    id: 'fine_leaf',
    label: 'Fine leaf count',
    unit: '%',
    stage: 'intake',
    method: 'Share of two-leaves-and-a-bud in a sample drawn at the collection-centre weigh-in',
    scaleMax: 100,
  },
  {
    id: 'moisture',
    label: 'Made-tea moisture',
    unit: '%',
    stage: 'factory',
    method: 'Factory laboratory moisture reading on the sealed lot',
    scaleMax: null,
  },
  {
    id: 'taster_score',
    label: 'Taster panel score',
    unit: '/10',
    stage: 'factory',
    method: "The factory tasting panel's own 10-point scale; not comparable across factories",
    scaleMax: 10,
  },
]

export const QUALITY_STAGE_LABELS = { intake: 'Collection centre', factory: 'Factory', laboratory: 'Laboratory' }

// [traceId, fine_leaf, moisture, taster_score, notes, verified?]
const SEED = [
  ['TL-2026-00482', 80, 3.1, 7.8, 'Bright, brisk liquor with a coppery infusion'],
  ['TL-2026-00461', 75, 3.3, 7.4, 'Good colour, medium strength'],
  ['TL-2026-00521', 76, 3.0, 7.6, 'Brisk with a clean finish'],
  ['TL-2026-00604', 73, 3.4, 7.1, 'Even colour, slightly light in the cup'],
  ['TL-2026-00388', 78, 2.9, 7.7, 'Bright and full, well-twisted particles'],
  ['TL-2026-00327', 76, 3.2, 7.3, 'Dense powdery grade, strong colour'],
  ['TL-2026-00611', 81, 3.0, 7.9, 'Bright, brisk, a touch of flowery character'],
  ['TL-2026-00624', 75, 3.2, 7.5, 'Good body, even infusion'],
  ['TL-2026-00630', 74, 3.5, 7.2, 'Medium strength, slightly dull infusion', false],
  ['TL-2026-00637', 78, 3.1, 7.4, 'Strong colour, brisk'],
  ['TL-2026-00645', 73, 3.3, 7.0, 'Light liquor, clean'],
]

const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** @type {import('../../lib/contracts/offtaker').QualityAssessment[]} */
export const QUALITY_ASSESSMENTS = SEED.map(([traceId, fineLeaf, moisture, tasterScore, notes, isVerified = true]) => {
  const record = BATCH_CHAIN.find((entry) => entry.traceId === traceId)
  const at = record.batch.sealedAt
  return {
    id: `QA-${traceId.slice(3)}`,
    batchTraceId: traceId,
    assessedAt: at,
    byRole: 'Factory quality controller',
    byOrgId: 'org-ntzdc',
    grade: record.batch.grade,
    metrics: { fine_leaf: fineLeaf, moisture, taster_score: tasterScore },
    notes,
    documentId: `DOC-${traceId.slice(8)}-QR`,
    verification: isVerified
      ? reviewed(at, addDays(at, 1), addDays(at, 2), { role: 'Zone quality officer', submitterRole: 'Factory quality controller' })
      : [submitted(at, 'Factory quality controller')],
  }
})

export function qualityForBatch(traceId) {
  return QUALITY_ASSESSMENTS.find((assessment) => assessment.batchTraceId === traceId) ?? null
}
