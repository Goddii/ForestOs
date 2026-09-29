// Design tokens lifted from the Figma Make file. The green is Spotify's brand
// green, so it is intentionally not remapped onto the site's forest palette.
export const GREEN = '#1DB954'
export const MINT = '#4EFEA1'
export const INK = '#0B1910'

export const FONT_SERIF = 'Cormorant Garamond, serif'
export const FONT_MONO = 'JetBrains Mono, monospace'
export const FONT_SANS = 'Inter, sans-serif'

export const TEXT_2 = 'rgba(255,255,255,0.72)'
export const TEXT_3 = 'rgba(255,255,255,0.56)'

// Type roles. Cormorant is the voice (headline, titles, numerals, the pull
// quote); Inter carries body and UI; mono is reserved for tiny instrument labels.
export const TYPE = {
  title: { fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 600, lineHeight: 1.15, letterSpacing: '0.005em', color: '#fff' },
  numeral: { fontFamily: FONT_SERIF, fontSize: '46px', fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'lining-nums tabular-nums', color: GREEN },
  lede: { fontFamily: FONT_SERIF, fontSize: '22px', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.3, color: TEXT_2 },
  caption: { fontFamily: FONT_SERIF, fontSize: '16px', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.2, color: 'rgba(255,255,255,0.88)' },
  body: { fontFamily: FONT_SANS, fontSize: '14px', fontWeight: 400, lineHeight: 1.6, color: TEXT_2 },
  ui: { fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.02em' },
  small: { fontFamily: FONT_SANS, fontSize: '12px', fontWeight: 400, lineHeight: 1.5, color: TEXT_3 },
  action: { fontFamily: FONT_SANS, fontSize: '11px', fontWeight: 600, lineHeight: 1, letterSpacing: '0.14em', textTransform: 'uppercase' },
  label: { fontFamily: FONT_MONO, fontSize: '10px', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.14em', textTransform: 'uppercase', color: TEXT_3 },
}

export const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=JetBrains+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap'
