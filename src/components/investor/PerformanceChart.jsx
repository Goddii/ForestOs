import { useId, useState } from 'react'

const WIDTH = 320
const HEIGHT = 120
const PAD_X = 8
const PAD_Y = 14

/**
 * One metric, one hue, one line — small multiples rather than one crowded
 * multi-series chart (dataviz skill: never a dual-axis chart; a second
 * measure of different scale gets its own chart). Single-hue `forest-accent`
 * mark, 2px stroke, rounded caps, >=8px hover hit targets, a visible
 * crosshair + tooltip, and a screen-reader-only data table so the same
 * numbers are available without the SVG (dataviz skill's "a table view
 * exists" accessibility pass).
 *
 * @param {{
 *   label: string,
 *   unit: string,
 *   methodology: string,
 *   series: Array<{ year: string, value: number }>,
 * }} props
 */
export default function PerformanceChart({ label, unit, methodology, series }) {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState(null)

  const values = series.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (WIDTH - PAD_X * 2) / (series.length - 1)

  const points = series.map((point, index) => ({
    ...point,
    x: PAD_X + index * stepX,
    y: HEIGHT - PAD_Y - ((point.value - min) / range) * (HEIGHT - PAD_Y * 2),
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${HEIGHT - PAD_Y} L${points[0].x},${HEIGHT - PAD_Y} Z`
  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
      <p className="text-[13px] font-semibold text-ink">{label}</p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
        {methodology}
      </p>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`${label}: ${series.map((p) => `${p.year} ${p.value}${unit}`).join(', ')}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-forest-accent)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--color-forest-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Recessive baseline only — no full grid, keeps the mark the focus */}
          <line
            x1={PAD_X}
            y1={HEIGHT - PAD_Y}
            x2={WIDTH - PAD_X}
            y2={HEIGHT - PAD_Y}
            stroke="var(--color-line-strong)"
          />

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-forest-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, index) => (
            <g key={p.year}>
              {/* Visible mark stays small; the invisible circle gives the >=8px hit target */}
              <circle
                cx={p.x}
                cy={p.y}
                r={index === hoverIndex ? 3.5 : 2.5}
                fill={index === points.length - 1 ? 'var(--color-forest-accent)' : 'var(--color-card)'}
                stroke="var(--color-forest-accent)"
                strokeWidth="2"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="transparent"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${p.year}: ${p.value}${unit}`}
              />
            </g>
          ))}
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border border-line-strong bg-card px-2 py-1 font-mono text-[10px] font-semibold tabular-nums text-ink shadow-[0_6px_20px_-6px_rgba(20,32,25,0.25)]"
            style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100 - 4}%` }}
          >
            {hovered.year}: {hovered.value.toLocaleString('en-US')}
            {unit && ` ${unit}`}
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
        {series.map((point) => (
          <span key={point.year}>{point.year}</span>
        ))}
      </div>

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
