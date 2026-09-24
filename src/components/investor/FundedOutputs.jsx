import { Link } from 'react-router-dom'
import { formatNumber } from '../../lib/investor/format'
import { useWorkspace, useWorkspacePath } from './FunderWorkspaceContext'

/**
 * The funder's own outputs, attributed directly (only activities its
 * allocations paid for). Verified is the headline; work still in review is
 * named separately, never folded in. Each row opens its indicator on the
 * Progress page, where the contributing activities and evidence live.
 */
export default function FundedOutputs() {
  const { progress } = useWorkspace()
  const path = useWorkspacePath()
  const rows = progress.filter((row) => row.fundedReported > 0)

  if (rows.length === 0) {
    return <p className="px-5 py-6 text-[13px] text-ink-muted">No activities funded by this agreement have been reported yet.</p>
  }

  return (
    <ul className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
      {rows.map(({ indicator, fundedVerified, fundedReported }) => {
        const pending = fundedReported - fundedVerified
        return (
          <li key={indicator.id} className="sm:border-b sm:border-line sm:odd:border-r">
            <Link
              to={`${path('progress')}#${indicator.id}`}
              className="block px-5 py-5 transition-colors duration-200 hover:bg-canvas-sunk"
            >
              <p className="text-[13px] font-semibold text-ink">{indicator.label}</p>
              <p className="mt-1.5 font-sans text-3xl font-bold tabular-nums text-ink">
                {formatNumber(fundedVerified)}
                <span className="ml-1.5 text-sm font-medium text-ink-muted">{indicator.unit} verified</span>
              </p>
              <p className="mt-1 text-[12px] text-ink-muted">
                {pending > 0 ? `${formatNumber(pending)} ${indicator.unit} more reported, awaiting verification` : 'Nothing awaiting verification'}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
