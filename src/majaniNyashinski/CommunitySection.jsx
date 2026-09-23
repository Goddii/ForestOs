import Reveal from '../components/Reveal'
import CountUp from '../components/ui/CountUp'

/**
 * Community metrics. `covenantHa` is real (`findBatchRecord('921').block.
 * covenantHa`); scans/guardians/conservation-action counts and the top-
 * guardian-regions list have no backend counter behind them yet, so every
 * one of them carries the same "Demo data" mark this repo uses elsewhere
 * (e.g. `ImpactTicker`'s "· illustrative figures") — never presented as live.
 *
 * @param {{
 *   covenantHa: number, demoScans: number, demoGuardians: number,
 *   demoConservationActions: number,
 *   demoTopGuardianRegions: Array<{ region: string, guardians: number }>,
 *   onJoin: () => void,
 * }} props
 */
export default function CommunitySection({
  covenantHa,
  demoScans,
  demoGuardians,
  demoConservationActions,
  demoTopGuardianRegions,
  onJoin,
}) {
  return (
    <section className="bg-bone px-6 py-24 text-ink sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint">
            The Guardian community
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            You're not the only one listening.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Community activity · illustrative figures
          </p>
        </Reveal>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Scans', value: demoScans },
            { label: 'Guardians', value: demoGuardians },
            { label: 'Conservation actions', value: demoConservationActions },
            { label: 'Hectares under covenant', value: covenantHa, real: true },
          ].map(({ label, value, real }) => (
            <Reveal key={label} delay={0.05}>
              <div className="rounded-2xl border border-line bg-card p-5">
                <p className="font-sans text-2xl font-bold tabular-nums text-ink">
                  <CountUp to={value} separator="," duration={1.4} />
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {label}
                  {real ? '' : ' *'}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-ink-faint">
          * demo figure — hectares under covenant is the one real number above
        </p>

        <Reveal delay={0.2} className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Top Guardian regions (demo)
          </p>
          <ol className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
            {demoTopGuardianRegions.map((entry, i) => (
              <li key={entry.region} className="flex items-center justify-between px-5 py-3.5">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-ink-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-sm font-semibold">{entry.region}</span>
                </span>
                <span className="font-mono text-[12px] tabular-nums text-ink-muted">
                  {entry.guardians.toLocaleString('en-US')} guardians
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.3}>
          <button
            type="button"
            onClick={onJoin}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-800 px-6 py-3 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
          >
            Join the community
          </button>
        </Reveal>
      </div>
    </section>
  )
}
