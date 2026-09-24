import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CORE_OUTCOMES } from '../../data/investor'
import { getComponent } from '../../data/funder/programme'
import { useWorkspace } from './FunderWorkspaceContext'
import { formatCurrencyShort, formatNumber } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ActionButton from './ui/ActionButton'

const OUTCOMES_BY_ID = Object.fromEntries(CORE_OUTCOMES.map((outcome) => [outcome.id, outcome]))

function ChainStep({ label, children }) {
  return (
    <div>
      <p className="mb-2 font-mono text-label font-semibold uppercase tracking-label text-ink-faint">{label}</p>
      {children}
    </div>
  )
}

/**
 * Investor-grade Use of Funds (build brief §13/§15). Each category is its
 * own single-hue progress bar (deployed fill vs. remaining track) —
 * deliberately not a stacked multi-color chart, so it never needs a
 * categorical palette the design system wasn't built for. Clicking a
 * category opens its results chain, all read from the data layer: what it
 * paid for (a pointer that filters the page's single expenditure ledger via
 * `onShowPayments`, never a second payment list) → what that produced → the
 * outcomes it contributes to. Meant to sit inside a `ContentCard`, so it
 * carries no outer border of its own.
 *
 * @param {{ onShowPayments: (filter: import('../../lib/investor/capitalLedger').LedgerFilter) => void }} props
 */
export default function UseOfFundsBars({ onShowPayments }) {
  const [expanded, setExpanded] = useState(null)
  const { openEvidence } = useEvidenceDrawer()
  const { capital } = useWorkspace()
  const { useOfFunds: USE_OF_FUNDS, position: CAPITAL_POSITION } = capital

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
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {category.category}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-ink-faint transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </span>
                <span className="shrink-0 font-mono text-label font-semibold tabular-nums text-ink">
                  {formatCurrencyShort(category.budget, CAPITAL_POSITION.currency)}
                  <span className="ml-1 font-normal text-ink-faint">{category.percentage}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
                <div className="h-full rounded-full bg-forest-accent" style={{ width: `${deployedPct}%` }} />
              </div>
              <p className="mt-1 font-mono text-label uppercase tracking-label text-ink-faint">
                {formatCurrencyShort(category.deployed, CAPITAL_POSITION.currency)} deployed ·{' '}
                {formatCurrencyShort(category.verified, CAPITAL_POSITION.currency)} verified ·{' '}
                {formatCurrencyShort(category.remaining, CAPITAL_POSITION.currency)} remaining
              </p>
            </button>

            {isOpen && (
              <div className="mx-5 mb-4 space-y-5 rounded-lg border border-line bg-canvas-sunk p-4">
                <ChainStep label="Paid for">
                  <p className="text-xs text-ink-muted">
                    {category.expenditures.length} payment{category.expenditures.length === 1 ? '' : 's'} ·{' '}
                    {formatCurrencyShort(category.verified, CAPITAL_POSITION.currency)} of{' '}
                    {formatCurrencyShort(category.deployed, CAPITAL_POSITION.currency)} verified{' '}
                    <ActionButton
                      variant="text"
                      onClick={() => onShowPayments({ status: 'all', categoryId: category.id })}
                    >
                      Show in the ledger
                    </ActionButton>
                  </p>
                </ChainStep>

                <ChainStep label="Produced">
                  <ul className="list-disc space-y-1 pl-4 text-xs text-ink-muted">
                    {category.outputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </ChainStep>

                <ChainStep label="Contributes to">
                  {outcomes.length > 0 ? (
                    <ul className="space-y-1">
                      {outcomes.map((outcome) => (
                        <li key={outcome.id} className="flex flex-wrap items-center justify-between gap-2 text-xs">
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
                    <p className="text-xs text-ink-muted">
                      Measured through the programme's output indicators (
                      {getComponent(category.componentId)?.title ?? 'programme management'}), not a
                      single outcome figure.
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
