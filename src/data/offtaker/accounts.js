// DEMO DATA — the buying organisations with portal access. The organisation
// itself lives in the shared registry (data/funder/organisations.js); this
// file holds only what the portal needs on top: what kind of buyer it is and
// which roles its team holds.

/**
 * @typedef {Object} OfftakerAccount
 * @property {string} orgId
 * @property {import('../../lib/contracts/offtaker').BuyerType} buyerType
 * @property {string} market          where the buyer sells, in its own words
 * @property {import('../../lib/contracts/offtaker').OfftakerRole} defaultRole
 * @property {Array<{ role: import('../../lib/contracts/offtaker').OfftakerRole, seats: number }>} team
 * @property {string} onboardedDate
 */

/** @type {OfftakerAccount[]} */
export const OFFTAKER_ACCOUNTS = [
  {
    orgId: 'org-offtaker-rvt',
    buyerType: 'brand_packer',
    market: 'Packed retail tea, Kenya and East Africa',
    defaultRole: 'procurement',
    team: [
      { role: 'procurement', seats: 2 },
      { role: 'quality', seats: 1 },
      { role: 'sustainability', seats: 1 },
      { role: 'admin', seats: 1 },
    ],
    onboardedDate: '2026-03-02',
  },
  {
    orgId: 'org-offtaker-hlc',
    buyerType: 'exporter',
    market: 'Single-origin direct trade, EU importers',
    defaultRole: 'compliance',
    team: [
      { role: 'procurement', seats: 1 },
      { role: 'compliance', seats: 2 },
      { role: 'admin', seats: 1 },
    ],
    onboardedDate: '2026-05-18',
  },
]

export const BUYER_TYPE_LABELS = {
  brand_packer: 'Brand packer',
  exporter: 'Exporter',
  processor: 'Processor',
}

export function accountForOrg(orgId) {
  return OFFTAKER_ACCOUNTS.find((account) => account.orgId === orgId) ?? null
}
