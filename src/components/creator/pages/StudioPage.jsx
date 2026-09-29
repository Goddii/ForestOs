import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, Lock, Plus } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { PageHeader, SectionTitle, StatusBadge } from '../ui'
import { inputClass } from '../../brand/Field'

/**
 * Experience Studio, the starting point: the creator's experiences to keep
 * shaping, and the six controlled templates, each one an existing ForestOS
 * QR experience that opens for real from "Preview experience".
 */
export default function StudioPage() {
  const { experiences, templates, campaigns, createExperience } = useCreator()
  const path = useCreatorPath()
  const navigate = useNavigate()
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id ?? '')

  const start = (templateId) => {
    const id = createExperience(templateId, campaignId)
    if (id) navigate(path(`studio/${id}`))
  }

  return (
    <div className="space-y-14">
      <PageHeader
        title="Experience Studio"
        lede="Pick a template, dress it in your story, music and links, and publish it behind a QR code. The verified ForestOS layer comes with every template and stays exactly as recorded."
        actions={
          <Link
            to={path('design')}
            className="rounded-full border border-line px-4 py-2 text-compact font-semibold text-ink transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft"
          >
            Request a custom design
          </Link>
        }
      />

      <section aria-labelledby="studio-yours">
        <SectionTitle>
          <span id="studio-yours">Your experiences</span>
        </SectionTitle>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {experiences.map((experience) => (
            <li key={experience.id} className="flex flex-wrap items-center gap-4 py-4">
              <img src={experience.template.coverSrc} alt="" className="h-16 w-12 shrink-0 rounded-md object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{experience.name}</p>
                <p className="text-compact text-ink-faint">
                  {experience.campaign.title}, {experience.template.name}
                </p>
              </div>
              <StatusBadge status={experience.status} />
              <Link
                to={path(`studio/${experience.id}`)}
                className="rounded-full border border-line px-4 py-1.5 text-compact font-semibold text-ink transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="studio-templates">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTitle>
              <span id="studio-templates">Start from a template</span>
            </SectionTitle>
            <p className="mt-2 max-w-[60ch] text-compact text-ink-muted">
              Every template is a live ForestOS experience. Sections marked with a lock carry verified data and cannot be removed or edited.
            </p>
          </div>
          <label className="grid gap-1.5 text-compact font-semibold text-ink md:w-72">
            New experiences go into
            <select value={campaignId} onChange={(event) => setCampaignId(event.target.value)} className={inputClass}>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <li key={template.id} className="flex flex-col">
              <img src={template.coverSrc} alt={template.coverAlt} loading="lazy" className="aspect-[4/3] w-full rounded-xl bg-canvas object-cover" />
              <h3 className="mt-4 font-display text-2xl leading-tight text-ink">{template.name}</h3>
              <p className="mt-1.5 text-compact leading-relaxed text-ink-muted">{template.summary}</p>
              <ol className="mt-3 flex flex-wrap gap-1.5" aria-label={`Sections in ${template.name}`}>
                {template.sections.map((section) => (
                  <li
                    key={section.key}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-compact ${
                      section.layer === 'verified' ? 'bg-forest-accent-soft text-forest-accent-dark' : 'bg-canvas text-ink-muted'
                    }`}
                  >
                    {section.layer === 'verified' && <Lock className="h-3 w-3" aria-label="Verified, locked" />}
                    {section.label}
                  </li>
                ))}
              </ol>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <button
                  type="button"
                  onClick={() => start(template.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-forest-accent px-4 py-2 text-compact font-semibold text-white transition-colors hover:bg-forest-accent-dark active:translate-y-px"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> Use this template
                </button>
                <a
                  href={template.route}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-compact font-semibold text-ink transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft"
                >
                  Preview experience <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
