// DEMO DATA — QR experiences. A brand does not build the consumer page: it
// picks a ForestOS experience template, connects it to a product and its
// batch, and customises the brand layer (logo, colours, title, hero, story,
// links). The verified layer underneath comes from the batch record and the
// brand's approved impact statements, and the brand cannot edit it.
//
// For this iteration there is one template, and every experience resolves to
// the public batch #921 record as a placeholder. Brand-specific consumer
// templates arrive with the artist and public-figure portals; see
// `PLACEHOLDER_BATCH_ID`.

/** The public batch record every experience opens until brand templates ship. */
export const PLACEHOLDER_BATCH_ID = '921'

export const EXPERIENCE_TEMPLATES = [
  {
    id: 'tpl-verified-batch',
    name: 'Verified batch story',
    description:
      'The ForestOS public record for a batch: where it grew, the forest it sits beside, who verified it, and the brand story on top.',
    stages: ['Scan confirmed', 'Where it grew', 'The forest beside it', 'How it was verified', 'Your brand story', 'Call to action'],
    route: `/batch/${PLACEHOLDER_BATCH_ID}`,
    status: 'available',
  },
]

/**
 * @typedef {Object} ExperienceCustomisation
 * @property {string} title
 * @property {string} heroAssetId         → data/brand/assets.js
 * @property {string} story               brand content, shown as the brand's words
 * @property {string[]} metricIds         approved impact statements shown, in order (lib/brand/claims.js)
 * @property {{ label: string, href: string }} cta
 * @property {Array<{ network: string, href: string }>} socialLinks
 * @property {string | null} musicLink
 * @property {string | null} communityLink
 * @property {{ primary: string, accent: string }} colours
 * @property {boolean} showLogo
 *
 * @typedef {Object} BrandExperience
 * @property {string} id
 * @property {string} brandOrgId
 * @property {string} templateId
 * @property {string | null} productId
 * @property {string | null} batchTraceId
 * @property {'published' | 'draft'} status
 * @property {string} shortCode
 * @property {string | null} publishedAt
 * @property {ExperienceCustomisation} customisation
 */

/** @type {BrandExperience[]} */
export const BRAND_EXPERIENCES = [
  {
    id: 'exp-kil-mau',
    brandOrgId: 'org-brand-kilele',
    templateId: 'tpl-verified-batch',
    productId: 'prd-kil-mau-black',
    batchTraceId: 'TL-2026-00482',
    status: 'published',
    shortCode: 'kil-mau',
    publishedAt: '2026-09-02',
    customisation: {
      title: 'Mau Mornings',
      heroAssetId: 'fos-mau',
      story: 'Every Kilele morning starts on the edge of the Mau. This tin was packed from one lot grown on the Kiptunga tea buffer, where the tea gardens hold the line for the forest behind them.',
      metricIds: ['ind-seedlings', 'ind-tea-ha', 'ind-patrols'],
      cta: { label: 'Find your nearest Kilele', href: 'https://example.com/kilele/cafes' },
      socialLinks: [{ network: 'Instagram', href: 'https://example.com/kilele/instagram' }],
      musicLink: null,
      communityLink: null,
      colours: { primary: '#23483a', accent: '#c7773f' },
      showLogo: true,
    },
  },
  {
    id: 'exp-kil-chai',
    brandOrgId: 'org-brand-kilele',
    templateId: 'tpl-verified-batch',
    productId: 'prd-kil-chai',
    batchTraceId: 'TL-2026-00461',
    status: 'draft',
    shortCode: 'kil-chai',
    publishedAt: null,
    customisation: {
      title: 'The hands behind the cup',
      heroAssetId: 'fos-training',
      story: 'Our chai starts with growers on the Nessuit spur, where the buffer now includes fuelwood plots so households no longer cut from the forest edge.',
      metricIds: ['ind-fuelwood-ha'],
      cta: { label: 'See the chai menu', href: 'https://example.com/kilele/menu' },
      socialLinks: [{ network: 'Instagram', href: 'https://example.com/kilele/instagram' }],
      musicLink: null,
      communityLink: 'https://example.com/kilele/growers-evening',
      colours: { primary: '#23483a', accent: '#c7773f' },
      showLogo: true,
    },
  },
  {
    id: 'exp-mc-guest',
    brandOrgId: 'org-brand-maracrest',
    templateId: 'tpl-verified-batch',
    productId: 'prd-mc-guest',
    batchTraceId: 'TL-2026-00482',
    status: 'published',
    shortCode: 'mc-guest',
    publishedAt: '2026-08-28',
    customisation: {
      title: 'A cup from the Mau',
      heroAssetId: 'fos-mau-forest',
      story: 'The tea in your room was grown on the Kiptunga buffer of the Mau Forest, one of Kenya’s nine water towers. Scan to see the lot it came from and the forest work checked alongside it.',
      metricIds: ['ind-seedlings', 'ind-plots-audited'],
      cta: { label: 'Book a forest walk', href: 'https://example.com/maracrest/experiences' },
      socialLinks: [
        { network: 'Instagram', href: 'https://example.com/maracrest/instagram' },
        { network: 'LinkedIn', href: 'https://example.com/maracrest/linkedin' },
      ],
      musicLink: null,
      communityLink: null,
      colours: { primary: '#7b3222', accent: '#d7b16b' },
      showLogo: true,
    },
  },
  {
    id: 'exp-mc-sundowner',
    brandOrgId: 'org-brand-maracrest',
    templateId: 'tpl-verified-batch',
    productId: 'prd-mc-sundowner',
    batchTraceId: 'TL-2026-00611',
    status: 'draft',
    shortCode: 'mc-sundowner',
    publishedAt: null,
    customisation: {
      title: 'Road to COP32',
      heroAssetId: 'fos-planting',
      story: '',
      metricIds: [],
      cta: { label: 'Follow the road to COP32', href: '' },
      socialLinks: [],
      musicLink: 'https://example.com/maracrest/sundowner-playlist',
      communityLink: null,
      colours: { primary: '#7b3222', accent: '#d7b16b' },
      showLogo: true,
    },
  },
  {
    id: 'exp-hg-afternoon',
    brandOrgId: 'org-brand-halden',
    templateId: 'tpl-verified-batch',
    productId: 'prd-hg-afternoon',
    batchTraceId: 'TL-2026-00327',
    status: 'published',
    shortCode: 'hg-afternoon',
    publishedAt: '2026-08-15',
    customisation: {
      title: 'Highland Heritage',
      heroAssetId: 'fos-mt-kenya',
      story: 'Our afternoon tea is poured from a single lot grown on the Kangaita block, high on the eastern slopes of Mount Kenya, and traced from the plot to your table.',
      metricIds: [],
      cta: { label: 'Reserve afternoon tea', href: 'https://example.com/halden/afternoon-tea' },
      socialLinks: [{ network: 'Instagram', href: 'https://example.com/halden/instagram' }],
      musicLink: null,
      communityLink: null,
      colours: { primary: '#1d2a45', accent: '#b89a5c' },
      showLogo: true,
    },
  },
]

// ── Custom design requests ──────────────────────────────────────────────────
// When no template fits, a brand can ask the ForestOS design team to design a
// bespoke experience. The team designs the brand layer only: the verified
// layer (batch record, approved statements, evidence) is the same one every
// template uses, and the finished design still passes the publish checks.
// A backend would route these to the design team's queue; in the demo they
// are seed records plus whatever the session adds.

/** Features a brand can ask for; each maps to something the team has built before. */
export const DESIGN_REQUEST_FEATURES = {
  music: 'Music player or playlist',
  community: 'Community or event sign-up',
  collectible: 'Collectible stamps or passport',
  video: 'Video story',
  landscape_map: 'Interactive landscape map',
  multilingual: 'More than one language',
}

/** Where a request is, in order. */
export const DESIGN_REQUEST_STAGES = [
  { key: 'received', label: 'Received', detail: 'The design team replies within two working days to book a scoping call.' },
  { key: 'scoping', label: 'Scoping', detail: 'Agreeing the story, features and timeline with your team.' },
  { key: 'in_design', label: 'In design', detail: 'The design team is building the experience around your verified lot.' },
  { key: 'review', label: 'Your review', detail: 'A preview is ready for your team to approve or send back.' },
  { key: 'delivered', label: 'Delivered', detail: 'Added to your QR experiences as a draft, ready to publish.' },
]

/**
 * @typedef {Object} DesignRequest
 * @property {string} id
 * @property {string} brandOrgId
 * @property {string[]} productIds
 * @property {string | null} campaignId
 * @property {string} brief              what the experience should do, in the brand's words
 * @property {string[]} features         keys of DESIGN_REQUEST_FEATURES
 * @property {string} references         links or notes on look and feel
 * @property {string} launchBy           target launch date
 * @property {string} contactId          → team member id
 * @property {'received' | 'scoping' | 'in_design' | 'review' | 'delivered'} status
 * @property {string} submittedAt
 */

/** @type {DesignRequest[]} */
export const DESIGN_REQUESTS = [
  {
    id: 'dr-mc-01',
    brandOrgId: 'org-brand-maracrest',
    productIds: ['prd-mc-sundowner'],
    campaignId: 'cmp-mc-cop32',
    brief: 'A take-home experience for lodge guests: the sundowner tin opens a year-long Road to COP32 journey, with a new chapter each time they scan.',
    features: ['collectible', 'music', 'landscape_map'],
    references: 'Evening light over the Mara, lodge fire-pit mood. Our guest newsletter tone.',
    launchBy: '2026-11-25',
    contactId: 'tm-mc-2',
    status: 'in_design',
    submittedAt: '2026-09-08',
  },
]
