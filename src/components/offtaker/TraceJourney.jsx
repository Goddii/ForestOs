import { AlertTriangle, CheckCircle2, CircleDashed, Clock, Store } from 'lucide-react'
import { INDEPENDENCE_LABELS } from '../../lib/programme/verificationState'
import { StageStatusBadge } from './StatusBadges'

const NODE = {
  verified: { icon: CheckCircle2, ring: 'border-forest-accent bg-forest-accent text-white', line: 'bg-forest-accent' },
  pending: { icon: Clock, ring: 'border-warning bg-warning-soft text-warning', line: 'bg-line-strong' },
  flagged: { icon: AlertTriangle, ring: 'border-danger bg-danger-soft text-danger', line: 'bg-line-strong' },
  not_recorded: { icon: CircleDashed, ring: 'border-line-strong bg-card text-ink-faint', line: 'bg-line-strong' },
  open: { icon: Store, ring: 'border-line-strong bg-card text-ink-faint', line: 'bg-line-strong' },
}

/**
 * Farmer / Source → Collection centre → Delivery → Processing → Batch →
 * Buyer. A real sequence, so the stages are numbered and joined; the line
 * after a stage is solid green only when that stage is verified, so a break
 * in the chain is visible at a glance, and every node carries its own icon
 * and label (never colour alone).
 *
 * @param {{ journey: ReturnType<import('../../lib/offtaker/journey').buildJourney> }} props
 */
export default function TraceJourney({ journey }) {
  return (
    <ol className="grid gap-0 lg:grid-cols-6">
      {journey.stages.map((stage, index) => {
        const node = NODE[stage.status]
        const Icon = node.icon
        const last = index === journey.stages.length - 1
        return (
          <li key={stage.key} className="relative flex gap-4 pb-8 lg:block lg:pb-0 lg:pr-5">
            {/* connector: vertical on mobile, horizontal on desktop */}
            {!last && (
              <>
                <span aria-hidden="true" className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 lg:hidden ${node.line}`} />
                <span aria-hidden="true" className={`absolute left-8 right-0 top-[15px] hidden h-0.5 lg:block ${node.line}`} />
              </>
            )}
            <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${node.ring}`}>
              <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <div className="min-w-0 lg:mt-4">
              <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
                {index + 1}. {stage.label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink">{stage.title}</p>
              <StageStatusBadge status={stage.status} className="mt-2" />
              {stage.attestation && (
                <p className="mt-2 text-xs leading-snug text-ink-muted">
                  {stage.attestation.role}, {stage.attestation.at}
                  <span className="block text-ink-faint">{INDEPENDENCE_LABELS[stage.attestation.independence]}</span>
                </p>
              )}
              {stage.rows.length > 0 && (
                <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-xs">
                  {stage.rows.map((row) => (
                    <div key={row.k}>
                      <dt className="text-ink-faint">{row.k}</dt>
                      <dd className="font-medium tabular-nums text-ink-muted [overflow-wrap:anywhere]">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {stage.note && <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-xs leading-snug text-ink-muted">{stage.note}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * The same six stages as a single row of status dots — for cards and table
 * rows, where the full journey would be too much. Labelled for screen readers.
 *
 * @param {{ journey: ReturnType<import('../../lib/offtaker/journey').buildJourney> }} props
 */
export function JourneyStrip({ journey }) {
  const summary = journey.stages.map((stage) => `${stage.label}: ${stage.status.replace('_', ' ')}`).join(', ')
  return (
    <div className="flex items-center" role="img" aria-label={summary} title={summary}>
      {journey.stages.map((stage, index) => {
        const node = NODE[stage.status]
        const Icon = node.icon
        return (
          <span key={stage.key} className="flex items-center">
            <span className={`grid h-5 w-5 place-items-center rounded-full border ${node.ring}`}>
              <Icon className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
            </span>
            {index < journey.stages.length - 1 && <span className={`h-0.5 w-2.5 ${node.line}`} aria-hidden="true" />}
          </span>
        )
      })}
    </div>
  )
}
