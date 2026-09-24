import { useId, useState } from 'react'
import { chartDomainMax } from '../../lib/investor/chartScale'
import { formatNumber } from '../../lib/investor/format'

const WIDTH = 320
const HEIGHT = 110
const PAD_X = 10
const PAD_TOP = 16
const PAD_BOTTOM = 2
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM

// Axis ticks stay short ("10k") so they fit the narrow gutter beside the plot.
const formatTick = (value) => (value >= 1_000 ? `${value / 1_000}k` : formatNumber(value))

/**
 * One metric, one hue, one line — small multiples rather than one crowded
 * multi-series chart (dataviz skill: never a dual-axis chart; a second
 * measure of different scale gets its own chart). The y-axis always starts
 * at zero (or spans a metric's declared fixed scale, e.g. a 0–100 index), so
 * the line's height is proportional to the value: a 58 → 67 index change
 * reads as the modest rise it is, not as a climb from nothing. The first and
 * latest values are labelled directly; the rest are on hover and in a
 * screen-reader-only table.
 *
 * @param {{
 *   label: string,
 *   unit: string,
 *   methodology: string,
 *   series: Array<{ year: string, value: number }>,
 *   scaleMax?: number,
 *   baselineBefore?: string,
 * }} props
 * `scaleMax` is the metric's fixed scale top (100 for an index or a
 * percentage). `baselineBefore` (a year) marks every earlier point as
 * baseline — data from before the funding began, not a programme result.
 */
export default function PerformanceChart({ label, unit, methodology, series, scaleMax, baselineBefore }) {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState(null)

  if (series.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-4">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-2 text-sm text-ink-muted">Not yet measured.</p>
        <p className="mt-3 text-xs leading-snug text-ink-faint">{methodology}</p>
      </div>
    )
  }

  const domainMax = chartDomainMax(series.map((point) => point.value), scaleMax)
  const stepX = (WIDTH - PAD_X * 2) / Math.max(1, series.length - 1)
  const toY = (value) => PAD_TOP + PLOT_HEIGHT - (value / domainMax) * PLOT_HEIGHT
  const baseY = toY(0)

  const isBaseline = (point) => Boolean(baselineBefore) && point.year < baselineBefore
  const points = series.map((point, index) => ({
    ...point,
    baseline: isBaseline(point),
    x: PAD_X + index * stepX,
    y: toY(point.value),
  }))
  const latest = points[points.length - 1]
  const ticks = [domainMax, domainMax / 2, 0]

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${latest.x},${baseY} L${points[0].x},${baseY} Z`
  const hovered = hoverIndex !== null ? points[hoverIndex] : null
  const labelled = hovered ? [] : [...new Set([points[0], latest])]
  const toLeft = (x) => `${(x / WIDTH) * 100}%`
  const toTop = (y) => `${(y / HEIGHT) * 100}%`

  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-sans text-2xl font-bold tabular-nums text-ink">{formatNumber(latest.value)}</span>
        <span className="text-xs text-ink-muted">
          {unit} · {latest.year}
        </span>
      </p>

      <div className="mt-3 pl-8">
        <div className="relative">
          {/* Recessive y-axis: three ticks, labelled in HTML so text never scales with the SVG */}
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-full mr-2 -translate-y-1/2 font-mono text-[10px] tabular-nums text-ink-faint"
              style={{ top: toTop(toY(tick)) }}
            >
              {formatTick(tick)}
            </span>
          ))}

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block w-full overflow-visible"
            role="img"
            aria-label={`${label}: ${series.map((p) => `${p.year} ${p.value} ${unit}`).join(', ')}. Axis from 0 to ${domainMax}.`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-forest-accent)" stopOpacity="0.14" />
                <stop offset="100%" stopColor="var(--color-forest-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={WIDTH}
                y1={toY(tick)}
                y2={toY(tick)}
                stroke={tick === 0 ? 'var(--color-line-strong)' : 'var(--color-line)'}
                strokeDasharray={tick === 0 ? undefined : '2 3'}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-forest-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {points.map((p, index) => (
              <g key={p.year}>
                {/* Visible mark stays small; the invisible circle gives the >=8px hit target */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={index === hoverIndex ? 4 : 3}
                  fill={index === points.length - 1 ? 'var(--color-forest-accent)' : 'var(--color-card)'}
                  stroke={p.baseline ? 'var(--color-ink-faint)' : 'var(--color-forest-accent)'}
                  strokeWidth="2"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.year}${p.baseline ? ' (baseline, before funding)' : ''}: ${p.value} ${unit}`}
                />
              </g>
            ))}
          </svg>

          {labelled.map((p) => (
            <span
              key={p.year}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-[140%] font-mono text-[11px] font-semibold tabular-nums text-ink-muted"
              style={{ left: toLeft(p.x), top: toTop(p.y) }}
            >
              {formatNumber(p.value)}
            </span>
          ))}

          {hovered && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-md border border-line-strong bg-card px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-ink shadow-[0_6px_20px_-6px_rgba(20,32,25,0.25)]"
              style={{ left: toLeft(hovered.x), top: toTop(hovered.y) }}
            >
              {hovered.year}: {formatNumber(hovered.value)} {unit}
              {hovered.baseline && <span className="ml-1 font-normal text-ink-faint">baseline</span>}
            </div>
          )}
        </div>

        <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-ink-faint">
          {series.map((point) => (
            <span key={point.year}>
              {point.year}
              {isBaseline(point) && <span className="ml-1">baseline</span>}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs leading-snug text-ink-faint">{methodology}</p>

      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Value ({unit || 'count'})</th>
          </tr>
        </thead>
        <tbody>
          {series.map((point) => (
            <tr key={point.year}>
              <th scope="row">{point.year}</th>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
