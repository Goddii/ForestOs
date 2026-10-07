import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const EnterpriseHub = lazy(() => import('../enterprisePartners/EnterpriseHub'))
const BrandExperience = lazy(() => import('../enterprisePartners/BrandExperience'))
const PackagingSuite = lazy(() => import('../enterprisePartners/PackagingSuite'))
const TouchpointsShowcase = lazy(() => import('../enterprisePartners/TouchpointsShowcase'))
const InvestorDeck = lazy(() => import('../enterprisePartners/InvestorDeck'))

const Fallback = (
  <div className="grid min-h-svh place-items-center bg-forest-950">
    <span className="font-mono text-xs uppercase tracking-[0.24em] text-sage-500">Loading…</span>
  </div>
)

export default function EnterprisePartnersView() {
  return (
    <Suspense fallback={Fallback}>
      <Routes>
        <Route index element={<EnterpriseHub />} />
        <Route path="experience/:brandId" element={<BrandExperience />} />
        <Route path="packaging" element={<PackagingSuite />} />
        <Route path="touchpoints" element={<TouchpointsShowcase />} />
        <Route path="investor" element={<InvestorDeck />} />
        <Route path="*" element={<Navigate to="/enterprise-partners" replace />} />
      </Routes>
    </Suspense>
  )
}
