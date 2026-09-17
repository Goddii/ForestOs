// ── Field-capture records arriving from Forest Line ─────────────────────────
// Mock instances of the six record types declared in `contracts/shapes.js`,
// shaped exactly as the sibling Forest Line app (`Forest-Line-App`, branch
// `presentation-v2`) says it will emit them.
//
// Why these exist here: ForestOS has always been able to *show* a verified
// batch. It could not show what the verification rests on. These records are
// the substrate — the per-person work, the reconciliation that catches leaf
// laundering, the payments that make the fair-pay claim auditable, and the
// named human who signed before any of it left the system.
//
// Illustrative only. Figures are consistent with the existing chain: the two
// Kiptunga day lots below sum to the 8,200 kg of `HRV-2026-0412`, which is the
// harvest behind batch 802 in `batchChain.js`.

// Reconciliation tolerance. A lot outside this is an alarm, not a rounding note.
export const VARIANCE_TOLERANCE = 0.005 // ±0.5% of the weighed lot

// ── Work tickets ────────────────────────────────────────────────────────────
// A sample of one day's tickets. A real lot carries 80–95 of these; the
// module states the full count rather than pretending this list is all of them.

const T = (seq, workerId, plotId, quantity, rateKes, at, lotId, status = 'paid') => ({
  ticketId: `WT-2026-${String(seq).padStart(6, '0')}`,
  workerId,
  plotId,
  blockId: 'KIP',
  zoneId: 'SW-MAU',
  task: 'plucking',
  quantity,
  unit: 'kg',
  rateKes,
  recordedAt: at,
  recordedBy: 'SUP-KIP-02',
  dayLotId: lotId,
  status,
  capture: 'supervisor_device',
  gps: { lat: -0.4712, lng: 35.6389 },
})

export const WORK_TICKETS = [
  T(4182, 'RVT-0887', 'KIP-09', 42, 24, '2026-08-18T11:20:00Z', 'LOT-KIP-20260818'),
  T(4183, 'RVT-1042', 'KIP-09', 51, 24, '2026-08-18T11:24:00Z', 'LOT-KIP-20260818'),
  T(4184, 'RVT-1190', 'KIP-09', 38, 24, '2026-08-18T11:31:00Z', 'LOT-KIP-20260818'),
  T(4185, 'RVT-1355', 'KIP-09', 47, 24, '2026-08-18T11:38:00Z', 'LOT-KIP-20260818'),
  // A disputed ticket — the worker's SMS receipt is the control that produced
  // this, and it must be visible rather than quietly corrected.
  T(4186, 'RVT-0459', 'KIP-09', 29, 24, '2026-08-18T11:44:00Z', 'LOT-KIP-20260818', 'disputed'),
  T(4187, 'RVT-0723', 'KIP-01', 44, 24, '2026-08-18T11:52:00Z', 'LOT-KIP-20260818'),
]

// ── Day lots — the reconciliation point ─────────────────────────────────────

const lot = (lotId, blockId, date, ticketCount, ticketsTotalKg, weighedKg, dispatchedTo, harvestId) => {
  const varianceKg = +(weighedKg - ticketsTotalKg).toFixed(1)
  return {
    lotId,
    blockId,
    date,
    ticketCount,
    ticketsTotalKg,
    weighedKg,
    varianceKg,
    varianceStatus:
      Math.abs(varianceKg) / weighedKg <= VARIANCE_TOLERANCE ? 'within_tolerance' : 'flagged',
    closedBy: blockId === 'KIP' ? 'SUP-KIP-02' : 'SUP-TIN-01',
    dispatchedTo,
    harvestId,
  }
}

export const DAY_LOTS = [
  lot('LOT-KIP-20260818', 'KIP', '2026-08-18', 94, 4183, 4180, 'CC-KPT', 'HRV-2026-0412'),
  lot('LOT-KIP-20260819', 'KIP', '2026-08-19', 89, 4018, 4020, 'CC-KPT', 'HRV-2026-0412'),
  // Deliberately flagged. 508 kg of weighed leaf with no ticket behind it is
  // exactly the shape of leaf bought in from outside the buffer to inherit its
  // conservation story. The control is only credible if a failure is visible,
  // so the demo carries one.
  lot('LOT-TIN-20260819', 'TIN', '2026-08-19', 61, 3402, 3910, 'CC-TIN', null),
]

/** The lots a harvest is composed of. */
export function lotsForHarvest(harvestId) {
  return DAY_LOTS.filter((l) => l.harvestId === harvestId)
}

// ── Payments ────────────────────────────────────────────────────────────────
// One week, settled per worker, straight to their own M-Pesa number. The three
// rates are broken out because ForestOS already separates them everywhere else
// — and because the conservation slice is conditional on verified conservation.

const pay = (seq, workerId, ticketIds, baseKes, qualityKes, conservationKes, mpesaRef, notified) => ({
  paymentId: `PAY-2026-${String(seq).padStart(6, '0')}`,
  workerId,
  periodStart: '2026-08-17',
  periodEnd: '2026-08-23',
  ticketIds,
  baseKes,
  qualityPremiumKes: qualityKes,
  conservationPremiumKes: conservationKes,
  totalKes: baseKes + qualityKes + conservationKes,
  channel: 'mpesa',
  mpesaRef,
  approvedBy: 'SUP-KIP-02',
  signedOffBy: 'ZM-SWMAU-01',
  settledAt: '2026-08-25T08:02:00Z',
  workerNotifiedAt: notified,
})

export const PAYMENTS = [
  pay(19844, 'RVT-0887', ['WT-2026-004182'], 5040, 260, 310, 'SGH7K2LQ91', '2026-08-25T08:02:41Z'),
  pay(19845, 'RVT-1042', ['WT-2026-004183'], 6120, 340, 376, 'SGH7K3MT08', '2026-08-25T08:02:44Z'),
  pay(19846, 'RVT-1190', ['WT-2026-004184'], 4560, 190, 280, 'SGH7K4NR22', '2026-08-25T08:02:49Z'),
  pay(19847, 'RVT-1355', ['WT-2026-004185'], 5640, 300, 346, 'SGH7K5PW17', '2026-08-25T08:02:53Z'),
  // Not yet notified — the worker cannot dispute a number they have not seen,
  // so this is an open control gap, not a cosmetic nil.
  pay(19848, 'RVT-0459', ['WT-2026-004186'], 3480, 0, 214, 'SGH7K6QX40', null),
]

// ── Survival checks ─────────────────────────────────────────────────────────
// The answer to "planted AND survived". The bonus follows survival on a
// 40 / 40 / 20 split across planting, 12 months and 24 months — the same money,
// but it buys a forest instead of a planting event.

export const BONUS_SPLIT = [
  { milestone: 'Planting verified', sharePct: 40 },
  { milestone: 'Alive at 12 months', sharePct: 40 },
  { milestone: 'Alive at 24 months', sharePct: 20 },
]

export const SURVIVAL_CHECKS = [
  {
    checkId: 'SVC-2026-00731',
    claimId: 'VC-2048',
    interval: '12m',
    dueAt: '2027-08-20',
    checkedAt: null,
    checkedBy: null,
    planted: 50,
    aliveCount: null,
    survivalRate: null,
    photoUrls: [],
    gps: { lat: -0.4712, lng: 35.6389 },
    ndviAtCheck: null,
    bonusReleasedKes: null,
  },
  {
    checkId: 'SVC-2025-00512',
    claimId: 'VC-1904',
    interval: '12m',
    dueAt: '2026-06-14',
    checkedAt: '2026-06-16T09:14:00Z',
    checkedBy: 'SUP-KIP-02',
    planted: 50,
    aliveCount: 43,
    survivalRate: 0.86,
    photoUrls: ['/media/forests/mau.webp'],
    gps: { lat: -0.4698, lng: 35.6402 },
    ndviAtCheck: 0.69,
    bonusReleasedKes: 1720,
  },
  {
    checkId: 'SVC-2025-00498',
    claimId: 'VC-1877',
    interval: '24m',
    dueAt: '2026-05-02',
    checkedAt: '2026-05-04T10:40:00Z',
    checkedBy: 'SUP-NES-01',
    planted: 80,
    aliveCount: 52,
    survivalRate: 0.65,
    photoUrls: ['/media/forests/mau.webp'],
    gps: { lat: -0.5231, lng: 35.7015 },
    ndviAtCheck: 0.61,
    bonusReleasedKes: 1040,
  },
]

/**
 * Survival-adjusted planting total. The honest figure: trees still standing at
 * their last check, not trees put in the ground.
 */
export function survivalAdjusted() {
  const checked = SURVIVAL_CHECKS.filter((c) => c.survivalRate != null)
  const planted = checked.reduce((s, c) => s + c.planted, 0)
  const alive = checked.reduce((s, c) => s + c.aliveCount, 0)
  const pending = SURVIVAL_CHECKS.filter((c) => c.survivalRate == null)
  return {
    planted,
    alive,
    survivalRate: planted ? alive / planted : 0,
    checksComplete: checked.length,
    checksPending: pending.length,
    pendingTrees: pending.reduce((s, c) => s + c.planted, 0),
  }
}

// ── Sign-off — the gate ─────────────────────────────────────────────────────
// Nothing leaves ForestOS as a "verified" claim unless a sign-off covers its
// period. Automated data plus a named attestation is what an auditor accepts;
// automated data alone is what carbon markets were caught with.

export const SIGN_OFFS = [
  {
    signOffId: 'SGN-SWMAU-2026-08',
    scope: 'zone_period',
    zoneId: 'SW-MAU',
    blockId: null,
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    covers: { workTickets: 2412, dayLots: 30, claims: 41, payments: 1180 },
    exceptionsOpen: 2,
    attestation:
      'I confirm the records in this period were captured under my supervision and reviewed for the exceptions listed.',
    signedBy: 'ZM-SWMAU-01',
    signedAt: '2026-09-02T14:10:00Z',
    hash: 'sha256:9f2c4a17be80d3e5',
  },
  // September is not signed yet — so anything dated into September is not
  // exportable as verified. The gate has to be able to say no, or it is not a
  // gate.
]

/** The sign-off covering a date, or null when the period is unsigned. */
export function signOffCovering(isoDate) {
  return (
    SIGN_OFFS.find((s) => isoDate >= s.periodStart && isoDate <= s.periodEnd) ?? null
  )
}

/**
 * Whether a batch can leave the system as a verified claim: every day lot
 * reconciled, and a sign-off covering the harvest period.
 */
export function exportGate(harvestId, harvestDate) {
  const lots = lotsForHarvest(harvestId)
  const flagged = lots.filter((l) => l.varianceStatus === 'flagged')
  const signOff = signOffCovering(harvestDate)
  const disputed = WORK_TICKETS.filter(
    (t) => t.status === 'disputed' && lots.some((l) => l.lotId === t.dayLotId),
  )
  const unnotified = PAYMENTS.filter((p) => !p.workerNotifiedAt)

  const blockers = []
  if (!signOff) blockers.push('No zone sign-off covers this period')
  if (flagged.length) blockers.push(`${flagged.length} day lot(s) failed reconciliation`)

  const warnings = []
  if (disputed.length) warnings.push(`${disputed.length} disputed work ticket(s) open`)
  if (unnotified.length) warnings.push(`${unnotified.length} payment(s) with no worker SMS receipt`)

  return {
    lots,
    flagged,
    signOff,
    disputed,
    unnotified,
    blockers,
    warnings,
    releasable: blockers.length === 0,
  }
}

/**
 * The corroboration table — for each link in the chain, what independently
 * checks it. This is the column that separates the claim from every "verified"
 * badge that has later embarrassed its issuer, so it is rendered, not implied.
 */
export const CORROBORATION = [
  {
    link: 'Work ticket → day lot',
    by: 'Arithmetic. The lot is physically weighed; tickets must sum to it within tolerance.',
    independent: 'A scale, and the worker’s own SMS receipt',
  },
  {
    link: 'Day lot → plot',
    by: 'Plot geometry is fixed and mapped; Sentinel-2 confirms the polygon was not cleared forest.',
    independent: 'Sentinel-2 (EU-run, free, 10 m)',
  },
  {
    link: 'Plot → agronomic ceiling',
    by: 'A plot of known hectarage cannot exceed a maximum daily yield. Output above it flags.',
    independent: 'Registry hectares',
  },
  {
    link: 'Payment → worker',
    by: 'Daraja transaction id reconciled against the payroll line; money lands on the worker’s own number.',
    independent: 'M-Pesa, and the person being paid',
  },
  {
    link: 'Planting → survival',
    by: 'The same polygon re-checked on schedule, with NDVI over the same period.',
    independent: 'Time, and Sentinel-2',
  },
  {
    link: 'Period → export',
    by: 'A named zone manager attests to the period before any claim leaves.',
    independent: 'A human who can be held responsible',
  },
]

/**
 * The limits we state rather than let an auditor discover. An overclaim that
 * gets caught discards everything else we said.
 */
export const STATED_LIMITS = [
  'Sentinel-2 at 10 m cannot see a single seedling. It corroborates polygon-level canopy trend, not individual trees.',
  'The supervisor records kilos, verifies claims and approves payroll. That concentration is contained by worker SMS receipts, direct M-Pesa, and rotated claim verification — not eliminated.',
  'Once leaf enters a factory that also buys non-buffer leaf, this chain ends unless the factory segregates. That is a commercial dependency, not a software feature.',
]
