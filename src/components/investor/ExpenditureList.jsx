import { Fragment, useState } from 'react'
import { CheckCircle2, ChevronDown, CircleDashed, Clock, RotateCcw, XCircle } from 'lucide-react'
import { getEvidenceById } from '../../data/investor'
import { useWorkspace } from './FunderWorkspaceContext'
import { formatMillions } from '../../lib/investor/format'
import { paymentStatus } from '../../lib/investor/paymentStatus'
import { currentState } from '../../lib/programme/verificationState'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ActionButton from './ui/ActionButton'
import Badge from './ui/Badge'

// One status per payment (see paymentStatus) — icon + label + fill, never colour alone.
const STATUS = {
  verified: { label: 'Verified', tone: 'verified', icon: CheckCircle2 },
  under_review: { label: 'Under review', tone: 'warning', icon: Clock },
  correction_required: { label: 'Correction required', tone: 'danger', icon: RotateCcw },
  rejected: { label: 'Rejected', tone: 'danger', icon: XCircle },
  awaiting_verification: { label: 'Awaiting verification', tone: 'warning', icon: Clock },
  awaiting_evidence: { label: 'Awaiting evidence', tone: 'neutral', icon: CircleDashed },
}
const HEAD_CELL = 'px-4 py-2.5 font-mono text-label font-medium uppercase tracking-label text-ink-faint sm:px-5'
const CELL = 'px-4 py-3.5 align-top sm:px-5'

/** What the payment paid for and the evidence behind it, shown when its row is opened. */
function PaymentDetail({ paidFor, evidence }) {
  const { openEvidence } = useEvidenceDrawer()
  return (
    <dl className="grid gap-x-6 gap-y-2 text-compact sm:grid-cols-[6rem_1fr]">
      {paidFor.length > 0 && (
        <>
          <dt className="pt-0.5 font-mono text-label uppercase tracking-label text-ink-faint">Paid for</dt>
          <dd className="space-y-1 text-ink-muted">
            {paidFor.map((activity) => (
              <p key={activity.id}>{activity.summary}</p>
            ))}
          </dd>
        </>
      )}
      <dt className="pt-0.5 font-mono text-label uppercase tracking-label text-ink-faint">Evidence</dt>
      <dd className="space-y-1 text-ink-muted">
        {evidence.length === 0 && <p>No supporting evidence submitted yet.</p>}
        {evidence.map((record) => (
          <p key={record.id} className="flex flex-wrap items-center gap-x-2">
            <ActionButton variant="text" onClick={() => openEvidence(record.id)}>
              {record.title}
            </ActionButton>
            <span className="text-ink-faint">{record.location}</span>
          </p>
        ))}
      </dd>
    </dl>
  )
}

/**
 * The expenditure ledger's rows as a table — date, payment, one status,
 * evidence count and amount — where every capital drill-down renders a
 * disbursement, so Capital → Activity → Evidence reads the same from the
 * accountability chain, use of funds and the full ledger. Opening a row
 * shows what it paid for and its evidence records (each opens the evidence
 * drawer). On narrow screens the date and evidence count fold under the
 * payment name.
 *
 * @param {{
 *   rows: import('../../data/investor/types').Expenditure[],
 *   showCategory?: boolean,
 *   emptyMessage?: string,
 * }} props
 */
export default function ExpenditureList({ rows, showCategory = false, emptyMessage = 'No expenditure recorded yet.' }) {
  const [expanded, setExpanded] = useState(null)
  const { capital, activities } = useWorkspace()
  const categoryLabels = Object.fromEntries(capital.useOfFunds.map((c) => [c.id, c.category]))
  const activitiesById = new Map(activities.map((activity) => [activity.id, activity]))
  const stateOf = (id) => {
    const activity = activitiesById.get(id)
    return activity ? currentState(activity.verification) : undefined
  }

  if (rows.length === 0) {
    return <p className="px-4 py-6 text-xs text-ink-muted sm:px-5">{emptyMessage}</p>
  }

  return (
    <table className="w-full text-left text-sm text-ink">
      <caption className="sr-only">Payments, newest first</caption>
      <thead className="border-b border-line">
        <tr>
          <th scope="col" className={`${HEAD_CELL} hidden w-px sm:table-cell`}>Date</th>
          <th scope="col" className={HEAD_CELL}>Payment</th>
          <th scope="col" className={`${HEAD_CELL} hidden md:table-cell`}>Status</th>
          <th scope="col" className={`${HEAD_CELL} hidden sm:table-cell`}>Evidence</th>
          <th scope="col" className={`${HEAD_CELL} text-right`}>Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {rows.map((row) => {
          const isOpen = expanded === row.id
          const evidence = row.evidenceIds.map(getEvidenceById).filter(Boolean)
          const paidFor = (row.activityIds ?? []).map((id) => activitiesById.get(id)).filter(Boolean)
          const status = STATUS[paymentStatus(row, stateOf)]
          const evidenceLabel = evidence.length === 0 ? 'None yet' : `${evidence.length} record${evidence.length === 1 ? '' : 's'}`
          const badge = <Badge tone={status.tone} icon={status.icon}>{status.label}</Badge>
          return (
            <Fragment key={row.id}>
              <tr className={isOpen ? 'bg-canvas' : 'transition-colors duration-200 hover:bg-canvas'}>
                <td className={`${CELL} hidden whitespace-nowrap font-mono text-xs text-ink-faint sm:table-cell`}>{row.date}</td>
                <th scope="row" className={`${CELL} text-left font-normal`}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : row.id)}
                    aria-expanded={isOpen}
                    className="flex cursor-pointer items-start gap-1.5 text-left font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent/50"
                  >
                    {row.description}
                    <ChevronDown
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    <span className="font-mono sm:hidden">{row.date} · </span>
                    {showCategory && categoryLabels[row.categoryId]}
                  </span>
                  <span className="mt-2 block md:hidden">{badge}</span>
                </th>
                <td className={`${CELL} hidden md:table-cell`}>{badge}</td>
                <td className={`${CELL} hidden whitespace-nowrap sm:table-cell ${evidence.length === 0 ? 'text-ink-faint' : 'font-semibold text-forest-accent'}`}>
                  {evidenceLabel}
                </td>
                <td className={`${CELL} whitespace-nowrap text-right font-bold tabular-nums text-ink`}>
                  {formatMillions(row.amount, capital.position.currency)}
                </td>
              </tr>
              {isOpen && (
                <tr className="bg-canvas">
                  <td className="hidden sm:table-cell" />
                  <td colSpan={4} className="px-4 pb-4 pt-0 sm:px-5">
                    <PaymentDetail paidFor={paidFor} evidence={evidence} />
                  </td>
                </tr>
              )}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
