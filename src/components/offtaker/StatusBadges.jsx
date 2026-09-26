import { AlertTriangle, Ban, CheckCircle2, CircleDashed, Clock, FileClock, FileWarning, FileX, ShieldCheck, ShoppingCart, Store, XCircle } from 'lucide-react'
import Badge from '../investor/ui/Badge'
import { STAGE_STATUS_LABELS } from '../../lib/offtaker/journey'
import { DOCUMENT_STATUS_LABELS } from '../../lib/offtaker/documentStatus'

// Icon + label + fill for every state — never colour alone.
const STAGE = {
  verified: { icon: CheckCircle2, tone: 'verified' },
  pending: { icon: Clock, tone: 'warning' },
  flagged: { icon: AlertTriangle, tone: 'danger' },
  not_recorded: { icon: CircleDashed, tone: 'neutral' },
  open: { icon: Store, tone: 'neutral' },
}

/** @param {{ status: keyof typeof STAGE_STATUS_LABELS, className?: string }} props */
export function StageStatusBadge({ status, className = '' }) {
  const config = STAGE[status] ?? STAGE.not_recorded
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {STAGE_STATUS_LABELS[status]}
    </Badge>
  )
}

const DOCUMENT = {
  valid: { icon: ShieldCheck, tone: 'verified' },
  expiring: { icon: FileClock, tone: 'warning' },
  expired: { icon: FileX, tone: 'danger' },
  pending: { icon: Clock, tone: 'warning' },
  rejected: { icon: XCircle, tone: 'danger' },
  withdrawn: { icon: Ban, tone: 'neutral' },
}

/** @param {{ status: keyof typeof DOCUMENT_STATUS_LABELS, className?: string }} props */
export function DocumentStatusBadge({ status, className = '' }) {
  const config = DOCUMENT[status] ?? { icon: FileWarning, tone: 'neutral' }
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {DOCUMENT_STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

/** @param {{ access: 'allocated' | 'available' }} props */
export function AccessBadge({ access }) {
  return access === 'allocated' ? (
    <Badge tone="live" icon={ShoppingCart}>
      Yours
    </Badge>
  ) : (
    <Badge tone="neutral" icon={Store}>
      Available
    </Badge>
  )
}

const CLAIM = {
  verified: { label: 'Verified', icon: CheckCircle2, tone: 'verified' },
  reported: { label: 'Reported, not verified', icon: Clock, tone: 'warning' },
  method_pending: { label: 'Method pending', icon: CircleDashed, tone: 'neutral' },
  unsupported: { label: 'No evidence linked', icon: AlertTriangle, tone: 'danger' },
}

/** @param {{ basis: keyof typeof CLAIM }} props */
export function ClaimBasisBadge({ basis }) {
  const config = CLAIM[basis]
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {config.label}
    </Badge>
  )
}
