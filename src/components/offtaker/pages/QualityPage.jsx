import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContentCard from '../../investor/ui/ContentCard'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import PerformanceChart from '../../investor/PerformanceChart'
import VerificationStateBadge from '../../investor/VerificationStateBadge'
import { QUALITY_METRICS, QUALITY_STAGE_LABELS } from '../../../data/supply/quality'
import { REJECTION_REASON_LABELS } from '../../../data/supply/intake'
import { currentState } from '../../../lib/programme/verificationState'
import { formatKg, formatMonth } from '../../../lib/offtaker/format'
import { useOfftaker, useOfftakerPath } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DataTable from '../DataTable'
import VolumeBars from '../VolumeBars'
import RestrictedNote from '../RestrictedNote'

const selectClass =
  'cursor-pointer rounded-full border border-line bg-card px-3.5 py-2 font-mono text-label uppercase tracking-label text-ink-muted shadow-sm outline-none hover:border-line-strong focus:border-forest-accent/50 focus:ring-2 focus:ring-emerald-500/30'

function monthlySeries(centres, pick) {
  const byMonth = new Map()
  for (const centre of centres) {
    for (const row of centre.history) {
      const entry = byMonth.get(row.month) ?? { received: 0, accepted: 0, fineWeighted: 0 }
      entry.received += row.receivedKg
      entry.accepted += row.acceptedKg
      entry.fineWeighted += row.fineLeafPct * row.receivedKg
      byMonth.set(row.month, entry)
    }
  }
  return [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, entry]) => ({ year: formatMonth(month), value: pick(entry) }))
}

export default function QualityPage() {
  const ws = useOfftaker()
  const path = useOfftakerPath()
  const sourceIds = new Set(ws.batches.map((batch) => batch.centre?.id))
  const [centreId, setCentreId] = useState('')
  const centres = ws.centres.filter((centre) => (centreId ? centre.id === centreId : sourceIds.has(centre.id)))
  const scopeLabel = centreId ? `${centres[0].name} collection centre` : 'the centres your visible tea comes from'

  const reasons = Object.entries(
    ws.batches.flatMap((batch) => batch.intake?.rejections ?? []).reduce((acc, row) => ({ ...acc, [row.reason]: (acc[row.reason] ?? 0) + row.kg }), {}),
  ).sort((a, b) => b[1] - a[1])
  const received = ws.batches.reduce((sum, batch) => sum + (batch.intake?.receivedKg ?? 0), 0)
  const rejected = ws.batches.reduce((sum, batch) => sum + (batch.intake?.rejectedKg ?? 0), 0)

  return (
    <div className="space-y-12">
      <PageHeader
        title="Quality"
        description="Grades, measured quality and what was rejected at the weigh-in. ForestOS reports measured values and how they were taken; the specification you buy against is set in your own contract."
        actions={
          <select aria-label="Collection centre" value={centreId} onChange={(event) => setCentreId(event.target.value)} className={selectClass}>
            <option value="">Your source centres</option>
            {ws.centres.map((centre) => (
              <option key={centre.id} value={centre.id}>
                {centre.name}
              </option>
            ))}
          </select>
        }
      />

      <section>
        <SectionHeading title="Quality trends" description={`Monthly intake at ${scopeLabel}.`} />
        <div className="grid gap-4 md:grid-cols-2">
          <PerformanceChart
            label="Fine leaf count"
            unit="%"
            scaleMax={100}
            series={monthlySeries(centres, (e) => Math.round((e.fineWeighted / e.received) * 10) / 10)}
            methodology={QUALITY_METRICS.find((m) => m.id === 'fine_leaf').method + ', weighted by leaf received.'}
          />
          <PerformanceChart
            label="Green leaf accepted at weigh-in"
            unit="%"
            scaleMax={100}
            series={monthlySeries(centres, (e) => Math.round((e.accepted / e.received) * 1000) / 10)}
            methodology="Accepted green leaf as a share of leaf received, all deliveries in the month."
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading title="Rejection reasons" description="Across the batches you can see." />
          <ContentCard className="p-5">
            <VolumeBars rows={reasons.map(([reason, kg]) => ({ key: reason, label: REJECTION_REASON_LABELS[reason], value: kg }))} />
            <p className="mt-4 text-xs text-ink-muted">
              {formatKg(rejected)} rejected of {formatKg(received)} received ({((rejected / received) * 100).toFixed(1)}%).
            </p>
          </ContentCard>
        </div>
        <div className="lg:col-span-3">
          <SectionHeading title="Accepted and rejected by batch" />
          <DataTable
            caption="Intake by batch"
            rows={ws.batches}
            rowKey={(batch) => batch.traceId}
            minWidth="36rem"
            columns={[
              { key: 'batch', header: 'Batch', cell: (b) => <Link to={path(`batches/${b.traceId}`)} className="font-mono font-semibold text-ink hover:text-forest-accent hover:underline">{b.traceId}</Link> },
              { key: 'received', header: 'Received', align: 'right', cell: (b) => formatKg(b.intake.receivedKg) },
              { key: 'accepted', header: 'Accepted', align: 'right', cell: (b) => formatKg(b.intake.acceptedKg) },
              { key: 'rejected', header: 'Rejected', align: 'right', cell: (b) => `${formatKg(b.intake.rejectedKg)} (${((b.intake.rejectedKg / b.intake.receivedKg) * 100).toFixed(1)}%)` },
              { key: 'state', header: 'Record', cell: (b) => <VerificationStateBadge state={currentState(b.intake.verification)} /> },
            ]}
          />
        </div>
      </section>

      <section>
        <SectionHeading
          title="Batch comparison"
          description="Grade and measured values side by side. The bar in each cell is the value on its metric’s own scale, from zero."
        />
        {ws.permissions.qualityMetrics ? (
          <DataTable
            caption="Quality measurements by batch"
            rows={ws.batches}
            rowKey={(batch) => batch.traceId}
            minWidth="56rem"
            columns={[
              { key: 'batch', header: 'Batch', cell: (b) => <Link to={path(`batches/${b.traceId}`)} className="font-mono font-semibold text-ink hover:text-forest-accent hover:underline">{b.traceId}</Link> },
              { key: 'grade', header: 'Grade', cell: (b) => <Badge tone="neutral">{b.grade}</Badge> },
              ...QUALITY_METRICS.map((metric) => {
                const max = metric.scaleMax ?? Math.max(...ws.batches.map((b) => b.quality?.metrics?.[metric.id] ?? 0))
                return {
                  key: metric.id,
                  header: `${metric.label} (${metric.unit})`,
                  cell: (b) => {
                    const value = b.quality?.metrics?.[metric.id]
                    return value == null ? (
                      '—'
                    ) : (
                      <div className="min-w-[6rem]">
                        <span className="font-semibold tabular-nums text-ink">{value}</span>
                        <div className="mt-1 h-1.5 rounded-full bg-canvas-sunk" aria-hidden="true">
                          <div className="h-1.5 rounded-full bg-forest-accent" style={{ width: `${(value / max) * 100}%` }} />
                        </div>
                      </div>
                    )
                  },
                }
              }),
              { key: 'notes', header: 'Tasting notes', cell: (b) => <span className="text-xs text-ink-muted">{b.quality?.notes}</span> },
              { key: 'state', header: 'Verification', cell: (b) => (b.quality ? <VerificationStateBadge state={currentState(b.quality.verification)} /> : '—') },
            ]}
          />
        ) : (
          <RestrictedNote permission="qualityMetrics" />
        )}
      </section>

      <section>
        <SectionHeading title="Metrics shown and how they are measured" description="Configured per portal; ForestOS sets no pass or fail limits." />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {QUALITY_METRICS.map((metric) => (
            <li key={metric.id} className="bg-card p-5">
              <p className="font-semibold text-ink">
                {metric.label} <span className="font-normal text-ink-faint">({metric.unit})</span>
              </p>
              <p className="mt-1 font-mono text-label uppercase tracking-label text-ink-faint">{QUALITY_STAGE_LABELS[metric.stage]}</p>
              <p className="mt-2 text-compact leading-relaxed text-ink-muted">{metric.method}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
