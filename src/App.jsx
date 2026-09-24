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
// Premium cultural-campaign build for the Nyashinski × Majani Guardian
// Edition collaboration (Sept 2026) — fully isolated in `src/majaniNyashinski/`
// + this one route file. Does not touch `/qr-experience` or the real
// Figma-approved `/passport/majani/:batchId` tenant passport.
const MajaniNyashinski = lazy(() => import('./routes/MajaniNyashinski'))
// "The Sound of the Shield" — a second isolated cultural-campaign prototype,
// ported as-is from Figma (Nyashinski × Nyayo Tea Zones QR-scan landing).
// Own folder (`src/soundOfTheShield/`), own route file; does not touch any
// other prototype or route.
const SoundOfTheShield = lazy(() => import('./routes/SoundOfTheShield'))
// "The Living Anthem" — a third isolated cultural-campaign prototype, a
// seven-chapter QR story ported from Figma. Own folder (`src/livingAnthem/`),
// own route file; does not touch any other route.
const LivingAnthem = lazy(() => import('./routes/LivingAnthem'))
// A plain link list to every prototype/comparison/demo build in this repo,
// for quickly switching between them in a demo — links out only, changes
// nothing about the routes it lists.
const PrototypeIndex = lazy(() => import('./routes/PrototypeIndex'))
const LaunchEdition = lazy(() => import('./routes/LaunchEdition'))
// Funder workspace — the funder-agnostic ESG console (Sept 2026). Each
// funding organisation gets `/funder/:orgSlug`; the old `/investor` URLs
// redirect into the investment-type workspace. See
// docs/IMPLEMENTATION_PLAN_ESG_AND_FACTORY.md.
const FunderView = lazy(() => import('./routes/FunderView'))
const InvestorRedirect = lazy(() => import('./routes/FunderView').then((m) => ({ default: m.InvestorRedirect })))
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
        <Route path="/passport/:tenantSlug/:batchId" element={<TenantPassportView />} />
        <Route path="/qr-experience" element={<QrExperienceView />} />
        <Route path="/qr-experience/:experienceId" element={<QrExperienceView />} />
        <Route path="/majani/nyashinski" element={<MajaniNyashinski />} />
        <Route path="/sound-of-the-shield" element={<SoundOfTheShield />} />
        <Route path="/living-anthem" element={<LivingAnthem />} />
        <Route path="/prototypes" element={<PrototypeIndex />} />
        <Route path="/launch" element={<LaunchEdition />} />
        <Route path="/funder" element={<Navigate to="/funder/funder-a" replace />} />
        <Route path="/funder/:orgSlug/*" element={<FunderView />} />
        <Route path="/investor/*" element={<InvestorRedirect />} />
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
