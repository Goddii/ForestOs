import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronLeft, Copy, Download, ExternalLink, Lock, Plus, Trash2, X } from 'lucide-react'
import { claimsRepeatedIn, publishReadiness } from '../../../lib/brand/publish'
import { findBatchRecord } from '../../../lib/batchChain'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import ActionButton from '../../investor/ui/ActionButton'
import ExperiencePreview from '../ExperiencePreview'
import Field, { inputClass } from '../Field'
import PermissionNote from '../PermissionNote'
import QrCode, { downloadQrSvg } from '../QrCode'
import { ClaimVerdictBadge, ExperienceStatusBadge, SourceTag } from '../StatusBadges'

const MAX_SOCIAL_LINKS = 3

const draftFrom = (experience) => ({
  productId: experience.productId,
  batchTraceId: experience.batchTraceId,
  customisation: experience.customisation,
})

function Section({ title, owner, children }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6 shadow-card" aria-label={title}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {owner && <SourceTag kind={owner} />}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function HeroPicker({ photos, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">Hero media</legend>
      <p className="mt-0.5 text-xs text-ink-muted">ForestOS photography cleared for use beside verified records. Your own uploads live in Assets.</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {photos.map((photo) => (
          <label key={photo.id} className="group relative cursor-pointer overflow-hidden rounded-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500/50">
            <input type="radio" name="hero" value={photo.id} checked={value === photo.id} onChange={() => onChange(photo.id)} className="sr-only" />
            <img src={`${photo.src}.jpg`} alt={photo.alt} loading="lazy" className={`aspect-[4/3] w-full object-cover transition-opacity ${value === photo.id ? '' : 'opacity-70 group-hover:opacity-100'}`} />
            <span className={`absolute inset-0 rounded-lg border-2 ${value === photo.id ? 'border-forest-accent' : 'border-transparent'}`} aria-hidden="true" />
            {value === photo.id && (
              <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-forest-accent text-white" aria-hidden="true">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ClaimsInStory({ claims, onUseWording }) {
  if (claims.length === 0) return null
  return (
    <ul className="space-y-2 rounded-xl border border-line bg-canvas p-3.5">
      <li className="text-xs font-semibold text-ink-muted">Your story repeats {claims.length === 1 ? 'a claim' : `${claims.length} claims`} ForestOS has checked</li>
      {claims.map((claim) => (
        <li key={claim.id} className="rounded-lg bg-card p-3 text-compact">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span className="text-ink">“{claim.statement}”</span>
            <ClaimVerdictBadge status={claim.assessment.status} />
          </div>
          {claim.assessment.status !== 'approved' && (
            <p className="mt-1.5 text-xs text-ink-muted">{claim.assessment.reason}</p>
          )}
          {claim.assessment.status !== 'approved' && claim.assessment.approvedWording && (
            <button
              type="button"
              onClick={() => onUseWording(claim)}
              className="mt-2 text-xs font-semibold text-forest-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              Replace with: “{claim.assessment.approvedWording}”
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

function Readiness({ readiness }) {
  return (
    <ul className="space-y-2">
      {readiness.checks.map((check) => (
        <li key={check.key} className="flex items-start gap-2.5 text-compact">
          <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${check.ok ? 'bg-forest-accent text-white' : 'border border-warning text-warning'}`}>
            {check.ok ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : <X className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />}
          </span>
          <span className="min-w-0">
            <span className={check.ok ? 'text-ink' : 'font-semibold text-ink'}>{check.label}</span>
            <span className="sr-only">{check.ok ? ': passed' : ': not yet'}</span>
            {check.owner === 'forestos' && <Lock className="ml-1.5 inline h-3 w-3 text-ink-faint" aria-label="Checked by ForestOS" />}
            {!check.ok && <span className="block text-xs text-ink-muted">{check.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}

function QrPanel({ experience, url }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="flex gap-4">
      <QrCode value={url} label={`QR code for ${experience.customisation.title}`} size={112} className="shrink-0 border border-line" />
      <div className="min-w-0 space-y-2">
        <p className="break-all font-mono text-xs text-ink-muted">{url}</p>
        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={() => downloadQrSvg(url, `${experience.shortCode}-qr.svg`)} icon={Download} iconPosition="left">
            SVG
          </ActionButton>
          <ActionButton onClick={copy} icon={copied ? Check : Copy} iconPosition="left">
            {copied ? 'Copied' : 'Copy link'}
          </ActionButton>
        </div>
        <p className="text-xs text-ink-faint" role="status">
          {experience.status === 'published' ? 'Live: scanning opens the experience.' : 'Print only after publishing; until then the code opens the placeholder record.'}
        </p>
      </div>
    </div>
  )
}

/** Keyed on the id so moving between experiences starts from that experience's saved state. */
export default function ExperienceStudioPage() {
  const { experienceId } = useParams()
  return <Studio key={experienceId} experienceId={experienceId} />
}

function Studio({ experienceId }) {
  const ws = useBrand()
  const path = useBrandPath()
  const experience = ws.experiences.find((entry) => entry.id === experienceId)
  const [draft, setDraft] = useState(() => (experience ? draftFrom(experience) : null))
  const [savedNote, setSavedNote] = useState('')
  if (!experience || !draft) return <Navigate to={path('experiences')} replace />

  const canEdit = ws.permissions.editContent
  const canPublish = ws.permissions.publishExperiences
  const product = ws.products.find((entry) => entry.id === draft.productId) ?? null
  const lotRecord = draft.batchTraceId ? findBatchRecord(draft.batchTraceId) : null
  const lot = product?.lots.find((entry) => entry.traceId === draft.batchTraceId) ?? null
  const approvedMetrics = product?.evidence.metrics ?? []
  const storyClaims = claimsRepeatedIn(draft.customisation.story, product?.claims ?? [])
  const readiness = publishReadiness(draft, {
    products: ws.products,
    lotStatus: () => lotRecord?.verification.status ?? null,
    approvedMetricIds: new Set(approvedMetrics.map((metric) => metric.id)),
    claimsInStory: storyClaims.map((claim) => claim.assessment),
  })
  const dirty = JSON.stringify(draft) !== JSON.stringify(draftFrom(experience))
  const heroAsset = ws.photos.find((photo) => photo.id === draft.customisation.heroAssetId) ?? null
  const selectedMetrics = draft.customisation.metricIds.map((id) => approvedMetrics.find((metric) => metric.id === id)).filter(Boolean)
  const liveUrl = `${window.location.origin}${experience.livePath}`

  const setCustom = (changes) => setDraft((prev) => ({ ...prev, customisation: { ...prev.customisation, ...changes } }))
  const onText = (key) => (event) => setCustom({ [key]: event.target.value })
  const selectProduct = (event) => {
    const next = ws.products.find((entry) => entry.id === event.target.value) ?? null
    const allowed = new Set((next?.evidence.metrics ?? []).map((metric) => metric.id))
    setDraft((prev) => ({
      ...prev,
      productId: next?.id ?? null,
      batchTraceId: next?.lots[0]?.traceId ?? null,
      customisation: { ...prev.customisation, metricIds: prev.customisation.metricIds.filter((id) => allowed.has(id)) },
    }))
  }
  const toggleMetric = (id) =>
    setCustom({
      metricIds: draft.customisation.metricIds.includes(id) ? draft.customisation.metricIds.filter((entry) => entry !== id) : [...draft.customisation.metricIds, id],
    })
  const useWording = (claim) => {
    // Match the claim as written, case-insensitively, with its closing full
    // stop optional (the same tolerance claimsRepeatedIn uses to detect it).
    const pattern = new RegExp(claim.statement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\.$/, '\\.?'), 'i')
    setCustom({ story: draft.customisation.story.replace(pattern, claim.assessment.approvedWording) })
  }
  const setSocial = (index, changes) =>
    setCustom({ socialLinks: draft.customisation.socialLinks.map((link, i) => (i === index ? { ...link, ...changes } : link)) })
  const save = (changes = {}, note = 'Draft saved') => {
    ws.saveExperience(experience.id, { ...draft, ...changes })
    setSavedNote(note)
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link to={path('experiences')} className="inline-flex items-center gap-1 text-compact text-ink-muted hover:text-forest-accent">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          QR experiences
        </Link>
      </nav>

      <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ExperienceStatusBadge status={experience.status} />
            {dirty && <span className="text-xs font-semibold text-warning">Unsaved changes</span>}
            {!dirty && savedNote && (
              <span className="text-xs text-ink-muted" role="status">
                {savedNote}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[2.1rem]">{draft.customisation.title || 'Untitled experience'}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {experience.template.name} template
            {experience.publishedAt && `, published ${experience.publishedAt}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={experience.livePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-sans text-label font-semibold uppercase tracking-label text-ink-muted transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft hover:text-forest-accent-dark"
          >
            Open live <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          {canEdit && experience.status === 'draft' && (
            <ActionButton onClick={() => save()} disabled={!dirty} icon={null}>
              Save draft
            </ActionButton>
          )}
          {canPublish && experience.status === 'published' && (
            <ActionButton onClick={() => save({ status: 'draft' }, 'Unpublished')} icon={null}>
              Unpublish
            </ActionButton>
          )}
          {canPublish && (
            <ActionButton
              onClick={() => save({ status: 'published', publishedAt: experience.publishedAt ?? ws.asOf }, 'Published')}
              variant="primary"
              disabled={!readiness.canPublish || (experience.status === 'published' && !dirty)}
              title={readiness.canPublish ? undefined : 'Pass every check to publish'}
              icon={null}
            >
              {experience.status === 'published' ? 'Publish changes' : 'Publish'}
            </ActionButton>
          )}
        </div>
      </div>

      {!canPublish && <PermissionNote permission="publishExperiences" className="mb-6" />}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <fieldset disabled={!canEdit} className="min-w-0 space-y-6">
          <legend className="sr-only">Experience settings</legend>
          {!canEdit && <PermissionNote permission="editContent" />}

          <Section title="Connected to">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Product">
                {(props) => (
                  <select {...props} className={inputClass} value={draft.productId ?? ''} onChange={selectProduct}>
                    <option value="">Choose a product</option>
                    {ws.products.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Lot" helper="The lot the product is packed from. Its record is ForestOS verified.">
                {(props) => (
                  <select {...props} className={inputClass} value={draft.batchTraceId ?? ''} onChange={(event) => setDraft((prev) => ({ ...prev, batchTraceId: event.target.value || null }))}>
                    <option value="">{product?.lots.length ? 'Choose a lot' : 'This product has no lot yet'}</option>
                    {(product?.lots ?? []).map((entry) => (
                      <option key={entry.traceId} value={entry.traceId}>
                        #{entry.code}, {entry.block} ({entry.verificationStatus.toLowerCase()})
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
          </Section>

          <Section title="Brand layer" owner="brand">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
              <Field label="Campaign title">
                {(props) => <input {...props} className={inputClass} value={draft.customisation.title} onChange={onText('title')} />}
              </Field>
              <fieldset className="grid gap-1.5">
                <legend className="text-sm font-semibold text-ink">Colours</legend>
                <div className="flex items-center gap-3">
                  {['primary', 'accent'].map((key) => (
                    <label key={key} className="flex items-center gap-1.5 text-xs capitalize text-ink-muted">
                      <input
                        type="color"
                        value={draft.customisation.colours[key]}
                        onChange={(event) => setCustom({ colours: { ...draft.customisation.colours, [key]: event.target.value } })}
                        className="h-9 w-11 cursor-pointer rounded-md border border-line-strong bg-card p-0.5"
                      />
                      {key}
                    </label>
                  ))}
                  <button type="button" onClick={() => setCustom({ colours: { primary: ws.kit.primary, accent: ws.kit.accent } })} className="text-xs font-semibold text-forest-accent hover:underline">
                    Brand kit
                  </button>
                </div>
              </fieldset>
            </div>
            <label className="flex items-center gap-2.5 text-compact text-ink">
              <input type="checkbox" checked={draft.customisation.showLogo} onChange={(event) => setCustom({ showLogo: event.target.checked })} className="h-4 w-4 accent-[var(--color-forest-accent)]" />
              Show the brand logo in the header
            </label>
            <HeroPicker photos={ws.photos} value={draft.customisation.heroAssetId} onChange={(id) => setCustom({ heroAssetId: id })} />
            <Field label="Story" helper="Your words, shown as the brand’s. If the story repeats a claim, ForestOS checks it before you can publish.">
              {(props) => <textarea {...props} rows={4} className={inputClass} value={draft.customisation.story} onChange={onText('story')} />}
            </Field>
            <ClaimsInStory claims={storyClaims} onUseWording={useWording} />
          </Section>

          <Section title="Impact statements" owner="forestos">
            {approvedMetrics.length === 0 ? (
              <p className="text-compact text-ink-muted">
                {product ? 'No verified conservation work is linked to this product’s lot, so there is no impact statement to show. The verified origin still appears.' : 'Connect a product to see the statements its lot supports.'}
              </p>
            ) : (
              <>
                <p className="-mt-2 text-xs text-ink-muted">Choose which approved statements appear, in the order you tick them. The wording and figures are fixed by ForestOS.</p>
                <ul className="space-y-2">
                  {approvedMetrics.map((metric) => {
                    const order = draft.customisation.metricIds.indexOf(metric.id)
                    return (
                      <li key={metric.id}>
                        <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${order >= 0 ? 'border-forest-accent bg-forest-accent-soft/50' : 'border-line hover:border-ink-faint'}`}>
                          <input type="checkbox" checked={order >= 0} onChange={() => toggleMetric(metric.id)} className="mt-0.5 h-4 w-4 accent-[var(--color-forest-accent)]" />
                          <span className="min-w-0 flex-1 text-compact text-ink">{metric.wording}</span>
                          {order >= 0 && <span className="font-mono text-xs text-forest-accent-dark">#{order + 1}</span>}
                        </label>
                      </li>
                    )
                  })}
                </ul>
                {(product?.evidence.pendingMetrics ?? []).length > 0 && (
                  <p className="text-xs text-ink-faint">
                    In verification, not available yet: {product.evidence.pendingMetrics.map((metric) => metric.label.toLowerCase()).join(', ')}.
                  </p>
                )}
              </>
            )}
          </Section>

          <Section title="Links" owner="brand">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Call to action label">
                {(props) => <input {...props} className={inputClass} value={draft.customisation.cta.label} onChange={(event) => setCustom({ cta: { ...draft.customisation.cta, label: event.target.value } })} />}
              </Field>
              <Field label="Call to action link" helper="A full https:// address.">
                {(props) => (
                  <input {...props} type="url" inputMode="url" className={inputClass} value={draft.customisation.cta.href} onChange={(event) => setCustom({ cta: { ...draft.customisation.cta, href: event.target.value } })} />
                )}
              </Field>
              <Field label="Music link" optional helper="Spotify or another streaming link, where the campaign has one.">
                {(props) => <input {...props} type="url" className={inputClass} value={draft.customisation.musicLink ?? ''} onChange={(event) => setCustom({ musicLink: event.target.value || null })} />}
              </Field>
              <Field label="Community link" optional helper="A community page, event or group customers can join.">
                {(props) => <input {...props} type="url" className={inputClass} value={draft.customisation.communityLink ?? ''} onChange={(event) => setCustom({ communityLink: event.target.value || null })} />}
              </Field>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Social links</legend>
              <ul className="mt-2 space-y-2">
                {draft.customisation.socialLinks.map((link, index) => (
                  <li key={index} className="grid grid-cols-[8rem_minmax(0,1fr)_auto] gap-2">
                    <input aria-label={`Network ${index + 1}`} className={inputClass} value={link.network} onChange={(event) => setSocial(index, { network: event.target.value })} />
                    <input aria-label={`Link ${index + 1}`} type="url" className={inputClass} value={link.href} onChange={(event) => setSocial(index, { href: event.target.value })} />
                    <button
                      type="button"
                      onClick={() => setCustom({ socialLinks: draft.customisation.socialLinks.filter((_, i) => i !== index) })}
                      aria-label={`Remove ${link.network || 'link'}`}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink-muted hover:border-danger/40 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              {draft.customisation.socialLinks.length < MAX_SOCIAL_LINKS && (
                <button
                  type="button"
                  onClick={() => setCustom({ socialLinks: [...draft.customisation.socialLinks, { network: '', href: '' }] })}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-forest-accent hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add a social link
                </button>
              )}
            </fieldset>
          </Section>
        </fieldset>

        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start" aria-label="Preview and publishing">
          <ExperiencePreview customisation={draft.customisation} kit={ws.kit} heroAsset={heroAsset} lot={lot} metrics={selectedMetrics} />
          <p className="text-center text-xs leading-relaxed text-ink-faint">
            A preview of your brand layer. The live page is the ForestOS batch record, which is a placeholder (batch #921) until brand templates ship.
          </p>
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-bold text-ink">Before you publish</h2>
            <Readiness readiness={readiness} />
          </div>
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <h2 className="mb-3 text-sm font-bold text-ink">QR code</h2>
            <QrPanel experience={experience} url={liveUrl} />
          </div>
          {experience.status === 'published' && (
            <Link
              to={`${path('analytics')}?exp=${experience.id}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-forest-accent/40"
            >
              <span>
                <span className="block text-3xl font-bold leading-none tracking-tight text-ink">{experience.scans.scans.toLocaleString('en-US')}</span>
                <span className="mt-1 block text-xs text-ink-muted">scans since {experience.publishedAt}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-compact font-semibold text-forest-accent">
                Scan analytics <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}
