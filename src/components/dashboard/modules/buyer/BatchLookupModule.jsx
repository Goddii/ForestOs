import { useMemo, useState } from 'react'
import { Search, Download, FileJson, FileText } from 'lucide-react'
import { ModuleHeader, Panel } from '../../DashboardKit'
import BatchProvenanceChain from '../../../batch/BatchProvenanceChain'
import SectorFocusView from '../../sector/SectorFocusView'
import { brandedBatches, findBatchRecord, redactBatchRecord, toLegacyBatch } from '../../../../lib/batchChain'
import { plotsToGeoJSON, plotToAuditCert, downloadJSON, downloadCert } from '../../../../lib/geojson'
import { downloadConservationPassport } from '../../../../lib/passportPdf'
import { SECTOR } from '../../../../lib/dashboardData'

const BASELINE_DATE = '2020-12-31'

/** Adapt a canonical chain plot to the shape the GeoJSON / cert helpers expect. */
function batchToPlot(record) {
  const { plot } = record
  return {
    id: plot.id,
    centre: plot.centre,
    lat: plot.lat,
    lon: plot.lon,
    hectares: plot.areaHa,
    canopy2020: plot.canopyBaseline2020Pct,
    canopyNow: plot.canopyNowPct,
    loss: Math.max(0, plot.canopyBaseline2020Pct - plot.canopyNowPct),
    status: 'clear',
    ndvi: plot.ndvi,
  }
}

export default function BatchLookupModule() {
  const branded = useMemo(() => brandedBatches(), [])
  const [activeId, setActiveId] = useState(branded[0].id)
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)

  const record = branded.find((b) => b.id === activeId) ?? branded[0]
  const view = redactBatchRecord(record, 'buyer')

  const handleSearch = (event) => {
    event.preventDefault()
    const hit = findBatchRecord(query)
    if (!hit) {
      setError(`No batch matches “${query.trim()}”.`)
      return
    }
    if (hit.channel !== 'direct') {
      setError(`Batch #${hit.id} is auction-pool volume — not a direct-sold batch, so it has no branded provenance chain.`)
      return
    }
    setError(null)
    setActiveId(hit.id)
    setQuery('')
  }

  const evidence = [
    {
      label: 'Plot GeoJSON',
      Icon: FileJson,
      onClick: () =>
        downloadJSON(
          plotsToGeoJSON([batchToPlot(record)], { baselineDate: BASELINE_DATE }),
          `ForestOS-${record.plot.id}-plot.geojson`,
        ),
    },
    {
      label: 'EUDR audit certificate',
      Icon: FileText,
      onClick: () =>
        downloadCert(
          plotToAuditCert(batchToPlot(record), { sector: SECTOR, baselineDate: BASELINE_DATE }),
          `ForestOS-${record.plot.id}-audit-cert.json`,
        ),
    },
    {
      label: 'Conservation passport (PDF)',
      Icon: Download,
      onClick: () => downloadConservationPassport(toLegacyBatch(record)),
    },
  ]

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Batch Lookup"
        sub={`Direct-sold batches only · ${branded.length} branded batches · auction volume excluded`}
      />

      <Panel
        title="Find a batch"
        lede="Search by batch ID, or pick from your direct-sold batches. Auction-pool volume is not tracked to a chain."
      >
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <label htmlFor="batch-q" className="sr-only">
            Batch ID
          </label>
          <div className="relative min-w-[200px] flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              id="batch-q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 802"
              className="w-full rounded-md border border-line bg-card py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus-visible:border-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
          >
            Look up
          </button>
        </form>
        {error && (
          <p className="mt-2.5 rounded-md border border-amber-700/30 bg-amber-500/[0.10] px-3 py-2 text-[12px] text-amber-700" role="alert">
            {error}
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {branded.map((b) => {
            const active = b.id === record.id
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(b.id)
                    setError(null)
                  }}
                  aria-pressed={active}
                  className={
                    'rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors ' +
                    (active
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-line bg-card text-ink-muted hover:border-line-strong hover:text-ink')
                  }
                >
                  #{b.id}
                </button>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel
        title={`Batch #${record.id} · ${record.product}`}
        lede={`${record.brand} · ${record.season} · ${record.volumeKg.toLocaleString()} kg made tea, direct-sold.`}
        actions={
          <div className="flex flex-wrap gap-2">
            {evidence.map(({ label, Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        }
      >
        <BatchProvenanceChain view={view} />
      </Panel>

      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Satellite cross-check · same map as Satellite Recovery
        </p>
        <SectorFocusView variant="ndvi" />
      </div>
    </div>
  )
}
