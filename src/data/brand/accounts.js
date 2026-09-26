// DEMO DATA — the brands with Brand Portal access. The organisation itself
// lives in the shared registry (data/funder/organisations.js); this file
// holds what the portal needs on top: what kind of brand it is, its brand
// kit, its team and which packer produces its tea.
//
// Team members are fictional people at fictional brands.

/**
 * @typedef {Object} BrandKit
 * @property {string} monogram     two letters for the generated logo mark
 * @property {string} wordmark     how the name is set on packs and experiences
 * @property {string} primary      brand colour (hex)
 * @property {string} accent       secondary brand colour (hex)
 * @property {string} ink          text colour on the brand colour (hex)
 *
 * @typedef {Object} BrandAccount
 * @property {string} orgId
 * @property {'cafe' | 'hotel_group' | 'luxury_hotel'} segment
 * @property {string} footprint        where the brand sells or serves, in its own words
 * @property {string} packerOrgId      the offtaker that packs its private-label tea
 * @property {string} defaultRole
 * @property {BrandKit} kit
 * @property {Array<{ id: string, name: string, title: string, role: string, status: 'active' | 'invited', lastActive: string | null }>} team
 * @property {string} onboardedDate
 */

/** @type {BrandAccount[]} */
export const BRAND_ACCOUNTS = [
  {
    orgId: 'org-brand-kilele',
    segment: 'cafe',
    footprint: '14 cafés in Nairobi and Mombasa, plus retail tins at the counter',
    packerOrgId: 'org-offtaker-rvt',
    defaultRole: 'brand_lead',
    kit: { monogram: 'KC', wordmark: 'KILELE', primary: '#23483a', accent: '#c7773f', ink: '#f6f1e7' },
    team: [
      { id: 'tm-kil-1', name: 'Wanjiru Mwangi', title: 'Head of Brand', role: 'brand_lead', status: 'active', lastActive: '2026-09-24' },
      { id: 'tm-kil-2', name: 'Brian Otieno', title: 'Marketing Manager', role: 'marketing', status: 'active', lastActive: '2026-09-23' },
      { id: 'tm-kil-3', name: 'Njeri Kamau', title: 'Product Developer', role: 'product', status: 'active', lastActive: '2026-09-22' },
      { id: 'tm-kil-4', name: 'Tausi Creative', title: 'Design agency', role: 'agency', status: 'active', lastActive: '2026-09-19' },
      { id: 'tm-kil-5', name: 'Daniel Kiprono', title: 'Digital Lead', role: 'admin', status: 'active', lastActive: '2026-09-24' },
    ],
    onboardedDate: '2026-06-10',
  },
  {
    orgId: 'org-brand-maracrest',
    segment: 'hotel_group',
    footprint: '6 hotels and safari lodges across Kenya: guest rooms, lounges and lodge shops',
    packerOrgId: 'org-offtaker-rvt',
    defaultRole: 'brand_lead',
    kit: { monogram: 'MC', wordmark: 'MARA CREST', primary: '#7b3222', accent: '#d7b16b', ink: '#fbf5ea' },
    team: [
      { id: 'tm-mc-1', name: 'Amina Hassan', title: 'Director of Brand & Guest Experience', role: 'brand_lead', status: 'active', lastActive: '2026-09-24' },
      { id: 'tm-mc-2', name: 'Kevin Mutua', title: 'Sustainability Manager', role: 'marketing', status: 'active', lastActive: '2026-09-21' },
      { id: 'tm-mc-3', name: 'Grace Wambui', title: 'Food & Beverage Procurement', role: 'product', status: 'active', lastActive: '2026-09-18' },
      { id: 'tm-mc-4', name: 'Samuel Njoroge', title: 'Group Digital Manager', role: 'admin', status: 'active', lastActive: '2026-09-23' },
      { id: 'tm-mc-5', name: 'Lulu Ochieng', title: 'Social Media Lead', role: 'marketing', status: 'invited', lastActive: null },
    ],
    onboardedDate: '2026-07-01',
  },
  {
    orgId: 'org-brand-halden',
    segment: 'luxury_hotel',
    footprint: 'One 212-room luxury hotel: afternoon tea service, in-room amenities and the hotel boutique',
    packerOrgId: 'org-offtaker-rvt',
    defaultRole: 'brand_lead',
    kit: { monogram: 'HG', wordmark: 'THE HALDEN', primary: '#1d2a45', accent: '#b89a5c', ink: '#f7f3ea' },
    team: [
      { id: 'tm-hg-1', name: 'Charlotte Ndegwa', title: 'Director of Marketing', role: 'brand_lead', status: 'active', lastActive: '2026-09-22' },
      { id: 'tm-hg-2', name: 'Moses Karanja', title: 'Executive Pastry Chef, Afternoon Tea', role: 'product', status: 'active', lastActive: '2026-09-17' },
      { id: 'tm-hg-3', name: 'Faith Achieng', title: 'Communications Manager', role: 'marketing', status: 'active', lastActive: '2026-09-23' },
      { id: 'tm-hg-4', name: 'Peter Gathogo', title: 'IT & Digital', role: 'admin', status: 'active', lastActive: '2026-09-12' },
    ],
    onboardedDate: '2026-08-04',
  },
]

export const BRAND_SEGMENT_LABELS = {
  cafe: 'Café chain',
  hotel_group: 'Hotel & lodge group',
  luxury_hotel: 'Luxury hotel',
}

export function brandAccountForOrg(orgId) {
  return BRAND_ACCOUNTS.find((account) => account.orgId === orgId) ?? null
}
