import { Lock } from 'lucide-react'
import { PERMISSION_LABELS } from '../../data/offtaker/roles'
import { useOfftaker } from './OfftakerWorkspaceContext'

/**
 * Says plainly that something exists but this role can't see it, and who can
 * change that — never an empty space that reads as "no data".
 *
 * @param {{ permission: keyof typeof PERMISSION_LABELS, className?: string }} props
 */
export default function RestrictedNote({ permission, className = '' }) {
  const { roleConfig } = useOfftaker()
  return (
    <p className={`flex items-start gap-2 rounded-xl border border-dashed border-line-strong bg-canvas px-4 py-3 text-compact text-ink-muted ${className}`}>
      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={2} aria-hidden="true" />
      <span>
        {PERMISSION_LABELS[permission]} are not part of the {roleConfig.label} role. Your organisation admin can change your role.
      </span>
    </p>
  )
}
