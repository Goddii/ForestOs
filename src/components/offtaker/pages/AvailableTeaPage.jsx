import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import ContentCard from '../../investor/ui/ContentCard'
import ActionButton from '../../investor/ui/ActionButton'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import { QUALITY_METRICS } from '../../../data/supply/quality'
import { formatKg } from '../../../lib/offtaker/format'
import { useOfftaker, useOfftakerPath } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import BatchTable from '../BatchTable'
import TraceJourney from '../TraceJourney'
import RestrictedNote from '../RestrictedNote'
import EmptyState from '../../investor/EmptyState'

/**
 * Unallocated lots offered to every buyer. Each lot shows the facts a buyer
 * decides on — volume, grade, quality record, journey, conservation link —
 * and, for roles that can, a reservation request. Requests stay in this
 * browser session: there is no sales backend to send them to.
 */
export default function AvailableTeaPage() {
  const ws = useOfftaker()
  const path = useOfftakerPath()
  const connected = new Set(ws.conservation.connectedAvailable.map((batch) => batch.traceId))

  return (
    <div className="space-y-10">
      <PageHeader
        title="Available tea"
        description="Sealed lots not yet allocated to any buyer. Allocated lots disappear from every other buyer’s portal."
        meta={<Badge tone="neutral">{ws.available.length} lots · {formatKg(ws.totals.availableKg)}</Badge>}
      />

      {!ws.permissions.reserveLots && <RestrictedNote permission="reserveLots" />}

      {ws.available.length === 0 ? (
        <EmptyState message="No unallocated lots right now. Expected production is on the Supply page." />
      ) : (
        <div className="space-y-6">
          {ws.available.map((batch) => {
            const requested = ws.reservationRequests.includes(batch.traceId)
            return (
              <ContentCard key={batch.traceId} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link to={path(`batches/${batch.traceId}`)} className="font-mono text-lg font-semibold text-ink hover:text-forest-accent hover:underline">
                      {batch.traceId}
                    </Link>
                    <p className="mt-1 text-sm text-ink-muted">
                      {batch.centre.name} collection centre, {batch.zone}. Processed at {batch.record.processing.facility}.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone="neutral">{batch.grade}</Badge>
                      <Badge tone="neutral">{formatKg(batch.madeTeaKg)}</Badge>
                      <Badge tone="neutral">Sealed {batch.sealedAt}</Badge>
                      {connected.has(batch.traceId) && <Badge tone="verified">Verified conservation link</Badge>}
                    </div>
                  </div>
                  {ws.permissions.reserveLots &&
                    (requested ? (
                      <Badge tone="live" icon={CheckCircle2}>
                        Reservation requested
                      </Badge>
                    ) : (
                      <ActionButton variant="primary" icon={ShoppingCart} iconPosition="left" onClick={() => ws.requestReservation(batch.traceId)}>
                        Request reservation
                      </ActionButton>
                    ))}
                </div>

                {ws.permissions.qualityMetrics && batch.quality?.metrics && (
                  <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-canvas p-4 sm:grid-cols-4">
                    {QUALITY_METRICS.map((metric) => (
                      <div key={metric.id}>
                        <dt className="text-label text-ink-faint">{metric.label}</dt>
                        <dd className="text-base font-bold tabular-nums text-ink">
                          {batch.quality.metrics[metric.id]}
                          {metric.unit}
                        </dd>
                      </div>
                    ))}
                    <div>
                      <dt className="text-label text-ink-faint">Tasting notes</dt>
                      <dd className="text-xs leading-snug text-ink-muted">{batch.quality.notes}</dd>
                    </div>
                  </dl>
                )}

                <div className="mt-6">
                  <TraceJourney journey={batch.journey} />
                </div>
              </ContentCard>
            )
          })}
          {ws.reservationRequests.length > 0 && (
            <p className="text-xs text-ink-faint">
              Demo: reservation requests are kept in this browser session only and are not sent to NTZDC.
            </p>
          )}
        </div>
      )}

      <section>
        <SectionHeading title="Compare lots" description="The same lots as a table, filterable." />
        <BatchTable batches={ws.available} showAccessFilter={false} />
      </section>
    </div>
  )
}
