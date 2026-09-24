import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { formatMillions } from '../../lib/investor/format'
import { sumAmounts } from '../../lib/investor/capitalLedger'
import { shareOf, trancheSegments } from '../../lib/investor/chartScale'
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
    { key: 'allocated', label: 'Allocated to work', breakdownKey: 'allocated' },
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
 * The capital accountability chain (build brief §10/§23), drawn to scale:
 * every stage is a bar measured against the full commitment, so the reader
 * sees proportions, not five equal boxes. The Received bar also outlines the
 * planned tranches still to come. Every stage expands to the categories that
 * figure is made of, and the Spent stages link to their payments in the
 * expenditure ledger via `onShowPayments`.
 *
 * @param {{ onShowPayments: (filter: import('../../lib/investor/capitalLedger').LedgerFilter) => void }} props
 */
export default function CapitalFlow({ onShowPayments }) {
  const [expanded, setExpanded] = useState(null)
  const { capital } = useWorkspace()
  const { position, expenditures } = capital
  const steps = buildSteps(expenditures)

  return (
    <ol className="divide-y divide-line rounded-xl border border-line bg-card">
      {steps.map((step) => {
        const isOpen = expanded === step.key
        return (
          <li key={step.key}>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : step.key)}
              aria-expanded={isOpen}
              className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-5 py-4 text-left transition-colors duration-200 ease-out hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-accent/50 sm:grid-cols-[12rem_1fr_9rem]"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                {step.label}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-ink-faint transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              <span className="col-span-2 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                <StageBar step={step} position={position} tranches={capital.tranches} />
              </span>
              <span className="col-start-2 row-start-1 text-right sm:col-start-3">
                <span className="block font-sans text-lg font-bold tabular-nums text-ink">
                  {formatMillions(position[step.key], position.currency)}
                </span>
                <span className="block text-xs tabular-nums text-ink-faint">
                  {Math.round(shareOf(position[step.key], position.committed) * 100)}% of committed
                </span>
              </span>
            </button>

            {isOpen && (
              <StageBreakdown step={step} capital={capital} onShowPayments={onShowPayments} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// Committed is the reference total, so it reads as a neutral frame; the
// verified stage, the chain's end point, is the one darker emphasis.
const BAR_TONE = {
  committed: 'bg-line-strong',
  verified: 'bg-forest-accent-dark',
}

/**
 * One stage's bar on a track that represents the full commitment. The
 * Received stage outlines each planned tranche so money still to come is
 * visible next to money that has arrived.
 */
function StageBar({ step, position, tranches }) {
  const fill = shareOf(position[step.key], position.committed)
  const segments = trancheSegments(tranches, position.committed)

  return (
    <span className="relative block h-3 overflow-hidden rounded-[4px] bg-canvas-sunk" aria-hidden="true">
      {step.key === 'received' &&
        segments.map((segment) => (
          <span
            key={segment.id}
            className="absolute inset-y-0 rounded-[4px] border border-dashed border-ink-faint/60"
            style={{ left: `${segment.left * 100}%`, width: `calc(${segment.width * 100}% - 2px)` }}
          />
        ))}
      <span
        className={`absolute inset-y-0 left-0 rounded-[4px] ${BAR_TONE[step.key] ?? 'bg-forest-accent'}`}
        style={{ width: `${fill * 100}%` }}
      />
    </span>
  )
}

function StageBreakdown({ step, capital, onShowPayments }) {
  const { position, useOfFunds, expenditures, tranches } = capital
  const pendingRows = expenditures.filter((row) => row.status === 'pending_verification')
  const isTranches = step.breakdown === 'tranches'
  const rows = isTranches
    ? tranches.map((tranche) => ({
        id: tranche.id,
        label: tranche.milestone,
        value: tranche.receivedKes
          ? formatMillions(tranche.receivedKes, position.currency)
          : `${formatMillions(tranche.plannedKes, position.currency)} planned, not yet received`,
      }))
    : useOfFunds.map((category) => ({
        id: category.id,
        label: category.category,
        value: formatMillions(category[step.breakdownKey], position.currency),
      }))

  return (
    <div className="border-t border-line bg-canvas px-5 py-4 sm:pl-[calc(12rem+2.75rem)]">
      <p className="text-xs font-semibold text-ink-muted">{isTranches ? 'By tranche' : 'By allocation'}</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-muted">{row.label}</span>
            <span className="font-mono text-xs font-semibold tabular-nums text-ink">{row.value}</span>
          </li>
        ))}
      </ul>

      {step.ledgerFilter && (
        <div className="mt-4 space-y-2 border-t border-line pt-4">
          {step.key === 'deployed' && pendingRows.length > 0 && (
            <p className="text-sm text-ink-muted">
              {formatMillions(sumAmounts(pendingRows), position.currency)} across {pendingRows.length} payments
              is awaiting verification.{' '}
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
  )
}
