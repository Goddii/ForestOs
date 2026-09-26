// DEMO DATA — the roles a person at a buying organisation can hold, and what
// each role may see. Applied at the workspace boundary
// (data/offtaker/workspace.js) the same way the funder workspace applies its
// disclosure policy: data a role may not see is removed before any page
// renders, not hidden with CSS.
//
// Farmer identities are withheld from every role. EUDR due diligence needs
// plot geolocation, not people, so full-precision plot coordinates go to the
// compliance roles only; everyone else sees the collection centre and a
// coarse (~1 km) plot location.

/**
 * @typedef {Object} RolePermissions
 * @property {boolean} commercialTerms   prices and contract values
 * @property {boolean} plotGeolocation   full-precision plot coordinates and plot geolocation records
 * @property {boolean} qualityMetrics    per-batch laboratory and panel values
 * @property {boolean} reserveLots       can request a reservation on available tea
 */

/** @type {Record<import('../../lib/contracts/offtaker').OfftakerRole, { label: string, description: string, permissions: RolePermissions }>} */
export const OFFTAKER_ROLE_CONFIG = {
  procurement: {
    label: 'Procurement',
    description: 'Sources and contracts tea: availability, volumes, commitments and prices.',
    permissions: { commercialTerms: true, plotGeolocation: false, qualityMetrics: true, reserveLots: true },
  },
  quality: {
    label: 'Quality assurance',
    description: 'Checks what arrives: grades, quality measurements and quality reports.',
    permissions: { commercialTerms: false, plotGeolocation: false, qualityMetrics: true, reserveLots: false },
  },
  compliance: {
    label: 'Compliance & due diligence',
    description: 'Deforestation-free due diligence: plot geolocation, certificates and verification records.',
    permissions: { commercialTerms: false, plotGeolocation: true, qualityMetrics: false, reserveLots: false },
  },
  sustainability: {
    label: 'Sustainability',
    description: 'Origin and conservation claims, and the evidence behind each one.',
    permissions: { commercialTerms: false, plotGeolocation: false, qualityMetrics: false, reserveLots: false },
  },
  admin: {
    label: 'Organisation admin',
    description: 'Manages the organisation and its team; sees everything the organisation is permitted to see.',
    permissions: { commercialTerms: true, plotGeolocation: true, qualityMetrics: true, reserveLots: true },
  },
}

export const PERMISSION_LABELS = {
  commercialTerms: 'Prices and contract values',
  plotGeolocation: 'Full-precision plot geolocation',
  qualityMetrics: 'Per-batch quality measurements',
  reserveLots: 'Request lot reservations',
}

/** What every offtaker may and may not see, whatever the role. Shown on the Organisation page. */
export const OFFTAKER_DISCLOSURE_POLICY = {
  id: 'dp-offtaker',
  audience: 'Offtaker',
  householdFloor: 10,
  visible: [
    'Batches allocated to your organisation, and unallocated lots offered to all buyers',
    'Each batch’s journey from source to buyer, with who verified each stage and how independently',
    'Collection-centre intake totals, rejection reasons and quality measurements',
    'Documents your role is permitted to open',
    'Verified conservation activity in the buffer segments linked to your source centres',
    'Farmer and plucker counts of 10 or more',
  ],
  withheld: [
    'Farmer and worker names, ID numbers, phone numbers and payments',
    'Batches allocated to other buyers, and other buyers’ names and volumes',
    'Weigh-in tickets, supervisor ids and internal reviewer notes',
    'NTZDC staff identities, payroll and operational budgets',
    'Full-precision plot coordinates, except to compliance and admin roles',
    'Counts below 10 (shown as “fewer than 10”)',
  ],
}
