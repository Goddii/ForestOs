import { ModuleHeader, Panel, StatTile, BulletBar } from '../../DashboardKit'
import { ESG } from '../../../../lib/dashboard/esg'

const KES_M = (n) =>
  n >= 1_000_000_000 ? `KES ${(n / 1_000_000_000).toFixed(2)}B` : `KES ${(n / 1_000_000).toFixed(0)}M`

export default function FundAllocationModule() {
  const { fund } = ESG
  const deployedPct = Math.round((fund.deployedKes / fund.committedKes) * 100)
  const programsMax = Math.max(
    ...fund.programs.map((p) => Math.max(p.deployedKes, (p.allocationPct / 100) * fund.committedKes)),
  )

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Fund Allocation"
        sub={`Mau Belt Conservation Fund I · ${fund.vintage} vintage`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Committed" value={KES_M(fund.committedKes)} unit="LP capital" />
        <StatTile
          label="Deployed"
          value={KES_M(fund.deployedKes)}
          unit={`${deployedPct}% of commitment`}
          tone="positive"
          share={fund.deployedKes / fund.committedKes}
        />
        <StatTile label="Dry powder" value={KES_M(fund.committedKes - fund.deployedKes)} unit="undeployed" />
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
            .map((p) => ({ ...p, target: (p.allocationPct / 100) * fund.committedKes }))
            .sort((a, b) => a.deployedKes / a.target - b.deployedKes / b.target)
            .map((p) => {
              const ratio = p.deployedKes / p.target
              return (
                <BulletBar
                  key={p.name}
                  label={p.name}
                  value={p.deployedKes}
                  target={p.target}
                  behind={ratio < fund.deployedKes / fund.committedKes}
                  max={programsMax}
                  display={`${KES_M(p.deployedKes)} · ${Math.round(ratio * 100)}%`}
                  targetLabel={`Target ${KES_M(p.target)} (${p.allocationPct}%)`}
                />
              )
            })}
        </div>
        <p className="mt-4 flex items-baseline gap-2 border-t border-line pt-3">
          <span className="font-display text-3xl tabular-nums text-emerald-700">{KES_M(fund.deployedKes)}</span>
          <span className="font-mono text-[11px] text-ink-muted">deployed of {KES_M(fund.committedKes)} committed</span>
        </p>
      </Panel>
    </div>
  )
}
