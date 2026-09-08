import { MapPin } from 'lucide-react'
import TimeToggle from '../TimeToggle'
import GlobeFocusChips from '../GlobeFocusChips'
import { ERAS, GLOBE_FOCI } from '../../lib/mock'

/**
 * Batch-mode globe HUD: the 2015⇄Today era toggle, the canopy-cover readout and
 * the location focus chips.
 */
export default function BatchGlobeHud({ era, onEraChange, centreName, activeFocusId, onFocus }) {
  const current = ERAS[era]
  return (
    <div className="flex max-w-[calc(100%-2rem)] flex-col gap-3">
      <div className="pointer-events-auto w-[min(20rem,100%)] rounded-2xl border border-bone/12 bg-forest-950/78 p-4 backdrop-blur-md">
        <TimeToggle value={era} onChange={onEraChange} />
        <div className="mt-3 flex items-baseline gap-2">
          <span className="tnum font-display text-3xl text-bone">{current.canopyCoverPct}%</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            canopy cover
          </span>
        </div>
        <p className="mt-1 text-[12px] leading-snug text-bone-300">{current.caption}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-bone/10 pt-3">
          <MapPin className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} aria-hidden="true" />
          <span className="font-mono text-[11px] tracking-[0.06em] text-bone-300">{centreName}</span>
        </div>
      </div>

      <div className="pointer-events-auto">
        <GlobeFocusChips foci={GLOBE_FOCI} activeId={activeFocusId} onFocus={(focus) => onFocus(focus.id)} />
      </div>
    </div>
  )
}
