import { CheckCircle2, Clock, FileEdit, RotateCcw, Send, XCircle } from 'lucide-react'
import Badge from './ui/Badge'
import { STATE_LABELS } from '../../lib/programme/verificationState'

// Icon + label + fill for every state — never color alone.
const CONFIG = {
  draft: { icon: FileEdit, tone: 'neutral' },
  submitted: { icon: Send, tone: 'neutral' },
  under_review: { icon: Clock, tone: 'warning' },
  verified: { icon: CheckCircle2, tone: 'verified' },
  correction_required: { icon: RotateCcw, tone: 'warning' },
  rejected: { icon: XCircle, tone: 'danger' },
}

/**
 * @param {{ state: import('../../lib/contracts/programme').VerificationState, className?: string }} props
 */
export default function VerificationStateBadge({ state, className = '' }) {
  const config = CONFIG[state] ?? CONFIG.draft
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {STATE_LABELS[state] ?? state}
    </Badge>
  )
}
