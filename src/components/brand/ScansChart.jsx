import { useEffect, useId, useRef, useState } from 'react'

const HEIGHT = 220
const PAD = { top: 12, right: 12, bottom: 26, left: 44 }
const TARGET_TICKS = 4
const STEPS = [1, 2, 5, 10]

/** A 1-2-5 tick step, so every gridline lands on a round whole number. */
function tickStep(max) {
  const raw = Math.max(1, max / TARGET_TICKS)
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  return STEPS.find((step) => step * magnitude >= raw) * magnitude
}

const formatDay = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function useWidth(ref) {
  const [width, setWidth] = useState(640)
  useEffect(() => {
    if (!ref.current) return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return width
}

/**
 * Daily scans, one series in the forest accent (dataviz: single hue, 2px
 * line, ~10% area wash, zero baseline, hairline solid grid). A crosshair
 * follows the pointer and the arrow keys; the tooltip leads with the value.
 * The same numbers are in a table below the chart, so nothing needs hover.
 *
 * @param {{ rows: Array<{ date: string, scans: number, uniqueDevices: number }>, label: string }} props
 */
export default function ScansChart({ rows, label }) {
  const containerRef = useRef(null)
  const width = useWidth(containerRef)
  const gradientId = useId()
  const [active, setActive] = useState(null)
  const [showTable, setShowTable] = useState(false)

  if (rows.length === 0) return null
  const step = tickStep(Math.max(...rows.map((row) => row.scans)))
  const max = Math.max(step, Math.ceil(Math.max(...rows.map((row) => row.scans)) / step) * step)
  const plotW = width - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const x = (index) => PAD.left + (rows.length === 1 ? plotW / 2 : (index / (rows.length - 1)) * plotW)
  const y = (value) => PAD.top + plotH - (value / max) * plotH
  const line = rows.map((row, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)},${y(row.scans).toFixed(1)}`).join(' ')
  const area = `${line} L${x(rows.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`
  const ticks = Array.from({ length: max / step + 1 }, (_, i) => step * i)
  const labelEvery = Math.max(1, Math.ceil(rows.length / Math.floor(plotW / 70)))
  const last = rows.length - 1

  const pick = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect()
    const ratio = (clientX - rect.left - PAD.left) / plotW
    setActive(Math.min(last, Math.max(0, Math.round(ratio * last))))
  }
  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') setActive((current) => Math.min(last, (current ?? -1) + 1))
    else if (event.key === 'ArrowLeft') setActive((current) => Math.max(0, (current ?? last + 1) - 1))
    else return
    event.preventDefault()
  }
  const point = active !== null ? rows[active] : null

  return (
    <div>
      <div ref={containerRef} className="relative">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`${label}. ${rows.length} days, from ${formatDay(rows[0].date)} to ${formatDay(rows[last].date)}. Use the arrow keys to read each day.`}
          tabIndex={0}
          onPointerMove={(event) => pick(event.clientX)}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="block touch-pan-y rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-forest-accent)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--color-forest-accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke="var(--color-line)" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(tick) + 3.5} textAnchor="end" className="fill-ink-faint text-[10px] tabular-nums">
                {Math.round(tick).toLocaleString('en-US')}
              </text>
            </g>
          ))}
          {rows.map((row, index) =>
            (index % labelEvery === 0 && last - index >= labelEvery) || index === last ? (
              <text key={row.date} x={x(index)} y={HEIGHT - 8} textAnchor={index === 0 ? 'start' : index === last ? 'end' : 'middle'} className="fill-ink-faint text-[10px]">
                {formatDay(row.date)}
              </text>
            ) : null,
          )}
          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line} fill="none" stroke="var(--color-forest-accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={x(last)} cy={y(rows[last].scans)} r="4" fill="var(--color-forest-accent)" stroke="var(--color-card)" strokeWidth="2" />
          {point && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="var(--color-ink-faint)" strokeWidth="1" />
              <circle cx={x(active)} cy={y(point.scans)} r="4.5" fill="var(--color-forest-accent)" stroke="var(--color-card)" strokeWidth="2" />
            </g>
          )}
        </svg>
        {point && (
          <div
            className="pointer-events-none absolute top-1 z-10 rounded-lg border border-line bg-card px-3 py-2 text-xs shadow-card"
            style={{ left: Math.min(Math.max(x(active) - 70, 0), width - 150) }}
            role="status"
          >
            <p className="text-sm font-bold tabular-nums text-ink">{point.scans.toLocaleString('en-US')} scans</p>
            <p className="tabular-nums text-ink-muted">~{point.uniqueDevices.toLocaleString('en-US')} devices</p>
            <p className="mt-0.5 text-ink-faint">{formatDay(point.date)}</p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setShowTable((open) => !open)}
        aria-expanded={showTable}
        className="mt-2 text-xs font-semibold text-forest-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        {showTable ? 'Hide the table' : 'Show as a table'}
      </button>
      {showTable && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-line">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{label}</caption>
            <thead className="sticky top-0 bg-canvas font-mono text-label uppercase tracking-label text-ink-faint">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Day</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Scans</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Devices (est.)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-t border-line">
                  <td className="px-3 py-1.5 text-ink-muted">{formatDay(row.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-ink">{row.scans.toLocaleString('en-US')}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-ink-muted">{row.uniqueDevices.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
