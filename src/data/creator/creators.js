// DEMO DATA — creative partner accounts. Nyashinski is the one real
// collaboration in this repo (lib/brands.js BRANDS.nyashinski); his Spotify
// artist link is the verified one the existing experiences already use.
// Every other link is a demo placeholder and is flagged `isDemo`, so the UI
// can say so instead of passing it off as his real profile.

import { SPOTIFY_ARTIST_URL } from '../../majaniNyashinski/data'

/**
 * @typedef {Object} CreatorLink
 * @property {'spotify' | 'instagram' | 'youtube' | 'website' | 'events' | 'signup' | 'participate'} kind
 * @property {string} label
 * @property {string} href
 * @property {boolean} isDemo
 *
 * @typedef {Object} Creator
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} discipline
 * @property {string} bio
 * @property {{ src: string, alt: string, credit: string }} portrait
 * @property {string} partnerSince
 * @property {string} programme
 * @property {CreatorLink[]} links
 */

/** @type {Creator[]} */
export const CREATORS = [
  {
    id: 'cr-nyashinski',
    slug: 'nyashinski',
    name: 'Nyashinski',
    discipline: 'Musician',
    bio: 'Kenyan musician and the voice of Nyashinski Tea. His campaigns pair each release with a verified conservation story from the Mau.',
    portrait: {
      src: '/media/nyashinski4.png',
      alt: 'Typographic portrait of Nyashinski built from his lyrics, on black',
      credit: 'Portrait artwork by Dante',
    },
    partnerSince: '2026-06',
    programme: 'Nyayo Tea Zone, South West Mau',
    links: [
      { kind: 'spotify', label: 'Spotify', href: SPOTIFY_ARTIST_URL, isDemo: false },
      { kind: 'instagram', label: 'Instagram', href: 'https://example.com/nyashinski/instagram', isDemo: true },
      { kind: 'youtube', label: 'YouTube', href: 'https://example.com/nyashinski/youtube', isDemo: true },
      { kind: 'website', label: 'Website', href: 'https://example.com/nyashinski', isDemo: true },
      { kind: 'events', label: 'Tour dates', href: 'https://example.com/nyashinski/tour', isDemo: true },
      { kind: 'signup', label: 'Guardian list sign-up', href: 'https://example.com/nyashinski/guardians', isDemo: true },
      { kind: 'participate', label: 'Join a planting day', href: 'https://example.com/nyayo/planting-days', isDemo: true },
    ],
  },
]

/** @param {string} slug */
export function getCreatorBySlug(slug) {
  return CREATORS.find((creator) => creator.slug === slug) ?? null
}
