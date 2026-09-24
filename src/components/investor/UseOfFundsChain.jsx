import { CORE_OUTCOMES } from '../../data/investor'
import { getComponent } from '../../data/funder/programme'
import { formatMillions, formatNumber } from '../../lib/investor/format'
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
 * One use-of-funds category's results chain, read from the data layer:
 * what it paid for (a pointer that filters the page's single expenditure
 * ledger via `onShowPayments`, never a second payment list) → what that
 * produced → the outcomes it contributes to.
 *
 * @param {{
 *   category: ReturnType<typeof import('../../lib/programme/funding').agreementUseOfFunds>[number],
 *   currency: string,
 *   onShowPayments: (filter: import('../../lib/investor/capitalLedger').LedgerFilter) => void,
 * }} props
 */
export default function UseOfFundsChain({ category, currency, onShowPayments }) {
  const { openEvidence } = useEvidenceDrawer()
  const outcomes = category.outcomeIds.map((id) => OUTCOMES_BY_ID[id]).filter(Boolean)
  const paymentCount = category.expenditures.length

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <ChainStep label="Paid for">
        <p className="text-xs text-ink-muted">
          {paymentCount} payment{paymentCount === 1 ? '' : 's'} · {formatMillions(category.verified, currency)} of{' '}
          {formatMillions(category.deployed, currency)} verified{' '}
          <ActionButton variant="text" onClick={() => onShowPayments({ status: 'all', categoryId: category.id })}>
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
            {getComponent(category.componentId)?.title ?? 'programme management'}), not a single outcome figure.
          </p>
        )}
      </ChainStep>
    </div>
  )
}
