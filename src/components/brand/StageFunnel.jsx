import { TrendingDown } from 'lucide-react'
import { shareOf } from '../../lib/investor/chartScale'

/**
 * How far readers get through the experience, stage by stage: one hue,
 * bars from zero against the first stage, the count and the share that
 * carried on from the stage before written beside every bar, and the
 * steepest drop called out with an icon and words rather than colour.
 *
 * @param {{ funnel: ReturnType<import('../../lib/brand/analytics').stageFunnel> }} props
 */
export default function StageFunnel({ funnel }) {
  const top = funnel.rows[0]?.count ?? 0
  return (
    <ol className="space-y-3.5">
      {funnel.rows.map((row) => {
        const isDrop = row.key === funnel.biggestDropKey
        return (
          <li key={row.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-compact">
              <span className="text-ink">{row.label}</span>
              <span className="flex items-baseline gap-3">
                {row.fromPrevious !== null && (
                  <span className={`inline-flex items-center gap-1 text-compact ${isDrop ? 'font-semibold text-warning' : 'text-ink-faint'}`}>
                    {isDrop && <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />}
                    {row.fromPrevious}% carried on{isDrop ? ', biggest drop' : ''}
                  </span>
                )}
                <span className="font-semibold tabular-nums text-ink">{row.count.toLocaleString('en-US')}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-canvas-sunk" aria-hidden="true">
              <div className="h-2 rounded-full bg-forest-accent" style={{ width: `${shareOf(row.count, top) * 100}%` }} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
