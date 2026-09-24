import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { USE_OF_FUNDS, CAPITAL_POSITION, CORE_OUTCOMES } from '../../data/investor'
import { formatCurrencyShort, formatNumber } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ExpenditureList from './ExpenditureList'
import ActionButton from './ui/ActionButton'

const OUTCOMES_BY_ID = Object.fromEntries(CORE_OUTCOMES.map((outcome) => [outcome.id, outcome]))

function ChainStep({ label, children }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      {children}
    </div>
  )
}

/**
 * Investor-grade Use of Funds (build brief §13/§15). Each category is its
 * own single-hue progress bar (deployed fill vs. remaining track) —
 * deliberately not a stacked multi-color chart, so it never needs a
 * categorical palette the design system wasn't built for. Clicking a
 * category opens its results chain, all read from the data layer: the
 * payments it made (and the evidence/location of each funded activity) →
 * what they produced → the outcomes they contribute to. Meant to sit inside
 * a `ContentCard`, so it carries no outer border of its own.
 */
export default function UseOfFundsBars() {
  const [expanded, setExpanded] = useState(null)
  const { openEvidence } = useEvidenceDrawer()

  return (
    <ul className="divide-y divide-line">
      {USE_OF_FUNDS.map((category) => {
        const deployedPct = Math.round((category.deployed / category.budget) * 100)
        const isOpen = expanded === category.id
        const outcomes = category.outcomeIds.map((id) => OUTCOMES_BY_ID[id]).filter(Boolean)

        return (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : category.id)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 text-left transition-colors duration-200 ease-in-out hover:bg-canvas-sunk"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                  {category.category}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-ink-faint transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </span>
                <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-ink">
                  {formatCurrencyShort(category.budget, CAPITAL_POSITION.currency)}
                  <span className="ml-1 font-normal text-ink-faint">{category.percentage}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
                <div className="h-full rounded-full bg-forest-accent" style={{ width: `${deployedPct}%` }} />
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {formatCurrencyShort(category.deployed, CAPITAL_POSITION.currency)} deployed ·{' '}
                {formatCurrencyShort(category.verified, CAPITAL_POSITION.currency)} verified ·{' '}
                {formatCurrencyShort(category.remaining, CAPITAL_POSITION.currency)} remaining
              </p>
            </button>

            {isOpen && (
              <div className="mx-5 mb-4 space-y-5 rounded-lg border border-line bg-canvas-sunk p-4">
                <ChainStep label="Paid for">
                  <ExpenditureList rows={category.expenditures} />
                </ChainStep>

                <ChainStep label="Produced">
                  <ul className="list-disc space-y-1 pl-4 text-[12px] text-ink-muted">
                    {category.outputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </ChainStep>

                <ChainStep label="Contributes to">
                  {outcomes.length > 0 ? (
                    <ul className="space-y-1">
                      {outcomes.map((outcome) => (
                        <li key={outcome.id} className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                          <span className="text-ink-muted">
                            <span className="font-semibold tabular-nums text-ink">
                              {formatNumber(outcome.value)}
                              {outcome.unit && ` ${outcome.unit}`}
                            </span>{' '}
                            {outcome.label.toLowerCase()}
                          </span>
                          <ActionButton variant="text" onClick={() => openEvidence(outcome.evidenceId)}>
                            Evidence
                          </ActionButton>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12px] text-ink-muted">
                      Coordination and administrative costs — enables every outcome, not tied to one.
                    </p>
                  )}
                </ChainStep>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
