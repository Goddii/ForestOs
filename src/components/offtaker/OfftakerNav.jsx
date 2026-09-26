import { NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useOfftaker, useOfftakerPath } from './OfftakerWorkspaceContext'
import { NAV_GROUPS } from './navItems'

/**
 * The dark nav rail, same construction as the funder console's
 * (`InvestorNav`): a rail on desktop, a horizontal scroller under the header
 * on narrow viewports. Groups name the question each set of pages answers.
 */
export default function OfftakerNav() {
  const { org, roleConfig } = useOfftaker()
  const path = useOfftakerPath()
  return (
    <nav
      aria-label="Offtaker portal navigation"
      className="shrink-0 overflow-x-auto border-b border-bone/10 bg-forest-950 px-6 py-3 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-64 lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-7"
    >
      <div className="hidden items-center gap-2 lg:flex">
        <Leaf className="h-4 w-4 text-forest-accent" strokeWidth={2} aria-hidden="true" />
        <span className="font-mono text-label uppercase tracking-label-wide text-bone">ForestOS</span>
      </div>
      <p className="mt-1 hidden font-display text-lg leading-tight text-bone lg:block">Offtaker portal</p>

      <div className="flex gap-4 lg:mt-6 lg:flex-1 lg:flex-col lg:gap-5 lg:border-t lg:border-bone/10 lg:pt-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="shrink-0">
            <p className="hidden px-3 pb-1.5 font-mono text-label uppercase tracking-label-wide text-sage-500 lg:block">
              {group.label}
            </p>
            <ul className="flex gap-1 lg:flex-col lg:gap-0.5">
              {group.items.map(({ sub, label, end }) => (
                <li key={sub || 'overview'} className="shrink-0">
                  <NavLink
                    to={path(sub)}
                    end={end}
                    className={({ isActive }) =>
                      `block whitespace-nowrap rounded-lg px-3 py-1.5 text-compact transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
                        isActive ? 'bg-forest-accent font-semibold text-bone' : 'text-sage-300 hover:bg-bone/5 hover:text-bone'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="hidden border-t border-bone/10 pt-5 lg:mt-6 lg:block">
        <p className="font-mono text-label uppercase tracking-label-wide text-sage-500">Buyer</p>
        <p className="mt-1.5 text-compact text-bone">{org.name}</p>
        <p className="mt-3 font-mono text-label uppercase tracking-label-wide text-sage-500">Your role</p>
        <p className="mt-1.5 text-compact text-bone">{roleConfig.label}</p>
      </div>
      <p className="mt-5 hidden font-mono text-label uppercase tracking-label-wide text-amber-400 lg:block">Demo environment</p>
    </nav>
  )
}
