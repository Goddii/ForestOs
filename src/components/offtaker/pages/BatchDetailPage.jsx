import { useParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import ContentCard from '../../investor/ui/ContentCard'
import ActionButton from '../../investor/ui/ActionButton'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import EmptyState from '../../investor/EmptyState'
import VerificationStateBadge from '../../investor/VerificationStateBadge'
import { QUALITY_METRICS } from '../../../data/supply/quality'
import { REJECTION_REASON_LABELS } from '../../../data/supply/intake'
import { VARIANCE_TOLERANCE_PCT } from '../../../data/supply/deliveries'
import { COMMITMENT_STATUS_LABELS } from '../../../data/offtaker/commitments'
import { currentState } from '../../../lib/programme/verificationState'
import { formatKg } from '../../../lib/offtaker/format'
import { useOfftaker, useOfftakerPath } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import TraceJourney from '../TraceJourney'
import DocumentTable from '../DocumentTable'
import RestrictedNote from '../RestrictedNote'
import VolumeBars from '../VolumeBars'
import { AccessBadge, StageStatusBadge } from '../StatusBadges'

export default function BatchDetailPage() {
  const { traceId } = useParams()
  const ws = useOfftaker()
  const path = useOfftakerPath()
  const batch = ws.batches.find((entry) => entry.traceId === traceId || entry.code === traceId)

  if (!batch) {
    // Same message whether the batch doesn't exist or belongs to another
    // buyer: the portal never confirms another buyer's batch exists.
    return (
      <div className="space-y-6">
        <PageHeader title="Batch not available" />
        <EmptyState message={`No batch “${traceId}” is available to ${ws.org.name}. Check the trace id, or find it in your batch list.`} />
        <ActionButton to={path('batches')} icon={ArrowLeft} iconPosition="left">
          All batches
        </ActionButton>
      </div>
    )
  }

  const { record, intake, delivery, quality, commitment, journey } = batch
  const documents = ws.documents.filter((document) => document.scope === 'batch' && document.scopeRef === batch.traceId)
  const centreLinked = ws.centres.find((centre) => centre.id === batch.centre?.id)?.conservationLinked

  return (
    <div className="space-y-12">
      <div>
        <ActionButton to={path('batches')} variant="text" icon={ArrowLeft} iconPosition="left">
          All batches
        </ActionButton>
      </div>
      <PageHeader
        title={batch.traceId}
        description={`${record.batch.grade} made tea from ${batch.centre?.name} collection centre, ${batch.zone}, processed at ${record.processing.facility}.`}
        meta={
          <>
            <AccessBadge access={batch.access} />
            <StageStatusBadge status={journey.fullyTraced ? 'verified' : journey.exceptions.length ? 'flagged' : 'pending'} />
            <Badge tone={batch.eudrStatus === 'Verified' ? 'verified' : 'warning'} icon={ShieldCheck}>
              Deforestation-free check {batch.eudrStatus.toLowerCase()}
            </Badge>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Made tea', formatKg(batch.madeTeaKg)],
          ['Grade', record.batch.grade],
          ['Sealed', batch.sealedAt],
          ['Factory lot', record.processing.lotId],
        ].map(([label, value]) => (
          <ContentCard key={label} className="p-5">
            <p className="text-2xl font-bold tabular-nums text-ink">{value}</p>
            <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">{label}</p>
          </ContentCard>
        ))}
      </section>

      <section>
        <SectionHeading
          title="Traceability journey"
          description={`${journey.verifiedCount} of 5 supply stages verified. Each stage shows who established it and how independently.`}
        />
        <ContentCard className="p-6">
          <TraceJourney journey={journey} />
        </ContentCard>
        {delivery && (
          <p className="mt-3 text-xs text-ink-faint">
            Delivery reconciliation tolerance: {VARIANCE_TOLERANCE_PCT}% of the weigh-in tickets, NTZDC’s own sign-off rule.
          </p>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="Intake at the collection centre" />
          <ContentCard className="p-5">
            {intake ? (
              <>
                <VolumeBars
                  rows={[
                    { key: 'accepted', label: 'Accepted', value: intake.acceptedKg },
                    ...intake.rejections.map((row) => ({ key: row.reason, label: REJECTION_REASON_LABELS[row.reason], sublabel: 'rejected', value: row.kg })),
                  ]}
                  max={intake.receivedKg}
                />
                <p className="mt-4 text-xs text-ink-muted">
                  {formatKg(intake.receivedKg)} green leaf received; {((intake.rejectedKg / intake.receivedKg) * 100).toFixed(1)}% rejected at the weigh-in.
                </p>
                <div className="mt-3">
                  <VerificationStateBadge state={currentState(intake.verification)} />
                </div>
              </>
            ) : (
              <p className="text-compact text-ink-muted">No intake record.</p>
            )}
          </ContentCard>
        </div>
        <div>
          <SectionHeading title="Quality" />
          <ContentCard className="p-5">
            {quality && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Grade {quality.grade}</Badge>
                <VerificationStateBadge state={currentState(quality.verification)} />
              </div>
            )}
            {quality?.metrics ? (
              <dl className="mt-4 divide-y divide-line">
                {QUALITY_METRICS.map((metric) => (
                  <div key={metric.id} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt>
                      <span className="text-compact text-ink">{metric.label}</span>
                      <span className="block text-xs text-ink-faint">
                        {metric.method}
                      </span>
                    </dt>
                    <dd className="text-lg font-bold tabular-nums text-ink">
                      {quality.metrics[metric.id]}
                      {metric.unit}
                    </dd>
                  </div>
                ))}
                <div className="py-2.5">
                  <dt className="text-xs text-ink-faint">Tasting notes</dt>
                  <dd className="text-compact text-ink-muted">{quality.notes}</dd>
                </div>
              </dl>
            ) : (
              <RestrictedNote permission="qualityMetrics" className="mt-4" />
            )}
          </ContentCard>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="Conservation connection" />
          <ContentCard className="p-5">
            <p className="text-compact text-ink">
              {centreLinked
                ? `${batch.centre.name}’s catchment overlaps buffer segments with verified planting or protection work.`
                : `${batch.centre?.name ?? 'This centre'} is not yet linked to a verified conservation programme.`}
            </p>
            <p className="mt-2 text-xs text-ink-muted">
              Canopy on the source plot: {record.plot.canopyBaseline2020Pct}% in 2020, {record.plot.canopyNowPct}% now (satellite).
            </p>
            <ActionButton to={path('origin')} className="mt-4">
              Origin & impact
            </ActionButton>
          </ContentCard>
        </div>
        <div>
          <SectionHeading title="Your commitment" />
          <ContentCard className="p-5">
            {commitment ? (
              <dl className="grid grid-cols-2 gap-4 text-compact">
                <div>
                  <dt className="text-xs text-ink-faint">Commitment</dt>
                  <dd className="font-mono text-ink">{commitment.id}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Your reference</dt>
                  <dd className="font-mono text-ink">{commitment.reference}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Status</dt>
                  <dd className="text-ink">{COMMITMENT_STATUS_LABELS[commitment.status]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Price</dt>
                  <dd className="text-ink">{commitment.priceKesPerKg != null ? `KES ${commitment.priceKesPerKg}/kg` : 'Not shown for your role'}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-compact text-ink-muted">Not allocated to you. This lot is on offer to every buyer.</p>
            )}
          </ContentCard>
        </div>
      </section>

      <section>
        <SectionHeading title="Batch documents" description="The documents for this batch that your role may open." />
        <DocumentTable documents={documents} showFilters={false} />
      </section>
    </div>
  )
}
