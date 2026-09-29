import { NavLink } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useBrand, useBrandPath } from './BrandWorkspaceContext'
import BrandMark from './BrandMark'
import { NAV_GROUPS } from './navItems'

/**
 * The dark nav rail shared with the Offtaker Portal and the funder console:
 * a rail on desktop, a horizontal scroller under the header on narrow
 * viewports. The brand's own mark sits under the ForestOS lockup so it is
 * clear whose workspace this is and whose platform it runs on.
 */
export default function BrandNav() {
  const { org, kit, roleConfig } = useBrand()
  const path = useBrandPath()
  return (
    <nav
      aria-label="Brand portal navigation"
      className="shrink-0 overflow-x-auto border-b border-bone/10 bg-forest-950 px-4 py-3 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-64 lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-7"
    >
      <div className="hidden items-center gap-2 lg:flex">
        <Leaf className="h-4 w-4 text-forest-accent" strokeWidth={2} aria-hidden="true" />
        <span className="font-mono text-label uppercase tracking-label-wide text-bone">ForestOS</span>
      </div>
      <p className="mt-1 hidden font-display text-lg leading-tight text-bone lg:block">Brand portal</p>

      <div className="mt-5 hidden items-center gap-3 rounded-xl border border-bone/10 bg-bone/[0.03] p-2.5 lg:flex">
        <BrandMark kit={kit} size={34} />
        <div className="min-w-0">
          <p className="truncate text-compact font-semibold text-bone" title={org.name}>
            {org.name}
          </p>
          <p className="truncate text-compact text-sage-300">{roleConfig.label}</p>
        </div>
      </div>

      <div className="flex gap-4 lg:mt-6 lg:flex-1 lg:flex-col lg:gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="shrink-0">
            <p className="hidden px-3 pb-1.5 font-mono text-label uppercase tracking-label-wide text-sage-500 lg:block">{group.label}</p>
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

      <p className="mt-6 hidden font-mono text-label uppercase tracking-label-wide text-amber-400 lg:block">Demo environment</p>
    </nav>
  )
}
