/** PROPOSED brand experiences — not confirmed partnerships. */

export const BRAND_IDS = ['safaricom', 'java-house']

export const BRANDS = {
  safaricom: {
    id: 'safaricom',
    slug: 'enterprise-safaricom',
    name: 'Safaricom',
    experienceTitle: 'Safaricom × ForestOS',
    themeClass: 'enterprise-safaricom',
    accentLabel: 'Connectivity layer',
    stampLabel: 'Safaricom stamp',
    stampGlyph: 'signal',
    /** Restrained accent — not a full green UI takeover */
    accentHex: '#2db34a',
    /** Real logo file, served from `public/media/logos/`. */
    logo: '/media/logos/safaricom.svg',
    /** Display form of the name, used only if the file fails to load. */
    wordmark: 'safaricom',
    markNote: 'Official Safaricom logo · partnership proposed, not confirmed',
  },
  'java-house': {
    id: 'java-house',
    slug: 'enterprise-java-house',
    name: 'Java House',
    experienceTitle: 'Java House × ForestOS',
    themeClass: 'enterprise-java-house',
    accentLabel: 'Café experience',
    stampLabel: 'Java House stamp',
    stampGlyph: 'cup',
    accentHex: '#b8956a',
    /** Real logo file, served from `public/media/logos/`. */
    logo: '/media/logos/java-house.svg',
    wordmark: 'Java House',
    markNote: 'Official Java House logo · partnership proposed, not confirmed',
  },
}

export function resolveBrand(brandId) {
  return BRANDS[brandId] ?? BRANDS.safaricom
}

export function nextBrandId(currentId) {
  const i = BRAND_IDS.indexOf(currentId)
  return BRAND_IDS[(i + 1) % BRAND_IDS.length]
}
