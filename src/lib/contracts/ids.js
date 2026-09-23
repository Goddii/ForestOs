// ── Forest Line ID conventions ───────────────────────────────────────────────
// One place for the identifier prefixes the Forest Line docs use, so mock data,
// the contract adapters (`src/lib/contracts/adapters.js`) and any future backend
// all speak the same scheme. Prefixes are drawn from the Concept Brief and the
// existing ForestOS data (`RVT-`, `TR-`, `AL-`, `BM-`, `CON-`, `FL-`).

export const ID_PREFIX = {
  farmer: 'RVT', // registered farmer / worker  — RVT-0887
  plot: 'NTZ', // NTZDC block+plot             — NTZ-A-014
  batch: 'TL', // production batch / trace id  — TL-2026-00482
  harvest: 'HRV', // one recorded harvest        — HRV-2026-0412
  verification: 'VER', // verification claim     — VER-0142
  problem: 'PR', // farmer problem report       — PR-0231
  passport: 'CP', // conservation passport       — CP-2026-0007 (brand-facing)
  visitorPassport: 'PSP', // a scanner's own passport — PSP-2026-00931
  conservation: 'CON', // conservation activity  — CON-90218
  fieldReport: 'FL', // field-officer report ref — FL-58291
  auditLog: 'AL', // append-only audit entry    — AL-231
  training: 'TR', // training session            — TR-092
  buffer: 'BM', // buffer-maintenance action    — BM-318
  // Forest Line field-capture records (sibling repo, `presentation-v2`).
  workTicket: 'WT', // one person, one plot, one day — WT-2026-004182
  muster: 'MUS', // a block's daily attendance    — MUS-KIP-20260916
  dayLot: 'LOT', // the reconciliation point      — LOT-KIP-20260916
  payment: 'PAY', // one settled worker payment   — PAY-2026-019844
  survivalCheck: 'SVC', // a re-check of a planting — SVC-2026-00731
  signOff: 'SGN', // a named human's attestation  — SGN-SWMAU-2026-09
}

const pad = (n, width) => String(n).padStart(width, '0')

/** `TL-2026-00482` from (2026, 482). */
export function makeBatchId(year, seq) {
  return `${ID_PREFIX.batch}-${year}-${pad(seq, 5)}`
}

/** `HRV-2026-0412` from (2026, 412). */
export function makeHarvestId(year, seq) {
  return `${ID_PREFIX.harvest}-${year}-${pad(seq, 4)}`
}

/** `VER-0142` from 142. */
export function makeClaimId(seq) {
  return `${ID_PREFIX.verification}-${pad(seq, 4)}`
}

/** `PR-0231` from 231. */
export function makeProblemId(seq) {
  return `${ID_PREFIX.problem}-${pad(seq, 4)}`
}

/** `CP-2026-0007` from (2026, 7). */
export function makePassportId(year, seq) {
  return `${ID_PREFIX.passport}-${year}-${pad(seq, 4)}`
}

/** `PSP-2026-00931` from (2026, 931) — one scanner's durable passport. */
export function makeVisitorPassportId(year, seq) {
  return `${ID_PREFIX.visitorPassport}-${year}-${pad(seq, 5)}`
}

/** True when `id` looks like it uses `prefix` (case-insensitive). */
export function hasPrefix(id, prefix) {
  return typeof id === 'string' && id.toUpperCase().startsWith(`${prefix.toUpperCase()}-`)
}
