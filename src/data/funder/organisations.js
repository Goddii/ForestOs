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
]

export function getOrganisation(id) {
  return ORGANISATIONS.find((org) => org.id === id) ?? null
}

export function getOrganisationBySlug(slug) {
  return ORGANISATIONS.find((org) => org.slug === slug) ?? null
}

export const FUNDER_ORGANISATIONS = ORGANISATIONS.filter((org) => org.type === 'funder')
