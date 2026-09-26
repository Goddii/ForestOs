import { useMemo, useState } from 'react'
import { FileSpreadsheet, FileText } from 'lucide-react'
import ContentCard from '../../investor/ui/ContentCard'
import ActionButton from '../../investor/ui/ActionButton'
import SectionHeading from '../../investor/SectionHeading'
import { QUALITY_METRICS } from '../../../data/supply/quality'
import { REPORT_DEFINITIONS, buildReport } from '../../../lib/offtaker/reports'
import { buildPdf, downloadFile, layoutReport, toCsv } from '../../../lib/offtaker/exports'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import DataTable from '../DataTable'

/**
 * Export-ready views. Each report is built from the same scoped workspace
 * the screens use, so a download never holds more than the role can see.
 * Files are generated in the browser and say they are illustrative.
 */
export default function ReportsPage() {
  const ws = useOfftaker()
  const [selected, setSelected] = useState(REPORT_DEFINITIONS[0].id)
  const reports = useMemo(() => Object.fromEntries(REPORT_DEFINITIONS.map(({ id }) => [id, buildReport(id, ws, QUALITY_METRICS)])), [ws])
  const active = reports[selected]
  const fileBase = (id) => `ForestOS-${id}-${ws.org.slug}-${ws.asOf}`

  const exportCsv = (id) => downloadFile(`${fileBase(id)}.csv`, toCsv(reports[id].rows, reports[id].columns), 'text/csv')
  const exportPdf = (id) => downloadFile(`${fileBase(id)}.pdf`, buildPdf(layoutReport(reports[id].pdf)), 'application/pdf')

  return (
    <div className="space-y-10">
      <PageHeader
        title="Reports"
        description={`Export-ready views of your sourcing, traceability, quality, compliance and conservation provenance, prepared for the ${ws.roleConfig.label} role.`}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {REPORT_DEFINITIONS.map((definition) => (
          <ContentCard
            key={definition.id}
            as="article"
            className={`flex flex-col p-5 ${selected === definition.id ? 'ring-2 ring-forest-accent' : ''}`}
          >
            <p className="font-semibold text-ink">{definition.title}</p>
            <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-muted">{definition.description}</p>
            <p className="mt-3 font-mono text-label text-ink-faint">{reports[definition.id].rows.length} rows</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <ActionButton variant={selected === definition.id ? 'primary' : 'ghost'} icon={null} onClick={() => setSelected(definition.id)}>
                Preview
              </ActionButton>
              <ActionButton icon={FileSpreadsheet} iconPosition="left" onClick={() => exportCsv(definition.id)}>
                CSV
              </ActionButton>
              <ActionButton icon={FileText} iconPosition="left" onClick={() => exportPdf(definition.id)}>
                PDF
              </ActionButton>
            </div>
          </ContentCard>
        ))}
      </section>

      <section>
        <SectionHeading title={`Preview: ${active.title}`} description="Exactly the rows the CSV will contain." />
        <DataTable
          caption={active.title}
          rows={active.rows.map((row, index) => ({ ...row, __key: String(index) }))}
          rowKey={(row) => row.__key}
          minWidth={`${Math.max(40, active.columns.length * 9)}rem`}
          columns={active.columns.map((column) => ({
            key: column.key,
            header: column.label,
            cell: (row) => <span className="text-ink-muted">{row[column.key] === '' || row[column.key] == null ? '—' : String(row[column.key])}</span>,
          }))}
        />
      </section>
    </div>
  )
}
