import { getEvidenceById } from '../../data/investor'
import { getSegment } from '../../data/funder/geography'
import { getOrganisation } from '../../data/funder/organisations'
import { currentState, latestDecision, INDEPENDENCE_LABELS } from '../../lib/programme/verificationState'
import { formatNumber } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import { useWorkspace } from './FunderWorkspaceContext'
import VerificationStateBadge from './VerificationStateBadge'
import ActionButton from './ui/ActionButton'
import Badge from './ui/Badge'

function Beneficiaries({ beneficiaries }) {
  if (!beneficiaries) return null
  if (beneficiaries.suppressed) return <span>Fewer than 10 households</span>
  return (
    <span>
      {formatNumber(beneficiaries.households)} households, {formatNumber(beneficiaries.womenHeaded)} women-headed
    </span>
  )
}

/**
 * Activity records as a funder sees them (already disclosure-projected):
 * what was done, where, the quantity it contributes, its verification state
 * and who decided it, how independently, and the evidence behind it.
 * `rows` may carry a per-indicator `value` to show next to the activity.
 *
 * @param {{ rows: Array<{ activity: Object, value?: number, unit?: string }>, emptyMessage?: string }} props
 */
export default function ActivityList({ rows, emptyMessage = 'No activities recorded.' }) {
  const { openEvidence } = useEvidenceDrawer()
  const { allocationIds } = useWorkspace()

  if (rows.length === 0) return <p className="text-compact text-ink-muted">{emptyMessage}</p>

  return (
    <ul className="divide-y divide-line">
      {rows.map(({ activity, value, unit }) => {
        const state = currentState(activity.verification)
        const decision = latestDecision(activity.verification)
        const evidence = activity.evidenceIds.map(getEvidenceById).filter(Boolean)
        const segment = getSegment(activity.segmentId)
        return (
          <li key={activity.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{activity.summary}</p>
                <p className="mt-0.5 font-mono text-label uppercase tracking-label text-ink-faint">
                  {activity.date} · {segment?.label ?? activity.segmentId}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {value !== undefined && (
                  <span className={`font-mono text-xs font-semibold tabular-nums ${state === 'rejected' ? 'text-ink-faint line-through' : 'text-ink'}`}>
                    {formatNumber(value)} {unit}
                  </span>
                )}
                {allocationIds.has(activity.allocationId) ? (
                  <Badge tone="verified">Funded by you</Badge>
                ) : (
                  <Badge tone="neutral">Other funder</Badge>
                )}
                <VerificationStateBadge state={state} />
              </div>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {decision ? (
                <>
                  {decision.state === 'verified' ? 'Verified' : decision.state === 'rejected' ? 'Rejected' : 'Returned'} {decision.at} by{' '}
                  {decision.byRole}, {getOrganisation(decision.byOrgId)?.name ?? decision.byOrgId} ·{' '}
                  {INDEPENDENCE_LABELS[decision.independence]}
                </>
              ) : (
                `Submitted ${activity.verification[0]?.at ?? ''}, no reviewer decision yet`
              )}
              {activity.beneficiaries && (
                <>
                  {' · '}
                  <Beneficiaries beneficiaries={activity.beneficiaries} />
                </>
              )}
            </p>

            {evidence.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {evidence.map((record) => (
                  <ActionButton key={record.id} variant="text" onClick={() => openEvidence(record.id)}>
                    {record.title}
                  </ActionButton>
                ))}
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-ink-faint">No evidence submitted yet.</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
