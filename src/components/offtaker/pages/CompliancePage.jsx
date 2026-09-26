import ContentCard from '../../investor/ui/ContentCard'
import SectionHeading from '../../investor/SectionHeading'
import { DOCUMENT_STATUS_LABELS, EXPIRY_NOTICE_DAYS } from '../../../lib/offtaker/documentStatus'
import { formatCoords } from '../../../lib/offtaker/access'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DocumentTable from '../DocumentTable'
import DataTable from '../DataTable'
import RestrictedNote from '../RestrictedNote'
import { DocumentStatusBadge, StageStatusBadge } from '../StatusBadges'

const STATUS_ORDER = ['valid', 'expiring', 'expired', 'pending', 'rejected', 'withdrawn']

export default function CompliancePage() {
  const ws = useOfftaker()
  const compliance = ws.documents.filter((document) => ['certificate', 'verification_record'].includes(document.kind))
  const required = ws.documents.filter((document) => document.requiredForBuyers && document.scope !== 'batch')

  return (
    <div className="space-y-12">
      <PageHeader
        title="Compliance"
        description={`Certificates, licences and verification records for the factories, zones and batches you source from, filtered to what the ${ws.roleConfig.label} role needs.`}
      />

      <section className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {STATUS_ORDER.map((status) => (
          <ContentCard key={status} className="p-4">
            <p className="text-2xl font-bold tabular-nums text-ink">{ws.totals.documentStatusCounts[status] ?? 0}</p>
            <DocumentStatusBadge status={status} className="mt-2" />
          </ContentCard>
        ))}
      </section>
      <p className="-mt-8 text-xs text-ink-faint">
        {ws.documents.length} documents visible to your role. {ws.withheldDocumentCount} more about your supply are limited to other roles in your organisation.
      </p>

      <section>
        <SectionHeading title="Required for buyers" description="Programme, zone and factory documents a buyer needs in place. Batch documents are on each batch." />
        <ContentCard>
          <ul className="divide-y divide-line">
            {required.map((document) => (
              <li key={document.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{document.title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {document.issuer}, issued {document.issuedDate}
                    {document.expiryDate ? `, expires ${document.expiryDate}` : ''}
                  </p>
                </div>
                <DocumentStatusBadge status={document.status} />
              </li>
            ))}
          </ul>
        </ContentCard>
      </section>

      <section>
        <SectionHeading
          title="Deforestation-free due diligence"
          description="Plot geolocation and the 2020-baseline check for each batch, as needed for a due-diligence statement. The statement itself is filed by the operator placing tea on the market, not by ForestOS."
        />
        {ws.permissions.plotGeolocation ? (
          <DataTable
            caption="Plot geolocation per batch"
            rows={ws.batches}
            rowKey={(batch) => batch.traceId}
            minWidth="56rem"
            columns={[
              { key: 'batch', header: 'Batch', cell: (b) => <span className="font-mono font-semibold text-ink">{b.traceId}</span> },
              { key: 'plot', header: 'Plot', cell: (b) => <span className="font-mono text-label text-ink-muted">{b.record.plot.id}</span> },
              { key: 'coords', header: 'Plot location', cell: (b) => <span className="font-mono text-label tabular-nums text-ink-muted">{formatCoords(b.record.plot.lat, b.record.plot.lon, true)}</span> },
              { key: 'area', header: 'Area', align: 'right', cell: (b) => `${b.record.plot.areaHa} ha` },
              { key: 'baseline', header: 'Baseline', cell: (b) => <span className="font-mono text-label text-ink-muted">{b.record.verification.satellite.baseline}</span> },
              { key: 'status', header: 'Check', cell: (b) => <StageStatusBadge status={b.journey.stages[0].status} /> },
            ]}
          />
        ) : (
          <RestrictedNote permission="plotGeolocation" />
        )}
      </section>

      <section>
        <SectionHeading title="Certificates and verification records" />
        <DocumentTable documents={compliance} />
      </section>

      <p className="text-xs text-ink-faint">
        Status rules: “{DOCUMENT_STATUS_LABELS.expiring}” flags documents within {EXPIRY_NOTICE_DAYS} days of expiry, a portal notice window rather than a regulatory
        requirement. Issuers are placeholders until NTZDC confirms who issues each document.
      </p>
    </div>
  )
}
