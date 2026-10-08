import { useId } from 'react'
import { PackDefs } from './packParts'
import { Box, Pouch, Sachet, Tin } from './packShapes'

const SHAPES = { tin: Tin, pouch: Pouch, box: Box, sachet: Sachet }

/**
 * A flat render of a product's pack, generated from the product record and
 * the brand kit so every product has a consistent visual before the brand's
 * own photography exists. The silhouette follows the pack type; colours and
 * the logo mark are the brand's (the one place brand colour appears in the
 * portal besides the experience preview). Every pack carries the same cream
 * label, with the QR where the pack prints it.
 *
 * When the product has a `packImage` URL, that image is shown instead of the
 * generated SVG pack render.
 *
 * @param {{
 *   product: { name: string, line: string, packaging: { type: 'tin' | 'pouch' | 'box' | 'sachet', size: string }, packImage?: string },
 *   kit: import('../../data/brand/accounts').BrandKit,
 *   aspect?: string,
 *   className?: string,
 * }} props
 */
export default function PackRender({ product, kit, aspect = 'aspect-[4/5]', className = '' }) {
  const id = useId().replace(/:/g, '')
  const { type, packImage } = product.packaging
  const Shape = SHAPES[type] ?? Tin

  if (packImage) {
    return (
      <figure
        className={`relative isolate grid ${aspect} place-items-center overflow-hidden rounded-2xl ${className}`}
        style={{ background: `linear-gradient(160deg, ${kit.primary}14, ${kit.accent}24)` }}
      >
        <img
          src={packImage}
          alt={`${product.name}, ${product.packaging.size} ${type}`}
          className="h-full w-full object-contain"
        />
      </figure>
    )
  }

  return (
    <figure
      className={`relative isolate grid ${aspect} place-items-center overflow-hidden rounded-2xl ${className}`}
      style={{ background: `linear-gradient(160deg, ${kit.primary}14, ${kit.accent}24)` }}
    >
      <svg viewBox="0 0 200 250" className="h-[88%] w-auto" role="img" aria-label={`${product.name}, ${product.packaging.size} ${type}`}>
        <PackDefs id={id} />
        <Shape kit={kit} product={product} id={id} />
      </svg>
    </figure>
  )
}
