import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

function TelemetryRow({ term, children }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">
        {term}
      </dt>
      <dd className="mt-1 text-bone-300">{children}</dd>
    </div>
  )
}

/**
 * Glassmorphic slide-over showing mock "live" telemetry for the focused plot.
 * Opens when a focus chip or a 3D pin is clicked; the close button dismisses it
 * and asks the parent to reset the camera to the Kiptunga overview.
 *
 * Slide/fade honors prefers-reduced-motion (appears in place), and Escape
 * closes it. `focus` is null when nothing is selected.
 */
export default function PlotTelemetryDrawer({ focus, onClose }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!focus) return
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [focus, onClose])

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: '100%' },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: '100%' },
      }

  return (
    <AnimatePresence>
      {focus && (
        <motion.aside
          key={focus.id}
          role="dialog"
          aria-label={`Plot telemetry — ${focus.label}`}
          {...motionProps}
          transition={{ duration: 0.42, ease: EASE }}
          className="absolute inset-y-0 right-0 z-30 w-[min(21rem,calc(100%-1.5rem))] overflow-y-auto border-l border-river-500/25 bg-forest-950/80 p-5 backdrop-blur-md shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)]"
        >
          <header className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-river-500">
                Plot telemetry
              </p>
              <h3 className="mt-1 font-display text-xl leading-tight text-bone">
                {focus.label}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close telemetry"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-bone/15 text-sage-300 transition-colors duration-200 hover:border-bone/30 hover:text-bone"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </header>

          <dl className="mt-5 space-y-4 text-[13px] leading-relaxed">
            <TelemetryRow term="Elevation">
              <span className="font-mono tabular-nums text-bone">{focus.telemetry.elevation}</span>
              <span className="mt-0.5 block">{focus.telemetry.place}</span>
            </TelemetryRow>
            <TelemetryRow term="Coordinates">
              <span className="font-mono tabular-nums text-bone">
                {focus.telemetry.coordinates}
              </span>
            </TelemetryRow>
            <TelemetryRow term="Active community group">
              {focus.telemetry.group}
            </TelemetryRow>
          </dl>

          <div className="mt-5 rounded-xl border border-river-500/25 bg-river-500/10 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-river-500/60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-river-500" />
              </span>
              <p className="font-mono text-[11px] tabular-nums text-bone">
                {focus.telemetry.monitor}
              </p>
            </div>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
              {focus.telemetry.source}
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
