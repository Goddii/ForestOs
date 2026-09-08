import { ModuleHeader, Panel, StatTile, BarMeter, Sparkline } from '../../DashboardKit'
import { CREATOR } from '../../../../lib/dashboard/creator'

const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export default function CreatorImpactModule() {
  const { impact } = CREATOR

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Conservation Impact"
        sub="Buffer covenant funded by verified sales of this creator’s editions"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Hectares attributed"
          value={impact.hectaresAttributed}
          unit="in the Kiptunga Block"
          tone="positive"
        />
        <StatTile label="Trees standing" value={`${(impact.treesAttributed / 1000).toFixed(1)}k`} />
        <StatTile
          label="Canopy recovered"
          value={`+${impact.canopyRecoveredPp} pp`}
          tone="positive"
          delta={{ label: 'vs 2020 baseline', dir: 'up' }}
        />
        <StatTile label="Water / edition" value={`${impact.waterLitresPerEdition} L`} unit="catchment yield" />
      </div>

      <Panel title="Cumulative hectares funded" lede="Verified buffer area attributed to this creator, by month.">
        <Sparkline values={impact.cumulativeHa} />
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-ink-muted">{impact.note}</p>
      </Panel>

      <Panel title="Impact per drop" lede="Hectares each edition series has funded to date.">
        <div className="space-y-3">
          {CREATOR.campaigns
            .filter((c) => c.sold > 0)
            .map((c) => {
              const ha = +((c.sold / 431) * 12.6).toFixed(1)
              return (
                <BarMeter key={c.id} label={c.name} value={ha} max={13} display={`${ha} ha`} />
              )
            })}
        </div>
      </Panel>
    </div>
  )
}
