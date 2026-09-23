import { Download, FolderSearch } from 'lucide-react'
import { INVESTOR_PROJECT } from '../../data/investor'
import Badge from './ui/Badge'
import ActionButton from './ui/ActionButton'

const STATUS_LABEL = {
  active: 'Active',
  onboarding: 'Onboarding',
  closed: 'Closed',
}

/**
 * The top header (visual-system brief §5) — minimal on purpose: page
 * context plus two actions. Project identity now lives in the sidebar
 * (`InvestorNav`), so this doesn't repeat the full location/region block
 * the previous dark-theme header carried. Carries its own small "Demo
 * environment" mark (not just `DemoBadge`'s per-record "Demo data" wording)
 * because the sidebar's own demo notice is desktop-only (`hidden lg:block`)
 * — the header stays visible at every breakpoint, so the notice needs to
 * live here too to actually satisfy "keep it visible" (brief §27).
 */
export default function InvestorHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-card px-6 py-4 shadow-[0_1px_0_0_rgba(20,32,25,0.03)] sm:px-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="font-sans text-[15px] font-bold leading-tight text-ink">{INVESTOR_PROJECT.name}</p>
        <span className="text-line-strong">·</span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-forest-accent/50 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-accent" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-accent">
            {STATUS_LABEL[INVESTOR_PROJECT.status]}
          </span>
        </div>
        <span className="text-line-strong">·</span>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          {INVESTOR_PROJECT.reportingPeriod}
        </p>
        <span className="text-line-strong">·</span>
        <Badge tone="warning">Demo environment</Badge>
      </div>

      <div className="flex items-center gap-2">
        <ActionButton to="/investor/reports" variant="ghost" icon={Download} iconPosition="left">
          Export report
        </ActionButton>
        <ActionButton to="/investor/evidence" variant="primary" icon={FolderSearch} iconPosition="left">
          Evidence centre
        </ActionButton>
      </div>
    </header>
  )
}
