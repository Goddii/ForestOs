import Badge from './ui/Badge'
import { useWorkspace } from './FunderWorkspaceContext'
import { formatNumber } from '../../lib/investor/format'

const STATUS = {
  observed: { label: 'Counted', tone: 'verified' },
  overdue: { label: 'Overdue', tone: 'danger' },
  scheduled: { label: 'Scheduled', tone: 'neutral' },
}

/** Survival checks on the plantings this funder paid for: done, overdue, or still to come. */
export default function SurvivalChecks() {
  const { survivalChecks } = useWorkspace()
  const rows = survivalChecks.filter((check) => check.isFunded).toSorted((a, b) => a.dueDate.localeCompare(b.dueDate))

  if (rows.length === 0) return <p className="px-5 py-6 text-compact text-ink-muted">No plantings funded by this agreement need survival checks yet.</p>

  return (
    <ul className="divide-y divide-line">
      {rows.map((check) => {
        const status = STATUS[check.status]
        return (
          <li key={check.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">
                {check.monthsAfter}-month check · {check.activitySummary}
              </p>
              <p className="mt-0.5 font-mono text-label uppercase tracking-label text-ink-faint">
                Due {check.dueDate}
                {check.observedDate && ` · counted ${check.observedDate}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {check.status === 'observed' && (
                <span className="font-mono text-xs tabular-nums text-ink">
                  {formatNumber(check.surviving)} of {formatNumber(check.planted)} ({Math.round((check.surviving / check.planted) * 100)}%)
                </span>
              )}
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
