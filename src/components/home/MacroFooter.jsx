import { Link } from 'react-router-dom'
import { ArrowRight, FileCheck2, HandCoins, Satellite, QrCode } from 'lucide-react'

const MODULES = [
  { icon: FileCheck2, label: 'EUDR audit export', note: 'plot-level GeoJSON' },
  { icon: HandCoins, label: 'Fair-pay telemetry', note: 'premium paid vs. auction' },
  { icon: Satellite, label: 'Satellite analytics', note: 'canopy change, per block' },
  { icon: QrCode, label: 'QR scan attribution', note: 'where the pack was traced' },
]

// Who a Forest Edition is built for. Categories, not real brand names: the
// League above only ever names an actual sponsoring brand once it exists.
const ARCHETYPES = [
  'Artists & musicians',
  'Football clubs',
  'Airlines',
  'Banks',
  'Tourism boards',
  'Hotels & lodges',
  'Diaspora communities',
  'Foundations',
]

/**
 * Corporate gateway — "the export", and the page's closing beat. It bookends
 * the hero: the page ends on the same canopy it opened on (a frame from the
 * hero video, 1920x1080), fading in from forest-950 at the top and out to
 * slate at the base. One dark-glass card carries the single call to action;
 * the organisation types live inside it rather than in a separate row above.
 */
export default function MacroFooter({ bookend = false }) {
  return (
    <footer className="relative z-10 overflow-hidden bg-forest-950">
      {bookend ? (
        <>
          <img
            src="/media/footer-canopy.webp"
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-gradient-to-b from-forest-950 via-forest-950/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-slate-deep via-slate-deep/75 to-transparent"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-deep via-slate-deep/72 to-forest-950"
        />
      )}

      <div
        className={`relative mx-auto max-w-6xl px-6 sm:px-8 ${
          bookend ? 'pb-12 pt-40 sm:pb-14 sm:pt-64' : 'py-16 sm:py-20'
        }`}
      >
        <div
          className={`rounded-3xl border border-bone/20 p-8 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-12 ${
            bookend ? 'bg-forest-950/80' : 'bg-slate-deep/55'
          }`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div>
              <p className="font-mono text-label uppercase tracking-label text-sage-500">
                EUDR · Fair-pay · Satellite · QR
              </p>
              <h2 className="mt-3 max-w-[22ch] text-balance font-display text-3xl leading-[1.05] text-bone sm:text-display">
                The forest side of your supply chain, on the record.
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-sage-300">
                Every block your brand sponsors, audited and exportable, the proof a
                Conservation Passport is built from.
              </p>
            </div>

            <ul className="grid gap-3 self-center border-t border-bone/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {MODULES.map(({ icon: Icon, label, note }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" strokeWidth={2} aria-hidden="true" />
                  <span className="text-compact text-bone-300">
                    <span className="text-bone">{label}</span>
                    <span className="block font-mono text-label uppercase tracking-label text-sage-300">
                      {note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-6 border-t border-bone/15 pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-base font-semibold text-bone">
                Any organisation with a community behind it can adopt a sector of the belt.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {ARCHETYPES.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-bone/20 px-3 py-1.5 font-mono text-label uppercase tracking-label text-bone-300"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/launch"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
            >
              Request a Forest Edition
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
            bookend ? 'mt-24 sm:mt-28' : 'mt-10'
          }`}
        >
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-label uppercase tracking-label text-sage-300">
            ForestOS · Prototype · Nairobi
            <span aria-hidden="true" className="text-bone/30">
              ·
            </span>
            <Link
              to="/prototypes"
              className="underline decoration-sage-500/40 underline-offset-2 transition-colors duration-200 hover:text-bone"
            >
              All prototypes
            </Link>
            <span aria-hidden="true" className="text-bone/30">
              ·
            </span>
            <Link
              to="/passport/majani/802"
              className="underline decoration-sage-500/40 underline-offset-2 transition-colors duration-200 hover:text-bone"
            >
              Majani Passport tenant
            </Link>
          </p>
          <p className="max-w-[60ch] text-[12px] leading-relaxed text-bone-300">
            No ForestOS backend exists yet: belt figures, sponsor names,
            coordinates, verification references and every dashboard metric are
            illustrative mock data.
          </p>
        </div>
      </div>
    </footer>
  )
}
