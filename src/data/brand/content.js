// DEMO DATA — the brand's own content library: stories, pack copy, social
// posts and calls to action. Everything here is brand content, written and
// owned by the brand. Where a piece repeats a claim, it points at the claim
// (data/brand/claims.js) so its review status follows the claim's verdict
// instead of being typed in by hand.

/**
 * @typedef {Object} ContentItem
 * @property {string} id
 * @property {string} brandOrgId
 * @property {'story' | 'pack_copy' | 'social' | 'cta'} type
 * @property {string} title
 * @property {string} body
 * @property {'draft' | 'in_review' | 'approved'} status   the brand team's own sign-off
 * @property {string[]} claimIds
 * @property {string[]} usedIn        experience or product ids
 * @property {string} authorId        → team member id
 * @property {string} updatedAt
 */

/** @type {ContentItem[]} */
export const BRAND_CONTENT = [
  // ── Kilele Coffee House ───────────────────────────────────────────────────
  {
    id: 'cnt-kil-01',
    brandOrgId: 'org-brand-kilele',
    type: 'story',
    title: 'Mau Mornings experience story',
    body: 'Every Kilele morning starts on the edge of the Mau. This tin was packed from one lot grown on the Kiptunga tea buffer, where the tea gardens hold the line for the forest behind them.',
    status: 'approved',
    claimIds: ['clm-kil-02'],
    usedIn: ['exp-kil-mau'],
    authorId: 'tm-kil-2',
    updatedAt: '2026-08-31',
  },
  {
    id: 'cnt-kil-02',
    brandOrgId: 'org-brand-kilele',
    type: 'pack_copy',
    title: 'Tin back label',
    body: 'Grown on the edge of the Mau Forest, deforestation-free. 5,000 indigenous trees planted beside our tea gardens. Scan to see the lot this tin came from.',
    status: 'in_review',
    claimIds: ['clm-kil-02', 'clm-kil-03'],
    usedIn: ['prd-kil-mau-black'],
    authorId: 'tm-kil-4',
    updatedAt: '2026-09-04',
  },
  {
    id: 'cnt-kil-03',
    brandOrgId: 'org-brand-kilele',
    type: 'social',
    title: 'Launch post, Instagram',
    body: 'Every tin plants a tree. Our new Mau Highland Black is in all 14 cafés from today.',
    status: 'draft',
    claimIds: ['clm-kil-04'],
    usedIn: [],
    authorId: 'tm-kil-2',
    updatedAt: '2026-09-05',
  },
  {
    id: 'cnt-kil-04',
    brandOrgId: 'org-brand-kilele',
    type: 'story',
    title: 'House chai story',
    body: 'Our chai starts with growers on the Nessuit spur, where the buffer now includes fuelwood plots so households no longer cut from the forest edge.',
    status: 'in_review',
    claimIds: ['clm-kil-05'],
    usedIn: ['exp-kil-chai'],
    authorId: 'tm-kil-2',
    updatedAt: '2026-09-12',
  },
  {
    id: 'cnt-kil-05',
    brandOrgId: 'org-brand-kilele',
    type: 'cta',
    title: 'Café finder',
    body: 'Find your nearest Kilele',
    status: 'approved',
    claimIds: [],
    usedIn: ['exp-kil-mau'],
    authorId: 'tm-kil-5',
    updatedAt: '2026-08-29',
  },
  // ── Mara Crest Hotels & Lodges ────────────────────────────────────────────
  {
    id: 'cnt-mc-01',
    brandOrgId: 'org-brand-maracrest',
    type: 'story',
    title: 'In-room card story',
    body: 'The tea in your room was grown on the Kiptunga buffer of the Mau Forest, one of Kenya’s nine water towers. Scan to see the lot it came from and the forest work checked alongside it.',
    status: 'approved',
    claimIds: ['clm-mc-01'],
    usedIn: ['exp-mc-guest'],
    authorId: 'tm-mc-2',
    updatedAt: '2026-08-22',
  },
  {
    id: 'cnt-mc-02',
    brandOrgId: 'org-brand-maracrest',
    type: 'social',
    title: 'Sustainability report excerpt, LinkedIn',
    body: 'This year we restored 14.5 hectares of the forest tea buffer, and every room’s tea is protected by forest patrols.',
    status: 'in_review',
    claimIds: ['clm-mc-02', 'clm-mc-03'],
    usedIn: [],
    authorId: 'tm-mc-2',
    updatedAt: '2026-09-15',
  },
  {
    id: 'cnt-mc-03',
    brandOrgId: 'org-brand-maracrest',
    type: 'cta',
    title: 'Forest walk booking',
    body: 'Book a forest walk',
    status: 'approved',
    claimIds: [],
    usedIn: ['exp-mc-guest'],
    authorId: 'tm-mc-1',
    updatedAt: '2026-08-24',
  },
  // ── The Halden Grand ──────────────────────────────────────────────────────
  {
    id: 'cnt-hg-01',
    brandOrgId: 'org-brand-halden',
    type: 'story',
    title: 'Afternoon tea table card',
    body: 'Our afternoon tea is poured from a single lot grown on the Kangaita block, high on the eastern slopes of Mount Kenya, and traced from the plot to your table.',
    status: 'approved',
    claimIds: ['clm-hg-01'],
    usedIn: ['exp-hg-afternoon'],
    authorId: 'tm-hg-3',
    updatedAt: '2026-08-10',
  },
  {
    id: 'cnt-hg-02',
    brandOrgId: 'org-brand-halden',
    type: 'pack_copy',
    title: 'Gift box inner lid',
    body: 'An afternoon tea that protects Mount Kenya’s forests. A carbon-neutral afternoon tea, from our table to yours.',
    status: 'draft',
    claimIds: ['clm-hg-02', 'clm-hg-03'],
    usedIn: ['prd-hg-afternoon'],
    authorId: 'tm-hg-3',
    updatedAt: '2026-09-10',
  },
]

export const CONTENT_TYPE_LABELS = {
  story: 'Story',
  pack_copy: 'Pack copy',
  social: 'Social post',
  cta: 'Call to action',
}

export const CONTENT_STATUS_LABELS = {
  draft: 'Draft',
  in_review: 'In brand review',
  approved: 'Brand approved',
}
