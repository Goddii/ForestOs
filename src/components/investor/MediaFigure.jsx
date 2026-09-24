/**
 * One field-media photo, the way every investor-console image renders:
 * aspect-ratio sizing (never a fixed height, so it never squashes into a
 * strip at wide widths), WebP with a JPEG fallback, lazy loading, an
 * "Illustrative" label while the image is stock rather than a programme
 * capture, and the author/licence credit its licence requires.
 *
 * @param {{
 *   asset: import('../../data/investor/types').MediaAsset,
 *   aspect?: string,
 *   showCaption?: boolean,
 *   className?: string,
 * }} props
 */
export default function MediaFigure({ asset, aspect = 'aspect-[3/2]', showCaption = false, className = '' }) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden rounded-lg bg-canvas-sunk ${aspect}`}>
        <picture>
          <source srcSet={`${asset.src}.webp`} type="image/webp" />
          <img
            src={`${asset.src}.jpg`}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        {asset.isIllustrative && (
          <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 font-mono text-label uppercase tracking-label text-white">
            Illustrative
          </span>
        )}
      </div>
      <figcaption className="mt-1.5 text-label leading-snug text-ink-faint">
        {showCaption && <span className="block text-xs text-ink-muted">{asset.caption}</span>}
        Photo:{' '}
        <a href={asset.credit.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-ink-muted">
          {asset.credit.author}
        </a>{' '}
        · {asset.credit.license}
      </figcaption>
    </figure>
  )
}
