import { useLocation, useNavigate } from 'react-router-dom'
import { Plus, QrCode } from 'lucide-react'
import { BRAND_ORGANISATIONS } from '../../data/funder/organisations'
import { BRAND_ROLE_CONFIG } from '../../data/brand/roles'
import { useBrand, useBrandPath } from './BrandWorkspaceContext'
import Badge from '../investor/ui/Badge'
import ActionButton from '../investor/ui/ActionButton'

const selectClass =
  'max-w-[15rem] rounded-md border border-line bg-card px-2 py-1 font-sans text-compact normal-case tracking-normal text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50'

/**
 * Who is looking and as what. The brand and role switchers exist only
 * because this is a demo: a signed-in brand sees its own workspace, and its
 * role comes from its account. Switching keeps the current page, so the
 * effect of a role on the same view can be compared directly.
 */
export default function BrandHeader() {
  const { org, account, role, setRole, basePath, asOf, permissions } = useBrand()
  const path = useBrandPath()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const roles = [...new Set(account.team.map((member) => member.role))]

  return (
    <header className="flex flex-col gap-4 border-b border-line bg-card px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-base font-semibold leading-tight text-ink" title={org.name}>
          {org.name}
        </p>
        <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">Data as of {asOf}</p>
        <Badge tone="warning">Demo environment</Badge>
        <label className="flex items-center gap-2 font-mono text-label uppercase tracking-label text-ink-faint">
          Brand
          <select
            value={org.slug}
            onChange={(event) => navigate(`/brand/${event.target.value}${pathname.slice(basePath.length).split('/').slice(0, 2).join('/')}`)}
            className={selectClass}
          >
            {BRAND_ORGANISATIONS.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 font-mono text-label uppercase tracking-label text-ink-faint">
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)} className={selectClass}>
            {roles.map((entry) => (
              <option key={entry} value={entry}>
                {BRAND_ROLE_CONFIG[entry].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ActionButton to={path('experiences')} variant="ghost" icon={QrCode} iconPosition="left">
          QR experiences
        </ActionButton>
        {permissions.manageProducts && (
          <ActionButton to={path('products/new')} variant="primary" icon={Plus} iconPosition="left">
            New product
          </ActionButton>
        )}
      </div>
    </header>
  )
}
