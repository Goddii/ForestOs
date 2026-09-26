// DEMO DATA — which lots each brand product is packed from. Every brand buys
// its private-label tea through a packer, Rift Valley Tea Co., so every lot
// here is one of that packer's own commitments (data/offtaker/commitments.js)
// and still shows as Rift Valley's in the Offtaker Portal: the brand holds a
// share of the packer's lot, not the lot. workspace.test.js checks both that
// every lot belongs to the packer and that no lot is over-allocated.

/**
 * @typedef {Object} SourcingRecord
 * @property {string} id
 * @property {string} productId
 * @property {string} batchTraceId     → lib/batchChain.js
 * @property {number} allocatedKg      made tea reserved for this product
 * @property {'packed' | 'scheduled'} status
 * @property {string} date             packed on, or scheduled for
 */

/** @type {SourcingRecord[]} */
export const SOURCING = [
  { id: 'src-01', productId: 'prd-kil-mau-black', batchTraceId: 'TL-2026-00482', allocatedKg: 420, status: 'packed', date: '2026-09-01' },
  { id: 'src-02', productId: 'prd-kil-chai', batchTraceId: 'TL-2026-00461', allocatedKg: 300, status: 'packed', date: '2026-08-26' },
  { id: 'src-03', productId: 'prd-mc-guest', batchTraceId: 'TL-2026-00482', allocatedKg: 380, status: 'packed', date: '2026-09-02' },
  { id: 'src-04', productId: 'prd-mc-sundowner', batchTraceId: 'TL-2026-00611', allocatedKg: 250, status: 'scheduled', date: '2026-10-06' },
  { id: 'src-05', productId: 'prd-hg-afternoon', batchTraceId: 'TL-2026-00327', allocatedKg: 180, status: 'packed', date: '2026-08-06' },
]
