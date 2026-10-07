import { Link } from 'react-router-dom'
import { ArrowLeftRight, Leaf } from 'lucide-react'
import { BRANDS, nextBrandId } from '../data/brands'
import { ConceptTag } from './ui'
import XpRing from './game/XpRing'

export default function ExperienceChrome({
  brand,
  stageIndex,
  stageTotal,
  xp,
  forestRef,
  onSwitchBrand,
}) {
  const otherId = nextBrandId(brand.id)
  const other = BRANDS[otherId]

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-forest-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3 safe-area-inset-top">
        <Link
          to="/enterprise-partners"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-bone/15 text-sage-300 transition-colors hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          aria-label="Back to enterprise hub"
        >
          <Leaf className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">
            ForestOS · {brand.name}
          </p>
          <p className="truncate font-mono text-[10px] text-bone-500">
            {forestRef || '—'} · {stageIndex + 1}/{stageTotal}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSwitchBrand(otherId)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border ep-brand-border ep-brand-bg-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
          title={`Switch to ${other.name} skin`}
          aria-label={`Switch to the ${other.name} experience`}
        >
          <ArrowLeftRight className="h-3.5 w-3.5 ep-brand-accent" strokeWidth={2} aria-hidden="true" />
          {/* `xs:` is not a breakpoint in this Tailwind config, so the label
              used to be hidden at every width. `sm:` is the real one. */}
          <span className="hidden sm:inline">{other.name.split(' ')[0]}</span>
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-2">
          <ConceptTag variant="proposed">Proposed integration</ConceptTag>
          <ConceptTag variant="illustrative">Illustrative data</ConceptTag>
        </div>
        <div className="mx-auto mt-2 h-1 max-w-lg overflow-hidden rounded-full bg-forest-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-river-400 to-amber-400 transition-all duration-500 ep-motion"
            style={{ width: `${((stageIndex + 1) / stageTotal) * 100}%` }}
            role="progressbar"
            aria-valuenow={stageIndex + 1}
            aria-valuemin={1}
            aria-valuemax={stageTotal}
            aria-label="Journey progress"
          />
        </div>
        {/* The Canopy XP ring is always visible (brief 5.5). */}
        <div className="mx-auto mt-2 flex max-w-lg items-center justify-center">
          <XpRing xp={xp} size="sm" />
        </div>
      </div>
    </header>
  )
}
