// ── Collection Centre (staff) view — mock data ───────────────────────────────
// Edwin's Q1 names "NTZDC field and collection centre staff" as a distinct
// primary user who "require an app or dashboard", and Q2 says plainly:
// "Collection centre staff should verify and enter the final transaction
// data." The existing NTZDC Operations view is a supervisor's console — queues,
// reports, roll-ups — and had nowhere to *enter* a delivery. This file backs
// the entry surface.
//
// The capture list is Edwin's, field for field (Q2):
//   Farmer ID · Collection centre · Buffer zone · Total kg delivered ·
//   Accepted kg · Rejected kg · Reason for rejection · Price per kg ·
//   Amount payable
// plus "The farmer can receive an SMS confirmation" and "The price per kg must
// be configurable" — the price stack is read from the operator's published
// figures (`NTZDC.pricing`), never typed in at the centre.
//
// Q10 is explicit that no percentage split is agreed yet, so every rate here is
// the published prototype figure and is labelled as such on screen.
//
// Illustrative only — there is no ForestOS backend.

import { NTZDC } from './ntzdc'

/** Buffer zone per centre — Edwin's Q4 Phase 1 traceability stops at this level. */
export const CENTRES = [
  { id: 'CC-KPT', name: 'Kiptunga', bufferZone: 'Mau Forest', block: 'Kiptunga Block' },
  { id: 'CC-NES', name: 'Nessuit', bufferZone: 'Mau Forest', block: 'Nessuit Block' },
  { id: 'CC-MAR', name: 'Mariashoni', bufferZone: 'Mau Forest', block: 'Mariashoni Block' },
  { id: 'CC-TIN', name: 'Tinet', bufferZone: 'Mau Forest', block: 'Tinet Block' },
]

/** The controlled vocabulary a sorter picks from — free text would not aggregate. */
export const REJECTION_REASONS = [
  'Coarse leaf (3+ leaf)',
  'High moisture',
  'Foreign matter',
  'Late delivery window',
  'Pest / disease damage',
]

/**
 * The operator's published rate, assembled from the same configurator the
 * Price Configurator module edits. `conservation` is the conditional slice —
 * it is only released against verified conservation (see
 * `ntzdcManagement.js`), which is why it is separated here rather than folded
 * into one number.
 */
export function publishedRate() {
  const { baseRateKes, components, lastPublished } = NTZDC.pricing
  const by = Object.fromEntries(components.map((c) => [c.key, c.kes]))
  return {
    baseKes: baseRateKes,
    qualityKes: by.quality ?? 0,
    conservationKes: by.conservation ?? 0,
    settlementKes: by.settlement ?? 0,
    totalKes: baseRateKes + (by.quality ?? 0) + (by.conservation ?? 0) + (by.settlement ?? 0),
    lastPublished,
  }
}

/** Amount payable = accepted kg × published rate. Rejected leaf is not paid for. */
export function amountPayable(acceptedKg, rate = publishedRate()) {
  return {
    base: acceptedKg * rate.baseKes,
    quality: acceptedKg * rate.qualityKes,
    conservation: acceptedKg * rate.conservationKes,
    settlement: acceptedKg * rate.settlementKes,
    total: acceptedKg * rate.totalKes,
  }
}

/**
 * The SMS the farmer receives. This is the only channel most farmers have
 * (Edwin: "Farmers should mainly use USSD and SMS"), so the centre screen shows
 * the exact text rather than a "notification sent" tick — a 160-character
 * budget is a real design constraint and staff should see it.
 */
export function deliverySms({ farmerId, centre, totalKg, acceptedKg, rejectedKg, reason, rateKes, payableKes }) {
  const lines = [
    `NTZDC ${centre}`,
    `${farmerId}`,
    `Delivered ${totalKg}kg, accepted ${acceptedKg}kg`,
    rejectedKg > 0 ? `Rejected ${rejectedKg}kg: ${reason}` : 'No rejection',
    `Rate KES ${rateKes}/kg`,
    `Payable KES ${payableKes.toLocaleString()}`,
  ]
  return lines.join('. ') + '.'
}

// ── Farmer registry ─────────────────────────────────────────────────────────
// Q11: "ForestOS should track quality performance by farmer." The existing
// modules aggregate rejection by centre and zone, which cannot answer "which
// farmer needs help". Deliveries are per-farmer here so that question has an
// answer, and so Q12's data-triggered training has something to trigger on.
//
// Phone numbers are masked: the centre needs to confirm an SMS destination,
// not to expose a full number on a shared screen.

const F = (farmerId, centre, phoneTail, deliveries, training = []) => ({
  farmerId,
  centre,
  phoneMasked: `+254 7•• ••• ${phoneTail}`,
  deliveries,
  training,
})

const D = (date, totalKg, acceptedKg, reason = null) => ({ date, totalKg, acceptedKg, reason })

export const FARMERS = [
  // Trained mid-window, and the rejection rate fell afterwards — the case that
  // shows the intervention worked.
  F('RVT-0887', 'Tinet', '412', [
    D('2026-07-14', 52, 41, 'Coarse leaf (3+ leaf)'),
    D('2026-07-28', 49, 38, 'Coarse leaf (3+ leaf)'),
    D('2026-08-11', 54, 43, 'Coarse leaf (3+ leaf)'),
    D('2026-08-25', 51, 48),
    D('2026-09-01', 50, 48),
    D('2026-09-07', 53, 52),
  ], [{ id: 'TR-088', topic: 'Fine plucking standard', date: '2026-08-18' }]),

  // Trained, and the rate did not improve — the case the system must not hide.
  F('RVT-0723', 'Mariashoni', '907', [
    D('2026-07-16', 39, 30, 'High moisture'),
    D('2026-07-30', 42, 33, 'High moisture'),
    D('2026-08-13', 40, 31, 'High moisture'),
    D('2026-08-27', 38, 29, 'High moisture'),
    D('2026-09-03', 41, 31, 'High moisture'),
    D('2026-09-07', 39, 30, 'High moisture'),
  ], [{ id: 'TR-085', topic: 'Moisture handling & shade drying', date: '2026-08-20' }]),

  // Untrained and deteriorating — should surface as a training trigger.
  F('RVT-0459', 'Tinet', '188', [
    D('2026-07-15', 57, 54),
    D('2026-07-29', 55, 50),
    D('2026-08-12', 58, 49, 'Coarse leaf (3+ leaf)'),
    D('2026-08-26', 56, 45, 'Coarse leaf (3+ leaf)'),
    D('2026-09-02', 57, 44, 'Coarse leaf (3+ leaf)'),
    D('2026-09-07', 54, 41, 'Coarse leaf (3+ leaf)'),
  ]),

  F('RVT-0912', 'Tinet', '355', [
    D('2026-07-17', 50, 44, 'Late delivery window'),
    D('2026-07-31', 48, 40, 'Late delivery window'),
    D('2026-08-14', 52, 41, 'Late delivery window'),
    D('2026-08-28', 49, 39, 'Late delivery window'),
    D('2026-09-04', 51, 38, 'Late delivery window'),
    D('2026-09-07', 50, 38, 'Late delivery window'),
  ]),

  F('RVT-0634', 'Mariashoni', '664', [
    D('2026-07-18', 41, 35, 'Foreign matter'),
    D('2026-08-01', 43, 36, 'Foreign matter'),
    D('2026-08-15', 40, 34, 'Foreign matter'),
    D('2026-08-29', 42, 33, 'Foreign matter'),
    D('2026-09-05', 41, 33, 'Foreign matter'),
    D('2026-09-07', 43, 34, 'Foreign matter'),
  ]),

  // Consistently clean — the comparison that makes a rejection rate mean something.
  F('RVT-1042', 'Kiptunga', '021', [
    D('2026-07-14', 48, 47),
    D('2026-07-28', 47, 47),
    D('2026-08-11', 49, 48),
    D('2026-08-25', 48, 48),
    D('2026-09-01', 50, 49),
    D('2026-09-07', 48, 47),
  ]),

  F('RVT-1190', 'Nessuit', '530', [
    D('2026-07-15', 61, 60),
    D('2026-07-29', 59, 58),
    D('2026-08-12', 62, 60),
    D('2026-08-26', 60, 59),
    D('2026-09-02', 61, 60),
    D('2026-09-07', 60, 59),
  ]),

  F('RVT-1355', 'Kiptunga', '774', [
    D('2026-07-16', 44, 43),
    D('2026-07-30', 45, 43),
    D('2026-08-13', 43, 41),
    D('2026-08-27', 46, 44),
    D('2026-09-03', 44, 42),
    D('2026-09-07', 45, 44),
  ]),
]

/** Rejection rate over a set of deliveries, as a decimal fraction. */
function rateOf(deliveries) {
  const total = deliveries.reduce((s, d) => s + d.totalKg, 0)
  if (!total) return 0
  const rejected = deliveries.reduce((s, d) => s + (d.totalKg - d.acceptedKg), 0)
  return rejected / total
}

/**
 * The training trigger thresholds. Q12: "Training should be triggered by data
 * — high rejection rates, repeat quality problems, farmers requiring
 * intervention." These are the prototype's stated thresholds, editable once
 * NTZDC sets real ones.
 */
export const TRIGGERS = {
  highRejectionRate: 0.12, // over the window
  repeatReasonCount: 3, // same reason this many times
}

/**
 * Per-farmer quality performance, plus whether the data asks for an
 * intervention and — where training already happened — whether it worked.
 */
export function farmerQuality(farmer) {
  const { deliveries, training } = farmer
  const totalKg = deliveries.reduce((s, d) => s + d.totalKg, 0)
  const acceptedKg = deliveries.reduce((s, d) => s + d.acceptedKg, 0)
  const rejectionRate = rateOf(deliveries)

  // Repeat quality problems: the most frequent single reason.
  const counts = {}
  deliveries.forEach((d) => {
    if (d.reason) counts[d.reason] = (counts[d.reason] ?? 0) + 1
  })
  const [topReason, topReasonCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [null, 0]

  const lastTraining = training.length ? training[training.length - 1] : null

  // Q12's second half — did quality improve after the session?
  let beforeRate = null
  let afterRate = null
  let improved = null
  if (lastTraining) {
    const before = deliveries.filter((d) => d.date < lastTraining.date)
    const after = deliveries.filter((d) => d.date >= lastTraining.date)
    if (before.length && after.length) {
      beforeRate = rateOf(before)
      afterRate = rateOf(after)
      improved = afterRate < beforeRate
    }
  }

  // An intervention is warranted on the data, and has not already been tried.
  const triggered =
    rejectionRate >= TRIGGERS.highRejectionRate || topReasonCount >= TRIGGERS.repeatReasonCount
  const needsTraining = triggered && !lastTraining
  // Trained, still triggering — the case that needs a different intervention,
  // not a repeat of the same session.
  const trainingIneffective = Boolean(lastTraining) && improved === false

  return {
    farmerId: farmer.farmerId,
    centre: farmer.centre,
    deliveryCount: deliveries.length,
    totalKg,
    acceptedKg,
    rejectedKg: totalKg - acceptedKg,
    rejectionRate,
    topReason,
    topReasonCount,
    lastTraining,
    beforeRate,
    afterRate,
    improved,
    needsTraining,
    trainingIneffective,
    triggered,
    series: deliveries.map((d) => +(((d.totalKg - d.acceptedKg) / d.totalKg) * 100).toFixed(1)),
  }
}

/** Every farmer's quality record, worst rejection rate first. */
export function farmerQualityTable() {
  return FARMERS.map(farmerQuality).sort((a, b) => b.rejectionRate - a.rejectionRate)
}

/** The farmers the data says to act on, and why. */
export function trainingTriggers() {
  return farmerQualityTable()
    .filter((q) => q.needsTraining || q.trainingIneffective)
    .map((q) => ({
      ...q,
      action: q.trainingIneffective ? 'escalate' : 'schedule',
      because:
        q.rejectionRate >= TRIGGERS.highRejectionRate
          ? `Rejection ${(q.rejectionRate * 100).toFixed(1)}% over ${q.deliveryCount} deliveries`
          : `${q.topReasonCount}× repeat: ${q.topReason}`,
    }))
}

/** Roll-up for the centre view's KPI row. */
export function centreQualitySummary() {
  const rows = farmerQualityTable()
  const totalKg = rows.reduce((s, r) => s + r.totalKg, 0)
  const rejectedKg = rows.reduce((s, r) => s + r.rejectedKg, 0)
  const triggers = trainingTriggers()
  const trained = rows.filter((r) => r.lastTraining)
  return {
    farmers: rows.length,
    totalKg,
    rejectedKg,
    rejectionRate: totalKg ? rejectedKg / totalKg : 0,
    triggerCount: triggers.length,
    trainedCount: trained.length,
    improvedCount: trained.filter((r) => r.improved).length,
  }
}

/** Look a farmer up for the entry form. */
export function findFarmer(farmerId) {
  const needle = String(farmerId).trim().toUpperCase()
  return FARMERS.find((f) => f.farmerId.toUpperCase() === needle) ?? null
}
