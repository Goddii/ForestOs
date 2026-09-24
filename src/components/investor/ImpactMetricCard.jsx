import MetricTrend from './MetricTrend'
import ConfidenceIndicator from './ConfidenceIndicator'
import { formatNumber } from '../../lib/investor/format'

// What kind of number this is, from how it was established — never shown bare.
const VALUE_TYPE = {
  verified: 'Verified',
  field_verified: 'Verified in the field',
  satellite_verified: 'Remote-sensing observation',
  pending_verification: 'Reported, awaiting verification',
  incomplete: 'Not measured',
}

function formatValue(value, unit) {
  if (value === null || value === undefined) return '—'
  if (unit === 'KSh') return `KSh ${formatNumber(value)}`
  return `${formatNumber(value)}${unit ? ` ${unit}` : ''}`
}

/**
 * One Impact Explorer metric (build brief §24): current, baseline, target,
 * trend, evidence and methodology together — never a bare headline number
 * with no way to see what it's measured against. A `null` current value
 * renders as "—" with the methodology explaining why, never a fabricated
 * figure (build brief §32/§39). Purely informational (no click target), so
 * it carries a resting shadow for depth but no hover-interactive treatment.
 *
 * @param {{ metric: import('../../data/investor/types').ImpactMetric }} props
 */
export default function ImpactMetricCard({ metric }) {
  const isConfigured = metric.current !== null

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-compact font-semibold text-ink">{metric.label}</p>
        {isConfigured && <MetricTrend trend={metric.trend} />}
      </div>

      {isConfigured ? (
        <>
          <p className="mt-2 text-2xl font-bold tabular-nums text-ink">
            {formatValue(metric.current, metric.unit)}
          </p>
          <p className="mt-0.5 text-label text-ink-faint">{VALUE_TYPE[metric.confidence] ?? 'Reported'}, programme-wide</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-label uppercase tracking-label text-ink-faint">
            <div>
              <dt className="inline">Baseline </dt>
              <dd className="inline font-sans font-medium tabular-nums text-ink-muted">{formatValue(metric.baseline, metric.unit)}</dd>
            </div>
            {metric.target !== null && (
              <div>
                <dt className="inline">Target </dt>
                <dd className="inline font-sans font-medium tabular-nums text-ink-muted">{formatValue(metric.target, metric.unit)}</dd>
              </div>
            )}
          </dl>
        </>
      ) : (
        <p className="mt-2 text-2xl font-bold text-ink-faint">—</p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">{metric.evidenceSummary}</p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
        <ConfidenceIndicator status={metric.confidence} />
      </div>
      <p className="mt-2 font-mono text-label italic leading-relaxed text-ink-faint">
        {metric.methodology}
      </p>
    </div>
  )
}
