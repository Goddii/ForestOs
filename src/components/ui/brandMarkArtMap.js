import { Nyashinski, RiftValley, Meridian, NordicChai, WestRidge, Ntzdc } from './brandMarkArt'

/**
 * Logo identity by the brand's `mark` field: the emblem component to draw,
 * plus how the wordmark beside it is set (Tailwind classes, so the loaded
 * site fonts do the typesetting — no text baked into SVG).
 *
 * Only the fictional Impact League brands and NTZDC are here: they are the
 * ones with no official artwork to load. Safaricom, Java House, Carrefour,
 * M-PESA and Sentinel render their real files from `public/media/logos/`.
 *
 * @type {Record<string, {
 *   wordmark: string,
 *   wordmarkClass: string,
 *   tagline?: string,
 *   taglineClass?: string,
 *   Art: (p: { ink: string, accent: string }) => React.ReactNode,
 * }>}
 */
export const MARK_ART = {
  nyashinski: {
    wordmark: 'Nyashinski',
    wordmarkClass: 'font-display tracking-[-0.01em]',
    tagline: 'Conservation tea',
    taglineClass: 'font-mono uppercase tracking-[0.24em]',
    Art: Nyashinski,
  },
  riftValley: {
    wordmark: 'Rift Valley',
    wordmarkClass: 'font-sans font-bold uppercase tracking-[0.02em]',
    tagline: 'Tea Co.',
    taglineClass: 'font-mono uppercase tracking-[0.3em]',
    Art: RiftValley,
  },
  meridian: {
    wordmark: 'Meridian',
    wordmarkClass: 'font-sans font-bold tracking-[-0.01em]',
    tagline: 'Beverages',
    taglineClass: 'font-mono uppercase tracking-[0.28em]',
    Art: Meridian,
  },
  nordicChai: {
    wordmark: 'Nordic Chai',
    wordmarkClass: 'font-sans font-bold tracking-[0.01em]',
    tagline: 'Import',
    taglineClass: 'font-mono uppercase tracking-[0.3em]',
    Art: NordicChai,
  },
  westRidge: {
    wordmark: 'West Ridge',
    wordmarkClass: 'font-sans font-bold tracking-[0.01em]',
    tagline: 'Organics',
    taglineClass: 'font-mono uppercase tracking-[0.3em]',
    Art: WestRidge,
  },
  ntzdc: {
    wordmark: 'Nyayo Tea Zone',
    wordmarkClass: 'font-sans font-bold uppercase tracking-[0.04em]',
    tagline: 'Development Corporation',
    taglineClass: 'font-mono uppercase tracking-[0.16em]',
    Art: Ntzdc,
  },
}
