import { Link } from 'react-router-dom'
import { formatNumber } from '../../lib/investor/format'
import { desktopColumns, splitFundedOutputs } from '../../lib/investor/fundedOutputs'
import { useWorkspace, useWorkspacePath } from './FunderWorkspaceContext'
import Badge from './ui/Badge'

// Item width per desktop column count. Items also grow, so a short last
// row stretches to fill instead of leaving empty cells (static class names
// for Tailwind; the 1px offset leaves room for the gap-px dividers).
const DESKTOP_BASIS = {
  1: 'lg:basis-full',
  2: 'lg:basis-[calc(50%-1px)]',
  3: 'lg:basis-[calc(33.333%-1px)]',
  4: 'lg:basis-[calc(25%-1px)]',
  5: 'lg:basis-[calc(20%-1px)]',
}

/**
 * The funder's own outputs, attributed directly (only activities its
 * allocations paid for). Outputs with verified work lead as one strip of
 * headline figures; outputs reported but not yet verified at all sit on a
 * single line below instead of as large "0 verified" tiles. Targets and
 * percentages live on the Progress page only; every item links to its
 * indicator there, where the contributing activities and evidence live.
 */
export default function FundedOutputs() {
  const { progress } = useWorkspace()
  const path = useWorkspacePath()
  const { verified, unverified } = splitFundedOutputs(progress)
  const toIndicator = (row) => `${path('progress')}#${row.indicator.id}`
  const itemBasis = DESKTOP_BASIS[desktopColumns(verified.length)]

  if (verified.length === 0 && unverified.length === 0) {
    return <p className="px-5 py-6 text-compact text-ink-muted">No activities funded by this agreement have been reported yet.</p>
  }

  return (
    <>
      {verified.length > 0 && (
        <ul className="flex flex-wrap gap-px bg-line">
          {verified.map((row) => (
            <li key={row.indicator.id} className={`grow basis-[calc(50%-1px)] bg-card ${itemBasis}`}>
              <Link
                to={toIndicator(row)}
                className="block h-full px-5 py-5 transition-colors duration-200 ease-out hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-accent/50"
              >
                <p className="min-h-[2.5rem] text-compact font-semibold leading-snug text-ink">{row.indicator.label}</p>
                <p className="mt-2 font-sans text-3xl font-bold tabular-nums text-ink">
                  {formatNumber(row.fundedVerified)}
                  <span className="ml-1.5 text-sm font-medium text-ink-muted">{row.indicator.unit}</span>
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  {row.pending > 0 ? (
                    <>
                      <span className="font-semibold text-warning">
                        +{formatNumber(row.pending)} {row.indicator.unit}
                      </span>{' '}
                      awaiting verification
                    </>
                  ) : (
                    'All reported work verified'
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {unverified.length > 0 && (
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 ${verified.length > 0 ? 'border-t border-line' : ''}`}>
          <Badge tone="warning">Not yet verified</Badge>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
            {unverified.map((row) => (
              <li key={row.indicator.id}>
                <Link
                  to={toIndicator(row)}
                  className="text-compact text-ink-muted transition-colors duration-200 ease-out hover:text-forest-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent/50"
                >
                  <span className="sr-only">Not yet verified: </span>
                  {row.indicator.label} ·{' '}
                  <span className="font-semibold tabular-nums text-ink">
                    {formatNumber(row.pending)} {row.indicator.unit}
                  </span>{' '}
                  reported
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
