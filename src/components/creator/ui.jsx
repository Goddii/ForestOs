import { Lock } from 'lucide-react'
import Badge from '../investor/ui/Badge'
import { CAMPAIGN_STATUS_LABELS, EXPERIENCE_STATUS_LABELS } from '../../data/creator/campaigns'

// Small shared pieces for the Creative Partner Portal. Headings use the
// public site's display serif so the portal reads as a campaign workspace,
// not a data console; numbers and codes stay in the UI sans with tabular
// figures.

const STATUS_TONE = { live: 'live', published: 'live', preview: 'neutral', in_review: 'warning', draft: 'neutral' }

/** @param {{ status: string }} props */
export function StatusBadge({ status }) {
  const label = CAMPAIGN_STATUS_LABELS[status] ?? EXPERIENCE_STATUS_LABELS[status] ?? status
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{label}</Badge>
}

const CODE_STATES = {
  live: { label: 'Live', tone: 'live' },
  proof: { label: 'Proof', tone: 'neutral' },
  scheduled: { label: 'Scheduled', tone: 'neutral' },
  blocked: { label: 'Awaiting verification', tone: 'warning' },
}

/** The state of one per-batch pack code (lib/creator/experience.js packCodeState). */
export function CodeStateBadge({ state }) {
  const { label, tone } = CODE_STATES[state]
  return <Badge tone={tone}>{label}</Badge>
}

/** @param {{ title: string, lede?: string, actions?: import('react').ReactNode }} props */
export function PageHeader({ title, lede, actions }) {
  return (
    <header className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl leading-[1.05] text-ink text-balance sm:text-5xl">{title}</h1>
        {lede && <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-ink-muted">{lede}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

/** @param {{ children: import('react').ReactNode, className?: string }} props */
export function SectionTitle({ children, className = '' }) {
  return <h2 className={`font-display text-2xl leading-tight text-ink sm:text-3xl ${className}`}>{children}</h2>
}

/**
 * A figure with its label; no card around it. `note` is for honesty
 * qualifiers ("estimate", "demo data").
 *
 * @param {{ value: string | number, label: string, note?: string }} props
 */
export function Figure({ value, label, note }) {
  return (
    <div>
      <p className="text-3xl font-semibold tabular-nums tracking-tight text-ink">{typeof value === 'number' ? value.toLocaleString('en-GB') : value}</p>
      <p className="mt-1 text-compact text-ink-muted">{label}</p>
      {note && <p className="text-compact text-ink-faint">{note}</p>}
    </div>
  )
}

/** Marks something a creator cannot change. */
export function LockedTag({ children = 'Verified by ForestOS, locked' }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-compact font-semibold text-forest-accent-dark">
      <Lock className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
      {children}
    </span>
  )
}

export const formatDate = (iso) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Not yet'
