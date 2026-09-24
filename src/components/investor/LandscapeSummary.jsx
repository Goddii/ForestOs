import { LANDSCAPE_SUMMARY } from '../../data/investor'

/**
 * The landscape summary positioned beside the map (design-review brief §8):
 * condition, active conservation, field verification, last verified and
 * evidence coverage — so the map is read alongside numbers, not on its own.
 */
export default function LandscapeSummary() {
  const s = LANDSCAPE_SUMMARY

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-1 sm:divide-y sm:divide-line">
      <div className="sm:pb-5">
        <dt className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
          Landscape condition (context)
        </dt>
        <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
          {s.conditionIndicator} <span className="text-base text-ink-muted">{s.conditionLabel}</span>
        </dd>
      </div>
      <div className="sm:py-5">
        <dt className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
          Active conservation
        </dt>
        <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
          {s.activeConservationHa.toLocaleString('en-US')} ha
        </dd>
      </div>
      <div className="sm:py-5">
        <dt className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
          Field verification
        </dt>
        <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
          {s.fieldVerificationRecords.toLocaleString('en-US')}{' '}
          <span className="text-base text-ink-muted">records</span>
        </dd>
      </div>
      <div className="sm:py-5">
        <dt className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
          Evidence coverage
        </dt>
        <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">{s.evidenceCoveragePct}%</dd>
      </div>
      <div className="col-span-2 sm:col-span-1 sm:pt-5">
        <dt className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
          Last verified
        </dt>
        <dd className="mt-1 font-mono text-compact text-ink-muted">{s.lastVerified}</dd>
      </div>
      <div className="col-span-2 sm:col-span-1 sm:pt-5">
        <dt className="font-mono text-label uppercase tracking-label-wide text-ink-faint">Source</dt>
        <dd className="mt-1 text-compact text-ink-muted">{s.sources.join(' · ')}</dd>
      </div>
    </dl>
  )
}
