import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import InvestorShell from '../components/investor/InvestorShell'
import OverviewPage from '../components/investor/pages/OverviewPage'
import CapitalPage from '../components/investor/pages/CapitalPage'
import LandscapePage from '../components/investor/pages/LandscapePage'
import ImpactPage from '../components/investor/pages/ImpactPage'
import EvidencePage from '../components/investor/pages/EvidencePage'
import RisksPage from '../components/investor/pages/RisksPage'
import GovernancePage from '../components/investor/pages/GovernancePage'
import ReportsPage from '../components/investor/pages/ReportsPage'
import ProjectPage from '../components/investor/pages/ProjectPage'

/**
 * Mounted at `/investor/*` in App.jsx — one lazy chunk, one shell, an inner
 * `<Routes>` owning the nine investor pages. Same nesting pattern the
 * previous (now removed) `/dashboard/*` shell used.
 */
export default function InvestorView() {
  useEffect(() => {
    document.title = 'Conservation Capital — ForestOS'
  }, [])

  return (
    <InvestorShell>
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="capital" element={<CapitalPage />} />
        <Route path="landscape" element={<LandscapePage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="risks" element={<RisksPage />} />
        <Route path="governance" element={<GovernancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="project" element={<ProjectPage />} />
      </Routes>
    </InvestorShell>
  )
}
