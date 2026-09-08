import { useState } from 'react'
import { FileDown, FileSpreadsheet, Check } from 'lucide-react'
import { ModuleHeader, Panel, StatTile, DataTable } from '../../DashboardKit'
import { BUYER, buyerEsgReport } from '../../../../lib/dashboard/buyer'
import { downloadEsgReportPdf, downloadEsgReportCsv } from '../../../../lib/esgReport'

const COLUMNS = [
  { key: 'block', label: 'Source block', sortAccessor: (r) => r.block },
  { key: 'hectares', label: 'Hectares protected', align: 'right', mono: true, sortAccessor: (r) => r.hectares },
  { key: 'carbonTonnesCo2', label: 'Carbon stored (tCO₂e)', align: 'right', mono: true, sortAccessor: (r) => r.carbonTonnesCo2 },
  { key: 'verification', label: 'Verification', align: 'right', sortAccessor: (r) => r.verification },
]

export default function EsgReportExportModule() {
  const report = buyerEsgReport()
  const [saved, setSaved] = useState(null)

  const download = (kind) => {
    if (kind === 'pdf') downloadEsgReportPdf(report)
    else downloadEsgReportCsv(report)
    setSaved(kind)
  }

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="ESG Report Export"
        sub={`${BUYER.name} · ${report.period} · ${report.batchCount} direct-sold batches · auction volume excluded`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Hectares protected" value={`${report.hectaresProtected} ha`} unit="under buffer covenant" tone="positive" />
        <StatTile
          label="Carbon stored"
          value={report.carbonTonnesCo2.toLocaleString()}
          unit="tCO₂e attributed"
          tone="positive"
        />
        <StatTile
          label="Verification status"
          value={report.verification.status}
          unit={report.verification.standard}
          tone={report.verification.status === 'Verified' ? 'positive' : 'warn'}
        />
      </div>

      <Panel
        title="Report contents"
        lede="Hectares protected, carbon stored and verification status, broken out by the blocks your direct-sold volume draws from."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => download('pdf')}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              <FileDown className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => download('csv')}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              Download CSV
            </button>
          </div>
        }
      >
        <DataTable
          columns={COLUMNS}
          rows={report.lines}
          sortable
          renderCell={(key, row) => {
            if (key === 'hectares') return `${row.hectares} ha`
            if (key === 'carbonTonnesCo2') return row.carbonTonnesCo2.toLocaleString()
            return row[key]
          }}
        />
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-4 font-mono text-[11px] sm:grid-cols-4">
          <div>
            <dt className="text-ink-faint">Made tea sourced</dt>
            <dd className="mt-0.5 tabular-nums text-ink">{report.volumeKg.toLocaleString()} kg</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Buffer zones</dt>
            <dd className="mt-0.5 text-ink">{report.bufferZones.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Field check</dt>
            <dd className="mt-0.5 text-ink">{report.verification.field}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Satellite check</dt>
            <dd className="mt-0.5 text-ink">{report.verification.satellite}</dd>
          </div>
        </dl>
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint" aria-live="polite">
          {saved ? (
            <>
              <Check className="h-3 w-3 text-emerald-700" strokeWidth={2.5} aria-hidden="true" />
              {saved.toUpperCase()} generated in your browser · illustrative mock data, not an audited disclosure.
            </>
          ) : (
            'Prototype export · generated client-side, no backend.'
          )}
        </p>
      </Panel>
    </div>
  )
}
