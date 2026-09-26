import ContentCard from '../../investor/ui/ContentCard'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import VerificationStateBadge from '../../investor/VerificationStateBadge'
import EmptyState from '../../investor/EmptyState'
import { useEvidenceDrawer } from '../../investor/EvidenceDrawerContext'
import { LAND_USE_LABELS, TENURE_LABELS } from '../../../data/funder/geography'
import { currentState, latestDecision } from '../../../lib/programme/verificationState'
import { formatKg } from '../../../lib/offtaker/format'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DataTable from '../DataTable'
import ClaimLedger from '../ClaimLedger'
import BatchCard from '../BatchCard'

/**
 * "Verified origin & impact" — deliberately not an ESG dashboard. It answers
 * one buyer question: what can I truthfully say about where this tea comes
 * from and the conservation behind it? The programme's own verified records
 * (the same ones the funder workspace reads) are the only source.
 */
export default function OriginPage() {
  const ws = useOfftaker()
  const { openEvidence, openZone } = useEvidenceDrawer()
  const c = ws.conservation
  const { connectedKg, allocatedKg } = c.connection

  return (
    <div className="space-y-12">
      <PageHeader
        title="Verified origin & impact"
        description="Where your tea is grown, the conservation programme connected to it, and which statements about it are verified. Only verified records count; everything else is labelled for what it is."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <ContentCard className="p-6 lg:col-span-2">
          <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">Origin</p>
          <p className="mt-2 text-lg font-bold leading-snug text-ink">
            Nyayo Tea Zone buffer belt: tea grown on the ~100 m strip that separates farmland from Kenya’s gazetted forests.
          </p>
          <p className="mt-3 text-compact leading-relaxed text-ink-muted">
            Your supply comes from {c.sourceCentres.map((centre) => `${centre.name} (${centre.zone})`).join(', ') || 'no centres yet'}.
            Each batch’s plot has a field check and a satellite check against the 2020 forest baseline.
          </p>
        </ContentCard>
        <ContentCard className="p-6">
          <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">Connected to verified work</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-ink">{formatKg(connectedKg)}</p>
          <p className="mt-1 text-compact text-ink-muted">of {formatKg(allocatedKg)} sourced by you</p>
          <div className="mt-3 h-1.5 rounded-full bg-canvas-sunk" aria-hidden="true">
            <div className="h-1.5 rounded-full bg-forest-accent" style={{ width: `${allocatedKg ? (connectedKg / allocatedKg) * 100 : 0}%` }} />
          </div>
        </ContentCard>
      </section>

      <section>
        <SectionHeading title="Conservation programme" />
        <ContentCard className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{c.programme.name}</p>
              <p className="mt-1 text-xs text-ink-muted">
                Run by NTZDC, {c.programme.startDate} to {c.programme.endDate}
              </p>
            </div>
            <Badge tone="live">Active</Badge>
          </div>
          <p className="mt-3 max-w-[75ch] text-compact leading-relaxed text-ink-muted">{c.programme.goal}</p>
          <p className="mt-3 text-xs text-ink-faint">
            Your tea is connected to this programme only where its collection centre’s catchment overlaps a buffer segment with verified work.
          </p>
        </ContentCard>
      </section>

      {c.segments.length === 0 ? (
        <section className="space-y-6">
          <EmptyState message="None of your sourced tea comes from a collection centre linked to the buffer programme yet. Nothing is claimed on its behalf." />
          {c.connectedAvailable.length > 0 && (
            <div>
              <SectionHeading title="Available lots with a verified conservation link" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {c.connectedAvailable.map((batch) => (
                  <BatchCard key={batch.traceId} batch={batch} />
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <section>
            <SectionHeading
              title="Verified landscape"
              description="The buffer segments your source centres overlap. Geometry is demo data digitised for the prototype, not a surveyed boundary."
            />
            <DataTable
              caption="Linked buffer segments"
              rows={c.segments}
              rowKey={(segment) => segment.id}
              minWidth="44rem"
              columns={[
                { key: 'label', header: 'Segment', cell: (s) => <span className="font-medium text-ink">{s.label}</span> },
                { key: 'length', header: 'Length', align: 'right', cell: (s) => `${s.lengthKm.toFixed(1)} km` },
                { key: 'area', header: 'Buffer area', align: 'right', cell: (s) => `${s.areaHa.toFixed(1)} ha` },
                { key: 'tenure', header: 'Tenure', cell: (s) => <span className="text-ink-muted">{TENURE_LABELS[s.tenure]}</span> },
                { key: 'use', header: 'Land use', cell: (s) => <span className="text-ink-muted">{LAND_USE_LABELS[s.landUse]}</span> },
              ]}
            />
            {c.zones.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {c.zones.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => openZone(zone.id)}
                    className="rounded-full border border-line px-3 py-1 text-xs text-forest-accent hover:border-forest-accent/40 hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeading
              title="Conservation activities"
              description={`Planting and protection work in those segments. ${c.rejectedCount ? `${c.rejectedCount} claim was rejected at review and is not counted.` : ''}`}
            />
            <DataTable
              caption="Conservation activities in linked segments"
              rows={c.activities}
              rowKey={(activity) => activity.id}
              minWidth="56rem"
              columns={[
                { key: 'summary', header: 'Activity', cell: (a) => (<><p className="font-medium text-ink">{a.summary}</p><p className="text-xs text-ink-faint">{a.intervention}</p></>) },
                { key: 'date', header: 'Date', cell: (a) => <span className="font-mono text-label tabular-nums text-ink-muted">{a.date}</span> },
                { key: 'state', header: 'Verification', cell: (a) => <VerificationStateBadge state={currentState(a.verification)} /> },
                {
                  key: 'by',
                  header: 'Verified by',
                  cell: (a) => {
                    const decision = latestDecision(a.verification)
                    return decision ? <span className="text-xs text-ink-muted">{decision.byRole}</span> : <span className="text-xs text-ink-faint">Not yet</span>
                  },
                },
                {
                  key: 'evidence',
                  header: 'Evidence',
                  cell: (a) =>
                    a.evidenceIds.length ? (
                      <div className="flex flex-wrap gap-1">
                        {a.evidenceIds.map((id) => (
                          <button key={id} type="button" onClick={() => openEvidence(id)} className="rounded-full border border-line px-2 py-0.5 font-mono text-label text-forest-accent hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
                            {id}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-ink-faint">None</span>
                    ),
                },
              ]}
            />
          </section>
        </>
      )}

      <section>
        <SectionHeading
          title="What you can say, and what you can’t yet"
          description="Every origin and impact statement in circulation about your tea, sorted by what it rests on. Open the evidence before repeating a verified claim."
        />
        <ClaimLedger claims={c.claims} />
      </section>
    </div>
  )
}
