import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import BrandShell from '../components/brand/BrandShell'
import { BrandWorkspaceProvider } from '../components/brand/BrandWorkspaceContext'
import OverviewPage from '../components/brand/pages/OverviewPage'
import ProductsPage from '../components/brand/pages/ProductsPage'
import NewProductPage from '../components/brand/pages/NewProductPage'
import ProductDetailPage from '../components/brand/pages/ProductDetailPage'
import SourcesPage from '../components/brand/pages/SourcesPage'
import StoryPage from '../components/brand/pages/StoryPage'
import CampaignsPage from '../components/brand/pages/CampaignsPage'
import NewCampaignPage from '../components/brand/pages/NewCampaignPage'
import ExperiencesPage from '../components/brand/pages/ExperiencesPage'
import ExperienceStudioPage from '../components/brand/pages/ExperienceStudioPage'
import DesignRequestPage from '../components/brand/pages/DesignRequestPage'
import ContentPage from '../components/brand/pages/ContentPage'
import ImpactPage from '../components/brand/pages/ImpactPage'
import AnalyticsPage from '../components/brand/pages/AnalyticsPage'
import AssetsPage from '../components/brand/pages/AssetsPage'
import TeamPage from '../components/brand/pages/TeamPage'
import SettingsPage from '../components/brand/pages/SettingsPage'
import { buildBrandWorkspace } from '../data/brand/workspace'
import { brandAccountForOrg } from '../data/brand/accounts'
import { getOrganisationBySlug } from '../data/funder/organisations'
import { EXPERIENCE_TEMPLATES } from '../data/brand/experiences'

/** Where `/brand` with no organisation lands in the demo. */
export const DEFAULT_BRAND_SLUG = 'kilele-coffee-house'

const EMPTY_DRAFTS = { products: [], sourcing: [], campaigns: [], experiences: [], experienceEdits: {}, invites: [], designRequests: [] }

function WorkspaceNotFound({ slug }) {
  return (
    <div className="brand-portal grid min-h-svh place-items-center bg-card px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-ink">No brand workspace for “{slug}”</h1>
        <p className="mt-2 text-[14px] text-ink-muted">The link may be out of date, or this organisation is not onboarded as a brand.</p>
        <Link
          to={`/brand/${DEFAULT_BRAND_SLUG}`}
          className="mt-5 inline-block rounded-full bg-forest-accent px-5 py-2 text-[13px] font-semibold text-white hover:bg-forest-accent-dark"
        >
          Open the demo workspace
        </Link>
      </div>
    </div>
  )
}

/** A draft experience for a new product, on the one available template. */
function draftExperienceFor(product, lotTraceId, kit) {
  return {
    id: `exp-${product.id}`,
    brandOrgId: product.brandOrgId,
    templateId: EXPERIENCE_TEMPLATES[0].id,
    productId: product.id,
    batchTraceId: lotTraceId,
    status: 'draft',
    shortCode: product.id.replace(/^prd-/, ''),
    publishedAt: null,
    customisation: {
      title: product.name,
      heroAssetId: 'fos-tea-landscape',
      story: '',
      metricIds: [],
      cta: { label: '', href: '' },
      socialLinks: [],
      musicLink: null,
      communityLink: null,
      colours: { primary: kit.primary, accent: kit.accent },
      showLogo: true,
    },
  }
}

/**
 * Mounted at `/brand/:orgSlug/*` — one brand's portal. The organisation in
 * the URL and the viewer's role (`?role=`, switchable in the header for the
 * demo) select what the workspace builder lets through. Anything created in
 * the session (products, campaigns, experience edits, invites) lives in this
 * component's state: there is no backend yet.
 */
export default function BrandView() {
  const { orgSlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  // Session drafts belong to one brand: switching brand starts from none.
  // Ids for session records come from a counter, not a list length, so two
  // creations before a re-render can never collide.
  const nextId = useRef(0)
  const [session, setSession] = useState({ slug: orgSlug, drafts: EMPTY_DRAFTS })
  const drafts = session.slug === orgSlug ? session.drafts : EMPTY_DRAFTS
  const setDrafts = useCallback(
    (update) => setSession((prev) => ({ slug: orgSlug, drafts: update(prev.slug === orgSlug ? prev.drafts : EMPTY_DRAFTS) })),
    [orgSlug],
  )

  const account = brandAccountForOrg(getOrganisationBySlug(orgSlug)?.id)
  const requestedRole = searchParams.get('role')
  const role = account?.team.some((member) => member.role === requestedRole) ? requestedRole : account?.defaultRole

  const setRole = useCallback(
    (next) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set('role', next)
        return params
      }),
    [setSearchParams],
  )

  const workspace = useMemo(() => {
    const built = buildBrandWorkspace(orgSlug, role, drafts)
    if (!built) return null
    return {
      ...built,
      setRole,
      addProduct: ({ product, sourcing, createExperience }) => {
        nextId.current += 1
        const id = `prd-new-${nextId.current}`
        const saved = { ...product, id, brandOrgId: built.org.id }
        const sourcingRecord = sourcing ? { ...sourcing, id: `src-${id}`, productId: id } : null
        setDrafts((prev) => ({
          ...prev,
          products: [...prev.products, saved],
          sourcing: sourcingRecord ? [...prev.sourcing, sourcingRecord] : prev.sourcing,
          experiences: createExperience ? [...prev.experiences, draftExperienceFor(saved, sourcing?.batchTraceId ?? null, built.kit)] : prev.experiences,
        }))
        return id
      },
      addExperience: (productId) => {
        const product = built.products.find((entry) => entry.id === productId)
        if (!product) return null
        const experience = draftExperienceFor(product, product.lots[0]?.traceId ?? null, built.kit)
        setDrafts((prev) => ({ ...prev, experiences: [...prev.experiences, experience] }))
        return experience.id
      },
      addCampaign: (campaign) => {
        nextId.current += 1
        const id = `cmp-new-${nextId.current}`
        setDrafts((prev) => ({ ...prev, campaigns: [...prev.campaigns, { ...campaign, id, brandOrgId: built.org.id }] }))
        return id
      },
      saveExperience: (id, changes) =>
        setDrafts((prev) => ({
          ...prev,
          experienceEdits: { ...prev.experienceEdits, [id]: { ...(prev.experienceEdits[id] ?? {}), ...changes } },
        })),
      requestDesign: (request) => {
        nextId.current += 1
        const id = `dr-new-${nextId.current}`
        setDrafts((prev) => ({
          ...prev,
          designRequests: [...prev.designRequests, { ...request, id, brandOrgId: built.org.id, status: 'received', submittedAt: built.asOf }],
        }))
        return id
      },
      inviteMember: (member) =>
        setDrafts((prev) => ({
          ...prev,
          invites: [...prev.invites, { ...member, id: `invite-${prev.invites.length + 1}`, status: 'invited', lastActive: null }],
        })),
    }
  }, [orgSlug, role, drafts, setRole, setDrafts])

  useEffect(() => {
    document.title = workspace ? `${workspace.org.name} · Brand portal · ForestOS` : 'Brand portal · ForestOS'
  }, [workspace])

  if (!workspace) return <WorkspaceNotFound slug={orgSlug} />

  return (
    <BrandWorkspaceProvider value={workspace}>
      <BrandShell>
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<NewProductPage />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="campaigns/new" element={<NewCampaignPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="experiences/request" element={<DesignRequestPage />} />
          <Route path="experiences/:experienceId" element={<ExperienceStudioPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to={workspace.basePath} replace />} />
        </Routes>
      </BrandShell>
    </BrandWorkspaceProvider>
  )
}
