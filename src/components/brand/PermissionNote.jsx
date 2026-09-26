import { Lock } from 'lucide-react'
import { BRAND_PERMISSION_LABELS } from '../../data/brand/roles'
import { useBrand } from './BrandWorkspaceContext'

/**
 * Stands in for a control this role cannot use: says what is restricted and
 * who can change it, instead of an empty space or a dead button.
 *
 * @param {{ permission: keyof typeof BRAND_PERMISSION_LABELS, className?: string }} props
 */
export default function PermissionNote({ permission, className = '' }) {
  const { roleConfig } = useBrand()
  return (
    <p className={`flex items-start gap-2 rounded-xl border border-dashed border-line-strong bg-canvas px-4 py-3 text-compact text-ink-muted ${className}`}>
      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" strokeWidth={2} aria-hidden="true" />
      <span>
        {BRAND_PERMISSION_LABELS[permission]} is not part of the {roleConfig.label} role. A brand lead or workspace admin can do this, or change your role.
      </span>
    </p>
  )
}
