import { useEffect, useMemo } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import InvestorShell from '../components/investor/InvestorShell'
import { FunderWorkspaceProvider } from '../components/investor/FunderWorkspaceContext'
import OverviewPage from '../components/investor/pages/OverviewPage'
import CapitalPage from '../components/investor/pages/CapitalPage'
import LandscapePage from '../components/investor/pages/LandscapePage'
import ProgressPage from '../components/investor/pages/ProgressPage'
import ImpactPage from '../components/investor/pages/ImpactPage'
import EvidencePage from '../components/investor/pages/EvidencePage'
import RisksPage from '../components/investor/pages/RisksPage'
import GovernancePage from '../components/investor/pages/GovernancePage'
import ReportsPage from '../components/investor/pages/ReportsPage'
import ProjectPage from '../components/investor/pages/ProjectPage'
import { buildWorkspace } from '../data/funder/workspace'

/** Where `/funder` with no organisation lands in the demo. */
export const DEFAULT_FUNDER_SLUG = 'funder-a'

/** The old `/investor/*` console now lives in Funder B's (investment) workspace. */
const LEGACY_SEGMENTS = {
  capital: 'funding',
  impact: 'outcomes',
  risks: 'issues',
  governance: 'organisation',
  project: 'programme',
}

export function InvestorRedirect() {
  const rest = useParams()['*'] ?? ''
  const [first, ...more] = rest.split('/').filter(Boolean)
  const mapped = first ? [LEGACY_SEGMENTS[first] ?? first, ...more].join('/') : ''
  return <Navigate to={`/funder/funder-b${mapped ? `/${mapped}` : ''}`} replace />
}

function WorkspaceNotFound({ slug }) {
  return (
    <div className="investor grid min-h-svh place-items-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-ink">No funder workspace for “{slug}”</h1>
        <p className="mt-2 text-[14px] text-ink-muted">
          The link may be out of date, or this organisation has no funding agreement on the programme yet.
        </p>
        <Link
          to={`/funder/${DEFAULT_FUNDER_SLUG}`}
          className="mt-5 inline-block rounded-full bg-forest-accent px-5 py-2 text-[13px] font-semibold text-white hover:bg-forest-accent-dark"
        >
          Open the demo workspace
        </Link>
      </div>
    </div>
  )
}

/**
 * Mounted at `/funder/:orgSlug/*` — one funder's workspace. The organisation
 * in the URL selects the funding agreement; every page reads that funder's
 * scoped workspace from context (audit §10), so adding a funder is data.
 */
export default function FunderView() {
  const { orgSlug } = useParams()
  const workspace = useMemo(() => buildWorkspace(orgSlug), [orgSlug])

  useEffect(() => {
    document.title = workspace ? `${workspace.org.name} · Funder workspace · ForestOS` : 'Funder workspace · ForestOS'
  }, [workspace])

  if (!workspace) return <WorkspaceNotFound slug={orgSlug} />

  return (
    <FunderWorkspaceProvider value={workspace}>
      <InvestorShell>
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="programme" element={<ProjectPage />} />
          <Route path="funding" element={<CapitalPage />} />
          <Route path="landscape" element={<LandscapePage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="outcomes" element={<ImpactPage />} />
          <Route path="issues" element={<RisksPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="organisation" element={<GovernancePage />} />
          <Route path="*" element={<Navigate to={workspace.basePath} replace />} />
        </Routes>
      </InvestorShell>
    </FunderWorkspaceProvider>
  )
}
