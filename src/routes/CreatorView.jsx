import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import CreatorShell from '../components/creator/CreatorShell'
import { CreatorProvider } from '../components/creator/CreatorContext'
import HomePage from '../components/creator/pages/HomePage'
import ProfilePage from '../components/creator/pages/ProfilePage'
import CampaignsPage from '../components/creator/pages/CampaignsPage'
import StudioPage from '../components/creator/pages/StudioPage'
import StudioEditorPage from '../components/creator/pages/StudioEditorPage'
import TeaPage from '../components/creator/pages/TeaPage'
import DesignRequestsPage from '../components/creator/pages/DesignRequestsPage'
import ContentPage from '../components/creator/pages/ContentPage'
import StoryPage from '../components/creator/pages/StoryPage'
import CommunityPage from '../components/creator/pages/CommunityPage'
import AnalyticsPage from '../components/creator/pages/AnalyticsPage'
import QrCodesPage from '../components/creator/pages/QrCodesPage'
import AssetsPage from '../components/creator/pages/AssetsPage'
import SettingsPage from '../components/creator/pages/SettingsPage'
import { EMPTY_CREATOR_DRAFTS, buildCreatorWorkspace } from '../data/creator/workspace'
import { getTemplate } from '../data/creator/templates'

/** Where `/creator` with no creator lands in the demo. */
export const DEFAULT_CREATOR_SLUG = 'nyashinski'

function CreatorNotFound({ slug }) {
  return (
    <div className="grid min-h-svh place-items-center bg-card px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-ink">No creative workspace for “{slug}”</h1>
        <p className="mt-2 text-[14px] text-ink-muted">The link may be out of date, or this partner is not onboarded yet.</p>
        <Link to={`/creator/${DEFAULT_CREATOR_SLUG}`} className="mt-5 inline-block rounded-full bg-forest-accent px-5 py-2 text-[13px] font-semibold text-white hover:bg-forest-accent-dark">
          Open the demo workspace
        </Link>
      </div>
    </div>
  )
}

/**
 * Mounted at `/creator/:creatorSlug/*` — one creative partner's portal.
 * Edits and publishes made in the session live in this component's state;
 * there is no backend yet, and every edit goes through the creative-only
 * filter in lib/creator/experience.js.
 */
/** A fresh draft on a template: every section on, no creative content yet. */
function draftFrom(template, campaignId, serial) {
  return {
    id: `exp-new-${serial}`,
    campaignId,
    templateId: template.id,
    name: `New ${template.name}`,
    status: 'draft',
    shortCode: `draft-${serial}`,
    publishedAt: null,
    creative: {
      headline: '',
      subline: '',
      heroAssetId: 'cr-portrait',
      narrative: '',
      sectionOrder: template.sections.map((section) => section.key),
      hiddenSections: [],
      musicLink: null,
      ctas: [],
      statementIds: [],
    },
  }
}

export default function CreatorView() {
  const { creatorSlug } = useParams()
  // Ids for session drafts come from a counter, so two quick creations never collide.
  const serial = useRef(0)
  const [session, setSession] = useState({ slug: creatorSlug, drafts: EMPTY_CREATOR_DRAFTS })
  const drafts = session.slug === creatorSlug ? session.drafts : EMPTY_CREATOR_DRAFTS
  const update = useCallback(
    (fn) => setSession((prev) => ({ slug: creatorSlug, drafts: fn(prev.slug === creatorSlug ? prev.drafts : EMPTY_CREATOR_DRAFTS) })),
    [creatorSlug],
  )

  const workspace = useMemo(() => {
    const built = buildCreatorWorkspace(creatorSlug, drafts)
    if (!built) return null
    return {
      ...built,
      saveCreative: (id, changes) =>
        update((prev) => ({ ...prev, experienceEdits: { ...prev.experienceEdits, [id]: { ...(prev.experienceEdits[id] ?? {}), ...changes } } })),
      publish: (id) => update((prev) => ({ ...prev, published: { ...prev.published, [id]: true } })),
      bookBatch: (booking) => {
        serial.current += 1
        const id = `qr-booked-${serial.current}`
        update((prev) => ({ ...prev, bookings: [...(prev.bookings ?? []), { ...booking, id }] }))
        return id
      },
      requestDesign: (request) => {
        serial.current += 1
        const id = `dr-new-${serial.current}`
        update((prev) => ({ ...prev, designRequests: [...(prev.designRequests ?? []), { ...request, id, status: 'received', submittedAt: built.asOf }] }))
        return id
      },
      createExperience: (templateId, campaignId) => {
        const template = getTemplate(templateId)
        if (!template) return null
        serial.current += 1
        const draft = draftFrom(template, campaignId, serial.current)
        update((prev) => ({ ...prev, created: [...(prev.created ?? []), draft] }))
        return draft.id
      },
    }
  }, [creatorSlug, drafts, update])

  useEffect(() => {
    document.title = workspace ? `${workspace.creator.name} · Creative partner portal · ForestOS` : 'Creative partner portal · ForestOS'
  }, [workspace])

  if (!workspace) return <CreatorNotFound slug={creatorSlug} />

  return (
    <CreatorProvider value={workspace}>
      <CreatorShell>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="studio/:experienceId" element={<StudioEditorPage />} />
          <Route path="tea" element={<TeaPage />} />
          <Route path="design" element={<DesignRequestsPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="qr" element={<QrCodesPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to={workspace.basePath} replace />} />
        </Routes>
      </CreatorShell>
    </CreatorProvider>
  )
}
