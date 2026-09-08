// Campaign sell-through: one segmented bar across every launched edition series.
// Each drop owns a slice of the track sized by its edition run; the filled part
// of the slice is units sold. Upcoming (scheduled) drops are summarised as
// held-back inventory rather than drawn as empty track.

const SEGMENT_FILL = ['bg-emerald-800', 'bg-emerald-600', 'bg-emerald-500', 'bg-emerald-400']

export default function CampaignSellThrough({ drops }) {
  const launched = drops.filter((d) => d.status !== 'scheduled')
  const upcoming = drops.filter((d) => d.status === 'scheduled')

  const runTotal = launched.reduce((s, d) => s + d.editions, 0)
  const soldTotal = launched.reduce((s, d) => s + d.sold, 0)
  const upcomingEditions = upcoming.reduce((s, d) => s + d.editions, 0)
  const sellThroughPct = Math.round((soldTotal / runTotal) * 100)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <p className="font-display text-[2rem] leading-none tabular-nums text-ink">
          {soldTotal.toLocaleString()}
          <span className="text-ink-faint"> / {runTotal.toLocaleString()}</span>
          <span className="ml-2 font-mono text-[13px] uppercase tracking-[0.1em] text-ink-muted">
            units
          </span>
        </p>
        <p className="font-mono text-[13px] tabular-nums text-emerald-700">
          {sellThroughPct}% sell-through
        </p>
      </div>

      <div
        className="mt-3 flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-line-strong"
        role="img"
        aria-label={
          `Sell-through by series: ` +
          launched
            .map((d) => `${d.name}, ${d.sold} of ${d.editions} sold`)
            .join('; ')
        }
      >
        {launched.map((drop, i) => (
          <span
            key={drop.id}
            className="relative block h-full bg-line first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(drop.editions / runTotal) * 100}%` }}
          >
            <span
              className={'absolute inset-y-0 left-0 block rounded-[inherit] ' + SEGMENT_FILL[i % SEGMENT_FILL.length]}
              style={{ width: `${(drop.sold / drop.editions) * 100}%` }}
            />
          </span>
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {launched.map((drop, i) => (
          <li
            key={drop.id}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted"
          >
            <span
              className={'h-2 w-2 rounded-[2px] ' + SEGMENT_FILL[i % SEGMENT_FILL.length]}
              aria-hidden="true"
            />
            {drop.name} · {drop.sold}/{drop.editions} · {Math.round((drop.sold / drop.editions) * 100)}%
          </li>
        ))}
      </ul>

      {upcomingEditions > 0 && (
        <p className="mt-3 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          {upcomingEditions.toLocaleString()} editions held back for{' '}
          {upcoming.map((d) => d.name).join(', ')}
        </p>
      )}
    </div>
  )
}
