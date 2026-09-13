import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileCheck2, HandCoins, Satellite, QrCode } from 'lucide-react'
import { useInViewport } from '../../hooks/useInViewport'

const SatelliteGrid = lazy(() => import('../../scenes/homeAmbient/SatelliteGrid'))

const MODULES = [
  { icon: FileCheck2, label: 'EUDR audit export', note: 'plot-level GeoJSON' },
  { icon: HandCoins, label: 'Fair-pay telemetry', note: 'premium paid vs. auction' },
  { icon: Satellite, label: 'Satellite analytics', note: 'canopy change, per block' },
  { icon: QrCode, label: 'QR scan attribution', note: 'where the pack was traced' },
]

/**
 * Corporate gateway — "the export". Previously carried the same real-footage
 * WebGL relief treatment as the Buffer Belt viewer, backed by cargo-ship
 * footage — pulled because that clip was unlicensed Shutterstock preview
 * footage (visible watermark). Rather than wait on a licensed clip, the
 * background layer is now a small original scene instead: a quiet plot grid
 * with one slow scanning pass, in the same river-500 "data / verification"
 * accent the rest of the site already uses for this idea — it needs no
 * footage at all, so it directly answers "EUDR audit export" / "Satellite
 * analytics" / "QR scan attribution" in the card beside it.
 *
 * The footer's height is content-driven (its card + banner + disclosure
 * rows), so the background layer can't use `height:100%` the way a
 * fixed-height section can (that needs a *definite* ancestor height — see
 * `BufferBeltViewer`). Instead, the footer is a CSS grid whose background
 * layer and content layer share one implicit cell (`col/row-start-1`): the
 * content's natural height sizes the row, and the grid's default stretch
 * behaviour gives the background layer that same height directly — no
 * ResizeObserver needed.
 */
export default function MacroFooter() {
  const [footerRef, inView] = useInViewport({ rootMargin: '400px 0px' })

  return (
    <footer ref={footerRef} className="relative z-10 grid overflow-hidden bg-forest-950">
      <Suspense fallback={null}>
        <div className="pointer-events-none relative col-start-1 row-start-1 min-w-0 opacity-70">
          <SatelliteGrid active={inView} />
        </div>
      </Suspense>

      {/* Forest-950 at the top seam → opaque cool slate at the base, bridging the
          site palette into the dark corporate dashboard shell. */}
      <div className="pointer-events-none col-start-1 row-start-1 min-w-0 bg-gradient-to-t from-slate-deep via-slate-deep/72 to-forest-950/92" />

      <div className="relative col-start-1 row-start-1 mx-auto min-w-0 max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 rounded-3xl border border-amber-400/25 bg-slate-deep/55 p-8 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
              EUDR · Fair-pay · Satellite · QR
            </p>
            <h2 className="mt-3 max-w-[20ch] font-display text-3xl leading-[1.08] text-bone sm:text-4xl">
              The forest side of your supply chain, on the record.
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-sage-300">
              Every block your brand sponsors, audited and exportable — the proof
              a Conservation Passport is built from.
            </p>
            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
            >
              Open the ESG portal
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </div>

          <ul className="grid gap-2 self-center border-t border-bone/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {MODULES.map(({ icon: Icon, label, note }) => (
              <li key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" strokeWidth={2} aria-hidden="true" />
                <span className="text-[13px] leading-snug text-bone-300">
                  <span className="text-bone">{label}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-sage-500">
                    {note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-bone/10 bg-slate-deep/50 px-6 py-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-[14px] leading-snug text-bone-300">
            <span className="text-bone">Not sponsoring a block yet?</span> Launch a
            co-branded edition and adopt a sector of the belt.
          </p>
          <Link
            to="/launch"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-400/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400 transition-colors duration-200 hover:border-amber-400 hover:bg-amber-400/10"
          >
            Request a Forest Edition
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
            ForestOS · Prototype · Nairobi
          </p>
          <p className="max-w-[60ch] text-[12px] leading-relaxed text-bone-300">
            No ForestOS backend exists yet — belt figures, sponsor names,
            coordinates, verification references and every dashboard metric are
            illustrative mock data.
          </p>
        </div>
      </div>
    </footer>
  )
}
