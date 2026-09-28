import { Download } from 'lucide-react'
import { useCreator } from '../CreatorContext'
import { PageHeader, SectionTitle } from '../ui'

/**
 * The asset library, in two clearly separate shelves: the campaign's own
 * artwork with its rights as known, and imagery ForestOS supplies for use
 * next to verified records. Masonry columns keep every image at its own
 * aspect ratio.
 */
export default function AssetsPage() {
  const { assets } = useCreator()
  return (
    <div className="space-y-16">
      <PageHeader title="Assets" lede="Artwork for your campaigns and imagery ForestOS has approved to sit next to the verified story." />
      <Shelf title="Campaign artwork" items={assets.uploads} />
      <Shelf title="ForestOS imagery" items={assets.forestos} />
      <section aria-labelledby="assets-mark" className="max-w-2xl">
        <SectionTitle>
          <span id="assets-mark">{assets.mark.name} mark</span>
        </SectionTitle>
        <ul className="mt-4 grid list-disc gap-2 pl-5 text-compact text-ink-muted">
          {assets.mark.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Shelf({ title, items }) {
  const id = `shelf-${title.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <section aria-labelledby={id}>
      <SectionTitle>
        <span id={id}>{title}</span>
      </SectionTitle>
      <ul className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((asset) => (
          <li key={asset.id} className="mb-6 break-inside-avoid">
            <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading="lazy" className="h-auto w-full rounded-xl bg-canvas" />
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-compact font-semibold text-ink">{asset.title}</p>
                <p className="text-xs text-ink-faint">{asset.rights}</p>
              </div>
              <a href={asset.src} download className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-forest-accent hover:text-forest-accent-dark">
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
