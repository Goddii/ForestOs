import { useLocation, useNavigate } from 'react-router-dom'
import { Download, FolderSearch } from 'lucide-react'
import { FUNDER_ORGANISATIONS } from '../../data/funder/organisations'
import { useWorkspace, useWorkspacePath } from './FunderWorkspaceContext'
import Badge from './ui/Badge'
import ActionButton from './ui/ActionButton'

/**
 * The top header: which funder this workspace belongs to, the programme's
 * status, and two actions. The "View as" switcher exists only because this
 * is a demo — a signed-in funder would only ever see its own workspace. It
 * keeps the current page when switching, so the two funders can be compared.
 * Carries its own "Demo environment" mark because the sidebar's notice is
 * desktop-only.
 */
export default function InvestorHeader() {
  const { org, basePath, asOf } = useWorkspace()
  const path = useWorkspacePath()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const switchFunder = (slug) => {
    const rest = pathname.slice(basePath.length)
    navigate(`/funder/${slug}${rest}`)
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-card px-6 py-4 shadow-[0_1px_0_0_rgba(20,32,25,0.03)] sm:px-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="font-sans text-base font-bold leading-tight text-ink">{org.name}</p>
        <span className="text-line-strong">·</span>
        <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">Data as of {asOf}</p>
        <Badge tone="warning">Demo environment</Badge>
        <label className="flex items-center gap-2 font-mono text-label uppercase tracking-label text-ink-faint">
          View as
          <select
            value={org.slug}
            onChange={(event) => switchFunder(event.target.value)}
            className="rounded-md border border-line bg-card px-2 py-1 font-sans text-xs normal-case tracking-normal text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            {FUNDER_ORGANISATIONS.map((funder) => (
              <option key={funder.slug} value={funder.slug}>
                {funder.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <ActionButton to={path('reports')} variant="ghost" icon={Download} iconPosition="left">
          Reports
        </ActionButton>
        <ActionButton to={path('evidence')} variant="primary" icon={FolderSearch} iconPosition="left">
          Evidence centre
        </ActionButton>
      </div>
    </header>
  )
}
