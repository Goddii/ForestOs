import { Link } from 'react-router-dom'
import { useWorkspace, useWorkspacePath } from './FunderWorkspaceContext'
import ActionButton from './ui/ActionButton'
import Badge from './ui/Badge'
import { formatCurrencyShort } from '../../lib/investor/format'
import { sumAmounts } from '../../lib/investor/capitalLedger'
import { shareOf, trancheSegments } from '../../lib/investor/chartScale'
import { nextTranche } from '../../lib/investor/overviewBand'
import { getAttentionItems } from '../../lib/investor/attention'

// A tranche due within this many days is flagged as imminent.
const SOON_DAYS = 14
const ATTENTION_PREVIEW = 2

const ATTENTION_TAGS = {
  overdue: { label: 'Overdue', tone: 'danger' },
  correction: { label: 'Returned', tone: 'warning' },
  risk: { label: 'Risk', tone: 'warning' },
}
const tagFor = (kind) => ATTENTION_TAGS[kind] ?? { label: 'Open', tone: 'neutral' }
const days = (count) => `${count} ${count === 1 ? 'day' : 'days'}`

/**
 * The overview's first viewport: which programme and who is looking, then
 * one band a returning funder can read without scrolling — their money
 * position drawn to scale, the next tranche and what releases it, and what
 * needs attention. Every figure comes from the funder's agreement, its
 * ledger rows, and the attention list derived from existing records.
 */
export default function OverviewHero() {
  const workspace = useWorkspace()
  const { programme, org } = workspace

  return (
    <section>
      <h1 className="font-display text-4xl leading-[1.02] text-ink sm:text-display">{programme.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="text-sm text-ink-muted">
          Implemented by Nyayo Tea Zones Development Corporation · viewing as{' '}
          <span className="font-semibold text-ink">{org.name}</span>
        </p>
        {org.isPlaceholder && org.note && <Badge tone="warning">{org.note}</Badge>}
      </div>

      <div className="mt-6 grid grid-cols-1 divide-y divide-line rounded-xl border border-line bg-card sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-[6fr_3fr_3fr]">
        <ContributionPane workspace={workspace} />
        <TranchePane workspace={workspace} />
        <AttentionPane workspace={workspace} />
      </div>
    </section>
  )
}

function PaneHeader({ title, action }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {action}
    </div>
  )
}

function ContributionPane({ workspace }) {
  const path = useWorkspacePath()
  const { capital, terms } = workspace
  const { committed, received, deployed, verified, currency } = capital.position
  const pct = (part, whole) => `${Math.round(shareOf(part, whole) * 100)}%`
  const figures = [
    { key: 'committed', label: 'Committed', value: committed, note: `${currency}, ${capital.tranches.length} tranches`, swatch: 'border border-line-strong bg-canvas-sunk' },
    { key: 'received', label: 'Received', value: received, note: `${pct(received, committed)} of committed`, swatch: 'border border-dashed border-ink-faint' },
    { key: 'spent', label: 'Spent', value: deployed, note: `${pct(deployed, received)} of received`, swatch: 'bg-forest-accent' },
    { key: 'verified', label: 'On verified work', value: verified, note: `${pct(verified, deployed)} of spent`, swatch: 'bg-forest-accent-dark' },
  ]

  return (
    <div className="p-5 sm:col-span-2 sm:p-6 lg:col-span-1">
      <PaneHeader
        title={terms.positionTitle}
        action={<ActionButton to={path('funding')} variant="text">Funding detail</ActionButton>}
      />
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {figures.map((figure) => (
          <div key={figure.key}>
            <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className={`h-2.5 w-2.5 rounded-[3px] ${figure.swatch}`} aria-hidden="true" />
              {figure.label}
            </dt>
            <dd className="mt-1 font-sans text-2xl font-bold tabular-nums text-ink">
              {formatCurrencyShort(figure.value, '').trim()}
            </dd>
            <dd className="text-xs tabular-nums text-ink-faint">{figure.note}</dd>
          </div>
        ))}
      </dl>
      <ContributionBar position={capital.position} tranches={capital.tranches} />
      <AwaitingVerification capital={capital} fundingPath={path('funding')} />
    </div>
  )
}

/** Spent and verified money on a track of the full commitment, with the planned tranches outlined. */
function ContributionBar({ position, tranches }) {
  const { committed, received, deployed, verified, currency } = position
  return (
    <div className="mt-5">
      <div
        className="relative h-3.5 overflow-hidden rounded-[4px] bg-canvas-sunk"
        role="img"
        aria-label={`Of ${formatCurrencyShort(committed, currency)} committed: ${formatCurrencyShort(received, currency)} received, ${formatCurrencyShort(deployed, currency)} spent, ${formatCurrencyShort(verified, currency)} on verified work.`}
      >
        {trancheSegments(tranches, committed).map((segment) => (
          <span
            key={segment.id}
            className="absolute inset-y-0 rounded-[4px] border border-dashed border-ink-faint/60"
            style={{ left: `${segment.left * 100}%`, width: `calc(${segment.width * 100}% - 2px)` }}
          />
        ))}
        <span className="absolute inset-y-0 left-0 rounded-[4px] bg-forest-accent" style={{ width: `${shareOf(deployed, committed) * 100}%` }} />
        <span className="absolute inset-y-0 left-0 rounded-[4px] bg-forest-accent-dark" style={{ width: `${shareOf(verified, committed) * 100}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-label tabular-nums text-ink-faint">
        <span>0</span>
        <span>{formatCurrencyShort(committed, currency)} committed</span>
      </div>
    </div>
  )
}

/** Money already spent on work whose verification is still pending, from the funder's ledger rows. */
function AwaitingVerification({ capital, fundingPath }) {
  const pendingRows = capital.expenditures.filter((row) => row.status === 'pending_verification')
  if (pendingRows.length === 0) return null
  return (
    <p className="mt-4 border-t border-line pt-4 text-sm text-ink-muted">
      <span className="font-semibold tabular-nums text-ink">
        {formatCurrencyShort(sumAmounts(pendingRows), capital.position.currency)}
      </span>{' '}
      spent on work still awaiting verification, across {pendingRows.length}{' '}
      {pendingRows.length === 1 ? 'payment' : 'payments'}.{' '}
      <Link to={fundingPath} className="font-semibold text-forest-accent underline-offset-2 hover:underline">
        See the ledger
      </Link>
    </p>
  )
}

function dueLabel(daysUntil) {
  if (daysUntil < 0) return { text: `${days(-daysUntil)} past planned date`, className: 'font-semibold text-danger' }
  if (daysUntil === 0) return { text: 'due today', className: 'font-semibold text-warning' }
  if (daysUntil <= SOON_DAYS) return { text: `in ${days(daysUntil)}`, className: 'font-semibold text-warning' }
  return { text: `in ${days(daysUntil)}`, className: '' }
}

// Middle pane borders: a top rule under the full-width contribution pane on
// tablet, vertical rules either side on desktop.
const MIDDLE_PANE = 'p-5 sm:border-r sm:border-t sm:border-line sm:p-6 lg:border-x lg:border-t-0'

function TranchePane({ workspace }) {
  const { capital, asOf } = workspace
  const { currency } = capital.position
  const next = nextTranche(capital.tranches, asOf)

  if (!next) {
    return (
      <div className={MIDDLE_PANE}>
        <PaneHeader title="Next tranche" />
        <p className="mt-4 text-sm text-ink-muted">All {capital.tranches.length} tranches have been received.</p>
      </div>
    )
  }

  const due = dueLabel(next.daysUntil)
  return (
    <div className={MIDDLE_PANE}>
      <PaneHeader title="Next tranche" />
      <p className="mt-4 font-sans text-2xl font-bold tabular-nums text-ink">
        {formatCurrencyShort(next.tranche.plannedKes, currency)}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Planned {next.tranche.plannedDate} · <span className={due.className}>{due.text}</span>
      </p>
      <div className="mt-3 flex gap-1" role="img" aria-label={`Tranche ${next.number} of ${next.count}`}>
        {capital.tranches.map((tranche, index) => (
          <span
            key={tranche.id}
            className={`h-1 flex-1 rounded-full ${index < next.number - 1 ? 'bg-forest-accent' : index === next.number - 1 ? 'bg-ink-faint/50' : 'bg-canvas-sunk'}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-ink-faint">Tranche {next.number} of {next.count}</p>
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs font-semibold text-ink">Released when</p>
        <p className="mt-0.5 text-sm leading-snug text-ink-muted">{next.tranche.milestone}</p>
      </div>
    </div>
  )
}

function AttentionPane({ workspace }) {
  const path = useWorkspacePath()
  const items = getAttentionItems(workspace)

  return (
    <div className="p-5 sm:border-t sm:border-line sm:p-6 lg:border-t-0">
      <PaneHeader
        title="Needs attention"
        action={<ActionButton to={path('issues')} variant="text">All issues</ActionButton>}
      />
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">Nothing currently requires attention.</p>
      ) : (
        <>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-sans text-2xl font-bold tabular-nums text-ink">{items.length}</span>
            <span className="text-sm text-ink-muted">open {items.length === 1 ? 'item' : 'items'}</span>
          </p>
          <ul className="mt-2">
            {items.slice(0, ATTENTION_PREVIEW).map((item) => (
              <li key={item.id} className="border-t border-line">
                <Link
                  to={item.to}
                  title={item.label}
                  className="block py-2.5 text-sm leading-snug text-ink transition-colors duration-200 ease-out hover:text-forest-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent/50"
                >
                  <Badge tone={tagFor(item.kind).tone} className="px-2 py-0.5">
                    {tagFor(item.kind).label}
                  </Badge>
                  <span className="mt-1 line-clamp-2 block">{item.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
