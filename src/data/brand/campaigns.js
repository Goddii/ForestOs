// DEMO DATA — brand campaigns. A campaign groups products and one QR
// experience around a theme. Performance is never stored here: it is read
// from the scan records of the campaign's experience (lib/brand/analytics.js).

/**
 * @typedef {'conservation' | 'landscape' | 'community' | 'cultural_identity' | 'artists' | 'climate_action'} CampaignTheme
 *
 * @typedef {Object} BrandCampaign
 * @property {string} id
 * @property {string} brandOrgId
 * @property {string} name
 * @property {CampaignTheme} theme
 * @property {'live' | 'scheduled' | 'draft' | 'ended'} status
 * @property {{ start: string, end: string | null }} period
 * @property {string[]} productIds
 * @property {string | null} experienceId
 * @property {string} objective
 * @property {string[]} channels
 */

/** @type {BrandCampaign[]} */
export const BRAND_CAMPAIGNS = [
  // ── Kilele Coffee House ───────────────────────────────────────────────────
  {
    id: 'cmp-kil-mornings',
    brandOrgId: 'org-brand-kilele',
    name: 'Mau Mornings',
    theme: 'landscape',
    status: 'live',
    period: { start: '2026-09-02', end: '2026-11-30' },
    productIds: ['prd-kil-mau-black'],
    experienceId: 'exp-kil-mau',
    objective: 'Get café customers to scan the tin and see the Mau landscape their morning tea comes from.',
    channels: ['Tin back label', 'Table talkers in 14 cafés', 'Instagram'],
  },
  {
    id: 'cmp-kil-hands',
    brandOrgId: 'org-brand-kilele',
    name: 'The hands behind the cup',
    theme: 'community',
    status: 'scheduled',
    period: { start: '2026-10-15', end: '2026-12-31' },
    productIds: ['prd-kil-chai', 'prd-kil-mau-black'],
    experienceId: 'exp-kil-chai',
    objective: 'Tell the story of the Nessuit growers and fuelwood work behind the house chai.',
    channels: ['Chai menu cards', 'Retail pouch front panel'],
  },
  {
    id: 'cmp-kil-sessions',
    brandOrgId: 'org-brand-kilele',
    name: 'Kilele Sessions',
    theme: 'artists',
    status: 'draft',
    period: { start: '2027-01-15', end: null },
    productIds: ['prd-kil-mau-black'],
    experienceId: null,
    objective: 'Monthly acoustic evenings in the flagship café, with a playlist linked from the tin.',
    channels: ['In-café events', 'Spotify playlist'],
  },
  // ── Mara Crest Hotels & Lodges ────────────────────────────────────────────
  {
    id: 'cmp-mc-guest',
    brandOrgId: 'org-brand-maracrest',
    name: 'A cup from the Mau',
    theme: 'conservation',
    status: 'live',
    period: { start: '2026-08-28', end: null },
    productIds: ['prd-mc-guest'],
    experienceId: 'exp-mc-guest',
    objective: 'Turn the in-room tea card into the guest’s first look at the forest the group supports.',
    channels: ['In-room card', 'Guest welcome email', 'Lodge lounge screens'],
  },
  {
    id: 'cmp-mc-cop32',
    brandOrgId: 'org-brand-maracrest',
    name: 'Road to COP32',
    theme: 'climate_action',
    status: 'scheduled',
    period: { start: '2026-11-01', end: '2027-11-30' },
    productIds: ['prd-mc-guest', 'prd-mc-sundowner'],
    experienceId: 'exp-mc-sundowner',
    objective: 'A year-long guest programme building up to COP32 in Addis Ababa, anchored on the lodge-shop tin.',
    channels: ['Lodge shops', 'Guest newsletter', 'LinkedIn'],
  },
  // ── The Halden Grand ──────────────────────────────────────────────────────
  {
    id: 'cmp-hg-heritage',
    brandOrgId: 'org-brand-halden',
    name: 'Highland Heritage Afternoon Tea',
    theme: 'cultural_identity',
    status: 'live',
    period: { start: '2026-08-15', end: '2026-12-15' },
    productIds: ['prd-hg-afternoon'],
    experienceId: 'exp-hg-afternoon',
    objective: 'Give afternoon-tea guests the Mount Kenya growing story behind the pot on their table.',
    channels: ['Table cards', 'Boutique gift box', 'Concierge desk'],
  },
]

/** The six campaign themes a brand can build around, and what each is for. */
export const CAMPAIGN_THEMES = {
  conservation: { label: 'Conservation', description: 'The forest work verified beside your tea.' },
  landscape: { label: 'Landscape', description: 'The place: the forest, the ridge, the water towers.' },
  community: { label: 'Community', description: 'The growers, pluckers and households behind the cup.' },
  cultural_identity: { label: 'Cultural identity', description: 'Heritage, ritual and the way tea is served.' },
  artists: { label: 'Artists', description: 'Music, art and the people who make it.' },
  climate_action: { label: 'Climate action', description: 'Milestones such as the road to COP32.' },
}

export const CAMPAIGN_STATUS_LABELS = {
  live: 'Live',
  scheduled: 'Scheduled',
  draft: 'Draft',
  ended: 'Ended',
}
