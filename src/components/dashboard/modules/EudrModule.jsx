import { useState } from 'react'
import { Download } from 'lucide-react'
import { StatTile } from '../DashboardKit'
import SectorFocusView from '../sector/SectorFocusView'
import { EUDR } from '../../../lib/dashboardData'
import { plotsToGeoJSON, downloadJSON } from '../../../lib/geojson'

export default function EudrModule() {
  const [exported, setExported] = useState(false)

  const handleExport = () => {
    downloadJSON(
      plotsToGeoJSON(EUDR.plots, { baselineDate: EUDR.baselineDate }),
      'ForestOS-EUDR-plot-audit.geojson',
    )
    setExported(true)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-emerald-950 sm:text-3xl">EUDR &amp; Plot Compliance Suite</h2>
          <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
            Every sourced plot geolocated and audited against the{' '}
            <span className="font-mono text-[13px] text-ink">{EUDR.baselineDate}</span> EUDR forest
            baseline.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Export full GeoJSON
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Plots audited" value={EUDR.summary.total} unit={`${EUDR.summary.hectares} ha`} />
        <StatTile label="Clear" value={EUDR.summary.clear} tone="positive" />
        <StatTile label="Watch" value={EUDR.summary.watch} tone="warn" />
        <StatTile label="Flagged" value={EUDR.summary.flagged} tone="warn" />
      </div>

      <SectorFocusView variant="eudr" />

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint" aria-live="polite">
        {exported
          ? 'Exported — ForestOS-EUDR-plot-audit.geojson (prototype, schematic polygons).'
          : 'Full GeoJSON export includes every plot polygon with baseline vs current canopy properties.'}
      </p>
    </div>
  )
}
