import { NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useWorkspace, useWorkspacePath } from './FunderWorkspaceContext'

// The funder workspace IA (audit §10): strategic first, then each page is
// the single home for its kind of record.
const ITEMS = [
  { sub: '', label: 'Overview', end: true },
  { sub: 'programme', label: 'Programme' },
  { sub: 'funding', label: 'Funding' },
  { sub: 'landscape', label: 'Landscape' },
  { sub: 'progress', label: 'Progress' },
  { sub: 'evidence', label: 'Evidence' },
  { sub: 'outcomes', label: 'Outcomes' },
  { sub: 'issues', label: 'Issues & risks' },
  { sub: 'reports', label: 'Reports' },
  { sub: 'organisation', label: 'Organisation' },
]

/**
 * The nav sidebar (visual-system brief §4) — the one surface that stays
 * dark, deliberately: it's what gives the white content canvas its contrast
 * and keeps "ForestOS" legible as a brand, not just a data product. A rail
 * on desktop, a horizontal scroller under the header on narrow viewports
 * (never a shrunk desktop nav — brief §29).
 */
export default function InvestorNav() {
  const { programme, org } = useWorkspace()
  const path = useWorkspacePath()
  return (
    <nav
      aria-label="Investor console navigation"
      className="shrink-0 overflow-x-auto border-b border-bone/10 bg-forest-950 px-6 py-3 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-bone/10 lg:px-5 lg:py-7"
    >
      <div className="hidden items-center gap-2 lg:flex">
        <Leaf className="h-4 w-4 text-forest-accent" strokeWidth={2} aria-hidden="true" />
        <span className="font-mono text-label uppercase tracking-label-wide text-bone">
          ForestOS
        </span>
      </div>
      <p className="mt-1 hidden font-display text-lg leading-tight text-bone lg:block">
        Funder workspace
      </p>

      <div className="hidden border-t border-bone/10 pt-5 lg:mt-6 lg:block" />

      <ul className="flex gap-1 lg:flex-1 lg:flex-col lg:gap-0.5">
        {ITEMS.map(({ sub, label, end }) => (
          <li key={sub || 'overview'} className="shrink-0">
            <NavLink
              to={path(sub)}
              end={end}
              className={({ isActive }) =>
                `block cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 font-mono text-label uppercase tracking-label transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
                  isActive
                    ? 'bg-forest-accent font-semibold text-bone'
                    : 'text-sage-300 hover:bg-bone/5 hover:text-bone'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="hidden border-t border-bone/10 pt-5 lg:mt-6 lg:block">
        <p className="font-mono text-label uppercase tracking-label-wide text-sage-500">Programme</p>
        <p className="mt-1.5 text-compact text-bone">{programme.name}</p>
        <p className="mt-3 font-mono text-label uppercase tracking-label-wide text-sage-500">Funder</p>
        <p className="mt-1.5 text-compact text-bone">{org.name}</p>
      </div>

      <div className="hidden border-t border-bone/10 pt-5 lg:mt-6 lg:block">
        <p className="font-mono text-label uppercase tracking-label-wide text-amber-400">
          Demo environment
        </p>
      </div>
    </nav>
  )
}
