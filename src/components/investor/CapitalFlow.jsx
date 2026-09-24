import { useState } from 'react'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { CAPITAL_POSITION, USE_OF_FUNDS, EXPENDITURES } from '../../data/investor'
import { formatCurrencyShort } from '../../lib/investor/format'
import ExpenditureList from './ExpenditureList'

// Each stage's breakdown reads the matching per-category field, so its lines
// always sum to the stage's own headline (budget → Committed, allocated →
// Allocated, ledger-derived deployed/verified → Deployed/Verified). The two
// ledger stages also list the payments behind them: Deployed shows what is
// still awaiting verification (the Deployed → Verified gap), Verified shows
// every verified payment with the evidence for the activity it funded.
const STEPS = [
  { key: 'committed', label: 'Committed', breakdownKey: 'budget' },
  { key: 'allocated', label: 'Allocated', breakdownKey: 'allocated' },
  {
    key: 'deployed',
    label: 'Deployed',
    breakdownKey: 'deployed',
    ledgerTitle: 'Awaiting verification',
    ledgerRows: EXPENDITURES.filter((row) => row.status === 'pending_verification'),
  },
  {
    key: 'verified',
    label: 'Verified',
    breakdownKey: 'verified',
    ledgerTitle: 'Verified payments and their evidence',
    ledgerRows: EXPENDITURES.filter((row) => row.status === 'verified'),
  },
]

/**
 * The capital accountability chain (build brief §10/§23) — committed
 * capital narrows step by step to the portion that's actually deployed with
 * verified evidence behind it. Every stage is clickable: it expands to the
 * categories that figure is made of, and the Deployed/Verified stages down
 * to the individual payments and their evidence.
 */
export default function CapitalFlow() {
  const [expanded, setExpanded] = useState(null)

  return (
    <ol className="flex flex-col items-center gap-1">
      {STEPS.map((step, index) => {
        const isOpen = expanded === step.key
        return (
          <li key={step.key} className="flex w-full max-w-xl flex-col items-center">
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : step.key)}
              aria-expanded={isOpen}
              className={`w-full max-w-sm cursor-pointer rounded-xl border px-5 py-4 text-center shadow-card transition-all duration-200 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
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
                  By category
                </p>
                <ul className="mt-2 space-y-1.5">
                  {USE_OF_FUNDS.map((category) => (
                    <li key={category.id} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="text-ink-muted">{category.category}</span>
                      <span className="font-mono font-semibold tabular-nums text-ink">
                        {formatCurrencyShort(category[step.breakdownKey], CAPITAL_POSITION.currency)}
                      </span>
                    </li>
                  ))}
                </ul>

                {step.ledgerRows && (
                  <div className="mt-4 border-t border-line pt-4">
                    <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      {step.ledgerTitle}
                    </p>
                    <div className="max-h-96 overflow-y-auto pr-1">
                      <ExpenditureList rows={step.ledgerRows} showCategory />
                    </div>
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
