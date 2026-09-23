import { MapPin, ShieldCheck, Sprout } from 'lucide-react'
import Reveal from '../components/Reveal'

const PILLARS = [
  {
    key: 'trace',
    icon: MapPin,
    label: 'Trace',
    body: 'Where it came from — the real block, plot, and collection centre.',
  },
  {
    key: 'verify',
    icon: ShieldCheck,
    label: 'Verify',
    body: 'What happened — field and satellite verification, not a claim on a label.',
  },
  {
    key: 'act',
    icon: Sprout,
    label: 'Act',
    body: 'What you can do — join the community protecting this forest.',
  },
]

/**
 * The proof layer, mid-story: ForestOS becomes visible as infrastructure,
 * not the hero. Real verification fields from `findBatchRecord('921')`.
 *
 * @param {{
 *   standard: string, status: string, reference: string, verifiedAt: string,
 *   collectionCentre: string, farmersRepresented: number, proofUrl: string,
 *   onViewOrigin: () => void,
 * }} props
 */
export default function OriginProof({
  standard,
  status,
  reference,
  verifiedAt,
  collectionCentre,
  farmersRepresented,
  proofUrl,
  onViewOrigin,
}) {
  return (
    <section className="bg-card px-6 py-24 text-ink sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint">
            ForestOS · verification
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            The technology behind the tin.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PILLARS.map(({ key, icon: Icon, label, body }, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <div className="rounded-2xl border border-line bg-bone/40 p-6">
                <Icon className="h-5 w-5 text-forest-700" strokeWidth={1.75} aria-hidden="true" />
                <p className="mt-4 font-sans text-base font-bold">{label}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-8">
          <div className="rounded-2xl border border-line-strong bg-bone/60 p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-forest-700" strokeWidth={2} aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-700">
                {status} · {standard}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-4 font-mono text-[12px] sm:grid-cols-4">
              <div>
                <dt className="text-ink-faint">Collection centre</dt>
                <dd className="mt-0.5 font-semibold text-ink">{collectionCentre}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Farmers represented</dt>
                <dd className="mt-0.5 font-semibold tabular-nums text-ink">{farmersRepresented}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Verified</dt>
                <dd className="mt-0.5 font-semibold text-ink">{verifiedAt}</dd>
              </div>
              <div>
                <dt className="text-ink-faint">Reference</dt>
                <dd className="mt-0.5 font-semibold text-ink">{reference}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onViewOrigin}
                className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-5 py-2.5 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bone/60"
              >
                See the climate story
              </button>
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bone/60"
              >
                View full proof map
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
