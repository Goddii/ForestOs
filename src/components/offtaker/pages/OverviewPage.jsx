import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ContentCard from '../../investor/ui/ContentCard'
import StatCard from '../../investor/ui/StatCard'
import ActionButton from '../../investor/ui/ActionButton'
import SectionHeading from '../../investor/SectionHeading'
import PerformanceChart from '../../investor/PerformanceChart'
import { BUYER_TYPE_LABELS } from '../../../data/offtaker/accounts'
import { sourcingConfidence } from '../../../lib/offtaker/confidence'
import { formatKg, formatMonth } from '../../../lib/offtaker/format'
import { useOfftaker, useOfftakerPath } from '../OfftakerWorkspaceContext'
import BatchCard from '../BatchCard'
import VolumeBars from '../VolumeBars'
import { DocumentStatusBadge, StageStatusBadge } from '../StatusBadges'

/** Monthly fine-leaf share, weighted by intake, across the centres a buyer sources from. */
function fineLeafTrend(centres) {
  const byMonth = new Map()
  for (const centre of centres) {
    for (const row of centre.history) {
      const entry = byMonth.get(row.month) ?? { weighted: 0, kg: 0 }
      entry.weighted += row.fineLeafPct * row.receivedKg
      entry.kg += row.receivedKg
      byMonth.set(row.month, entry)
    }
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, entry]) => ({ year: formatMonth(month), value: Math.round((entry.weighted / entry.kg) * 10) / 10 }))
}

export default function OverviewPage() {
  const ws = useOfftaker()
  const path = useOfftakerPath()
  const checks = sourcingConfidence(ws)
  const sourceCentreIds = new Set(ws.batches.map((batch) => batch.centre?.id))
  const sourceCentres = ws.centres.filter((centre) => sourceCentreIds.has(centre.id))
  const zones = Object.entries(
    ws.batches.reduce((acc, batch) => ({ ...acc, [batch.zone]: (acc[batch.zone] ?? 0) + batch.madeTeaKg }), {}),
  ).sort((a, b) => b[1] - a[1])
  const outstanding = ws.documents.filter((document) => document.outstanding)

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-3 border-b border-line pb-8">
        <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">{BUYER_TYPE_LABELS[ws.account.buyerType]}</p>
        <h1 className="font-display text-5xl leading-[1.05] text-ink sm:text-6xl">{ws.org.name}</h1>
        <p className="max-w-[68ch] text-sm leading-relaxed text-ink-muted">
          Market: {ws.account.market}. Tea from the Nyayo Tea Zone buffer belt, with each batch’s journey, quality
          record, documents and conservation link, read from NTZDC’s own records and scoped to your organisation and role.
        </p>
      </div>

      {/* The answer first: the four things a buyer needs to be true before sourcing */}
      <section aria-labelledby="confidence-heading">
        <h2 id="confidence-heading" className="text-2xl font-bold tracking-tight text-ink">
          Can you source this tea with confidence?
        </h2>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card md:grid-cols-2 xl:grid-cols-4">
          {checks.map((check) => (
            <li key={check.key} className="flex flex-col bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink">{check.title}</p>
                <StageStatusBadge status={check.status} />
              </div>
              <p className="mt-3 text-lg font-bold leading-snug text-ink">{check.headline}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-muted">{check.detail}</p>
              <Link
                to={path(check.to)}
                className="mt-4 inline-flex items-center gap-1 text-label font-semibold uppercase tracking-label text-forest-accent hover:text-forest-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                Review {check.title.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Volumes" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ContentCard className="p-5">
          <StatCard label="Available to buy" value={ws.totals.availableKg} unit="kg" separator="," />
          <p className="mt-3 text-xs text-ink-muted">{ws.totals.availableLots} unallocated lots, sealed and ready</p>
        </ContentCard>
        <ContentCard className="p-5">
          <StatCard label="Committed, not yet delivered" value={ws.totals.committedOpenKg} unit="kg" separator="," />
          <p className="mt-3 text-xs text-ink-muted">{ws.totals.openCommitments} open commitment{ws.totals.openCommitments === 1 ? '' : 's'}</p>
        </ContentCard>
        <ContentCard className="p-5">
          <StatCard label="Delivered to you" value={ws.totals.deliveredKg} unit="kg" separator="," />
          <p className="mt-3 text-xs text-ink-muted">Across {ws.allocated.filter((b) => b.commitment?.status === 'delivered').length} batches</p>
        </ContentCard>
        <ContentCard className="p-5">
          <StatCard label="Traceability coverage" value={`${ws.totals.traceability.pct}%`} accent />
          <div className="mt-3 h-1.5 rounded-full bg-canvas-sunk" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-forest-accent" style={{ width: `${ws.totals.traceability.pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {formatKg(ws.totals.traceability.tracedKg)} of {formatKg(ws.totals.traceability.visibleKg)} verified source to batch
          </p>
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          title="Recent batches"
          description="Yours and those on offer, newest first. The dots are the six journey stages."
          action={<ActionButton to={path('batches')}>All batches</ActionButton>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ws.batches.slice(0, 3).map((batch) => (
            <BatchCard key={batch.traceId} batch={batch} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading title="Quality trend" description="Fine leaf at the weigh-in, across the centres your tea comes from." />
          <PerformanceChart
            label="Fine leaf count (intake-weighted)"
            unit="%"
            scaleMax={100}
            series={fineLeafTrend(sourceCentres)}
            methodology="Share of two-leaves-and-a-bud in intake samples, weighted by green leaf received each month. A measured value, not a grade."
          />
        </div>
        <div>
          <SectionHeading title="Source zones" />
          <ContentCard className="p-5">
            <VolumeBars rows={zones.map(([zone, value]) => ({ key: zone, label: zone, value }))} />
            <p className="mt-4 text-xs text-ink-faint">Made tea visible to you (yours and available)</p>
          </ContentCard>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="Outstanding documents" action={<ActionButton to={path('compliance')}>Compliance</ActionButton>} />
          <ContentCard>
            {outstanding.length ? (
              <ul className="divide-y divide-line">
                {outstanding.map((document) => (
                  <li key={document.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-compact font-medium text-ink">{document.title}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">{document.issuer}</p>
                    </div>
                    <DocumentStatusBadge status={document.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-compact text-ink-muted">Nothing outstanding for your role.</p>
            )}
          </ContentCard>
        </div>
        <div>
          <SectionHeading title="Verified conservation connection" action={<ActionButton to={path('origin')}>Origin & impact</ActionButton>} />
          <ContentCard className="p-5">
            <p className="text-sm text-ink">{ws.conservation.programme.name}</p>
            <dl className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-label text-ink-faint">Your tea connected</dt>
                <dd className="text-xl font-bold tabular-nums text-ink">{formatKg(ws.conservation.connection.connectedKg)}</dd>
              </div>
              <div>
                <dt className="text-label text-ink-faint">Verified activities</dt>
                <dd className="text-xl font-bold tabular-nums text-ink">{ws.conservation.verifiedActivities.length}</dd>
              </div>
              <div>
                <dt className="text-label text-ink-faint">Evidence records</dt>
                <dd className="text-xl font-bold tabular-nums text-ink">{ws.conservation.evidence.length}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              {ws.conservation.connection.connectedKg > 0
                ? `From ${ws.conservation.connection.connectedCentreIds.length} source centre${ws.conservation.connection.connectedCentreIds.length === 1 ? '' : 's'} whose catchment overlaps buffer segments with verified planting or protection work.`
                : `None of your sourced tea comes from a centre linked to verified conservation work yet. ${ws.conservation.connectedAvailable.length} available lot${ws.conservation.connectedAvailable.length === 1 ? ' does' : 's do'}.`}
            </p>
          </ContentCard>
        </div>
      </section>
    </div>
  )
}
