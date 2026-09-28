// DEMO DATA — a creator's campaigns and the QR experiences inside them.
// A campaign is the cultural moment (a release, a tour, a cause); an
// experience is one scannable page in it, built on a template
// (data/creator/templates.js). Experiences hold creative content only: the
// verified layer comes from data/creator/verifiedStory.js at render time and
// is never stored on, or editable from, the experience.

import { BRANDS } from '../../lib/brands'
import { SPOTIFY_ARTIST_URL } from '../../majaniNyashinski/data'

const nyashinskiTea = BRANDS.nyashinski

/**
 * @typedef {'live' | 'preview' | 'in_review' | 'draft'} CampaignStatus
 *
 * @typedef {Object} Campaign
 * @property {string} id
 * @property {string} creatorId
 * @property {string} title
 * @property {string} subtitle
 * @property {CampaignStatus} status
 * @property {{ src: string, alt: string }} image
 * @property {string} product            the connected product
 * @property {string} programme          the conservation programme it tells
 * @property {string | null} launchedAt
 *
 * @typedef {Object} CreatorCta
 * @property {string} id
 * @property {string} label
 * @property {string} href
 * @property {'spotify' | 'social' | 'community' | 'website'} kind
 *
 * @typedef {Object} CreativeContent
 * @property {string} headline
 * @property {string} subline
 * @property {string} heroAssetId
 * @property {string} narrative
 * @property {string[]} sectionOrder      creative + verified section keys, in reading order
 * @property {string[]} hiddenSections    creative section keys the creator turned off
 * @property {string | null} musicLink
 * @property {CreatorCta[]} ctas
 * @property {string[]} statementIds      approved statements quoted word for word
 *
 * @typedef {Object} CreatorExperience
 * @property {string} id
 * @property {string} campaignId
 * @property {string} templateId
 * @property {string} name
 * @property {'published' | 'preview' | 'in_review' | 'draft'} status
 * @property {string} shortCode
 * @property {string | null} publishedAt
 * @property {CreativeContent} creative
 */

// `preview`: fully built and viewable, deliberately not published, so it is
// never scanned and never counted.
export const CAMPAIGN_STATUS_LABELS = { live: 'Live', preview: 'Preview', in_review: 'In review', draft: 'Draft' }
export const EXPERIENCE_STATUS_LABELS = { published: 'Published', preview: 'Preview', in_review: 'In review', draft: 'Draft' }

// The two strongest campaigns lead, live; the Guardian campaign is kept
// in preview.
/** @type {Campaign[]} */
export const CREATOR_CAMPAIGNS = [
  {
    id: 'cmp-anthem',
    creatorId: 'cr-nyashinski',
    title: 'The Living Anthem',
    subtitle: 'Fan membership',
    status: 'live',
    image: { src: '/media/living-anthem/artwork.jpg', alt: 'Illustrated forest threaded with glowing green sound waves' },
    product: nyashinskiTea.product,
    programme: 'Indigenous seedling planting, South West Mau',
    launchedAt: '2026-09-01',
  },
  {
    id: 'cmp-shield',
    creatorId: 'cr-nyashinski',
    title: 'The Sound of the Shield',
    subtitle: 'Tour campaign',
    status: 'live',
    image: { src: '/media/tree2.jpg', alt: 'A lone tree on a lit green hillside above dark still water' },
    product: nyashinskiTea.product,
    programme: 'Forest patrols, Mariashoni Block',
    launchedAt: '2026-09-04',
  },
  {
    id: 'cmp-guardian',
    creatorId: 'cr-nyashinski',
    title: 'Nyashinski × Nyayo Tea Zone',
    subtitle: nyashinskiTea.campaign,
    status: 'preview',
    image: { src: '/media/brand/nyashinski-ritual.jpg', alt: 'The Guardian Edition gift box on a stone ledge above the Mau tea landscape' },
    product: nyashinskiTea.product,
    programme: 'Mau buffer restoration, Mariashoni Block',
    launchedAt: null,
  },
]

/** @type {CreatorExperience[]} */
export const CREATOR_EXPERIENCES = [
  {
    id: 'exp-guardian',
    campaignId: 'cmp-guardian',
    templateId: 'tpl-artist-story',
    name: 'The Guardian Edition',
    status: 'preview',
    shortCode: 'guardian',
    publishedAt: null,
    creative: {
      headline: 'Good music grows better forests.',
      subline: 'Every tin of the Guardian Edition carries a verified story from the Mau.',
      heroAssetId: 'cr-portrait',
      narrative: 'This record was made for the people who carry the forest with them. Scan, listen, then see exactly where your tea grew and what it protects.',
      sectionOrder: ['hook', 'music', 'tea', 'origin', 'impact', 'community'],
      hiddenSections: [],
      musicLink: SPOTIFY_ARTIST_URL,
      ctas: [
        { id: 'cta-1', label: 'Listen on Spotify', href: SPOTIFY_ARTIST_URL, kind: 'spotify' },
        { id: 'cta-2', label: 'Become a Guardian', href: 'https://example.com/nyashinski/guardians', kind: 'community' },
      ],
      statementIds: ['st-origin', 'st-seedlings'],
    },
  },
  {
    id: 'exp-passport',
    campaignId: 'cmp-guardian',
    templateId: 'tpl-tea-origin',
    name: 'Pack insert passport',
    status: 'preview',
    shortCode: 'guardian-pack',
    publishedAt: null,
    creative: {
      headline: 'Your tin has a passport.',
      subline: 'Stamp it with every scan on the Road to COP32.',
      heroAssetId: 'cr-tin',
      narrative: 'The leaf in this tin was picked by growers on the Mariashoni Block. This passport follows it from their hands to yours.',
      sectionOrder: ['hook', 'origin', 'impact', 'cta'],
      hiddenSections: [],
      musicLink: null,
      ctas: [{ id: 'cta-1', label: 'Follow on Instagram', href: 'https://example.com/nyashinski/instagram', kind: 'social' }],
      statementIds: ['st-canopy'],
    },
  },
  {
    id: 'exp-shield',
    campaignId: 'cmp-shield',
    templateId: 'tpl-artist-campaign',
    name: 'Tour night landing',
    status: 'published',
    shortCode: 'shield',
    publishedAt: '2026-09-04',
    creative: {
      headline: 'The Sound of the Shield',
      subline: 'Every show night funds another patrol on the forest edge.',
      heroAssetId: 'cr-tree',
      narrative: 'The rangers of Mariashoni are the shield. Tonight, the crowd is too.',
      sectionOrder: ['hook', 'impact', 'story', 'community', 'music'],
      hiddenSections: [],
      musicLink: SPOTIFY_ARTIST_URL,
      ctas: [{ id: 'cta-1', label: 'See tour dates', href: 'https://example.com/nyashinski/tour', kind: 'website' }],
      statementIds: ['st-patrols'],
    },
  },
  {
    id: 'exp-anthem',
    campaignId: 'cmp-anthem',
    templateId: 'tpl-fan-campaign',
    name: 'Member chapters',
    status: 'published',
    shortCode: 'anthem',
    publishedAt: '2026-09-01',
    creative: {
      headline: 'The Living Anthem',
      subline: 'Seven chapters. One forest. Your name in the song.',
      heroAssetId: 'cr-anthem',
      narrative: 'Every scan opens a new chapter of the anthem, written with the forest it protects. Pledge, listen, and carry your member passport back to the Mau.',
      sectionOrder: ['hook', 'origin', 'impact', 'community', 'music', 'cta'],
      hiddenSections: [],
      musicLink: SPOTIFY_ARTIST_URL,
      ctas: [
        { id: 'cta-1', label: 'Take the pledge', href: 'https://example.com/nyashinski/guardians', kind: 'community' },
        { id: 'cta-2', label: 'Listen on Spotify', href: SPOTIFY_ARTIST_URL, kind: 'spotify' },
      ],
      statementIds: ['st-origin', 'st-canopy'],
    },
  },
]
