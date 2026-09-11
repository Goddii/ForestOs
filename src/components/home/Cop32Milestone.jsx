import { COP32 } from '../../lib/brands'
import { useCountdown } from '../../hooks/useCountdown'

/**
 * The shared finish line the league is racing toward — a real fixed date, a
 * mock pack count climbing toward a tree-planting milestone. Used full-width on
 * the home page and compact inside the batch brand beat.
 *
 * @param {boolean} [compact]  tighter padding + type for the batch page
 */
export default function Cop32Milestone({ compact = false }) {
  const { days } = useCountdown(COP32.date)
  const fill = Math.min(100, Math.round((COP32.packsNow / COP32.packsGoal) * 100))

  return (
    <div
      className={
        'rounded-2xl border border-bone/15 bg-forest-950/40 backdrop-blur-md ' +
        (compact ? 'p-5' : 'p-5 sm:p-6')
      }
    >
      <div className="sm:flex sm:items-end sm:justify-between sm:gap-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage-500">
            Road to COP32 · {COP32.label}
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className={'tnum font-display leading-none text-bone ' + (compact ? 'text-3xl' : 'text-4xl sm:text-5xl')}>
              {days.toLocaleString()}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
              days to go
            </span>
          </p>
        </div>

        <div className="mt-5 w-full sm:mt-0 sm:max-w-xs">
          <span className="block h-1.5 w-full overflow-hidden rounded-full bg-bone/15">
            <span className="block h-full rounded-full bg-amber-400" style={{ width: `${fill}%` }} />
          </span>
          <p className="tnum mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
            {COP32.packsNow.toLocaleString()} / {COP32.packsGoal.toLocaleString()} packs → {COP32.treesAtGoal.toLocaleString()} trees
          </p>
        </div>
      </div>
    </div>
  )
}
