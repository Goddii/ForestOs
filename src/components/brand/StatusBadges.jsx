import {
  Ban,
  CalendarClock,
  CloudSun,
  HandHeart,
  Landmark,
  Mountain,
  Music,
  Trees,
  CheckCircle2,
  CircleDashed,
  Clock,
  FilePen,
  Lock,
  PenLine,
  Pencil,
  Play,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from 'lucide-react'
import Badge from '../investor/ui/Badge'
import { CAMPAIGN_THEMES } from '../../data/brand/campaigns'

export const THEME_ICONS = {
  conservation: Trees,
  landscape: Mountain,
  community: HandHeart,
  cultural_identity: Landmark,
  artists: Music,
  climate_action: CloudSun,
}

/** A campaign's theme, icon and label (a category, not a status, so no fill colour). */
export function CampaignThemeTag({ theme, className = '' }) {
  const Icon = THEME_ICONS[theme] ?? Trees
  return (
    <span className={`inline-flex items-center gap-1.5 text-compact font-medium text-ink-muted ${className}`}>
      <Icon className="h-4 w-4 text-forest-accent" strokeWidth={2} aria-hidden="true" />
      {CAMPAIGN_THEMES[theme]?.label ?? theme}
    </span>
  )
}

// Icon + label + fill for every state, never colour alone (same rule as the
// Offtaker Portal's StatusBadges).

const CLAIM = {
  approved: { label: 'Approved', icon: CheckCircle2, tone: 'verified' },
  reword: { label: 'Use approved wording', icon: PenLine, tone: 'warning' },
  in_review: { label: 'Verification pending', icon: Clock, tone: 'neutral' },
  not_supported: { label: 'Cannot be claimed yet', icon: Ban, tone: 'danger' },
}

/** ForestOS's verdict on a brand claim. */
export function ClaimVerdictBadge({ status, className = '' }) {
  const config = CLAIM[status] ?? CLAIM.in_review
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  )
}

const PRODUCT = {
  on_sale: { label: 'On sale', icon: ShoppingBag, tone: 'live' },
  in_development: { label: 'In development', icon: Wrench, tone: 'neutral' },
  draft: { label: 'Draft', icon: FilePen, tone: 'neutral' },
}

export function ProductStatusBadge({ status, className = '' }) {
  const config = PRODUCT[status] ?? PRODUCT.draft
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  )
}

const EXPERIENCE = {
  published: { label: 'Published', icon: Radio, tone: 'live' },
  draft: { label: 'Draft', icon: FilePen, tone: 'neutral' },
}

export function ExperienceStatusBadge({ status, className = '' }) {
  const config = EXPERIENCE[status] ?? EXPERIENCE.draft
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  )
}

const CAMPAIGN = {
  live: { label: 'Live', icon: Play, tone: 'live' },
  scheduled: { label: 'Scheduled', icon: CalendarClock, tone: 'neutral' },
  draft: { label: 'Draft', icon: FilePen, tone: 'neutral' },
  ended: { label: 'Ended', icon: CircleDashed, tone: 'neutral' },
}

export function CampaignStatusBadge({ status, className = '' }) {
  const config = CAMPAIGN[status] ?? CAMPAIGN.draft
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  )
}

/** A lot's deforestation-free verification, as the batch record states it. */
export function LotVerificationBadge({ status, className = '' }) {
  const verified = status === 'Verified'
  return (
    <Badge tone={verified ? 'verified' : 'warning'} icon={verified ? ShieldCheck : Clock} className={className}>
      {verified ? 'Verified' : 'Verification pending'}
    </Badge>
  )
}

/**
 * Who owns a piece of content — the portal's central distinction. Brand
 * content is the brand's to edit; ForestOS verified data is read-only.
 *
 * @param {{ kind: 'brand' | 'forestos', className?: string }} props
 */
export function SourceTag({ kind, className = '' }) {
  if (kind === 'forestos') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-forest-accent-soft px-1.5 py-0.5 font-sans text-label font-semibold uppercase tracking-label text-forest-accent-dark ${className}`}>
        <Lock className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
        ForestOS verified
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 font-sans text-label font-semibold uppercase tracking-label text-ink-muted ${className}`}>
      <Pencil className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
      Brand content
    </span>
  )
}
