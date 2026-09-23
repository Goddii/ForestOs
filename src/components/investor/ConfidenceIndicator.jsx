import { CheckCircle2, ShieldCheck, Satellite, Clock, HelpCircle } from 'lucide-react'
import Badge from './ui/Badge'

// Why a record is considered verified — never a numeric "trust score".
// See src/data/investor/types.js (`ConfidenceStatus`). Renders as a real
// badge pill (visual-system brief §4) via the shared `Badge` primitive,
// not bare colored text.
const CONFIG = {
  verified: { label: 'Verified', icon: CheckCircle2, tone: 'verified' },
  field_verified: { label: 'Field verified', icon: ShieldCheck, tone: 'verified' },
  satellite_verified: { label: 'Satellite verified', icon: Satellite, tone: 'verified' },
  pending_verification: { label: 'Pending verification', icon: Clock, tone: 'warning' },
  incomplete: { label: 'Incomplete', icon: HelpCircle, tone: 'neutral' },
}

/**
 * @param {{ status: import('../../data/investor/types').ConfidenceStatus, className?: string }} props
 */
export default function ConfidenceIndicator({ status, className = '' }) {
  const config = CONFIG[status] ?? CONFIG.incomplete
  return (
    <Badge tone={config.tone} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  )
}
