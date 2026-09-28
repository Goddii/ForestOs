import { Link } from 'react-router-dom'
import { CheckCircle2, CircleAlert, Lock, PenLine } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { PageHeader, SectionTitle, StatusBadge } from '../ui'
import { findFigureClaims } from '../../../lib/creator/experience'

const YOURS = ['Headline and subline', 'Your story and narrative order', 'Imagery and music', 'Calls to action and links']
const FORESTOS = ['Hectares and area figures', 'Conservation activity', 'Verification status', 'Source location', 'Verified impact figures']

/**
 * The creator's words across every experience, checked against the one
 * rule that matters here: impact figures come from ForestOS, never from
 * creative copy. The split between the two layers is spelled out first.
 */
export default function ContentPage() {
  const { experiences } = useCreator()
  const path = useCreatorPath()

  return (
    <div className="space-y-16">
      <PageHeader title="Content" lede="Your creative copy, in one place, with a check on every piece before it reaches your community." />

      <section aria-labelledby="content-split" className="grid gap-6 md:grid-cols-2">
        <h2 id="content-split" className="sr-only">
          What you can and cannot change
        </h2>
        <div className="rounded-2xl bg-canvas p-6">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <PenLine className="h-4 w-4 text-forest-accent" aria-hidden="true" /> Yours to shape
          </p>
          <ul className="mt-4 grid gap-2 text-compact text-ink-muted">
            {YOURS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-forest-accent-soft p-6">
          <p className="flex items-center gap-2 font-semibold text-forest-accent-dark">
            <Lock className="h-4 w-4" aria-hidden="true" /> Verified by ForestOS, locked
          </p>
          <ul className="mt-4 grid gap-2 text-compact text-forest-accent-dark">
            {FORESTOS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="content-copy">
        <SectionTitle>
          <span id="content-copy">Your copy</span>
        </SectionTitle>
        <ul className="mt-6 grid gap-10">
          {experiences.map((experience) => {
            const { creative } = experience
            const figures = findFigureClaims(`${creative.headline} ${creative.subline} ${creative.narrative}`)
            return (
              <li key={experience.id} className="grid gap-4 border-t border-line pt-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
                <div>
                  <p className="font-semibold text-ink">{experience.name}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{experience.campaign.title}</p>
                  <div className="mt-2">
                    <StatusBadge status={experience.status} />
                  </div>
                </div>
                <div>
                  <p className="font-display text-3xl leading-tight text-ink">{creative.headline || <span className="text-ink-faint">No headline yet</span>}</p>
                  {creative.subline && <p className="mt-2 text-[15px] text-ink-muted">{creative.subline}</p>}
                  {creative.narrative ? (
                    <p className="mt-3 max-w-[65ch] text-compact leading-relaxed text-ink-muted">{creative.narrative}</p>
                  ) : (
                    <p className="mt-3 text-compact text-ink-faint">No story written yet.</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-compact">
                    {figures.length ? (
                      <span className="inline-flex items-center gap-1.5 text-warning">
                        <CircleAlert className="h-4 w-4" aria-hidden="true" /> Remove {figures.join(', ')}; ForestOS supplies the figures
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-forest-accent-dark">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> No figures in your own words
                      </span>
                    )}
                    <span className="text-ink-faint">{creative.statementIds.length} approved statements quoted</span>
                    <Link to={path(`studio/${experience.id}`)} className="font-semibold text-forest-accent hover:text-forest-accent-dark">
                      Edit in Studio
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
