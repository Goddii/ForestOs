import { useWorkspace } from './FunderWorkspaceContext'
import { ALL_PAYMENTS, LEDGER_ID, sumAmounts } from '../../lib/investor/capitalLedger'
import { formatMillions } from '../../lib/investor/format'
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
  const inCategory = capital.expenditures
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .filter((row) => filter.categoryId === 'all' || row.categoryId === filter.categoryId)
  const matchesStatus = (status) => (row) => status === 'all' || row.status === status
  const rows = inCategory.filter(matchesStatus(filter.status))
  const isFiltered = filter.status !== 'all' || filter.categoryId !== 'all'

  return (
    <div id={LEDGER_ID} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div role="group" aria-label="Verification status" className="inline-flex gap-0.5 rounded-lg border border-line bg-canvas p-0.5">
          {STATUS_OPTIONS.map((option) => {
            const isOn = filter.status === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isOn}
                onClick={() => onFilterChange({ ...filter, status: option.value })}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent/50 ${
                  isOn ? 'bg-card text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {option.label}
                <span className="ml-1.5 tabular-nums text-ink-faint">{inCategory.filter(matchesStatus(option.value)).length}</span>
              </button>
            )
          })}
        </div>

        <label className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="sr-only">Category</span>
          <select
            value={filter.categoryId}
            onChange={(event) => onFilterChange({ ...filter, categoryId: event.target.value })}
            className="rounded-lg border border-line bg-card px-2.5 py-1.5 font-sans text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent/50"
          >
            <option value="all">All categories</option>
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
            className="cursor-pointer text-xs font-semibold text-forest-accent hover:text-forest-accent-dark"
          >
            Clear filters
          </button>
        )}

        <p className="ml-auto text-xs tabular-nums text-ink-muted" aria-live="polite">
          {rows.length} payment{rows.length === 1 ? '' : 's'} ·{' '}
          <span className="font-semibold text-ink">{formatMillions(sumAmounts(rows), CAPITAL_POSITION.currency)}</span>
        </p>
      </div>

      <ExpenditureList rows={rows} showCategory emptyMessage="No payments match these filters." />
    </div>
  )
}
