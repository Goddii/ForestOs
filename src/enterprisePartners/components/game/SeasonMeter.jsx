import { TreePine } from 'lucide-react'
import { SEASON } from '../../data/game'
import { ConceptTag } from '../ui'

/**
 * Season 1 community goal (brief 5.2 meta-loop). Driven by the shared COP32
 * record so the prototype cannot drift from the rest of the site; the
 * progress figure is illustrative, and the meter is the return hook rather
 * than a countdown or a FOMO device.
 */
export default function SeasonMeter({ className = '' }) {
  const pct = Math.min(SEASON.now / SEASON.goal, 1)

  return (
    <section className={className} aria-label="Season goal">
      <div className="rounded-2xl border border-bone/12 bg-forest-900/50 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">
              {SEASON.label}
            </p>
            <p className="mt-1 font-display text-lg text-bone">
              {SEASON.place} · {SEASON.dateLabel}
            </p>
          </div>
          <ConceptTag variant="illustrative">Illustrative</ConceptTag>
        </div>

        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-forest-800"
          role="progressbar"
          aria-valuenow={Math.round(pct * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Community packs toward the season goal"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-river-400 to-amber-400"
            style={{ width: `${pct * 100}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] tabular-nums text-bone-500">
          <span>{SEASON.now.toLocaleString()} packs</span>
          <span className="flex items-center gap-1 text-river-400">
            <TreePine className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden="true" />
            {SEASON.treesAtGoal.toLocaleString()} trees at goal
          </span>
          <span>{SEASON.goal.toLocaleString()} goal</span>
        </div>
      </div>
    </section>
  )
}
