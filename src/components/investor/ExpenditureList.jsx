import { getEvidenceById } from '../../data/investor'
import { useWorkspace } from './FunderWorkspaceContext'
import { formatCurrencyShort } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ConfidenceIndicator from './ConfidenceIndicator'
import ActionButton from './ui/ActionButton'
import VerificationStateBadge from './VerificationStateBadge'
import { currentState } from '../../lib/programme/verificationState'

/**
 * Rows from the expenditure ledger — what each payment funded, when, how
 * much, whether it's verified, and a one-click path to the evidence (and
 * therefore the location) of the activity it paid for. The one place every
 * capital drill-down renders a disbursement, so Capital → Activity →
 * Evidence reads the same in the accountability chain, use of funds and
 * the full ledger.
 *
 * @param {{
 *   rows: import('../../data/investor/types').Expenditure[],
 *   showCategory?: boolean,
 *   emptyMessage?: string,
 * }} props
 */
export default function ExpenditureList({ rows, showCategory = false, emptyMessage = 'No expenditure recorded yet.' }) {
  const { openEvidence } = useEvidenceDrawer()
  const { capital, activities } = useWorkspace()
  const CAPITAL_POSITION = capital.position
  const CATEGORY_LABELS = Object.fromEntries(capital.useOfFunds.map((c) => [c.id, c.category]))
  const activitiesById = new Map(activities.map((activity) => [activity.id, activity]))

  if (rows.length === 0) {
    return <p className="text-xs text-ink-muted">{emptyMessage}</p>
  }

  return (
    <ul className="divide-y divide-line">
      {rows.map((row) => {
        const evidence = row.evidenceIds.map(getEvidenceById).filter(Boolean)
        const paidFor = (row.activityIds ?? []).map((id) => activitiesById.get(id)).filter(Boolean)
        return (
          <li key={row.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="min-w-0 text-compact font-medium text-ink">{row.description}</p>
              <p className="shrink-0 font-mono text-xs font-semibold tabular-nums text-ink">
                {formatCurrencyShort(row.amount, CAPITAL_POSITION.currency)}
              </p>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-mono text-label uppercase tracking-label text-ink-faint">
                {row.date}
                {showCategory && ` · ${CATEGORY_LABELS[row.categoryId]}`}
              </span>
              <ConfidenceIndicator status={row.status} />
            </div>
            {paidFor.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {paidFor.map((activity) => (
                  <li key={activity.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
                    <span className="text-ink-faint">Paid for</span>
                    <span className="text-ink">{activity.summary}</span>
                    <VerificationStateBadge state={currentState(activity.verification)} />
                  </li>
                ))}
              </ul>
            )}
            {evidence.length > 0 ? (
              <ul className="mt-1.5 space-y-0.5">
                {evidence.map((record) => (
                  <li key={record.id} className="flex flex-wrap items-center gap-x-2 text-xs text-ink-muted">
                    <ActionButton variant="text" onClick={() => openEvidence(record.id)}>
                      {record.title}
                    </ActionButton>
                    <span className="text-ink-faint">— {record.location}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-ink-faint">No supporting evidence submitted yet.</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
