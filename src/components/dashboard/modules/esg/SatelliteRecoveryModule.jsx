import { ModuleHeader, Panel, StatTile, Sparkline } from '../../DashboardKit'
import SectorFocusView from '../../sector/SectorFocusView'
import { SATELLITE } from '../../../../lib/dashboardData'
import { ESG } from '../../../../lib/dashboard/esg'

export default function SatelliteRecoveryModule() {
  const { recovery } = ESG
  const { ndvi } = SATELLITE
  const delta = (recovery.ndviCurrent - recovery.ndviBaseline).toFixed(2)

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Satellite Recovery"
        sub="Independently verified canopy & carbon recovery in the fund’s covenant area"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="NDVI health index"
          value={recovery.ndviCurrent}
          tone="positive"
          delta={{ label: `+${delta} vs baseline`, dir: 'up' }}
          trend={ndvi.series}
        />
        <StatTile label="Hectares recovered" value={recovery.hectaresRecovered.toLocaleString()} unit="ha canopy regained" tone="positive" />
        <StatTile label="Carbon sink" value={`${(recovery.carbonTonnesCo2 / 1000).toFixed(0)}k`} unit="tCO₂e stored" />
        <StatTile label="MRV cadence" value="Quarterly" unit="Sentinel-2 + SkySat" />
      </div>

      <SectorFocusView variant="ndvi" />

      <Panel title="NDVI recovery curve" lede="Quarterly mean across the covenant area since the fund’s first drawdown.">
        <Sparkline values={ndvi.series} />
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
          {ndvi.quarters.map((q) => (
            <span key={q}>{q}</span>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-ink-muted">{recovery.note}</p>
      </Panel>
    </div>
  )
}
