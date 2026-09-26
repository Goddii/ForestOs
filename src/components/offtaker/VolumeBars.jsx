import { shareOf } from '../../lib/investor/chartScale'

/**
 * Horizontal bars measured from zero against the largest value (dataviz:
 * magnitude → bar, one hue, direct labels, no truncated axis). Each row
 * carries its own value as text, so the bars never carry meaning alone.
 *
 * @param {{ rows: Array<{ key: string, label: string, sublabel?: string, value: number, format?: (v: number) => string }>, unit?: string, max?: number }} props
 */
export default function VolumeBars({ rows, unit = 'kg', max }) {
  const top = max ?? Math.max(1, ...rows.map((row) => row.value))
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.key}>
          <div className="flex items-baseline justify-between gap-3 text-compact">
            <span className="min-w-0 truncate text-ink">
              {row.label}
              {row.sublabel && <span className="ml-1.5 text-xs text-ink-faint">{row.sublabel}</span>}
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-ink">
              {row.format ? row.format(row.value) : `${row.value.toLocaleString('en-US')} ${unit}`}
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-canvas-sunk" aria-hidden="true">
            <div className="h-2 rounded-full bg-forest-accent" style={{ width: `${shareOf(row.value, top) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
