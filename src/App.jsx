import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// Route-level code splitting: the home and batch views both drag in GSAP +
// Cesium for the cinematic dive. Keeping each behind its own chunk keeps the
// initial handoff tiny.
//
// This app is the public consumer trace surface only — the operations system
// (worker / block supervisor / zone manager / admin) has been extracted to
// the sibling `forestos-ops` app; it no longer lives in this bundle.
const Home = lazy(() => import('./routes/Home'))
const BatchView = lazy(() => import('./routes/BatchView'))
const TenantPassportView = lazy(() => import('./routes/TenantPassportView'))
const QrExperienceView = lazy(() => import('./routes/QrExperienceView'))
const Act1PreviewView = lazy(() => import('./routes/Act1PreviewView'))
const LaunchEdition = lazy(() => import('./routes/LaunchEdition'))
const EudrCompliance = lazy(() => import('./routes/solutions/EudrCompliance'))
const ConservationPassports = lazy(() => import('./routes/solutions/ConservationPassports'))
const FairPayTelemetry = lazy(() => import('./routes/solutions/FairPayTelemetry'))
const CapitalDeployment = lazy(() => import('./routes/solutions/CapitalDeployment'))
const ImpactVerification = lazy(() => import('./routes/solutions/ImpactVerification'))
const TransparentReporting = lazy(() => import('./routes/solutions/TransparentReporting'))
const BatchTraceability = lazy(() => import('./routes/solutions/BatchTraceability'))
const EvidenceExport = lazy(() => import('./routes/solutions/EvidenceExport'))
const PassportAccess = lazy(() => import('./routes/solutions/PassportAccess'))
const AudienceScanAnalytics = lazy(() => import('./routes/solutions/AudienceScanAnalytics'))
const CommissionEarnings = lazy(() => import('./routes/solutions/CommissionEarnings'))

const RouteFallback = (
  <div className="grid min-h-svh place-items-center bg-forest-950">
    <span className="font-mono text-xs uppercase tracking-[0.24em] text-sage-500">
      Loading…
    </span>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={RouteFallback}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batch/:batchId" element={<BatchView />} />
        <Route path="/batch/:batchId/act1-v2" element={<Act1PreviewView />} />
        <Route path="/passport/:tenantSlug/:batchId" element={<TenantPassportView />} />
        <Route path="/qr-experience" element={<QrExperienceView />} />
        <Route path="/qr-experience/:experienceId" element={<QrExperienceView />} />
        <Route path="/launch" element={<LaunchEdition />} />
        <Route path="/solutions/eudr-compliance" element={<EudrCompliance />} />
        <Route path="/solutions/conservation-passports" element={<ConservationPassports />} />
        <Route path="/solutions/fair-pay-telemetry" element={<FairPayTelemetry />} />
        <Route path="/solutions/capital-deployment" element={<CapitalDeployment />} />
        <Route path="/solutions/impact-verification" element={<ImpactVerification />} />
        <Route path="/solutions/transparent-reporting" element={<TransparentReporting />} />
        <Route path="/solutions/batch-traceability" element={<BatchTraceability />} />
        <Route path="/solutions/evidence-export" element={<EvidenceExport />} />
        <Route path="/solutions/passport-access" element={<PassportAccess />} />
        <Route path="/solutions/audience-scan-analytics" element={<AudienceScanAnalytics />} />
        <Route path="/solutions/commission-earnings" element={<CommissionEarnings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
