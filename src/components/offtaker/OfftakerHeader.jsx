import { useLocation, useNavigate } from 'react-router-dom'
import { Download, Search } from 'lucide-react'
import { OFFTAKER_ORGANISATIONS } from '../../data/funder/organisations'
import { OFFTAKER_ROLE_CONFIG } from '../../data/offtaker/roles'
import { useOfftaker, useOfftakerPath } from './OfftakerWorkspaceContext'
import Badge from '../investor/ui/Badge'
import ActionButton from '../investor/ui/ActionButton'

const selectClass =
  'max-w-[15rem] rounded-md border border-line bg-card px-2 py-1 font-sans text-xs normal-case tracking-normal text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50'

/**
 * Who is looking and as what. The organisation and role switchers exist only
 * because this is a demo — a signed-in buyer sees its own organisation, and
 * its role comes from the account. Switching keeps the current page so the
 * effect of a role on the same view can be compared directly.
 */
export default function OfftakerHeader() {
  const { org, account, role, setRole, basePath, asOf } = useOfftaker()
  const path = useOfftakerPath()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const roles = account.team.map((seat) => seat.role)

  return (
    <header className="flex flex-col gap-4 border-b border-line bg-card px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-base font-bold leading-tight text-ink" title={org.name}>
          {org.name}
        </p>
        <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">Data as of {asOf}</p>
        <Badge tone="warning">Demo environment</Badge>
        <label className="flex items-center gap-2 font-mono text-label uppercase tracking-label text-ink-faint">
          Buyer
          <select
            value={org.slug}
            onChange={(event) => navigate(`/offtaker/${event.target.value}${pathname.slice(basePath.length)}`)}
            className={selectClass}
          >
            {OFFTAKER_ORGANISATIONS.map((entry) => (
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
                {OFFTAKER_ROLE_CONFIG[entry].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ActionButton to={path('reports')} variant="ghost" icon={Download} iconPosition="left">
          Reports
        </ActionButton>
        <ActionButton to={path('batches')} variant="primary" icon={Search} iconPosition="left">
          Find a batch
        </ActionButton>
      </div>
    </header>
  )
}
