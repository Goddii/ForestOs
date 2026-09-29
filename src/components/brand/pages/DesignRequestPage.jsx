import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Lock, Send } from 'lucide-react'
import { DESIGN_REQUEST_FEATURES, DESIGN_REQUEST_STAGES } from '../../../data/brand/experiences'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import ActionButton from '../../investor/ui/ActionButton'
import PermissionNote from '../PermissionNote'
import Field, { ChoiceCard, ChoiceGroup, inputClass } from '../Field'

const MIN_BRIEF_LENGTH = 20
const DAY_MS = 86_400_000

/** The earliest launch date a request can ask for: the day after today. */
const dayAfter = (iso) => new Date(Date.parse(iso) + DAY_MS).toISOString().slice(0, 10)

function validate(form, asOf) {
  const errors = {}
  if (form.productIds.length === 0) errors.productIds = 'Pick the product the experience is for.'
  if (form.brief.trim().length < MIN_BRIEF_LENGTH) errors.brief = 'Tell the team what the experience should do, in a sentence or two.'
  if (!form.launchBy) errors.launchBy = 'Choose a target launch date.'
  else if (form.launchBy < dayAfter(asOf)) errors.launchBy = 'Choose a date after today.'
  return errors
}

/**
 * Asks the ForestOS design team for a bespoke QR experience when no template
 * fits. A routed page rather than a modal: it is a considered brief, not a
 * quick action, and it deep-links from anywhere in the portal.
 */
export default function DesignRequestPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const navigate = useNavigate()
  const activeTeam = ws.team.filter((member) => member.status === 'active')
  const [form, setForm] = useState({
    productIds: [],
    campaignId: '',
    brief: '',
    features: [],
    references: '',
    launchBy: '',
    contactId: activeTeam.find((member) => member.role === ws.role)?.id ?? activeTeam[0]?.id ?? '',
  })
  const [errors, setErrors] = useState({})
  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))
  const toggle = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: prev[key].includes(value) ? prev[key].filter((entry) => entry !== value) : [...prev[key], value] }))

  if (!ws.permissions.editContent) {
    return (
      <div>
        <PageHeader title="Request a custom experience" />
        <PermissionNote permission="editContent" />
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(form, ws.asOf)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    ws.requestDesign({ ...form, campaignId: form.campaignId || null, brief: form.brief.trim(), references: form.references.trim() })
    navigate(`${path('experiences')}?requested=1`)
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link to={path('experiences')} className="inline-flex items-center gap-1 text-compact text-ink-muted hover:text-forest-accent">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          QR experiences
        </Link>
      </nav>
      <PageHeader
        title="Request a custom experience"
        description="When no template fits, the ForestOS design team designs one for your brand. Tell them what it is for; they come back to scope it with you."
      />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <ChoiceGroup legend="Products" helper="The packs this experience will be printed on." error={errors.productIds}>
            <div className="grid gap-2 sm:grid-cols-2">
              {ws.products.map((product) => (
                <ChoiceCard key={product.id} type="checkbox" name="products" value={product.id} checked={form.productIds.includes(product.id)} onChange={() => toggle('productIds', product.id)}>
                  <span className="text-compact font-semibold text-ink">{product.name}</span>
                  <span className="block text-compact text-ink-muted">{product.lots.length > 0 ? `Lot #${product.lots[0].code}, ${product.lots[0].block}` : 'No lot connected yet'}</span>
                </ChoiceCard>
              ))}
            </div>
          </ChoiceGroup>

          <Field label="Campaign" optional>
            {(props) => (
              <select {...props} className={inputClass} value={form.campaignId} onChange={set('campaignId')}>
                <option value="">Not part of a campaign</option>
                {ws.campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="What should the experience do?" helper="Who scans it, where, and what you want them to feel or do next." error={errors.brief}>
            {(props) => <textarea {...props} rows={4} className={inputClass} value={form.brief} onChange={set('brief')} />}
          </Field>

          <ChoiceGroup legend="Features you would like" helper="Optional. The team will say what fits the story and the timeline.">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(DESIGN_REQUEST_FEATURES).map(([key, label]) => (
                <ChoiceCard key={key} type="checkbox" name="features" value={key} checked={form.features.includes(key)} onChange={() => toggle('features', key)}>
                  <span className="text-compact text-ink">{label}</span>
                </ChoiceCard>
              ))}
            </div>
          </ChoiceGroup>

          <Field label="Look and feel" optional helper="Mood, references, links to work you like, brand guidelines.">
            {(props) => <textarea {...props} rows={3} className={inputClass} value={form.references} onChange={set('references')} />}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Target launch" error={errors.launchBy}>
              {(props) => <input {...props} type="date" min={dayAfter(ws.asOf)} className={inputClass} value={form.launchBy} onChange={set('launchBy')} />}
            </Field>
            <Field label="Contact on your team">
              {(props) => (
                <select {...props} className={inputClass} value={form.contactId} onChange={set('contactId')}>
                  {activeTeam.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}, {member.title}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="text-compact font-medium text-danger">
              Fix the {Object.keys(errors).length} highlighted field{Object.keys(errors).length === 1 ? '' : 's'} to send the request.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <ActionButton type="submit" variant="primary" icon={Send} iconPosition="left">
              Send to the design team
            </ActionButton>
            <ActionButton to={path('experiences')} variant="ghost" icon={null}>
              Cancel
            </ActionButton>
          </div>
        </form>

        <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start" aria-label="How custom design works">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-ink">What happens next</h2>
            <ol className="mt-3 space-y-3">
              {DESIGN_REQUEST_STAGES.map((stage, index) => (
                <li key={stage.key} className="grid grid-cols-[1.5rem_1fr] gap-2 text-compact">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-canvas font-mono text-compact text-ink-muted">{index + 1}</span>
                  <span>
                    <span className="font-semibold text-ink">{stage.label}</span>
                    <span className="block text-compact text-ink-muted">{stage.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-forest-accent/20 bg-forest-accent-soft/50 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Lock className="h-4 w-4 text-forest-accent" aria-hidden="true" /> The verified layer stays the same
            </h2>
            <p className="mt-2 text-compact leading-relaxed text-ink-muted">
              The team designs your brand layer. Origin, verification and impact statements still come from ForestOS records, and the finished experience passes
              the same publish checks as any template.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
