const SIGNALS = [
  'Batch KTB-0417 verified at Kiptunga collection centre',
  'Satellite pass over Mau sector complete, no canopy loss flagged',
  'EUDR geolocation export generated for 212 plots',
  'Direct plucker premium settled via M-Pesa, Aberdare East Belt',
  'Batch NRV-1183 traced to Nessuit, Mau Forest Complex',
]

/**
 * A thin activity strip above the nav, visible only over the transparent
 * hero phase (see MacroNav) — a live-feeling signal before the visitor has
 * scrolled at all, in the same honestly-labelled voice as ImpactTicker's
 * "illustrative figures" (there is no backend yet; nothing here claims to
 * be a real feed). Marquee content is duplicated once and looped by
 * translating exactly -50%, and the global reduced-motion rule in
 * index.css already collapses the animation to a static first frame.
 */
export default function OperationsTicker() {
  const loopedSignals = [...SIGNALS, ...SIGNALS]

  return (
    <div
      aria-hidden="true"
      className="hidden overflow-hidden border-b border-bone/10 bg-forest-950/70 backdrop-blur-sm sm:block"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-8 py-1.5">
        <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-sage-500">
          Live activity · illustrative feed
        </p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="ticker-track flex w-max gap-10 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-sage-300">
            {loopedSignals.map((signal, i) => (
              <span key={i}>{signal}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
