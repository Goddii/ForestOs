import { useState } from 'react'
import { MARK_ART } from './brandMarkArtMap'

/**
 * The one logo renderer for the whole repo.
 *
 * Two kinds of brand record are supported, chosen by the record itself:
 *
 * - `brand.logo` — a real brand file served from `public/media/logos/`
 *   (Safaricom, Java House, Carrefour, M-PESA, Sentinel). Official artwork is
 *   never redrawn here, so it renders as an `<img>` on a white plate: several
 *   of these marks are dark ink and would disappear on the forest ground, and
 *   a plate is how brand guidelines say to place them on a dark surface.
 * - `brand.mark` — an original emblem drawn for this prototype (see
 *   `brandMarkArtMap`), for the fictional Impact League brands and NTZDC, which
 *   have no official artwork to load. It takes the surface's `currentColor`.
 *
 * `size` is the logo HEIGHT in pixels for both kinds — these logos are wide,
 * so sizing by width would make every lockup a different optical size.
 *
 * @param {{
 *   brand: { id?: string, name?: string, logo?: string, mark?: string,
 *            logoAccent?: string, wordmark?: string, markNote?: string },
 *   size?: number,
 *   variant?: 'mark' | 'lockup',
 *   suffix?: string,
 *   note?: boolean,
 *   plate?: boolean,
 *   className?: string,
 *   label?: string | null,
 * }} props
 * `label` null → decorative (alt="", aria-hidden); a string → accessible name;
 * omitted → "<name> logo".
 */
export default function BrandLogo({
  brand,
  size = 24,
  variant = 'mark',
  suffix,
  note = false,
  plate,
  className = '',
  label,
}) {
  const [failed, setFailed] = useState(false)

  const b = brand ?? {}
  const art = b.mark ? MARK_ART[b.mark] : null
  const hasImage = Boolean(b.logo) && !failed && !art

  // A crafted lockup sets the brand name as visible text right beside the
  // emblem, so labelling it too would make a screen reader say it twice.
  const defaultLabel = variant === 'lockup' && art ? null : `${b.name ?? 'Brand'} logo`
  const a11yName = label === null ? null : (label ?? defaultLabel)

  // Real artwork gets the plate unless a caller overrides it; emblems inherit
  // the surface, so they never do.
  const onPlate = plate ?? (hasImage || (failed && Boolean(b.logo)))

  const ink = 'currentColor'
  const accent = b.logoAccent ?? b.accentHex ?? 'currentColor'

  let media
  if (hasImage) {
    media = (
      <img
        src={b.logo}
        alt={a11yName ?? ''}
        height={size}
        className="block w-auto max-w-full object-contain"
        style={{ height: size }}
        loading="lazy"
        decoding="async"
        {...(a11yName ? {} : { 'aria-hidden': true })}
        onError={() => setFailed(true)}
      />
    )
  } else if (art) {
    media = (
      <svg
        viewBox="0 0 72 72"
        width={size}
        height={size}
        className="block shrink-0"
        focusable="false"
        {...(a11yName ? { role: 'img' } : { 'aria-hidden': true })}
      >
        {a11yName ? <title>{a11yName}</title> : null}
        <art.Art ink={ink} accent={accent} />
      </svg>
    )
  } else {
    // The image failed to load (or the record has no artwork): set the name
    // rather than leave a broken-image hole in the layout.
    media = (
      <span
        className="block font-sans font-bold leading-none"
        style={{ fontSize: Math.max(10, size * 0.55) }}
        {...(a11yName ? { 'aria-label': a11yName, role: 'img' } : { 'aria-hidden': true })}
      >
        {b.wordmark ?? b.name ?? ''}
      </span>
    )
  }

  const padded = onPlate
    ? {
        className: 'inline-flex items-center rounded-lg bg-white ring-1 ring-black/10',
        style: {
          padding: size >= 32 ? '8px 12px' : '4px 8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        },
      }
    : { className: 'inline-flex items-center', style: undefined }

  const plateEl = (
    <span className={padded.className} style={padded.style}>
      {media}
    </span>
  )

  if (variant !== 'lockup') {
    return <span className={`inline-grid shrink-0 place-items-center ${className}`.trim()}>{plateEl}</span>
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 ${className}`.trim()}>
      {plateEl}
      {!hasImage && art ? (
        <span className="min-w-0 leading-none">
          <span
            className={`block ${art.wordmarkClass}`}
            style={{ fontSize: size * 0.5 }}
          >
            {art.wordmark}
          </span>
          {art.tagline ? (
            <span
              className={`mt-1 block text-bone-500 ${art.taglineClass}`}
              style={{ fontSize: Math.max(8, size * 0.2) }}
            >
              {art.tagline}
            </span>
          ) : null}
        </span>
      ) : null}
      {suffix || (note && b.markNote) ? (
        <span className="min-w-0 leading-none">
          {suffix ? (
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] opacity-70">
              {suffix}
            </span>
          ) : null}
          {note && b.markNote ? (
            <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.14em] opacity-55">
              {b.markNote}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  )
}
