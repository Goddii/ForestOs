import ContentCard from '../../investor/ui/ContentCard'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import { getOrganisation } from '../../../data/funder/organisations'
import { formatCount } from '../../../lib/offtaker/access'
import { formatKg } from '../../../lib/offtaker/format'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DataTable from '../DataTable'
import { DocumentStatusBadge } from '../StatusBadges'

/**
 * Who stands behind the tea: NTZDC as the supplier, its factories, and the
 * collection centres and zones the leaf comes from. People appear only as
 * counts (at or above the disclosure floor) — never names or ids.
 */
export default function SourcesPage() {
  const ws = useOfftaker()
  const floor = ws.policy.householdFloor
  const supplier = getOrganisation('org-ntzdc')

  const factories = [...new Set(ws.batches.map((batch) => batch.record.processing.facility))].map((name) => {
    const batches = ws.batches.filter((batch) => batch.record.processing.facility === name)
    const documents = ws.documents.filter((document) => document.scope === 'factory' && document.scopeRef === name)
    return { name, batches, documents, centres: [...new Set(batches.map((batch) => batch.centre?.name))] }
  })

  const centres = ws.centres
    .map((centre) => {
      const batches = ws.batches.filter((batch) => batch.centre?.id === centre.id)
      return {
        ...centre,
        batches,
        farmers: batches.reduce((sum, batch) => sum + batch.record.plot.farmers, 0),
        pluckers: batches.reduce((sum, batch) => sum + batch.record.harvest.pluckers, 0),
      }
    })
    .filter((centre) => centre.batches.length > 0)

  return (
    <div className="space-y-12">
      <PageHeader
        title="Suppliers & sources"
        description="The organisation supplying your tea, the factories that process it and the collection centres it is grown around. Farmers and pluckers appear as counts only."
      />

      <section>
        <SectionHeading title="Supplier" />
        <ContentCard className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xl font-bold text-ink">{supplier.name}</p>
            <p className="mt-1 max-w-[60ch] text-compact leading-relaxed text-ink-muted">
              State corporation that manages the tea-and-trees buffer belt around Kenya’s gazetted forests, runs the collection centres and
              factories, and records every batch’s journey in ForestOS.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">{factories.length} factories in your supply</Badge>
            <Badge tone="neutral">{centres.length} collection centres</Badge>
          </div>
        </ContentCard>
      </section>

      <section>
        <SectionHeading title="Factories" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {factories.map((factory) => (
            <ContentCard key={factory.name} className="p-5">
              <p className="font-semibold text-ink">{factory.name}</p>
              <p className="mt-1 text-xs text-ink-muted">Fed by {factory.centres.join(', ')}</p>
              <p className="mt-3 text-sm tabular-nums text-ink">
                {factory.batches.length} batch{factory.batches.length === 1 ? '' : 'es'}, {formatKg(factory.batches.reduce((s, b) => s + b.madeTeaKg, 0))}
              </p>
              <ul className="mt-4 space-y-2 border-t border-line pt-3">
                {factory.documents.length ? (
                  factory.documents.map((document) => (
                    <li key={document.id} className="flex items-start justify-between gap-2 text-xs">
                      <span className="text-ink-muted">{document.title.split(',')[0]}</span>
                      <DocumentStatusBadge status={document.status} />
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-ink-faint">No factory documents visible to your role.</li>
                )}
              </ul>
            </ContentCard>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Collection centres and zones" />
        <DataTable
          caption="Collection centres in your supply"
          rows={centres}
          rowKey={(centre) => centre.id}
          minWidth="52rem"
          columns={[
            { key: 'centre', header: 'Centre', cell: (c) => <span className="font-medium text-ink">{c.name}</span> },
            { key: 'zone', header: 'Zone', cell: (c) => <span className="text-ink-muted">{c.zone}</span> },
            { key: 'batches', header: 'Batches', align: 'right', cell: (c) => c.batches.length },
            { key: 'volume', header: 'Made tea', align: 'right', cell: (c) => formatKg(c.batches.reduce((s, b) => s + b.madeTeaKg, 0)) },
            { key: 'farmers', header: 'Farmers (count)', align: 'right', cell: (c) => formatCount(c.farmers, floor) },
            { key: 'pluckers', header: 'Pluckers (count)', align: 'right', cell: (c) => formatCount(c.pluckers, floor) },
            {
              key: 'conservation',
              header: 'Conservation link',
              cell: (c) => (c.conservationLinked ? <Badge tone="verified">Verified work</Badge> : <Badge tone="neutral">Not linked yet</Badge>),
            },
          ]}
        />
        <p className="mt-3 text-xs text-ink-faint">
          Counts are summed across the batches you can see; counts below {floor} show as “fewer than {floor}”. Names, ID numbers, phone numbers
          and payments are never shared with buyers.
        </p>
      </section>
    </div>
  )
}
