import { Link } from 'react-router-dom'
import ContentCard from '../../investor/ui/ContentCard'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import EmptyState from '../../investor/EmptyState'
import { COMMITMENT_STATUS_LABELS, OPEN_COMMITMENT_STATUSES } from '../../../data/offtaker/commitments'
import { formatKg } from '../../../lib/offtaker/format'
import { shareOf } from '../../../lib/investor/chartScale'
import { useOfftaker, useOfftakerPath } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DataTable from '../DataTable'
import RestrictedNote from '../RestrictedNote'

const STATUS_TONE = { requested: 'neutral', reserved: 'warning', confirmed: 'live', in_transit: 'live', delivered: 'verified', cancelled: 'danger' }

export default function OrdersPage() {
  const ws = useOfftaker()
  const path = useOfftakerPath()
  const schedule = ws.commitments
    .flatMap((commitment) => commitment.schedule.map((entry, index) => ({ ...entry, id: `${commitment.id}-${index}`, commitment })))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-12">
      <PageHeader
        title="Orders & commitments"
        description="Your contracts and spot purchases against Nyayo Tea Zone supply: volumes, allocated batches and the delivery schedule."
        meta={
          <>
            <Badge tone="live">{ws.totals.openCommitments} open</Badge>
            <Badge tone="neutral">{formatKg(ws.totals.committedOpenKg)} committed</Badge>
          </>
        }
      />

      {!ws.permissions.commercialTerms && <RestrictedNote permission="commercialTerms" />}

      <section className="space-y-4">
        {ws.commitments.length === 0 && <EmptyState message="No commitments yet. Available lots can be reserved from the Available tea page." />}
        {ws.commitments.map((commitment) => {
          const allocatedKg = commitment.schedule.filter((entry) => entry.batchTraceId).reduce((sum, entry) => sum + entry.volumeKg, 0)
          const deliveredKg = commitment.schedule.filter((entry) => entry.status === 'delivered').reduce((sum, entry) => sum + entry.volumeKg, 0)
          return (
            <ContentCard key={commitment.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-base font-semibold text-ink">{commitment.id}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {commitment.type === 'contract' ? 'Contract' : 'Spot purchase'}, your reference {commitment.reference}, {commitment.period.start} to {commitment.period.end}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[commitment.status]}>{COMMITMENT_STATUS_LABELS[commitment.status]}</Badge>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-label text-ink-faint">Volume</dt>
                  <dd className="text-lg font-bold tabular-nums text-ink">{formatKg(commitment.volumeKg)}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Allocated to batches</dt>
                  <dd className="text-lg font-bold tabular-nums text-ink">{formatKg(allocatedKg)}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Delivered</dt>
                  <dd className="text-lg font-bold tabular-nums text-ink">{formatKg(deliveredKg)}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Price</dt>
                  <dd className="text-lg font-bold tabular-nums text-ink">
                    {commitment.priceKesPerKg != null ? `KES ${commitment.priceKesPerKg}/kg` : <span className="text-sm font-normal text-ink-faint">Not shown</span>}
                  </dd>
                </div>
              </dl>
              {/* delivered ⊂ allocated ⊂ volume, drawn to scale on one bar */}
              <div className="relative mt-4 h-2 rounded-full bg-canvas-sunk" role="img" aria-label={`${formatKg(deliveredKg)} delivered and ${formatKg(allocatedKg)} allocated of ${formatKg(commitment.volumeKg)}`}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-forest-accent/35" style={{ width: `${shareOf(allocatedKg, commitment.volumeKg) * 100}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-forest-accent" style={{ width: `${shareOf(deliveredKg, commitment.volumeKg) * 100}%` }} />
              </div>
              <p className="mt-2 flex flex-wrap gap-x-4 text-xs text-ink-faint">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-forest-accent" aria-hidden="true" />Delivered</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-forest-accent/35" aria-hidden="true" />Allocated</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-canvas-sunk" aria-hidden="true" />Not yet allocated</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {commitment.batchTraceIds.map((traceId) => (
                  <Link key={traceId} to={path(`batches/${traceId}`)} className="rounded-full border border-line px-2.5 py-1 font-mono text-label text-forest-accent hover:border-forest-accent/40 hover:bg-forest-accent-soft">
                    {traceId}
                  </Link>
                ))}
              </div>
            </ContentCard>
          )
        })}
      </section>

      <section>
        <SectionHeading title="Delivery schedule" />
        <DataTable
          caption="Delivery schedule"
          rows={schedule}
          rowKey={(entry) => entry.id}
          minWidth="40rem"
          columns={[
            { key: 'date', header: 'Date', cell: (e) => <span className="font-mono text-label tabular-nums text-ink-muted">{e.date}</span> },
            { key: 'commitment', header: 'Commitment', cell: (e) => <span className="font-mono text-label text-ink">{e.commitment.id}</span> },
            { key: 'volume', header: 'Volume', align: 'right', cell: (e) => formatKg(e.volumeKg) },
            { key: 'batch', header: 'Batch', cell: (e) => (e.batchTraceId ? <span className="font-mono text-label text-ink">{e.batchTraceId}</span> : <span className="text-xs text-ink-faint">To be allocated</span>) },
            { key: 'status', header: 'Status', cell: (e) => <Badge tone={e.status === 'delivered' ? 'verified' : 'neutral'}>{e.status}</Badge> },
          ]}
        />
      </section>

      {ws.reservationRequests.length > 0 && (
        <section>
          <SectionHeading title="Reservation requests" description="Sent from this session. NTZDC confirms a reservation before the lot is allocated to you." />
          <ContentCard>
            <ul className="divide-y divide-line">
              {ws.reservationRequests.map((traceId) => (
                <li key={traceId} className="flex items-center justify-between px-5 py-3">
                  <span className="font-mono text-compact text-ink">{traceId}</span>
                  <Badge tone="neutral">{COMMITMENT_STATUS_LABELS.requested}</Badge>
                </li>
              ))}
            </ul>
          </ContentCard>
          <p className="mt-2 text-xs text-ink-faint">Demo: requests are not sent anywhere and clear when the session ends.</p>
        </section>
      )}

      <p className="text-xs text-ink-faint">
        {ws.commitments.filter((c) => OPEN_COMMITMENT_STATUSES.has(c.status)).length} open commitments. Prices are illustrative placeholders, not NTZDC’s commercial terms.
      </p>
    </div>
  )
}
