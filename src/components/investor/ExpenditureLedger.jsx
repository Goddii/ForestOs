import { useWorkspace } from './FunderWorkspaceContext'
import { ALL_PAYMENTS, LEDGER_ID, sumAmounts } from '../../lib/investor/capitalLedger'
import { formatCurrencyShort } from '../../lib/investor/format'
import ExpenditureList from './ExpenditureList'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'pending_verification', label: 'Awaiting verification' },
]

/**
 * The expenditure ledger — the one place payments are listed. The capital
 * flow stages and use-of-funds categories don't render payment lists of
 * their own; they set this ledger's filter (via the parent page) and scroll
 * here, so the same rows never appear twice on a page.
 *
 * @param {{
 *   filter: import('../../lib/investor/capitalLedger').LedgerFilter,
 *   onFilterChange: (filter: import('../../lib/investor/capitalLedger').LedgerFilter) => void,
 * }} props
 */
export default function ExpenditureLedger({ filter, onFilterChange }) {
  const { capital } = useWorkspace()
  const { useOfFunds: USE_OF_FUNDS, position: CAPITAL_POSITION } = capital
  const rows = capital.expenditures.toSorted((a, b) => b.date.localeCompare(a.date)).filter(
    (row) =>
      (filter.status === 'all' || row.status === filter.status) &&
      (filter.categoryId === 'all' || row.categoryId === filter.categoryId),
  )
  const isFiltered = filter.status !== 'all' || filter.categoryId !== 'all'

  return (
    <div id={LEDGER_ID} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
        <div role="group" aria-label="Verification status" className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter.status === option.value}
              onClick={() => onFilterChange({ ...filter, status: option.value })}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                filter.status === option.value
                  ? 'border-forest-accent bg-forest-accent-soft text-forest-accent-dark'
                  : 'border-line text-ink-muted hover:border-forest-accent/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
          Allocation
          <select
            value={filter.categoryId}
            onChange={(event) => onFilterChange({ ...filter, categoryId: event.target.value })}
            className="rounded-md border border-line bg-card px-2 py-1 font-sans text-[12px] normal-case tracking-normal text-ink"
          >
            <option value="all">All allocations</option>
            {USE_OF_FUNDS.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category}
              </option>
            ))}
          </select>
        </label>

        {isFiltered && (
          <button
            type="button"
            onClick={() => onFilterChange(ALL_PAYMENTS)}
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-accent hover:text-forest-accent-dark"
          >
            Clear filters
          </button>
        )}

        <p className="ml-auto font-mono text-[11px] tabular-nums text-ink-muted" aria-live="polite">
          {rows.length} payment{rows.length === 1 ? '' : 's'} ·{' '}
          {formatCurrencyShort(sumAmounts(rows), CAPITAL_POSITION.currency)}
        </p>
      </div>

      <div className="pt-4">
        <ExpenditureList rows={rows} showCategory emptyMessage="No payments match these filters." />
      </div>
    </div>
  )
}
