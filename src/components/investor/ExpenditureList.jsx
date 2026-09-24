import { USE_OF_FUNDS, CAPITAL_POSITION, getEvidenceById } from '../../data/investor'
import { formatCurrencyShort } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ConfidenceIndicator from './ConfidenceIndicator'
import ActionButton from './ui/ActionButton'

const CATEGORY_LABELS = Object.fromEntries(USE_OF_FUNDS.map((c) => [c.id, c.category]))

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

  if (rows.length === 0) {
    return <p className="text-[12px] text-ink-muted">{emptyMessage}</p>
  }

  return (
    <ul className="divide-y divide-line">
      {rows.map((row) => {
        const evidence = row.evidenceIds.map(getEvidenceById).filter(Boolean)
        return (
          <li key={row.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="min-w-0 text-[13px] font-medium text-ink">{row.description}</p>
              <p className="shrink-0 font-mono text-[12px] font-semibold tabular-nums text-ink">
                {formatCurrencyShort(row.amount, CAPITAL_POSITION.currency)}
              </p>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {row.date}
                {showCategory && ` · ${CATEGORY_LABELS[row.categoryId]}`}
              </span>
              <ConfidenceIndicator status={row.status} />
            </div>
            {evidence.length > 0 ? (
              <ul className="mt-1.5 space-y-0.5">
                {evidence.map((record) => (
                  <li key={record.id} className="flex flex-wrap items-center gap-x-2 text-[12px] text-ink-muted">
                    <ActionButton variant="text" onClick={() => openEvidence(record.id)}>
                      {record.title}
                    </ActionButton>
                    <span className="text-ink-faint">— {record.location}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-[12px] text-ink-faint">No supporting evidence submitted yet.</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
