import { Link } from 'react-router-dom'
import { ArrowRight, FileCheck2, HandCoins, Satellite, QrCode } from 'lucide-react'
import LoopingVideo from '../LoopingVideo'

const MODULES = [
  { icon: FileCheck2, label: 'EUDR audit export', note: 'plot-level GeoJSON' },
  { icon: HandCoins, label: 'Fair-pay telemetry', note: 'premium paid vs. auction' },
  { icon: Satellite, label: 'Satellite analytics', note: 'canopy change, per block' },
  { icon: QrCode, label: 'QR scan attribution', note: 'where the pack was traced' },
]

/**
 * Corporate gateway — "the export". Muted cargo-ship footage runs behind a
 * gradient that carries the palette from the forest ground at the top edge down
 * into the cool structural neutrals of the B2B dashboard theme.
 */
export default function MacroFooter() {
  return (
    <footer className="relative z-10 overflow-hidden bg-forest-950">
      <LoopingVideo
        src="/media/cargo-ship.mp4"
        playbackRate={0.7}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Forest-950 at the top seam → opaque cool slate at the base, bridging the
          site palette into the dark corporate dashboard shell. */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-deep via-slate-deep/72 to-forest-950/92" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
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

        <div className="mt-12 flex flex-col gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
