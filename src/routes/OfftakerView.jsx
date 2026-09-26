import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import OfftakerShell from '../components/offtaker/OfftakerShell'
import { OfftakerWorkspaceProvider } from '../components/offtaker/OfftakerWorkspaceContext'
import OverviewPage from '../components/offtaker/pages/OverviewPage'
import SupplyPage from '../components/offtaker/pages/SupplyPage'
import AvailableTeaPage from '../components/offtaker/pages/AvailableTeaPage'
import BatchesPage from '../components/offtaker/pages/BatchesPage'
import BatchDetailPage from '../components/offtaker/pages/BatchDetailPage'
import TraceabilityPage from '../components/offtaker/pages/TraceabilityPage'
import QualityPage from '../components/offtaker/pages/QualityPage'
import CompliancePage from '../components/offtaker/pages/CompliancePage'
import SourcesPage from '../components/offtaker/pages/SourcesPage'
import OriginPage from '../components/offtaker/pages/OriginPage'
import DocumentsPage from '../components/offtaker/pages/DocumentsPage'
import OrdersPage from '../components/offtaker/pages/OrdersPage'
import ReportsPage from '../components/offtaker/pages/ReportsPage'
import SettingsPage from '../components/offtaker/pages/SettingsPage'
import { buildOfftakerWorkspace } from '../data/offtaker/workspace'
import { accountForOrg } from '../data/offtaker/accounts'
import { getOrganisationBySlug } from '../data/funder/organisations'

/** Where `/offtaker` with no organisation lands in the demo. */
export const DEFAULT_OFFTAKER_SLUG = 'rift-valley-tea'

function WorkspaceNotFound({ slug }) {
  return (
    <div className="offtaker grid min-h-svh place-items-center bg-card px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-ink">No buyer workspace for “{slug}”</h1>
        <p className="mt-2 text-[14px] text-ink-muted">The link may be out of date, or this organisation is not onboarded as a buyer.</p>
        <Link
          to={`/offtaker/${DEFAULT_OFFTAKER_SLUG}`}
          className="mt-5 inline-block rounded-full bg-forest-accent px-5 py-2 text-[13px] font-semibold text-white hover:bg-forest-accent-dark"
        >
          Open the demo workspace
        </Link>
      </div>
    </div>
  )
}

/**
 * Mounted at `/offtaker/:orgSlug/*` — one buyer's portal. The organisation
 * in the URL and the viewer's role (`?role=`, switchable in the header for
 * the demo) select what the workspace builder lets through. Reservation
 * requests live in this component's state: there is no sales backend yet.
 */
export default function OfftakerView() {
  const { orgSlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [reservationRequests, setReservationRequests] = useState([])

  const account = accountForOrg(getOrganisationBySlug(orgSlug)?.id)
  const requestedRole = searchParams.get('role')
  const role = account?.team.some((seat) => seat.role === requestedRole) ? requestedRole : account?.defaultRole

  const workspace = useMemo(() => {
    const built = buildOfftakerWorkspace(orgSlug, role)
    if (!built) return null
    return {
      ...built,
      reservationRequests,
      requestReservation: (traceId) => setReservationRequests((prev) => (prev.includes(traceId) ? prev : [...prev, traceId])),
      setRole: (next) =>
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev)
          params.set('role', next)
          return params
        }),
    }
  }, [orgSlug, role, reservationRequests, setSearchParams])

  useEffect(() => {
    setReservationRequests([])
  }, [orgSlug])

  useEffect(() => {
    document.title = workspace ? `${workspace.org.name} · Offtaker portal · ForestOS` : 'Offtaker portal · ForestOS'
  }, [workspace])

  if (!workspace) return <WorkspaceNotFound slug={orgSlug} />

  return (
    <OfftakerWorkspaceProvider value={workspace}>
      <OfftakerShell>
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="supply" element={<SupplyPage />} />
          <Route path="available" element={<AvailableTeaPage />} />
          <Route path="batches" element={<BatchesPage />} />
          <Route path="batches/:traceId" element={<BatchDetailPage />} />
          <Route path="traceability" element={<TraceabilityPage />} />
          <Route path="quality" element={<QualityPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="origin" element={<OriginPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to={workspace.basePath} replace />} />
        </Routes>
      </OfftakerShell>
    </OfftakerWorkspaceProvider>
  )
}
