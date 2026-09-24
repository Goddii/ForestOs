import { useState } from 'react'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { formatCurrencyShort } from '../../lib/investor/format'
import { sumAmounts } from '../../lib/investor/capitalLedger'
import { useWorkspace } from './FunderWorkspaceContext'
import ActionButton from './ui/ActionButton'

// Each stage's breakdown reads the matching per-allocation field, so its
// lines always sum to the stage's own headline (budget → Committed,
// allocated → Allocated, ledger-derived deployed/verified → Spent / Spent on
// verified work). "Received" is money that has actually arrived, by tranche.
// The two ledger stages point at the payments behind them by filtering the
// page's single expenditure ledger; they never render a payment list.
function buildSteps(expenditures) {
  return [
    { key: 'committed', label: 'Committed', breakdownKey: 'budget' },
    { key: 'received', label: 'Received', breakdown: 'tranches' },
    { key: 'allocated', label: 'Allocated', breakdownKey: 'allocated' },
    {
      key: 'deployed',
      label: 'Spent',
      breakdownKey: 'deployed',
      ledgerFilter: { status: 'all', categoryId: 'all' },
      ledgerCount: expenditures.length,
    },
    {
      key: 'verified',
      label: 'Spent on verified work',
      breakdownKey: 'verified',
      ledgerFilter: { status: 'verified', categoryId: 'all' },
      ledgerCount: expenditures.filter((row) => row.status === 'verified').length,
    },
  ]
}

/**
 * The capital accountability chain (build brief §10/§23) — committed
 * capital narrows step by step to the portion that's actually deployed with
 * verified evidence behind it. Every stage is clickable: it expands to the
 * categories that figure is made of, and the Deployed/Verified stages link
 * to their payments in the expenditure ledger via `onShowPayments`.
 *
 * @param {{ onShowPayments: (filter: import('../../lib/investor/capitalLedger').LedgerFilter) => void }} props
 */
export default function CapitalFlow({ onShowPayments }) {
  const [expanded, setExpanded] = useState(null)
  const { capital } = useWorkspace()
  const { position: CAPITAL_POSITION, useOfFunds: USE_OF_FUNDS, expenditures, tranches } = capital
  const STEPS = buildSteps(expenditures)
  const PENDING_ROWS = expenditures.filter((row) => row.status === 'pending_verification')

  return (
    <ol className="flex flex-col items-center gap-1">
      {STEPS.map((step, index) => {
        const isOpen = expanded === step.key
        return (
          <li key={step.key} className="flex w-full max-w-sm flex-col items-center">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : step.key)}
              aria-expanded={isOpen}
              className={`w-full cursor-pointer rounded-xl border px-5 py-4 text-center shadow-card transition-all duration-200 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                isOpen
                  ? 'border-forest-accent/50 bg-canvas-sunk'
                  : 'border-line bg-card hover:border-emerald-500/40'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  {step.label}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-ink-faint transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1 block font-sans text-2xl font-bold tabular-nums text-ink">
                {formatCurrencyShort(CAPITAL_POSITION[step.key], CAPITAL_POSITION.currency)}
              </span>
            </button>

            {isOpen && (
              <div className="mt-1 w-full rounded-xl border border-line bg-canvas-sunk p-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  {step.breakdown === 'tranches' ? 'By tranche' : 'By allocation'}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {step.breakdown === 'tranches'
                    ? tranches.map((tranche) => (
                        <li key={tranche.id} className="flex items-center justify-between gap-3 text-[12px]">
                          <span className="text-ink-muted">{tranche.milestone}</span>
                          <span className="font-mono font-semibold tabular-nums text-ink">
                            {tranche.receivedKes
                              ? formatCurrencyShort(tranche.receivedKes, CAPITAL_POSITION.currency)
                              : 'Not yet received'}
                          </span>
                        </li>
                      ))
                    : USE_OF_FUNDS.map((category) => (
                        <li key={category.id} className="flex items-center justify-between gap-3 text-[12px]">
                          <span className="text-ink-muted">{category.category}</span>
                          <span className="font-mono font-semibold tabular-nums text-ink">
                            {formatCurrencyShort(category[step.breakdownKey], CAPITAL_POSITION.currency)}
                          </span>
                        </li>
                      ))}
                </ul>

                {step.ledgerFilter && (
                  <div className="mt-4 space-y-2 border-t border-line pt-4">
                    {step.key === 'deployed' && PENDING_ROWS.length > 0 && (
                      <p className="text-[12px] text-ink-muted">
                        {formatCurrencyShort(sumAmounts(PENDING_ROWS), CAPITAL_POSITION.currency)} across{' '}
                        {PENDING_ROWS.length} payments is awaiting verification.{' '}
                        <ActionButton
                          variant="text"
                          onClick={() => onShowPayments({ status: 'pending_verification', categoryId: 'all' })}
                        >
                          Show them
                        </ActionButton>
                      </p>
                    )}
                    <ActionButton variant="ghost" onClick={() => onShowPayments(step.ledgerFilter)}>
                      Show {step.ledgerCount} payments in the ledger
                    </ActionButton>
                  </div>
                )}
              </div>
            )}

            {index < STEPS.length - 1 && (
              <ArrowDown className="my-1.5 h-4 w-4 text-ink-faint" strokeWidth={1.75} aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
