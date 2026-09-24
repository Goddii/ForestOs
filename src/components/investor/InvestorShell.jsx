import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import InvestorHeader from './InvestorHeader'
import InvestorNav from './InvestorNav'
import EvidenceDrawer from './EvidenceDrawer'
import { EvidenceDrawerProvider } from './EvidenceDrawerContext'
import { useWorkspace } from './FunderWorkspaceContext'
import { sectionFor } from './navItems'

/**
 * App shell for the whole `/investor/*` surface (visual-system brief §3/§4):
 * a dark sidebar for identity, navigation and the demo notice; a white
 * content canvas with a slim header; the evidence drawer mounted once,
 * opened from anywhere via `useEvidenceDrawer`.
 *
 * Adds `.investor` to its own root and (mirroring `.dash`/`dash-root`)
 * `investor-root` to `<html>` — see index.css for what that sets (light
 * color-scheme, canvas page background).
 */
export default function InvestorShell({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('investor-root')
    return () => document.documentElement.classList.remove('investor-root')
  }, [])

  return (
    <EvidenceDrawerProvider>
      <div className="investor min-h-svh bg-canvas lg:flex">
        <InvestorNav />
        <div className="min-w-0 flex-1">
          <InvestorHeader />
          <main className="mx-auto max-w-[90rem] px-6 py-10 sm:px-8 sm:py-14">
            <PageTitle />
            {children}
          </main>
        </div>
        <EvidenceDrawer />
      </div>
    </EvidenceDrawerProvider>
  )
}

/**
 * A screen-reader-only <h1> naming the current page, for pages that don't
 * render a visible title of their own, so every page has one top-level
 * heading to land on.
 */
function PageTitle() {
  const { org, basePath } = useWorkspace()
  const { pathname } = useLocation()
  const section = sectionFor(pathname, basePath)
  if (!section || section.hasVisibleTitle) return null
  return <h1 className="sr-only">{`${section.label} · ${org.name}`}</h1>
}
