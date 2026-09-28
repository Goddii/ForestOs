import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Leaf, Wand2 } from 'lucide-react'
import { useCreator, useCreatorPath } from './CreatorContext'
import { CREATOR_NAV } from './navItems'
import Badge from '../investor/ui/Badge'
import ActionButton from '../investor/ui/ActionButton'

/**
 * App shell for `/creator/*`. Deliberately lighter than the funder, buyer and
 * brand consoles (which share a dark rail): a white rail with the creator's
 * own portrait, so the workspace reads as a creative studio while the
 * forest-green accent keeps it inside ForestOS.
 */
export default function CreatorShell({ children }) {
  const { creator, asOf } = useCreator()
  const path = useCreatorPath()

  useEffect(() => {
    document.documentElement.classList.add('creator-root')
    return () => document.documentElement.classList.remove('creator-root')
  }, [])

  return (
    <div className="creator-portal min-h-svh bg-card text-ink lg:flex">
      <nav
        aria-label="Creative partner portal"
        className="shrink-0 overflow-x-auto border-b border-line bg-card px-4 py-3 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-4 lg:py-7"
      >
        <div className="hidden items-center gap-2 px-2 lg:flex">
          <Leaf className="h-4 w-4 text-forest-accent" strokeWidth={2} aria-hidden="true" />
          <span className="text-compact font-semibold text-ink">ForestOS</span>
          <span className="text-compact text-ink-faint">Creative partners</span>
        </div>

        <div className="mt-6 hidden items-center gap-3 px-2 lg:flex">
          <img src={creator.portrait.src} alt="" width={44} height={55} className="h-14 w-11 rounded-md object-cover" />
          <div className="min-w-0">
            <p className="truncate font-display text-xl leading-tight text-ink">{creator.name}</p>
            <p className="truncate text-xs text-ink-faint">{creator.discipline}</p>
          </div>
        </div>

        <ul className="flex gap-1 lg:mt-7 lg:flex-1 lg:flex-col lg:gap-0.5">
          {CREATOR_NAV.map(({ sub, label, end }) => (
            <li key={sub || 'home'} className="shrink-0">
              <NavLink
                to={path(sub)}
                end={end}
                className={({ isActive }) =>
                  `block whitespace-nowrap rounded-lg px-3 py-2 text-compact transition-colors duration-150 ${
                    isActive ? 'bg-forest-accent-soft font-semibold text-forest-accent-dark' : 'text-ink-muted hover:bg-canvas hover:text-ink'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-compact font-semibold text-ink lg:hidden">{creator.name}</p>
            <Badge tone="warning">Demo environment</Badge>
            <p className="text-xs text-ink-faint">Data as of {asOf}</p>
          </div>
          <ActionButton to={path('studio')} variant="primary" icon={Wand2} iconPosition="left">
            Experience Studio
          </ActionButton>
        </header>
        <main className="mx-auto max-w-[84rem] px-4 py-10 sm:px-8 sm:py-12">{children}</main>
      </div>
    </div>
  )
}
