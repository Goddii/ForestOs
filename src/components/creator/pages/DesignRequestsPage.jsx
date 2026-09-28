import { useState } from 'react'
import { Lock, Send } from 'lucide-react'
import { useCreator } from '../CreatorContext'
import { PageHeader, SectionTitle, formatDate } from '../ui'
import Field, { ChoiceCard, ChoiceGroup, inputClass } from '../../brand/Field'
import { DESIGN_FEATURES, DESIGN_REQUEST_KINDS, DESIGN_REQUEST_STAGES } from '../../../data/creator/designRequests'

const MIN_BRIEF_LENGTH = 20
const DAY_MS = 86_400_000
const dayAfter = (iso) => new Date(Date.parse(iso) + DAY_MS).toISOString().slice(0, 10)

/** Features offered for a kind of request; "both" offers experience and packaging together. */
const featuresFor = (kind) => (kind === 'both' ? { ...DESIGN_FEATURES.experience, ...DESIGN_FEATURES.packaging } : DESIGN_FEATURES[kind])
const ALL_FEATURES = { ...DESIGN_FEATURES.experience, ...DESIGN_FEATURES.packaging }

function validate(form, asOf) {
  const errors = {}
  if (!form.campaignId) errors.campaignId = 'Pick the campaign this is for.'
  if (form.brief.trim().length < MIN_BRIEF_LENGTH) errors.brief = 'Tell the team what you want, in a sentence or two.'
  if (!form.launchBy) errors.launchBy = 'Choose a target date.'
  else if (form.launchBy < dayAfter(asOf)) errors.launchBy = 'Choose a date after today.'
  return errors
}

/**
 * Asks the ForestOS design team for something no template covers: a custom
 * QR experience, custom packaging for the tea, or both. The team designs the
 * creative layer only; the verified batch records and per-batch pack codes
 * stay as they are. Requests are tracked below through the team's stages.
 */
export default function DesignRequestsPage() {
  const { campaigns, designRequests, requestDesign, asOf } = useCreator()
  const blank = { kind: 'experience', campaignId: campaigns[0]?.id ?? '', brief: '', features: [], references: '', launchBy: '' }
  const [form, setForm] = useState(blank)
  const [attempted, setAttempted] = useState(false)
  const [sentId, setSentId] = useState(null)
  const errors = validate(form, asOf)
  const shown = (key) => (attempted ? errors[key] : null)
  const options = featuresFor(form.kind)

  const setKind = (kind) => setForm((prev) => ({ ...prev, kind, features: prev.features.filter((feature) => feature in featuresFor(kind)) }))
  const toggleFeature = (key) =>
    setForm((prev) => ({ ...prev, features: prev.features.includes(key) ? prev.features.filter((entry) => entry !== key) : [...prev.features, key] }))

  const submit = (event) => {
    event.preventDefault()
    setAttempted(true)
    if (Object.keys(errors).length) return
    setSentId(requestDesign({ ...form, brief: form.brief.trim(), references: form.references.trim() }))
    setForm(blank)
    setAttempted(false)
  }

  return (
    <div className="space-y-16">
      <PageHeader
        title="Design requests"
        lede="When no template fits, ask the ForestOS design team for a custom QR experience, custom packaging for your tea, or both. They reply within two working days to book a scoping call."
      />

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <form onSubmit={submit} noValidate className="grid gap-7" aria-labelledby="design-new">
          <SectionTitle>
            <span id="design-new">New request</span>
          </SectionTitle>

          <ChoiceGroup legend="What should the team design?">
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(DESIGN_REQUEST_KINDS).map(([value, label]) => (
                <ChoiceCard key={value} name="kind" value={value} checked={form.kind === value} onChange={() => setKind(value)}>
                  <span className="text-compact font-semibold text-ink">{label}</span>
                </ChoiceCard>
              ))}
            </div>
          </ChoiceGroup>

          <Field label="Campaign" error={shown('campaignId')}>
            {(props) => (
              <select {...props} className={inputClass} value={form.campaignId} onChange={(event) => setForm({ ...form, campaignId: event.target.value })}>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Your brief" helper="What should it do or look like, and who is it for?" error={shown('brief')}>
            {(props) => <textarea {...props} rows={4} maxLength={800} className={inputClass} value={form.brief} onChange={(event) => setForm({ ...form, brief: event.target.value })} />}
          </Field>

          <ChoiceGroup legend="Features" helper="Optional. Pick anything you already know you want.">
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(options).map(([key, label]) => (
                <ChoiceCard key={key} type="checkbox" value={key} checked={form.features.includes(key)} onChange={() => toggleFeature(key)}>
                  <span className="text-compact text-ink">{label}</span>
                </ChoiceCard>
              ))}
            </div>
          </ChoiceGroup>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="References" optional helper="Links, artwork names or the mood you want.">
              {(props) => <input {...props} className={inputClass} value={form.references} maxLength={300} onChange={(event) => setForm({ ...form, references: event.target.value })} />}
            </Field>
            <Field label="Needed by" error={shown('launchBy')}>
              {(props) => <input {...props} type="date" min={dayAfter(asOf)} className={inputClass} value={form.launchBy} onChange={(event) => setForm({ ...form, launchBy: event.target.value })} />}
            </Field>
          </div>

          <p className="flex items-start gap-2 rounded-xl bg-canvas px-4 py-3 text-xs text-ink-muted">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            The team designs your creative layer and packaging. Verified batch records and pack codes stay exactly as recorded.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-forest-accent px-5 py-2.5 text-compact font-semibold text-white transition-colors hover:bg-forest-accent-dark active:translate-y-px"
            >
              <Send className="h-4 w-4" aria-hidden="true" /> Send to the design team
            </button>
            {sentId && (
              <p role="status" className="text-compact text-forest-accent-dark">
                Sent. Track it in your requests.
              </p>
            )}
          </div>
        </form>

        <section aria-labelledby="design-yours">
          <SectionTitle>
            <span id="design-yours">Your requests</span>
          </SectionTitle>
          <ul className="mt-6 grid gap-6">
            {[...designRequests].reverse().map((request) => (
              <RequestCard key={request.id} request={request} campaign={campaigns.find((campaign) => campaign.id === request.campaignId)} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function RequestCard({ request, campaign }) {
  const stageIndex = DESIGN_REQUEST_STAGES.findIndex((stage) => stage.key === request.status)
  const stage = DESIGN_REQUEST_STAGES[stageIndex]
  return (
    <li className="rounded-2xl border border-line p-5">
      <p className="text-xs text-ink-faint">
        {DESIGN_REQUEST_KINDS[request.kind]}, sent {formatDate(request.submittedAt)}
      </p>
      <p className="mt-1 font-semibold text-ink">{campaign?.title}</p>
      <p className="mt-2 text-compact leading-relaxed text-ink-muted">{request.brief}</p>
      {request.features.length > 0 && <p className="mt-2 text-xs text-ink-faint">{request.features.map((key) => ALL_FEATURES[key]).join(', ')}</p>}
      <ol className="mt-4 flex gap-1" aria-label={`Stage ${stageIndex + 1} of ${DESIGN_REQUEST_STAGES.length}: ${stage.label}`}>
        {DESIGN_REQUEST_STAGES.map((entry, index) => (
          <li key={entry.key} className={`h-1.5 flex-1 rounded-full ${index <= stageIndex ? 'bg-forest-accent' : 'bg-line'}`} />
        ))}
      </ol>
      <p className="mt-2 text-compact font-semibold text-ink">{stage.label}</p>
      <p className="text-xs text-ink-muted">
        {stage.detail} Needed by {formatDate(request.launchBy)}.
      </p>
    </li>
  )
}
