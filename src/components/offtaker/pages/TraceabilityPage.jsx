import { useNavigate } from 'react-router-dom'
import ContentCard from '../../investor/ui/ContentCard'
import SectionHeading from '../../investor/SectionHeading'
import { formatKg } from '../../../lib/offtaker/format'
import { useOfftaker, useOfftakerPath } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DataTable from '../DataTable'
import { AccessBadge, StageStatusBadge } from '../StatusBadges'

// What "verified" means at each stage — shown so the badge is never a black box.
const STAGE_DEFINITIONS = [
  ['Farmer / Source', 'An NTZDC field officer checked the plot on the ground, and a satellite pass confirmed no forest loss against the 31 December 2020 baseline.'],
  ['Collection centre', 'The weigh-in totals and rejections were recorded by the centre clerk and confirmed by a separate zone quality officer.'],
  ['Delivery', 'Leaf weighed at the factory matched the sum of weigh-in tickets within tolerance, and a zone manager signed off the period.'],
  ['Processing', 'The factory’s dispatch record for the lot was confirmed by the factory manager.'],
  ['Batch', 'The sealed batch passed its deforestation-free check and carries a verification reference.'],
  ['Buyer', 'Delivery to you was confirmed against your commitment. Open for lots nobody has bought yet.'],
]

export default function TraceabilityPage() {
  const ws = useOfftaker()
  const path = useOfftakerPath()
  const navigate = useNavigate()
  const exceptions = ws.batches.filter((batch) => batch.journey.exceptions.length > 0)
  const stageLabels = ws.batches[0]?.journey.stages.map((stage) => [stage.key, stage.label]) ?? []

  return (
    <div className="space-y-12">
      <PageHeader
        title="Traceability"
        description="Every batch you can see, stage by stage from source plot to buyer. A batch counts as fully traced only when all five supply stages are verified."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <ContentCard className="p-5">
          <p className="text-3xl font-bold tabular-nums text-forest-accent">{ws.totals.traceability.pct}%</p>
          <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">Volume fully traced</p>
          <p className="mt-3 text-xs text-ink-muted">
            {formatKg(ws.totals.traceability.tracedKg)} of {formatKg(ws.totals.traceability.visibleKg)}
          </p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-3xl font-bold tabular-nums text-ink">
            {ws.batches.filter((b) => b.journey.fullyTraced).length} / {ws.batches.length}
          </p>
          <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">Batches fully traced</p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className={`text-3xl font-bold tabular-nums ${exceptions.length ? 'text-danger' : 'text-ink'}`}>{exceptions.length}</p>
          <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">Batches with an exception</p>
        </ContentCard>
      </section>

      <section>
        <SectionHeading title="Coverage by stage" description="Select a batch for its full journey and who verified each stage." />
        <DataTable
          caption="Verification status of each journey stage, per batch"
          rows={ws.batches}
          rowKey={(batch) => batch.traceId}
          onRowClick={(batch) => navigate(path(`batches/${batch.traceId}`))}
          minWidth="72rem"
          columns={[
            {
              key: 'batch',
              header: 'Batch',
              cell: (batch) => (
                <>
                  <p className="font-mono font-semibold text-ink">{batch.traceId}</p>
                  <p className="text-xs text-ink-faint">{formatKg(batch.madeTeaKg)}</p>
                </>
              ),
            },
            { key: 'access', header: 'Status', cell: (batch) => <AccessBadge access={batch.access} /> },
            ...stageLabels.map(([key, label]) => ({
              key,
              header: label,
              cell: (batch) => <StageStatusBadge status={batch.journey.stages.find((stage) => stage.key === key).status} />,
            })),
          ]}
        />
      </section>

      {exceptions.length > 0 && (
        <section>
          <SectionHeading title="Exceptions" description="Recorded problems stay on the record after sign-off, so you can decide for yourself." />
          <ul className="space-y-3">
            {exceptions.flatMap((batch) =>
              batch.journey.stages
                .filter((stage) => stage.status === 'flagged')
                .map((stage) => (
                  <li key={`${batch.traceId}-${stage.key}`}>
                    <ContentCard className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-ink">
                          {batch.traceId}: {stage.label}
                        </p>
                        <p className="mt-1 text-compact text-ink-muted">{stage.note}</p>
                      </div>
                      <StageStatusBadge status="flagged" />
                    </ContentCard>
                  </li>
                )),
            )}
          </ul>
        </section>
      )}

      <section>
        <SectionHeading title="What verified means at each stage" />
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
          {STAGE_DEFINITIONS.map(([label, text], index) => (
            <li key={label} className="bg-card p-5">
              <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
                {index + 1}. {label}
              </p>
              <p className="mt-2 text-compact leading-relaxed text-ink-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
