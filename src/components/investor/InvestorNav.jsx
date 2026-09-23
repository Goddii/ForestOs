import { NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { INVESTOR_PROJECT } from '../../data/investor'

const ITEMS = [
  { to: '/investor', label: 'Overview', end: true },
  { to: '/investor/capital', label: 'Capital' },
  { to: '/investor/landscape', label: 'Landscape' },
  { to: '/investor/impact', label: 'Impact' },
  { to: '/investor/evidence', label: 'Evidence' },
  { to: '/investor/risks', label: 'Risks' },
  { to: '/investor/governance', label: 'Governance' },
  { to: '/investor/reports', label: 'Reports' },
  { to: '/investor/project', label: 'Project' },
]

/**
 * The nav sidebar (visual-system brief §4) — the one surface that stays
 * dark, deliberately: it's what gives the white content canvas its contrast
 * and keeps "ForestOS" legible as a brand, not just a data product. A rail
 * on desktop, a horizontal scroller under the header on narrow viewports
 * (never a shrunk desktop nav — brief §29).
 */
export default function InvestorNav() {
  return (
    <nav
      aria-label="Investor console navigation"
      className="shrink-0 overflow-x-auto border-b border-bone/10 bg-forest-950 px-6 py-3 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-bone/10 lg:px-5 lg:py-7"
    >
      <div className="hidden items-center gap-2 lg:flex">
        <Leaf className="h-4 w-4 text-forest-accent" strokeWidth={2} aria-hidden="true" />
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone">
          ForestOS
        </span>
      </div>
      <p className="mt-1 hidden font-display text-lg leading-tight text-bone lg:block">
        Conservation Capital
      </p>

      <div className="hidden border-t border-bone/10 pt-5 lg:mt-6 lg:block" />

      <ul className="flex gap-1 lg:flex-1 lg:flex-col lg:gap-0.5">
        {ITEMS.map(({ to, label, end }) => (
          <li key={to} className="shrink-0">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `block cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
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
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-sage-500">Project</p>
        <p className="mt-1.5 text-[13px] text-bone">{INVESTOR_PROJECT.name}</p>
        <p className="text-[12px] text-sage-500">
          {INVESTOR_PROJECT.location.split(', ').pop()}, {INVESTOR_PROJECT.region}
        </p>
      </div>

      <div className="hidden border-t border-bone/10 pt-5 lg:mt-6 lg:block">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-400">
          Demo environment
        </p>
      </div>
    </nav>
  )
}
