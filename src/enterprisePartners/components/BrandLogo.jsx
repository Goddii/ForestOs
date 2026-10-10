import BaseBrandLogo from '../../components/ui/BrandLogo'
import { resolveBrand } from '../data/brands'

/**
 * The enterprise prototype's logo entry point — resolves a brand id (or takes
 * a brand record) and hands off to the repo-wide `ui/BrandLogo`.
 *
 * The partner brands here carry their REAL logo files (`brand.logo`, served
 * from `public/media/logos/`), because the honest way to satisfy the brief's
 * "don't invent official artwork" rule is to use the actual artwork instead
 * of drawing a substitute: what stays labelled as concept is the partnership
 * itself, not the mark. Every lockup can print that caveat via `note`.
 */
export default function BrandLogo({ brand, ...rest }) {
  const record = typeof brand === 'string' ? resolveBrand(brand) : brand
  if (!record) return null
  return <BaseBrandLogo brand={record} {...rest} />
}
