import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Download, FileCheck2, X } from 'lucide-react'
import { STATUS_CSS, STATUS_LABEL } from './sectorMapStyle'

const EASE = [0.16, 1, 0.3, 1]

function coordLabel(plot) {
  const ns = plot.lat < 0 ? 'S' : 'N'
  return `${Math.abs(plot.lat).toFixed(3)}° ${ns}, ${plot.lon.toFixed(3)}° E`
}

/** Two-bar baseline-vs-current canopy comparison, dark HUD styling. */
function CanopyBars({ baseline, current }) {
  const rows = [
    { label: 'Baseline · Dec 2020', value: baseline, tint: 'rgba(243,238,227,0.5)' },
    { label: 'Current', value: current, tint: current >= baseline ? '#3ba552' : '#e8a85c' },
  ]
  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-baseline justify-between font-mono text-[11px]">
            <span className="text-bone/55">{row.label}</span>
            <span className="tabular-nums text-bone">{row.value}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bone/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max(0, Math.min(100, row.value))}%`, background: row.tint }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Slide-over HUD card for one picked plot — floats on the right edge of the
 * Sector Focus viewport. Dark glass because it sits over the satellite scene.
 */
export default function PlotInspector({ plot, onClose, onDownloadGeoJSON, onDownloadCert }) {
  const reduced = useReducedMotion()
  return (
    <AnimatePresence>
      {plot && (
        <motion.aside
          key={plot.id}
          className="pointer-events-auto absolute inset-y-0 right-0 z-30 w-[290px] max-w-[86%] overflow-y-auto border-l border-bone/15 bg-[#0b1109]/92 p-4 backdrop-blur-md sm:p-5"
          initial={reduced ? { opacity: 0 } : { x: 24, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { x: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { x: 24, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          aria-label={`Plot ${plot.id} inspector`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/45">Plot</p>
              <p className="mt-0.5 font-mono text-lg tracking-[0.04em] text-bone">{plot.id}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-bone/50 transition-colors hover:bg-bone/10 hover:text-bone"
              aria-label="Close inspector"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-1 font-mono text-[11px] text-bone/60">{coordLabel(plot)}</p>
          <p className="mt-0.5 text-[12px] text-bone/70">
            {plot.centre} · {plot.hectares} ha
          </p>

          <div className="mt-3">
            <span
              className="inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{
                color: '#f3eee3',
                borderColor: `${STATUS_CSS[plot.status]}99`,
                background: `${STATUS_CSS[plot.status]}33`,
              }}
            >
              EUDR · {STATUS_LABEL[plot.status]}
            </span>
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/45">
            Canopy density
          </p>
          <div className="mt-2">
            <CanopyBars baseline={plot.canopy2020} current={plot.canopyNow} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-bone/60">
            NDVI {plot.ndvi} ·{' '}
            {plot.loss > 0 ? `${plot.loss} pp loss since baseline` : 'no loss since baseline'}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onDownloadGeoJSON(plot)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-bone/20 bg-bone/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-bone transition-colors hover:bg-bone/12"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              GeoJSON
            </button>
            <button
              type="button"
              onClick={() => onDownloadCert(plot)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm transition-colors hover:bg-emerald-500"
            >
              <FileCheck2 className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
              Audit Certificate
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
