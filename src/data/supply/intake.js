// DEMO DATA — see src/lib/contracts/offtaker.js (`IntakeRecord`).
//
// Green leaf received at the collection centre for each batch, and what was
// rejected at the weigh-in and why. `receivedKg` is read from the batch's own
// harvest record and `acceptedKg` is derived from the rejections, so the
// intake can never disagree with the chain. Rejection reasons describe leaf
// condition only; ForestOS applies no quality thresholds of its own.
import { BATCH_CHAIN } from '../../lib/batchChain'
import { centreForBatch } from './collectionCentres'
import { reviewed, submitted, underReview } from './events'

export const REJECTION_REASON_LABELS = {
  coarse_leaf: 'Coarse leaf',
  wet_leaf: 'Wet leaf',
  foreign_matter: 'Foreign matter',
  damaged_leaf: 'Bruised or damaged leaf',
  late_delivery: 'Late delivery to centre',
}

const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** [traceId, rejections, verified?] — everything else is read from the batch record. */
const SEED = [
  ['TL-2026-00482', [['coarse_leaf', 210], ['wet_leaf', 95], ['foreign_matter', 18]]],
  ['TL-2026-00461', [['coarse_leaf', 240], ['damaged_leaf', 60]]],
  ['TL-2026-00521', [['coarse_leaf', 170], ['wet_leaf', 120]]],
  ['TL-2026-00604', [['coarse_leaf', 150], ['late_delivery', 80]]],
  ['TL-2026-00388', [['coarse_leaf', 90], ['wet_leaf', 40]]],
  ['TL-2026-00327', [['coarse_leaf', 260], ['wet_leaf', 150], ['foreign_matter', 22]]],
  ['TL-2026-00611', [['coarse_leaf', 190], ['wet_leaf', 70]]],
  ['TL-2026-00624', [['coarse_leaf', 230], ['damaged_leaf', 45]]],
  ['TL-2026-00630', [['coarse_leaf', 180], ['wet_leaf', 210]], false],
  ['TL-2026-00637', [['coarse_leaf', 140], ['wet_leaf', 60]]],
  ['TL-2026-00645', [['coarse_leaf', 160], ['late_delivery', 120], ['foreign_matter', 30]]],
]

/** @type {import('../../lib/contracts/offtaker').IntakeRecord[]} */
export const INTAKE_RECORDS = SEED.map(([traceId, rejections, isVerified = true]) => {
  const record = BATCH_CHAIN.find((entry) => entry.traceId === traceId)
  const closed = record.harvest.window.split(' – ')[1]
  const rows = rejections.map(([reason, kg]) => ({ reason, kg }))
  const rejectedKg = rows.reduce((sum, row) => sum + row.kg, 0)
  return {
    id: `INT-${traceId.slice(3)}`,
    batchTraceId: traceId,
    centreId: centreForBatch(record)?.id ?? null,
    receivedKg: record.harvest.greenLeafKg,
    acceptedKg: record.harvest.greenLeafKg - rejectedKg,
    rejectedKg,
    rejections: rows,
    verification: isVerified
      ? reviewed(closed, addDays(closed, 1), addDays(closed, 2))
      : [submitted(closed), underReview(addDays(closed, 1))],
  }
})

export function intakeForBatch(traceId) {
  return INTAKE_RECORDS.find((intake) => intake.batchTraceId === traceId) ?? null
}

// Centre-level monthly intake — the aggregate of every weigh-in at a centre,
// not only leaf that ended up in a listed batch. Feeds the quality trends.
// `fineLeafPct` is the share of two-leaves-and-a-bud in the intake sample.
// [centreId, month, receivedKg, rejectedKg, fineLeafPct]
const HISTORY = [
  ['CC-KPT', '2026-04', 41200, 1690, 74], ['CC-KPT', '2026-05', 46800, 1780, 76], ['CC-KPT', '2026-06', 44100, 1550, 77],
  ['CC-KPT', '2026-07', 39800, 1310, 78], ['CC-KPT', '2026-08', 42600, 1360, 80], ['CC-KPT', '2026-09', 40300, 1170, 81],
  ['CC-NES', '2026-04', 33500, 1640, 71], ['CC-NES', '2026-05', 36200, 1700, 72], ['CC-NES', '2026-06', 35100, 1510, 72],
  ['CC-NES', '2026-07', 31900, 1340, 74], ['CC-NES', '2026-08', 34400, 1380, 75], ['CC-NES', '2026-09', 32800, 1250, 75],
  ['CC-MAR', '2026-04', 30100, 1780, 70], ['CC-MAR', '2026-05', 32700, 1860, 71], ['CC-MAR', '2026-06', 31400, 1700, 73],
  ['CC-MAR', '2026-07', 28900, 1530, 74], ['CC-MAR', '2026-08', 31200, 1590, 75], ['CC-MAR', '2026-09', 29600, 1750, 74],
  ['CC-TIN', '2026-04', 21800, 1260, 69], ['CC-TIN', '2026-05', 23500, 1320, 70], ['CC-TIN', '2026-06', 22900, 1240, 71],
  ['CC-TIN', '2026-07', 20700, 1090, 72], ['CC-TIN', '2026-08', 22100, 1140, 72], ['CC-TIN', '2026-09', 21300, 1180, 73],
  ['CC-KAN', '2026-04', 27400, 1370, 73], ['CC-KAN', '2026-05', 29900, 1440, 74], ['CC-KAN', '2026-06', 28600, 1290, 75],
  ['CC-KAN', '2026-07', 26100, 1150, 76], ['CC-KAN', '2026-08', 27800, 1110, 77], ['CC-KAN', '2026-09', 26900, 1030, 78],
  ['CC-WAN', '2026-04', 19600, 820, 75], ['CC-WAN', '2026-05', 21200, 850, 76], ['CC-WAN', '2026-06', 20400, 790, 77],
  ['CC-WAN', '2026-07', 18700, 700, 77], ['CC-WAN', '2026-08', 19900, 720, 78], ['CC-WAN', '2026-09', 19100, 690, 78],
  ['CC-KAP', '2026-04', 22300, 1290, 70], ['CC-KAP', '2026-05', 24100, 1330, 71], ['CC-KAP', '2026-06', 23300, 1210, 72],
  ['CC-KAP', '2026-07', 21000, 1080, 73], ['CC-KAP', '2026-08', 22700, 1120, 73], ['CC-KAP', '2026-09', 21900, 1060, 74],
]

export const CENTRE_INTAKE_HISTORY = HISTORY.map(([centreId, month, receivedKg, rejectedKg, fineLeafPct]) => ({
  centreId,
  month,
  receivedKg,
  acceptedKg: receivedKg - rejectedKg,
  rejectedKg,
  fineLeafPct,
}))
