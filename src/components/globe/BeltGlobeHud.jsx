import { MapPin, Building2 } from 'lucide-react'
import { BELT_BLOCKS } from '../../lib/platformData'

const TABS = [
  { id: null, name: 'Whole Belt' },
  ...BELT_BLOCKS.map((block) => ({ id: block.id, name: block.shortName })),
]

function tabClass(active) {
  return (
    'shrink-0 rounded-full border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] backdrop-blur transition-colors ' +
    (active
      ? 'border-amber-400 bg-amber-400 text-forest-950'
      : 'border-bone/15 bg-forest-950/75 text-sage-300 hover:text-bone')
  )
}

/**
 * Macro-mode globe HUD: the "Whole Belt" + five forest-block region selector
 * tabs, and the active block's counties / collection centres / sponsoring brand.
 * Tabs and the active-block card both sit in the top region so a selection is
 * always visible without scrolling the globe.
 */
export default function BeltGlobeHud({ activeBlockId, onSelectBlock }) {
  const activeBlock = BELT_BLOCKS.find((block) => block.id === activeBlockId) ?? null

  return (
    <div className="flex h-full flex-col items-start gap-3">
      {/* One scrollable row on mobile so the pills never blanket the map. */}
      <div className="pointer-events-auto -mx-1 flex w-full flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id ?? 'whole-belt'}
            type="button"
            onClick={() => onSelectBlock(tab.id)}
            aria-pressed={tab.id === activeBlockId}
            className={tabClass(tab.id === activeBlockId)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {activeBlock && (
        <div className="pointer-events-auto w-[min(24rem,100%)] rounded-2xl border border-bone/12 bg-forest-950/80 p-4 backdrop-blur-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-river-500">
            {activeBlock.counties.length} counties · {activeBlock.hectares.toLocaleString()} ha
          </p>
          <h3 className="mt-1 font-display text-2xl leading-tight text-bone">{activeBlock.name}</h3>
          <div className="mt-3 flex items-start gap-2 border-t border-bone/10 pt-3">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" strokeWidth={2.5} aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-bone-300">
              Active collection centres:{' '}
              <span className="text-bone">{activeBlock.collectionCentres.join(', ')}</span>
            </p>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-500" strokeWidth={2.5} aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-bone-300">
              Sponsored by <span className="text-bone">{activeBlock.sponsor}</span> · {activeBlock.sector}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
