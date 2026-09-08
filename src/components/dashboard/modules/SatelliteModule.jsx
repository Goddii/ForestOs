import { AlertTriangle } from 'lucide-react'
import { Panel, StatTile, Sparkline } from '../DashboardKit'
import SectorFocusView from '../sector/SectorFocusView'
import { SATELLITE } from '../../../lib/dashboardData'

export default function SatelliteModule() {
  const { ndvi, carbon, water, encroachmentAlerts } = SATELLITE
  const ndviDelta = (ndvi.current - ndvi.baseline).toFixed(2)

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl text-emerald-950 sm:text-3xl">ESG &amp; Environmental Satellite Analytics</h2>
        <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
          Belt-wide vegetation health, carbon and water metrics from Sentinel-2 and modelled catchments.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="NDVI health index"
          value={ndvi.current}
          tone="positive"
          delta={{ label: `+${ndviDelta} vs baseline`, dir: 'up' }}
          trend={ndvi.series}
        />
        <StatTile label="Carbon sink" value={`${(carbon.sinkTonnesCo2 / 1000).toFixed(0)}k`} unit="tCO₂e stored" />
        <StatTile label="Per hectare" value={carbon.perHectareTonnes} unit="tCO₂e / ha" />
        <StatTile
          label="Catchment yield"
          value={`+${water.changePct}%`}
          unit={`${water.catchmentYieldMcm} MCM / yr`}
          tone="positive"
        />
      </div>

      <SectorFocusView variant="ndvi" />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="NDVI Vegetation Health Index" lede="Quarterly mean across the belt covenant area.">
          <Sparkline values={ndvi.series} />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
            {ndvi.quarters.map((quarter) => (
              <span key={quarter}>{quarter}</span>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-ink-muted">
            Index at {ndvi.current}, recovered from a {ndvi.baseline} baseline — canopy is greening
            year on year.
          </p>
        </Panel>

        <Panel title="Carbon &amp; water" lede="Estimated ecosystem service value of the protected belt.">
          <dl className="space-y-4 text-[13px]">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Estimated carbon sink capacity
              </dt>
              <dd className="mt-1 font-display text-2xl tabular-nums text-ink">
                {carbon.sinkTonnesCo2.toLocaleString()} tCO₂e
              </dd>
              <dd className="text-[12px] text-ink-muted">{carbon.note}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                Water catchment yield
              </dt>
              <dd className="mt-1 font-display text-2xl tabular-nums text-ink">
                {water.catchmentYieldMcm.toLocaleString()} MCM / yr
              </dd>
              <dd className="text-[12px] text-ink-muted">{water.note}</dd>
            </div>
          </dl>
        </Panel>
      </div>

      <Panel
        title="Encroachment alerts"
        lede="Real-time flags for detected clearing within 500 m of the protected boundary."
      >
        <ul className="divide-y divide-line">
          {encroachmentAlerts.map((alert) => {
            const open = alert.status !== 'Resolved — replanted'
            return (
              <li key={alert.id} className="flex flex-wrap items-start gap-3 py-3 first:pt-0 last:pb-0">
                <AlertTriangle
                  className={'mt-0.5 h-4 w-4 shrink-0 ' + (open ? 'text-amber-700' : 'text-ink-faint')}
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-ink">
                    {alert.block}
                    <span className="ml-2 font-mono text-[11px] text-amber-700">
                      {alert.distanceM} m from boundary
                    </span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                    {alert.id} · {alert.detected} · {alert.areaHa} ha
                  </p>
                </div>
                <span
                  className={
                    'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ' +
                    (open
                      ? 'border-amber-700/30 bg-amber-500/[0.10] text-amber-700'
                      : 'border-emerald-600/30 bg-emerald-600/[0.10] text-emerald-700')
                  }
                >
                  {alert.status}
                </span>
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}
