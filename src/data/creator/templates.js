// DEMO DATA — the experience templates a creative partner can choose from.
// Each one is an existing ForestOS QR prototype in this repo, surfaced as a
// controlled template rather than rebuilt: "Preview experience" opens the
// real consumer route. A template fixes which sections exist and which of
// them carry verified ForestOS data; the creator arranges and dresses the
// creative sections only.

/**
 * @typedef {Object} TemplateSection
 * @property {string} key
 * @property {string} label
 * @property {'creative' | 'verified'} layer   verified sections render ForestOS records and are never editable
 *
 * @typedef {Object} ExperienceTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {string} route          the existing consumer experience this template is
 * @property {string} coverSrc
 * @property {string} coverAlt
 * @property {TemplateSection[]} sections
 */

const S = (key, label, layer = 'creative') => ({ key, label, layer })

/** @type {ExperienceTemplate[]} */
export const CREATOR_TEMPLATES = [
  {
    id: 'tpl-artist-story',
    name: 'Artist Conservation Story',
    summary: 'An editorial scroll: the artist’s hook, the music, the tea, then the verified origin and impact underneath.',
    route: '/majani/nyashinski',
    coverSrc: '/media/nyashinski4.png',
    coverAlt: 'Typographic portrait of Nyashinski built from his lyrics, on black',
    sections: [
      S('hook', 'Artist hook'),
      S('music', 'Music moment'),
      S('tea', 'The tea'),
      S('origin', 'Verified origin', 'verified'),
      S('impact', 'Verified impact', 'verified'),
      S('community', 'Community'),
    ],
  },
  {
    id: 'tpl-tea-origin',
    name: 'Premium Tea Origin',
    summary: 'A collectible tea passport: the pack, where the leaf grew, and the record that proves it.',
    route: '/passport/majani/921',
    coverSrc: '/media/brand/nyashinski-tin.jpg',
    coverAlt: 'Majani × Nyashinski conservation tea tin and refill pouch',
    sections: [S('hook', 'Pack reveal'), S('origin', 'Verified origin', 'verified'), S('impact', 'Verified impact', 'verified'), S('cta', 'Call to action')],
  },
  {
    id: 'tpl-landscape',
    name: 'Landscape Story',
    summary: 'The full public proof record for a batch, from forest block to cup, with your intro on top.',
    route: '/batch/921',
    coverSrc: '/media/forests/mau.jpg',
    coverAlt: 'Forest canopy of the Mau Forest Complex above the tea buffer',
    sections: [S('hook', 'Your intro'), S('origin', 'Verified origin', 'verified'), S('impact', 'Verified impact', 'verified'), S('cta', 'Call to action')],
  },
  {
    id: 'tpl-artist-campaign',
    name: 'Artist × Conservation Campaign',
    summary: 'A campaign landing: splash, live batch figures, a conservation leaderboard, the story and a sticky player.',
    route: '/sound-of-the-shield',
    coverSrc: '/media/tree2.jpg',
    coverAlt: 'A lone tree on a lit green hillside above dark still water',
    sections: [
      S('hook', 'Splash'),
      S('impact', 'Live batch figures', 'verified'),
      S('story', 'Shield story'),
      S('community', 'Community call'),
      S('music', 'Sticky player'),
    ],
  },
  {
    id: 'tpl-fan-campaign',
    name: 'Community / Fan Campaign',
    summary: 'Seven chapters that turn a scan into membership: pledge, music reward, member passport.',
    route: '/living-anthem',
    coverSrc: '/media/living-anthem/artwork.jpg',
    coverAlt: 'Illustrated forest threaded with glowing green sound waves',
    sections: [
      S('hook', 'Manifesto'),
      S('origin', 'Landscape', 'verified'),
      S('impact', 'Live telemetry', 'verified'),
      S('community', 'Pledge'),
      S('music', 'Music reward'),
      S('cta', 'Member passport'),
    ],
  },
  {
    id: 'tpl-climate-action',
    name: 'Climate Action Campaign',
    summary: 'Scan, verify, discover, take part, earn: discrete steps that end in a conservation action.',
    route: '/qr-experience',
    coverSrc: '/media/forest1-poster.jpg',
    coverAlt: 'Mist rolling over a dense green forest canopy',
    sections: [
      S('hook', 'Scan confirmed'),
      S('origin', 'Verify', 'verified'),
      S('story', 'Discover'),
      S('community', 'Participate'),
      S('cta', 'Earn'),
    ],
  },
]

/** @param {string} id */
export function getTemplate(id) {
  return CREATOR_TEMPLATES.find((template) => template.id === id) ?? null
}
