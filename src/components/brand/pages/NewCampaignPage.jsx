import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { CAMPAIGN_THEMES } from '../../../data/brand/campaigns'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import ActionButton from '../../investor/ui/ActionButton'
import PermissionNote from '../PermissionNote'
import Field, { ChoiceCard, ChoiceGroup, inputClass } from '../Field'
import { THEME_ICONS } from '../StatusBadges'

const EMPTY = { name: '', theme: '', start: '', end: '', productIds: [], experienceId: '', objective: '', channels: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name the campaign.'
  if (!form.theme) errors.theme = 'Choose a theme.'
  if (!form.start) errors.start = 'Choose a start date.'
  if (form.end && form.start && form.end < form.start) errors.end = 'The end date is before the start date.'
  if (form.productIds.length === 0) errors.productIds = 'Pick at least one product.'
  if (!form.objective.trim()) errors.objective = 'Say what the campaign should achieve.'
  return errors
}

export default function NewCampaignPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))
  const toggleProduct = (id) =>
    setForm((prev) => ({ ...prev, productIds: prev.productIds.includes(id) ? prev.productIds.filter((p) => p !== id) : [...prev.productIds, id] }))

  if (!ws.permissions.manageCampaigns) {
    return (
      <div>
        <PageHeader title="New campaign" />
        <PermissionNote permission="manageCampaigns" />
      </div>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    ws.addCampaign({
      name: form.name.trim(),
      theme: form.theme,
      status: 'draft',
      period: { start: form.start, end: form.end || null },
      productIds: form.productIds,
      experienceId: form.experienceId || null,
      objective: form.objective.trim(),
      channels: form.channels.split(',').map((channel) => channel.trim()).filter(Boolean),
    })
    navigate(path('campaigns'))
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link to={path('campaigns')} className="inline-flex items-center gap-1 text-compact text-ink-muted hover:text-forest-accent">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Campaigns
        </Link>
      </nav>
      <PageHeader title="New campaign" description="Saved as a draft. Nothing reaches customers until its QR experience is published." />

      <form onSubmit={handleSubmit} noValidate className="max-w-4xl space-y-8">
        <Field label="Campaign name" error={errors.name}>
          {(props) => <input {...props} className={inputClass} value={form.name} onChange={set('name')} autoComplete="off" />}
        </Field>

        <ChoiceGroup legend="Theme" error={errors.theme}>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CAMPAIGN_THEMES).map(([key, theme]) => {
              const Icon = THEME_ICONS[key]
              return (
                <ChoiceCard key={key} name="theme" value={key} checked={form.theme === key} onChange={set('theme')}>
                  <span className="flex items-center gap-2 text-compact font-semibold text-ink">
                    <Icon className="h-4 w-4 text-forest-accent" aria-hidden="true" />
                    {theme.label}
                  </span>
                  <span className="mt-0.5 block text-compact text-ink-muted">{theme.description}</span>
                </ChoiceCard>
              )
            })}
          </div>
        </ChoiceGroup>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Starts" error={errors.start}>
            {(props) => <input {...props} type="date" className={inputClass} value={form.start} onChange={set('start')} />}
          </Field>
          <Field label="Ends" optional error={errors.end} helper="Leave empty for an open-ended campaign.">
            {(props) => <input {...props} type="date" className={inputClass} value={form.end} onChange={set('end')} />}
          </Field>
        </div>

        <ChoiceGroup legend="Products" error={errors.productIds}>
          <div className="grid gap-2 sm:grid-cols-2">
            {ws.products.map((product) => (
              <ChoiceCard key={product.id} type="checkbox" name="products" value={product.id} checked={form.productIds.includes(product.id)} onChange={() => toggleProduct(product.id)}>
                <span className="text-compact font-semibold text-ink">{product.name}</span>
                <span className="block text-compact text-ink-muted">{product.line}</span>
              </ChoiceCard>
            ))}
          </div>
        </ChoiceGroup>

        <Field label="QR experience" optional helper="The experience customers reach from this campaign’s packs and materials.">
          {(props) => (
            <select {...props} className={inputClass} value={form.experienceId} onChange={set('experienceId')}>
              <option value="">None yet</option>
              {ws.experiences.map((experience) => (
                <option key={experience.id} value={experience.id}>
                  {experience.customisation.title} ({experience.status})
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Objective" error={errors.objective} helper="One or two sentences: who should do what, and why.">
          {(props) => <textarea {...props} rows={3} className={inputClass} value={form.objective} onChange={set('objective')} />}
        </Field>

        <Field label="Channels" optional helper="Separate with commas, for example “Table cards, Instagram”.">
          {(props) => <input {...props} className={inputClass} value={form.channels} onChange={set('channels')} />}
        </Field>

        {Object.keys(errors).length > 0 && (
          <p role="alert" className="text-compact font-medium text-danger">
            Fix the {Object.keys(errors).length} highlighted field{Object.keys(errors).length === 1 ? '' : 's'} to save the campaign.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <ActionButton type="submit" variant="primary" icon={null}>
            Save draft campaign
          </ActionButton>
          <ActionButton to={path('campaigns')} variant="ghost" icon={null}>
            Cancel
          </ActionButton>
        </div>
      </form>
    </div>
  )
}
