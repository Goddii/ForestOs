import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import { roleFromPath } from '../lib/dashboard/roles'

// Cross-cutting
import OverviewLandscapeModule from '../components/dashboard/modules/OverviewLandscapeModule'
import EvidenceChainModule from '../components/dashboard/modules/EvidenceChainModule'
// Brand / Offtaker modules
import OverviewModule from '../components/dashboard/modules/OverviewModule'
import EudrModule from '../components/dashboard/modules/EudrModule'
import PassportVaultModule from '../components/dashboard/modules/PassportVaultModule'
import FairPayModule from '../components/dashboard/modules/FairPayModule'
import SatelliteModule from '../components/dashboard/modules/SatelliteModule'
import QrAnalyticsModule from '../components/dashboard/modules/QrAnalyticsModule'
// Creator & Artist modules
import CampaignDropsModule from '../components/dashboard/modules/creator/CampaignDropsModule'
import AudienceScansModule from '../components/dashboard/modules/creator/AudienceScansModule'
import CreatorImpactModule from '../components/dashboard/modules/creator/CreatorImpactModule'
import EarningsModule from '../components/dashboard/modules/creator/EarningsModule'
// Collection Centre (staff) modules
import RecordDeliveryModule from '../components/dashboard/modules/centre/RecordDeliveryModule'
import FarmerQualityModule from '../components/dashboard/modules/centre/FarmerQualityModule'
// NTZDC Operations modules
import CollectionFeedsModule from '../components/dashboard/modules/ntzdc/CollectionFeedsModule'
import VerificationQueueModule from '../components/dashboard/modules/ntzdc/VerificationQueueModule'
import ProblemReportsModule from '../components/dashboard/modules/ntzdc/ProblemReportsModule'
import QualityRejectionsModule from '../components/dashboard/modules/ntzdc/QualityRejectionsModule'
import PriceConfiguratorModule from '../components/dashboard/modules/ntzdc/PriceConfiguratorModule'
import TrainingAlertsModule from '../components/dashboard/modules/ntzdc/TrainingAlertsModule'
import BufferMaintenanceModule from '../components/dashboard/modules/ntzdc/BufferMaintenanceModule'
// NTZDC Management modules
import LandscapeOverviewModule from '../components/dashboard/modules/management/LandscapeOverviewModule'
import ZoneComparisonModule from '../components/dashboard/modules/management/ZoneComparisonModule'
import BufferConservationRollupModule from '../components/dashboard/modules/management/BufferConservationRollupModule'
// Buyer / Brand modules
import ConservationPassportModule from '../components/dashboard/modules/buyer/ConservationPassportModule'
import BatchLookupModule from '../components/dashboard/modules/buyer/BatchLookupModule'
import EsgReportExportModule from '../components/dashboard/modules/buyer/EsgReportExportModule'
// ESG Capital Manager modules
import FundAllocationModule from '../components/dashboard/modules/esg/FundAllocationModule'
import CapitalDrawdownsModule from '../components/dashboard/modules/esg/CapitalDrawdownsModule'
import SatelliteRecoveryModule from '../components/dashboard/modules/esg/SatelliteRecoveryModule'
import ImpactAuditLogsModule from '../components/dashboard/modules/esg/ImpactAuditLogsModule'

const AS_OF = '2026-09-07'

/**
 * The ESG portal shell: a sticky dark-emerald sidebar + a routed module area on
 * the light "operations console" surface. The active role is derived from the
 * URL path (`roleFromPath`); the sidebar's Role View switcher navigates between
 * role base paths, and each role's module set routes below.
 */
export default function B2BDashboard() {
  const { pathname } = useLocation()
  const role = roleFromPath(pathname)
  const isOverview = pathname === '/dashboard/overview'
  const isEvidence = pathname === '/dashboard/evidence'
  const stripLabel = isOverview ? 'Forest Line' : isEvidence ? 'Evidence chain' : role.label
  const stripScope = isOverview
    ? 'One connected record'
    : isEvidence
      ? 'What every figure rests on'
      : role.org.scope

  useEffect(() => {
    document.title = isOverview
      ? 'ForestOS — Forest Line'
      : isEvidence
        ? 'ForestOS — Evidence Chain'
        : `ForestOS — ${role.label}`
    document.documentElement.classList.add('dash-root')
    return () => document.documentElement.classList.remove('dash-root')
  }, [role.label, isOverview, isEvidence])

  return (
    <div className="dash flex min-h-screen flex-col bg-paper text-ink lg:flex-row">
      <DashboardSidebar role={role} />
      <main className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-2.5 sm:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            {stripLabel} <span className="text-line-strong">/</span>{' '}
            <span className="text-ink-muted">{stripScope}</span>
          </p>
          <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            As of {AS_OF}
          </p>
        </div>
        <div className="flex items-center gap-2 border-b border-line bg-paper-sunk/60 px-4 py-1.5 sm:px-8">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
            Prototype · every figure is illustrative mock data, not verified evidence
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
          <Routes>
            {/* Cross-cutting — the Forest Line front door */}
            <Route path="overview" element={<OverviewLandscapeModule />} />
            <Route path="evidence" element={<EvidenceChainModule />} />

            {/* Brand / Offtaker (default, unprefixed) */}
            <Route index element={<OverviewModule />} />
            <Route path="eudr" element={<EudrModule />} />
            <Route path="passports" element={<PassportVaultModule />} />
            <Route path="fairpay" element={<FairPayModule />} />
            <Route path="satellite" element={<SatelliteModule />} />
            <Route path="qr" element={<QrAnalyticsModule />} />

            {/* Buyer / Brand */}
            <Route path="buyer" element={<ConservationPassportModule />} />
            <Route path="buyer/batches" element={<BatchLookupModule />} />
            <Route path="buyer/reports" element={<EsgReportExportModule />} />

            {/* Creator & Artist */}
            <Route path="creator" element={<CampaignDropsModule />} />
            <Route path="creator/scans" element={<AudienceScansModule />} />
            <Route path="creator/impact" element={<CreatorImpactModule />} />
            <Route path="creator/earnings" element={<EarningsModule />} />

            {/* Collection Centre (staff) — Phase 1 data entry */}
            <Route path="centre" element={<RecordDeliveryModule />} />
            <Route path="centre/quality" element={<FarmerQualityModule />} />

            {/* NTZDC Operations */}
            <Route path="ops" element={<CollectionFeedsModule />} />
            <Route path="ops/verification" element={<VerificationQueueModule />} />
            <Route path="ops/problems" element={<ProblemReportsModule />} />
            <Route path="ops/quality" element={<QualityRejectionsModule />} />
            <Route path="ops/pricing" element={<PriceConfiguratorModule />} />
            <Route path="ops/training" element={<TrainingAlertsModule />} />
            <Route path="ops/buffer" element={<BufferMaintenanceModule />} />

            {/* NTZDC Management (org-wide roll-up) */}
            <Route path="management" element={<LandscapeOverviewModule />} />
            <Route path="management/zones" element={<ZoneComparisonModule />} />
            <Route path="management/buffer" element={<BufferConservationRollupModule />} />

            {/* ESG Capital Manager */}
            <Route path="capital" element={<FundAllocationModule />} />
            <Route path="capital/drawdowns" element={<CapitalDrawdownsModule />} />
            <Route path="capital/recovery" element={<SatelliteRecoveryModule />} />
            <Route path="capital/audit" element={<ImpactAuditLogsModule />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
