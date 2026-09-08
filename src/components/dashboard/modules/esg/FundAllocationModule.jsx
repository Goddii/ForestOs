import { ModuleHeader, Panel, StatTile, BulletBar } from '../../DashboardKit'
import { ESG } from '../../../../lib/dashboard/esg'

const USD_M = (n) => `$${(n / 1_000_000).toFixed(1)}M`

export default function FundAllocationModule() {
  const { fund } = ESG
  const deployedPct = Math.round((fund.deployedUsd / fund.committedUsd) * 100)
  const programsMax = Math.max(
    ...fund.programs.map((p) => Math.max(p.deployedUsd, (p.allocationPct / 100) * fund.committedUsd)),
  )

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Fund Allocation"
        sub={`Mau Belt Conservation Fund I · ${fund.vintage} vintage`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Committed" value={USD_M(fund.committedUsd)} unit="LP capital" />
        <StatTile
          label="Deployed"
          value={USD_M(fund.deployedUsd)}
          unit={`${deployedPct}% of commitment`}
          tone="positive"
          share={fund.deployedUsd / fund.committedUsd}
        />
        <StatTile label="Dry powder" value={USD_M(fund.committedUsd - fund.deployedUsd)} unit="undeployed" />
        <StatTile label="Programs" value={fund.programs.length} unit="allocation lines" />
      </div>

      <Panel
        title="Deployed vs. target, by program"
        lede="Bar is capital disbursed; the tick is the program’s target allocation. Amber where deployment lags target."
      >
        <p className="-mt-1 mb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          Fund is {deployedPct}% deployed overall — amber marks a line running behind that pace.
        </p>
        <div className="space-y-4">
          {fund.programs
            .map((p) => ({ ...p, target: (p.allocationPct / 100) * fund.committedUsd }))
            .sort((a, b) => a.deployedUsd / a.target - b.deployedUsd / b.target)
            .map((p) => {
              const ratio = p.deployedUsd / p.target
              return (
                <BulletBar
                  key={p.name}
                  label={p.name}
                  value={p.deployedUsd}
                  target={p.target}
                  behind={ratio < fund.deployedUsd / fund.committedUsd}
                  max={programsMax}
                  display={`${USD_M(p.deployedUsd)} · ${Math.round(ratio * 100)}%`}
                  targetLabel={`Target ${USD_M(p.target)} (${p.allocationPct}%)`}
                />
              )
            })}
        </div>
        <p className="mt-4 flex items-baseline gap-2 border-t border-line pt-3">
          <span className="font-display text-3xl tabular-nums text-emerald-700">{USD_M(fund.deployedUsd)}</span>
          <span className="font-mono text-[11px] text-ink-muted">deployed of {USD_M(fund.committedUsd)} committed</span>
        </p>
      </Panel>
    </div>
  )
}
