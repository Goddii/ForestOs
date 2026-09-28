// DEMO DATA — the creator's asset library. Two kinds, kept apart:
//  - Campaign assets the creator's team owns or licensed (artwork, pack
//    shots). Rights are stated as known; unknown licences say so.
//  - ForestOS-approved imagery, supplied for use next to verified records
//    (shared with the Brand Portal: data/brand/assets.js, whose `src` is an
//    extension-less base with .webp and .jpg siblings).

import { FORESTOS_PHOTOS, VERIFICATION_MARK } from '../brand/assets'

/**
 * @typedef {Object} CreatorAsset
 * @property {string} id
 * @property {string} src        a full file path
 * @property {number} width
 * @property {number} height
 * @property {string} alt
 * @property {string} title
 * @property {string} rights
 * @property {'campaign' | 'forestos'} origin
 */

const upload = (id, src, width, height, title, rights, alt) => ({ id, src, width, height, title, rights, alt, origin: 'campaign' })

/** @type {CreatorAsset[]} */
export const CREATOR_UPLOADS = [
  upload('cr-portrait', '/media/nyashinski4.png', 720, 900, 'Lyric portrait', 'Artwork by Dante, artist-approved', 'Typographic portrait of Nyashinski built from his lyrics, on black'),
  upload('cr-ritual', '/media/brand/nyashinski-ritual.jpg', 1400, 788, 'Guardian Edition, landscape', 'Campaign licence', 'The Guardian Edition gift box on a stone ledge above the Mau tea landscape'),
  upload('cr-tin', '/media/brand/nyashinski-tin.jpg', 1400, 933, 'Tin and refill pouch', 'Campaign licence', 'Majani × Nyashinski conservation tea tin and refill pouch'),
  upload('cr-anthem', '/media/living-anthem/artwork.jpg', 1200, 896, 'Living Anthem artwork', 'Licence to be confirmed', 'Illustrated forest threaded with glowing green sound waves'),
  upload('cr-tree', '/media/tree2.jpg', 564, 1006, 'Shield key art', 'Licence to be confirmed', 'A lone tree on a lit green hillside above dark still water'),
]

/** @type {CreatorAsset[]} ForestOS photography, normalised to full paths. */
export const FORESTOS_IMAGERY = FORESTOS_PHOTOS.map((photo) => ({
  id: photo.id,
  src: `${photo.src}.jpg`,
  width: photo.width,
  height: photo.height,
  alt: photo.alt,
  title: photo.caption,
  rights: photo.credit ? `ForestOS, ${photo.credit}` : 'ForestOS approved for campaign use',
  origin: 'forestos',
}))

export { VERIFICATION_MARK }

/** Every image a creative section can use as its hero. */
export const HERO_OPTIONS = [...CREATOR_UPLOADS, ...FORESTOS_IMAGERY]

/** @param {string} id */
export function getHeroAsset(id) {
  return HERO_OPTIONS.find((asset) => asset.id === id) ?? null
}
