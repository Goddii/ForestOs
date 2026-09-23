import { CAPITAL_POSITION, DEPLOYMENT_TREND, INVESTOR_PROJECT, CORE_OUTCOMES } from '../../data/investor'
import ContentCard from './ui/ContentCard'
import StatCard from './ui/StatCard'
import Sparkline from './ui/Sparkline'

/**
 * The overview hero (design-review brief §5/§6/§7): project identity,
 * capital position, and a bridge straight into the landscape it funds. The
 * identity block stays directly on the page canvas (it reads as the page's
 * title, not a stat), but the capital figures move into a `ContentCard` —
 * the previous pass left them floating on raw canvas, which is exactly the
 * "printed report" flatness the visual-affordance brief calls out.
 */
export default function OverviewHero() {
  const { committed, deployed, currency } = CAPITAL_POSITION
  const remaining = committed - deployed
  const deploymentPct = Math.round((deployed / committed) * 100)
  const bridgeMetrics = CORE_OUTCOMES.filter((m) =>
    ['landscape', 'conservation', 'participation'].includes(m.id),
  )

  return (
    <section>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        {INVESTOR_PROJECT.region} · {INVESTOR_PROJECT.reportingPeriod}
      </p>
      <h1 className="mt-2 font-display text-5xl leading-[0.98] text-ink sm:text-6xl">
        {INVESTOR_PROJECT.name}
      </h1>
      <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-forest-accent">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-forest-accent/50 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-accent" />
        </span>
        Active conservation programme
      </p>
      <p className="mt-4 max-w-[58ch] text-[14px] leading-relaxed text-ink-muted">
        A verified conservation and agricultural landscape programme connecting capital
        deployment with field activity, landscape monitoring and evidence.
      </p>

      <ContentCard className="mt-8 grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            {currency} · Capital position
          </p>
          <div className="mt-4 grid grid-cols-3 gap-8 sm:max-w-xl">
            <StatCard size="xl" label="Committed" value={committed / 1_000_000} unit="M" duration={1.6} />
            <StatCard size="xl" label="Deployed" value={deployed / 1_000_000} unit="M" accent duration={1.6}>
              <Sparkline series={DEPLOYMENT_TREND} className="mt-2 text-forest-accent/70" />
            </StatCard>
            <StatCard size="xl" label="Remaining" value={remaining / 1_000_000} unit="M" duration={1.6} />
          </div>
          <div className="mt-6 max-w-xl">
            <div className="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              <span>Deployed</span>
              <span className="tabular-nums text-forest-accent">{deploymentPct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
              <div className="h-full rounded-full bg-forest-accent" style={{ width: `${deploymentPct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          {bridgeMetrics.map((metric) => (
            <StatCard
              key={metric.id}
              size="sm"
              label={metric.label}
              value={metric.value}
              unit={metric.unit}
              separator=","
              duration={1.2}
              className="flex items-baseline gap-2"
            />
          ))}
        </div>
      </ContentCard>
    </section>
  )
}
