const WIDTH = 72
const HEIGHT = 24
const PAD = 2

/**
 * A small real trend line for a KPI tile — supplements the tile's own
 * headline number, never stands in for it (craft-floor: sparklines must be
 * genuine data-viz, not decoration). Renders alongside a screen-reader-only
 * value list so the trend is available without the SVG.
 *
 * @param {{ series: Array<{ period: string, value: number }>, className?: string }} props
 */
export default function Sparkline({ series, className = '' }) {
  if (!series || series.length < 2) return null

  const values = series.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (WIDTH - PAD * 2) / (series.length - 1)

  const points = series.map((point, index) => ({
    x: PAD + index * stepX,
    y: HEIGHT - PAD - ((point.value - min) / range) * (HEIGHT - PAD * 2),
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const last = points[points.length - 1]

  return (
    <span className={`inline-block ${className}`}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        className="overflow-visible"
        role="img"
        aria-label={`Trend: ${series.map((p) => `${p.period} ${p.value.toLocaleString('en-US')}`).join(', ')}`}
      >
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="1.75" fill="currentColor" />
      </svg>
    </span>
  )
}
