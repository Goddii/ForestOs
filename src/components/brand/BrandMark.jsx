import { BRAND_MARK_ART } from './brandMarkArtMap'

/** Share of the tile the drawn mark occupies; the rest is breathing room. */
const ART_SHARE = 0.66

/**
 * The brand's logo mark on a tile in the brand colour. Uses the drawn mark
 * named by the kit's `mark` field, and falls back to a monogram until a
 * brand has one. Decorative next to the brand's name, so it is hidden from
 * screen readers by default.
 *
 * @param {{ kit: import('../../data/brand/accounts').BrandKit, size?: number, className?: string, label?: string }} props
 */
export default function BrandMark({ kit, size = 40, className = '', label }) {
  const Art = kit.mark ? BRAND_MARK_ART[kit.mark] : undefined
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl font-sans font-bold tracking-[0.06em] ${className}`}
      style={{ width: size, height: size, backgroundColor: kit.primary, color: kit.ink, fontSize: size * 0.34, boxShadow: `inset 0 -3px 0 ${kit.accent}` }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {Art ? (
        <svg viewBox="0 0 256 256" width={size * ART_SHARE} height={size * ART_SHARE} focusable="false">
          <Art ink={kit.ink} accent={kit.accent} />
        </svg>
      ) : (
        kit.monogram
      )}
    </span>
  )
}
