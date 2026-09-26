import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Paperclip } from 'lucide-react'
import { getInterventionType } from '../../../data/funder/interventionTypes'
import { BUFFER_SEGMENTS } from '../../../data/funder/geography'
import { INDEPENDENCE_LABELS, STATE_LABELS, currentState, latestDecision } from '../../../lib/programme/verificationState'
import { getForestosPhoto } from '../../../data/brand/assets'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import { useEvidenceDrawer } from '../../investor/EvidenceDrawerContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import Badge from '../../investor/ui/Badge'
import { SourceTag } from '../StatusBadges'

const segmentLabel = (id) => BUFFER_SEGMENTS.find((segment) => segment.id === id)?.label ?? id

function ActivityRow({ activity, isLast }) {
  const { openEvidence } = useEvidenceDrawer()
  const state = currentState(activity.verification)
  const decision = latestDecision(activity.verification)
  const verified = state === 'verified'
  return (
    <li className="relative grid grid-cols-[2rem_1fr] gap-4 pb-7 last:pb-0">
      {!isLast && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-line" />}
      <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${verified ? 'border-forest-accent bg-forest-accent text-white' : 'border-line-strong bg-card text-ink-faint'}`}>
        {verified ? <CheckCircle2 className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" /> : <Clock className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="font-mono text-label uppercase tracking-label text-ink-faint">
          {activity.date}, {segmentLabel(activity.segmentId)}
        </p>
        <p className="mt-1 font-semibold text-ink">{activity.summary}</p>
        <p className="mt-0.5 text-compact text-ink-muted">{getInterventionType(activity.interventionTypeId)?.label}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone={verified ? 'verified' : 'warning'}>{STATE_LABELS[state]}</Badge>
          {verified && decision && (
            <span className="text-xs text-ink-muted">
              {decision.at}, {INDEPENDENCE_LABELS[decision.independence].toLowerCase()}
            </span>
          )}
        </div>
        {activity.evidenceIds.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {activity.evidenceIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => openEvidence(id)}
                className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-forest-accent transition-colors hover:border-forest-accent/40 hover:bg-forest-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                <Paperclip className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                Evidence {id}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

export default function StoryPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const { evidence } = ws
  const timeline = [...evidence.verified, ...evidence.pending].sort((a, b) => b.date.localeCompare(a.date))
  const landscapes = [...new Set(ws.lots.map((lot) => lot.landscape))]
  const hero = getForestosPhoto(landscapes.includes('Mau Forest Complex') ? 'fos-mau-forest' : 'fos-mt-kenya')

  return (
    <div className="space-y-12">
      <PageHeader
        title="Conservation story"
        description="What has been done, and checked, in the forest buffer beside the tea gardens your lots come from. This is ForestOS’s record, the raw material for your story: you choose what to tell, and the Content & claims page checks how you tell it."
        meta={<SourceTag kind="forestos" />}
      />

      <section aria-label="Where your tea grows" className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {hero && (
          <figure>
            <picture>
              <source srcSet={`${hero.src}.webp`} type="image/webp" />
              <img src={`${hero.src}.jpg`} alt={hero.alt} width={hero.width} height={hero.height} className="aspect-[3/2] w-full rounded-2xl object-cover" />
            </picture>
            <figcaption className="mt-2 text-xs text-ink-faint">
              {hero.caption}. Illustrative photo{hero.credit ? `: ${hero.credit.author}, ${hero.credit.license}` : ''}.
            </figcaption>
          </figure>
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Where your tea grows</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink">
            {ws.lots.length === 0 && <p className="text-ink-muted">Connect a lot to a product to see its landscape.</p>}
            {evidence.centres.length > 0 && (
              <p>
                Your {ws.lots.filter((lot) => evidence.centres.some((centre) => centre.id === lot.centre?.id)).length > 1 ? 'lots come' : 'lot comes'} through{' '}
                {evidence.centres.map((centre) => centre.name).join(' and ')} collection {evidence.centres.length === 1 ? 'centre' : 'centres'}, in the ~100 m tea belt NTZDC
                keeps between smallholder farms and the forest edge. The belt’s job is to hold that edge: tea and fuelwood trees give households income and firewood
                without cutting into the forest.
              </p>
            )}
            {ws.lots
              .filter((lot) => !lot.centre?.segmentIds.length)
              .map((lot) => (
                <p key={lot.traceId} className="text-ink-muted">
                  Lot #{lot.code} comes from {lot.block} ({lot.region}). Its origin is verified, but no conservation work in the buffer there is on record yet, so it adds
                  no conservation story.
                </p>
              ))}
          </div>
          {evidence.segmentIds.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {evidence.segmentIds.map((id) => (
                <li key={id} className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted">
                  {segmentLabel(id)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-label="Verified work">
        <SectionHeading
          title="What has been done and checked"
          description={
            timeline.length > 0
              ? `${evidence.verified.length} verified records and ${evidence.pending.length} still being verified. Open any evidence file to see what supports it.`
              : undefined
          }
          action={
            <Link to={path('impact')} className="text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
              What you can say about it
            </Link>
          }
        />
        {timeline.length === 0 ? (
          <p className="max-w-[65ch] rounded-2xl border border-dashed border-line-strong px-5 py-4 text-compact text-ink-muted">
            No conservation work is recorded in the buffer segments linked to your lots. Your products can still show verified origin; for a conservation story,
            source from a centre next to verified buffer work (Kiptunga or Nessuit today).
          </p>
        ) : (
          <ol className="max-w-3xl">
            {timeline.map((activity, index) => (
              <ActivityRow key={activity.id} activity={activity} isLast={index === timeline.length - 1} />
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
