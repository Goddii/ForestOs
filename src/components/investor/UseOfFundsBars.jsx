import { Fragment, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useWorkspace } from './FunderWorkspaceContext'
import { formatMillions } from '../../lib/investor/format'
import { shareOf } from '../../lib/investor/chartScale'
import UseOfFundsChain from './UseOfFundsChain'

const LEGEND = [
  { label: 'Spent on verified work', swatch: 'bg-forest-accent-dark' },
  { label: 'Spent, awaiting verification', swatch: 'bg-forest-accent' },
  { label: 'Budget not yet spent', swatch: 'border border-line-strong bg-canvas-sunk' },
]
const NUMBER_CELL = 'px-4 py-3.5 text-right tabular-nums sm:px-5'
const HEAD_CELL = 'px-4 py-2.5 font-mono text-label font-medium uppercase tracking-label text-ink-faint sm:px-5'

/**
 * One category's bar. Every track is drawn to the same scale (the largest
 * budget), so a track's length is its budget; inside it, spent and verified
 * fill from the left in the same colours as the capital flow and overview.
 */
function BudgetBar({ category, maxBudget }) {
  return (
    <span
      className="relative block h-3 rounded-[4px] bg-canvas-sunk"
      style={{ width: `${shareOf(category.budget, maxBudget) * 100}%` }}
      aria-hidden="true"
    >
      <span className="absolute inset-y-0 left-0 rounded-[4px] bg-forest-accent" style={{ width: `${shareOf(category.deployed, category.budget) * 100}%` }} />
      <span className="absolute inset-y-0 left-0 rounded-[4px] bg-forest-accent-dark" style={{ width: `${shareOf(category.verified, category.budget) * 100}%` }} />
    </span>
  )
}

/**
 * Investor-grade Use of Funds (build brief §13/§15) as one table: budget,
 * spent, verified and remaining per category, to two decimals so the
 * figures add up, with a bar on a shared scale and a totals row that
 * reconciles with the capital flow. A category with spend but nothing
 * verified is flagged. Opening a row shows its results chain
 * (UseOfFundsChain). Meant to sit inside a `ContentCard`.
 *
 * @param {{ onShowPayments: (filter: import('../../lib/investor/capitalLedger').LedgerFilter) => void }} props
 */
export default function UseOfFundsBars({ onShowPayments }) {
  const [expanded, setExpanded] = useState(null)
  const { capital } = useWorkspace()
  const categories = capital.useOfFunds
  const { currency } = capital.position
  const maxBudget = Math.max(...categories.map((category) => category.budget))
  const total = (key) => categories.reduce((sum, category) => sum + category[key], 0)

  return (
    <div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 border-b border-line px-4 py-3 text-xs text-ink-muted sm:px-5">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${item.swatch}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>

      <table className="w-full text-sm text-ink">
        <caption className="sr-only">Budget, spend and verified spend by category, in millions of {currency}</caption>
        <thead className="border-b border-line">
          <tr>
            <th scope="col" className={`${HEAD_CELL} text-left md:min-w-[13rem]`}>Category</th>
            <th scope="col" className={`${HEAD_CELL} hidden w-[32%] text-left md:table-cell`}>Budget, spent and verified</th>
            <th scope="col" className={`${HEAD_CELL} hidden text-right sm:table-cell`}>Budget</th>
            <th scope="col" className={`${HEAD_CELL} text-right`}>Spent</th>
            <th scope="col" className={`${HEAD_CELL} text-right`}>Verified</th>
            <th scope="col" className={`${HEAD_CELL} hidden text-right sm:table-cell`}>Remaining</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {categories.map((category) => {
            const isOpen = expanded === category.id
            const isUnverified = category.deployed > 0 && category.verified === 0
            return (
              <Fragment key={category.id}>
                <tr className={isOpen ? 'bg-canvas' : 'transition-colors duration-200 hover:bg-canvas'}>
                  <th scope="row" className="px-4 py-3.5 text-left font-normal sm:px-5">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : category.id)}
                      aria-expanded={isOpen}
                      className="flex cursor-pointer items-center gap-1.5 text-left text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent/50"
                    >
                      {category.category}
                      <ChevronDown
                        className={`h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                    <span className="mt-0.5 block text-xs text-ink-faint">{category.percentage}% of budget</span>
                    <span className="mt-2 block md:hidden">
                      <BudgetBar category={category} maxBudget={maxBudget} />
                    </span>
                  </th>
                  <td className="hidden px-4 py-3.5 sm:px-5 md:table-cell">
                    <BudgetBar category={category} maxBudget={maxBudget} />
                  </td>
                  <td className={`${NUMBER_CELL} hidden sm:table-cell`}>{formatMillions(category.budget)}</td>
                  <td className={NUMBER_CELL}>{formatMillions(category.deployed)}</td>
                  <td className={`${NUMBER_CELL} ${isUnverified ? 'font-semibold text-warning' : ''}`}>
                    {formatMillions(category.verified)}
                    {isUnverified && <span className="block text-label font-normal sm:whitespace-nowrap">nothing verified yet</span>}
                  </td>
                  <td className={`${NUMBER_CELL} hidden text-ink-faint sm:table-cell`}>{formatMillions(category.remaining)}</td>
                </tr>
                {isOpen && (
                  <tr className="bg-canvas">
                    <td colSpan={6} className="px-4 pb-5 pt-1 sm:px-5">
                      <UseOfFundsChain category={category} currency={currency} onShowPayments={onShowPayments} />
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
        <tfoot className="border-t border-line-strong bg-canvas font-bold">
          <tr>
            <th scope="row" className="px-4 py-3 text-left sm:px-5">Total · {currency}</th>
            <td className="hidden md:table-cell" />
            <td className={`${NUMBER_CELL} hidden sm:table-cell`}>{formatMillions(total('budget'))}</td>
            <td className={NUMBER_CELL}>{formatMillions(total('deployed'))}</td>
            <td className={NUMBER_CELL}>{formatMillions(total('verified'))}</td>
            <td className={`${NUMBER_CELL} hidden text-ink-faint sm:table-cell`}>{formatMillions(total('remaining'))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
