import { Panel, StatTile, BarMeter, Sparkline } from '../DashboardKit'
import { FAIR_PAY } from '../../../lib/dashboardData'

const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export default function FairPayModule() {
  const { premiumBreakdown, totalPremiumKesPerKg, regionalParity, demographics, monthlyPremiumKesM } =
    FAIR_PAY
  const premiumParts = premiumBreakdown.filter((row) => !row.base)
  const maxParityRate = Math.max(...regionalParity.map((r) => r.premiumKesPerKg))

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl text-emerald-950 sm:text-3xl">Fair Pay &amp; Plucker Telemetry</h2>
        <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
          What reaches the picker, above the Mombasa auction clearing price of KES{' '}
          {FAIR_PAY.auctionBaselineKesPerKg}/kg.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Total premium"
          value={`+${totalPremiumKesPerKg}`}
          unit="KES / kg above auction"
          tone="positive"
        />
        <StatTile label="Distributed YTD" value="KES 18.4M" unit="direct to pluckers" />
        <StatTile
          label="Women pluckers"
          value={`${demographics[0].value}%`}
          unit="of the supported network"
          tone="positive"
        />
        <StatTile
          label="Same-week pay"
          value={`${demographics[3].value}%`}
          unit="of settlements"
          tone="positive"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Direct premium breakdown" lede="Each component stacked above the auction baseline.">
          <div className="space-y-3">
            {premiumParts.map((row) => (
              <BarMeter
                key={row.label}
                label={row.label}
                value={row.kes}
                max={totalPremiumKesPerKg}
                display={`+${row.kes} KES/kg`}
                tone="emerald"
              />
            ))}
          </div>
          <div className="mt-4 flex items-baseline gap-2 border-t border-line pt-3">
            <span className="font-display text-3xl tabular-nums text-emerald-700">
              +{totalPremiumKesPerKg}
            </span>
            <span className="font-mono text-[11px] text-ink-muted">KES / kg total uplift</span>
          </div>
        </Panel>

        <Panel title="Regional parity monitor" lede="Western belt vs. eastern belt — pay rate, settlement speed, coverage.">
          <div className="space-y-4">
            {regionalParity.map((region) => (
              <div key={region.belt} className="rounded-lg border border-line bg-paper-sunk p-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] font-medium text-ink">{region.belt}</p>
                  <p className="font-mono text-[11px] text-ink-faint">{region.blocks}</p>
                </div>
                <div className="mt-2 space-y-2">
                  <BarMeter
                    label="Premium"
                    value={region.premiumKesPerKg}
                    max={maxParityRate}
                    display={`+${region.premiumKesPerKg} KES/kg`}
                    tone="emerald"
                  />
                  <BarMeter
                    label="Coverage"
                    value={region.coveragePct}
                    max={100}
                    display={`${region.coveragePct}%`}
                    tone="river"
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  Median settlement · {region.settlementDays} days
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Demographic impact" lede="Share of the supported plucker network.">
          <div className="space-y-3">
            {demographics.map((row) => (
              <BarMeter
                key={row.label}
                label={row.label}
                value={row.value}
                max={100}
                display={`${row.value}%`}
                tone="emerald"
              />
            ))}
          </div>
        </Panel>

        <Panel title="Premium distributed" lede="KES millions paid directly to pluckers, by month.">
          <Sparkline values={monthlyPremiumKesM} />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
            {MONTHS.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-ink-muted">
            KES {monthlyPremiumKesM.at(-1)}M in the current month, up from KES{' '}
            {monthlyPremiumKesM[0]}M in February.
          </p>
        </Panel>
      </div>
    </div>
  )
}
