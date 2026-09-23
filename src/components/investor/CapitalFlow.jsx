import { useState } from 'react'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { CAPITAL_POSITION, USE_OF_FUNDS } from '../../data/investor'
import { formatCurrencyShort } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ActionButton from './ui/ActionButton'

// Each stage expands to the real category breakdown behind that figure
// (from Use of Funds) rather than a fabricated "expenditure record" screen —
// the data this prototype actually has. `verified` also opens the one real
// evidence record that backs it: the independent verification partner's
// sign-off.
const STEPS = [
  { key: 'committed', label: 'Committed', breakdownKey: 'budget' },
  { key: 'allocated', label: 'Allocated', breakdownKey: 'committed' },
  { key: 'deployed', label: 'Deployed', breakdownKey: 'deployed' },
  { key: 'verified', label: 'Verified', breakdownKey: 'deployed', evidenceId: 'ev-009' },
]

/**
 * The capital accountability chain (build brief §10/§23) — committed
 * capital narrows step by step to the portion that's actually deployed with
 * verified evidence behind it. Every stage is clickable: it expands to show
 * which categories that figure is made of, and `Verified` also opens its
 * backing evidence record.
 */
export default function CapitalFlow() {
  const [expanded, setExpanded] = useState(null)
  const { openEvidence } = useEvidenceDrawer()

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
              <div className="w-full rounded-xl border border-line bg-canvas-sunk p-4">
                <ul className="space-y-1.5">
                  {USE_OF_FUNDS.map((category) => (
                    <li key={category.category} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="text-ink-muted">{category.category}</span>
                      <span className="font-mono font-semibold tabular-nums text-ink">
                        {formatCurrencyShort(category[step.breakdownKey], CAPITAL_POSITION.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
                {step.evidenceId && (
                  <ActionButton variant="text" onClick={() => openEvidence(step.evidenceId)} className="mt-3">
                    View verification evidence
                  </ActionButton>
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
