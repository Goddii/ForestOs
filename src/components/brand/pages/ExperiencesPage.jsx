import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, ExternalLink, Palette, Plus } from 'lucide-react'
import { DESIGN_REQUEST_FEATURES, DESIGN_REQUEST_STAGES, PLACEHOLDER_BATCH_ID } from '../../../data/brand/experiences'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import DataTable from '../../offtaker/DataTable'
import ActionButton from '../../investor/ui/ActionButton'
import { inputClass } from '../Field'
import PermissionNote from '../PermissionNote'
import { ExperienceStatusBadge } from '../StatusBadges'

function TemplateCard({ template }) {
  return (
    <article className="grid gap-6 rounded-2xl border border-line bg-card p-6 shadow-card lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-ink">{template.name}</h3>
        <p className="mt-1 max-w-[65ch] text-compact leading-relaxed text-ink-muted">{template.description}</p>
        <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-xs text-ink">
          {template.stages.map((stage, index) => (
            <li key={stage} className="flex items-center gap-1.5">
              <span className="rounded-full border border-line bg-canvas px-2.5 py-1">{stage}</span>
              {index < template.stages.length - 1 && <span aria-hidden="true" className="h-px w-3 bg-line-strong" />}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col items-start gap-2 lg:items-end">
        <a
          href={template.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-label font-semibold uppercase tracking-label text-ink-muted transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft hover:text-forest-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        >
          Preview the live template <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <p className="text-xs text-ink-faint">Opens batch #{PLACEHOLDER_BATCH_ID}, the placeholder record</p>
      </div>
    </article>
  )
}

/** The other way to get an experience: have the ForestOS design team make one. */
function CustomDesignCard() {
  const ws = useBrand()
  const path = useBrandPath()
  return (
    <article className="grid gap-5 rounded-2xl border border-dashed border-forest-accent/40 bg-forest-accent-soft/30 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest-accent text-white">
          <Palette className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-ink">Custom experience, designed by ForestOS</h3>
          <p className="mt-1 max-w-[65ch] text-compact leading-relaxed text-ink-muted">
            When no template fits, the ForestOS design team designs one around your brand, campaign and verified lot: music, collectibles, video, maps or languages
            as the story needs. The verified layer underneath stays the same.
          </p>
        </div>
      </div>
      {ws.permissions.editContent ? (
        <ActionButton to={path('experiences/request')} variant="primary" icon={Palette} iconPosition="left">
          Request a custom experience
        </ActionButton>
      ) : (
        <p className="text-xs text-ink-faint">Your role cannot send design requests.</p>
      )}
    </article>
  )
}

function RequestProgress({ status }) {
  const at = DESIGN_REQUEST_STAGES.findIndex((stage) => stage.key === status)
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label={`Progress: ${DESIGN_REQUEST_STAGES[at]?.label}`}>
      {DESIGN_REQUEST_STAGES.map((stage, index) => (
        <li key={stage.key} className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
              index < at ? 'bg-forest-accent-soft text-forest-accent-dark' : index === at ? 'bg-forest-accent font-semibold text-white' : 'border border-line text-ink-faint'
            }`}
            aria-current={index === at ? 'step' : undefined}
          >
            {index < at && <CheckCircle2 className="h-3 w-3" aria-hidden="true" />}
            {stage.label}
          </span>
          {index < DESIGN_REQUEST_STAGES.length - 1 && <span aria-hidden="true" className="h-px w-3 bg-line-strong" />}
        </li>
      ))}
    </ol>
  )
}

function DesignRequests() {
  const ws = useBrand()
  if (ws.designRequests.length === 0) return null
  const memberName = (id) => ws.team.find((member) => member.id === id)?.name ?? 'Your team'
  const campaignName = (id) => ws.campaigns.find((campaign) => campaign.id === id)?.name
  return (
    <section aria-label="Design requests">
      <SectionHeading title="Design requests" description="Custom experiences the ForestOS design team is working on for you." />
      <ul className="space-y-4">
        {ws.designRequests.map((request) => {
          const stage = DESIGN_REQUEST_STAGES.find((entry) => entry.key === request.status)
          return (
            <li key={request.id} className="rounded-2xl border border-line bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {request.products.map((product) => product.name).join(', ')}
                    {request.campaignId && <span className="font-normal text-ink-muted">, {campaignName(request.campaignId)}</span>}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">
                    Sent {request.submittedAt}, launch by {request.launchBy}, contact {memberName(request.contactId)}
                  </p>
                </div>
              </div>
              <p className="mt-3 max-w-[70ch] text-compact leading-relaxed text-ink">{request.brief}</p>
              {request.features.length > 0 && (
                <p className="mt-2 text-xs text-ink-muted">Asked for: {request.features.map((key) => DESIGN_REQUEST_FEATURES[key]).join(', ')}</p>
              )}
              <div className="mt-4 border-t border-line pt-4">
                <RequestProgress status={request.status} />
                <p className="mt-2 text-xs text-ink-muted">{stage?.detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function StartExperience() {
  const ws = useBrand()
  const path = useBrandPath()
  const navigate = useNavigate()
  const withoutExperience = ws.products.filter((product) => !product.experienceId)
  const [productId, setProductId] = useState(withoutExperience[0]?.id ?? '')
  if (withoutExperience.length === 0) return null
  if (!ws.permissions.editContent) return <PermissionNote permission="editContent" />
  const start = () => {
    const id = ws.addExperience(productId)
    if (id) navigate(path(`experiences/${id}`))
  }
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line-strong p-5 sm:flex-row sm:items-end">
      <label className="grid flex-1 gap-1.5 text-sm font-semibold text-ink">
        Start an experience for a product
        <select className={inputClass} value={productId} onChange={(event) => setProductId(event.target.value)}>
          {withoutExperience.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
              {product.lots.length === 0 ? ' (no lot connected yet)' : ''}
            </option>
          ))}
        </select>
      </label>
      <ActionButton onClick={start} variant="primary" icon={Plus} iconPosition="left">
        Start experience
      </ActionButton>
    </div>
  )
}

export default function ExperiencesPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  // Read the "just sent" flag once, then drop it from the URL so going back
  // to this page later never re-shows a stale confirmation.
  const [requested] = useState(() => params.has('requested'))
  useEffect(() => {
    if (!params.has('requested')) return
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('requested')
        return next
      },
      { replace: true },
    )
  }, [params, setParams])
  return (
    <div className="space-y-12">
      <PageHeader
        title="QR experiences"
        description="What a customer sees after scanning your pack. You pick a ForestOS template, connect it to a product and its lot, and customise the brand layer; the verified layer underneath comes from ForestOS and cannot be changed."
      />

      <section aria-label="Templates">
        <SectionHeading title="Start from a template, or have one designed" description="Every experience is built on a ForestOS template, or designed for you by the ForestOS design team." />
        <div className="space-y-4">
          {ws.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
          <CustomDesignCard />
        </div>
      </section>

      {requested && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-forest-accent/25 bg-forest-accent-soft px-4 py-3 text-compact text-forest-accent-dark">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Request sent. The ForestOS design team replies within two working days to book a scoping call. No email is sent in this demo.
        </p>
      )}

      <DesignRequests />

      <section aria-label="Your experiences" className="space-y-4">
        <SectionHeading title="Your experiences" />
        <DataTable
          caption="Your QR experiences"
          rowKey={(row) => row.id}
          rows={ws.experiences}
          onRowClick={(row) => navigate(path(`experiences/${row.id}`))}
          empty="No QR experiences yet."
          columns={[
            {
              key: 'title',
              header: 'Experience',
              cell: (row) => (
                <span>
                  <span className="block font-semibold text-ink">{row.customisation.title}</span>
                  <span className="text-xs text-ink-faint">{row.template.name}</span>
                </span>
              ),
            },
            { key: 'product', header: 'Product', cell: (row) => row.product?.name ?? 'Not connected' },
            { key: 'lot', header: 'Lot', cell: (row) => (row.lot ? `#${row.lot.code}, ${row.lot.block}` : 'Not connected') },
            { key: 'status', header: 'Status', cell: (row) => <ExperienceStatusBadge status={row.status} /> },
            {
              key: 'ready',
              header: 'Checks',
              cell: (row) => {
                const passed = row.readiness.checks.filter((check) => check.ok).length
                return (
                  <span className={passed === row.readiness.checks.length ? 'text-ink' : 'text-warning'}>
                    {passed} of {row.readiness.checks.length} passed
                  </span>
                )
              },
            },
            { key: 'scans', header: 'Scans', align: 'right', cell: (row) => (row.status === 'published' ? row.scans.scans.toLocaleString('en-US') : '—') },
          ]}
        />
        <StartExperience />
      </section>
    </div>
  )
}
