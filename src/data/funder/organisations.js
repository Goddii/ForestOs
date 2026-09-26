// DEMO DATA — see src/lib/contracts/programme.js (`Organisation`).
//
// Funder A stands in for ABSA until NTZDC confirms the programme's details
// (audit §15): no ABSA name, logo, budget or requirement is invented here.
// Funder B is a generic impact-investment fund — the second funder exists to
// prove the workspace is funder-agnostic, not to represent a real party.

/** @type {Array<import('../../lib/contracts/programme').Organisation & { note?: string }>} */
export const ORGANISATIONS = [
  {
    id: 'org-ntzdc',
    slug: 'ntzdc',
    name: 'Nyayo Tea Zones Development Corporation',
    type: 'implementer',
    isPlaceholder: false,
  },
  {
    id: 'org-forestos',
    slug: 'forestos',
    name: 'ForestOS',
    type: 'technology',
    isPlaceholder: false,
  },
  {
    id: 'org-funder-a',
    slug: 'funder-a',
    name: 'Funder A',
    note: 'Placeholder for ABSA, agreement details not yet confirmed',
    type: 'funder',
    isPlaceholder: true,
  },
  {
    id: 'org-funder-b',
    slug: 'funder-b',
    name: 'Funder B (conservation capital fund)',
    note: 'Generic demo investor',
    type: 'funder',
    isPlaceholder: true,
  },
  {
    id: 'org-county',
    slug: 'county',
    name: 'County government',
    note: 'In-kind co-funder (demo)',
    type: 'government',
    isPlaceholder: true,
  },
  {
    id: 'org-verifier',
    slug: 'verifier',
    name: 'Independent verification partner',
    type: 'verifier',
    isPlaceholder: true,
  },
  // Document issuers for the Offtaker Portal's compliance library. Generic on
  // purpose: no real certification body, laboratory or regulator is named
  // until NTZDC confirms who actually issues each document.
  {
    id: 'org-certifier',
    slug: 'certifier',
    name: 'Accredited certification body',
    note: 'Placeholder issuer for food-safety and sustainability certificates',
    type: 'verifier',
    isPlaceholder: true,
  },
  {
    id: 'org-lab',
    slug: 'tea-lab',
    name: 'Independent tea testing laboratory',
    note: 'Placeholder issuer for laboratory reports',
    type: 'verifier',
    isPlaceholder: true,
  },
  {
    id: 'org-regulator',
    slug: 'regulator',
    name: 'Tea sector regulator',
    note: 'Placeholder issuer for factory and export licences',
    type: 'government',
    isPlaceholder: true,
  },
  // Offtakers — organisations buying tea from the Nyayo Tea Zone. Both names
  // already appear on batches in `lib/batchChain.js` and are fictional
  // placeholders (see `lib/brands.js`), not real customers.
  {
    id: 'org-offtaker-rvt',
    slug: 'rift-valley-tea',
    name: 'Rift Valley Tea Co.',
    note: 'Demo brand packer',
    type: 'offtaker',
    isPlaceholder: true,
  },
  {
    id: 'org-offtaker-hlc',
    slug: 'highland-leaf',
    name: 'Highland Leaf Collective',
    note: 'Demo direct-trade exporter',
    type: 'offtaker',
    isPlaceholder: true,
  },
]

export function getOrganisation(id) {
  return ORGANISATIONS.find((org) => org.id === id) ?? null
}

export function getOrganisationBySlug(slug) {
  return ORGANISATIONS.find((org) => org.slug === slug) ?? null
}

export const FUNDER_ORGANISATIONS = ORGANISATIONS.filter((org) => org.type === 'funder')

export const OFFTAKER_ORGANISATIONS = ORGANISATIONS.filter((org) => org.type === 'offtaker')
