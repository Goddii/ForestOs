// DEMO DATA — see src/lib/contracts/offtaker.js (`Commitment`).
//
// Buyers' orders against NTZDC supply. A batch listed here belongs to that
// buyer: it disappears from every other buyer's portal. Prices are
// illustrative placeholders, not NTZDC's commercial terms.

/** @type {import('../../lib/contracts/offtaker').Commitment[]} */
export const COMMITMENTS = [
  {
    id: 'CMT-2026-0008',
    offtakerOrgId: 'org-offtaker-rvt',
    type: 'contract',
    reference: 'RVT-PO-2026-031',
    period: { start: '2026-07-01', end: '2026-09-30' },
    volumeKg: 5000,
    batchTraceIds: ['TL-2026-00327', 'TL-2026-00461', 'TL-2026-00482'],
    status: 'delivered',
    priceKesPerKg: 395,
    schedule: [
      { date: '2026-08-05', volumeKg: 1310, batchTraceId: 'TL-2026-00327', status: 'delivered' },
      { date: '2026-08-24', volumeKg: 1520, batchTraceId: 'TL-2026-00461', status: 'delivered' },
      { date: '2026-09-01', volumeKg: 1840, batchTraceId: 'TL-2026-00482', status: 'delivered' },
    ],
  },
  {
    id: 'CMT-2026-0014',
    offtakerOrgId: 'org-offtaker-rvt',
    type: 'contract',
    reference: 'RVT-PO-2026-044',
    period: { start: '2026-10-01', end: '2026-12-31' },
    volumeKg: 6000,
    batchTraceIds: ['TL-2026-00611'],
    status: 'confirmed',
    priceKesPerKg: 405,
    schedule: [
      { date: '2026-10-06', volumeKg: 1720, batchTraceId: 'TL-2026-00611', status: 'scheduled' },
      { date: '2026-11-10', volumeKg: 2200, batchTraceId: null, status: 'scheduled' },
      { date: '2026-12-08', volumeKg: 2080, batchTraceId: null, status: 'scheduled' },
    ],
  },
  {
    id: 'CMT-2026-0006',
    offtakerOrgId: 'org-offtaker-hlc',
    type: 'spot',
    reference: 'HLC-2026-0619',
    period: { start: '2026-08-01', end: '2026-08-31' },
    volumeKg: 980,
    batchTraceIds: ['TL-2026-00388'],
    status: 'delivered',
    priceKesPerKg: 430,
    schedule: [{ date: '2026-08-20', volumeKg: 980, batchTraceId: 'TL-2026-00388', status: 'delivered' }],
  },
  {
    id: 'CMT-2026-0011',
    offtakerOrgId: 'org-offtaker-hlc',
    type: 'spot',
    reference: 'HLC-2026-0922',
    period: { start: '2026-09-20', end: '2026-10-31' },
    volumeKg: 1150,
    batchTraceIds: ['TL-2026-00637'],
    status: 'reserved',
    priceKesPerKg: 418,
    schedule: [{ date: '2026-10-14', volumeKg: 1150, batchTraceId: 'TL-2026-00637', status: 'scheduled' }],
  },
]

export const COMMITMENT_STATUS_LABELS = {
  requested: 'Requested',
  reserved: 'Reserved',
  confirmed: 'Confirmed',
  in_transit: 'In transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

/** Commitments still carrying undelivered volume. */
export const OPEN_COMMITMENT_STATUSES = new Set(['requested', 'reserved', 'confirmed', 'in_transit'])
