import { useWorkspace } from './FunderWorkspaceContext'
import ContentCard from './ui/ContentCard'
import StatCard from './ui/StatCard'
import Sparkline from './ui/Sparkline'
import Badge from './ui/Badge'

/**
 * The overview hero: which programme, who is looking, and that funder's own
 * money position — committed, actually received by NTZDC, and spent. Every
 * figure comes from the funder's agreement and its ledger rows.
 */
export default function OverviewHero() {
  const { programme, org, terms, capital } = useWorkspace()
  const { committed, received, deployed, currency } = capital.position
  const spentOfReceivedPct = received > 0 ? Math.round((deployed / received) * 100) : 0

  return (
    <section>
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">{programme.location}</p>
      <h1 className="mt-2 font-display text-5xl leading-[0.98] text-ink sm:text-6xl">{programme.name}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="text-[14px] text-ink-muted">
          Implemented by Nyayo Tea Zones Development Corporation · viewing as{' '}
          <span className="font-semibold text-ink">{org.name}</span>
        </p>
        {org.isPlaceholder && org.note && <Badge tone="warning">{org.note}</Badge>}
      </div>
      <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-ink-muted">{programme.goal}</p>

      <ContentCard className="mt-8 p-6 sm:p-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          {currency} · {terms.positionTitle}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-8 sm:max-w-xl">
          <StatCard size="xl" label="Committed" value={committed / 1_000_000} unit="M" duration={1.6} />
          <StatCard size="xl" label="Received" value={received / 1_000_000} unit="M" duration={1.6} />
          <StatCard size="xl" label="Spent" value={deployed / 1_000_000} unit="M" accent duration={1.6}>
            <Sparkline series={capital.trend} className="mt-2 text-forest-accent/70" />
          </StatCard>
        </div>
        <div className="mt-6 max-w-xl">
          <div className="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            <span>Spent of received</span>
            <span className="tabular-nums text-forest-accent">{spentOfReceivedPct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas-sunk">
            <div className="h-full rounded-full bg-forest-accent" style={{ width: `${Math.min(100, spentOfReceivedPct)}%` }} />
          </div>
        </div>
      </ContentCard>
    </section>
  )
}
