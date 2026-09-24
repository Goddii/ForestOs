import { useState } from 'react'
import { Copy, Check, Video } from 'lucide-react'
import {
  PROGRAMME_STORIES,
  SEEDLING_BATCHES,
  CORE_OUTCOMES,
  EXPENDITURES,
  getMediaById,
  getEvidenceById,
} from '../../data/investor'
import { attributedValue, fundShare } from '../../lib/investor/attribution'
import { formatNumber } from '../../lib/investor/format'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import { useWorkspace } from './FunderWorkspaceContext'
import MediaFigure from './MediaFigure'
import ActionButton from './ui/ActionButton'

const OUTCOMES_BY_ID = Object.fromEntries(CORE_OUTCOMES.map((outcome) => [outcome.id, outcome]))
const EXPENDITURE_BY_ID = new Map(EXPENDITURES.map((row) => [row.id, row]))

const isPlanted = (batch) => batch.stages.some((stage) => stage.stage === 'Planting' && stage.status === 'done')

/**
 * A story's headline figure, resolved from the data layer so a story can
 * never claim more than the console shows: the whole-programme figure, and
 * this funder's part of it. Seedlings attribute *directly* (batches this
 * funder's payments paid for). Other outcomes are shared across funders, so
 * a pro-rata share is shown only in an investment workspace, with the
 * method stated. Seedlings count only batches whose planting is done.
 *
 * @param {import('../../data/investor/types').ProgrammeStory['statSource']} source
 * @param {import('../../data/funder/workspace').FunderWorkspace} workspace
 * @returns {{ gross: string, yours: string | null, yoursLabel: string, label: string }}
 */
function resolveStat(source, workspace) {
  const format = (value, unit) => `${formatNumber(Math.round(value))}${unit ? ` ${unit}` : ''}`
  if (source.kind === 'batches') {
    const planted = SEEDLING_BATCHES.filter(isPlanted)
    const funded = planted.filter((batch) =>
      batch.expenditureIds.some((id) => workspace.allocationIds.has(EXPENDITURE_BY_ID.get(id)?.categoryId)),
    )
    const sum = (batches) => batches.reduce((total, batch) => total + batch.quantity, 0)
    return {
      gross: format(sum(planted)),
      yours: format(sum(funded)),
      yoursLabel: `paid for by ${workspace.terms.yours}`,
      label: 'native seedlings planted and tagged',
    }
  }
  const outcome = OUTCOMES_BY_ID[source.outcomeId]
  const share = fundShare(workspace.programmeFunding)
  return {
    gross: format(outcome.value, outcome.unit),
    yours: workspace.terms.showsAttribution ? format(attributedValue(outcome.value, share), outcome.unit) : null,
    yoursLabel: `(${Math.round(share * 1000) / 10}%) attributable to ${workspace.terms.yours}, pro-rata`,
    label: outcome.label.toLowerCase(),
  }
}

function VideoSlot({ posterMediaId }) {
  const poster = getMediaById(posterMediaId)
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-canvas-sunk">
        {poster && (
          <img
            src={`${poster.src}.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
          />
        )}
        <div className="absolute inset-0 grid place-items-center text-center">
          <p className="flex flex-col items-center gap-1.5 font-mono text-label uppercase tracking-label text-ink">
            <Video className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            Field video pending upload
          </p>
        </div>
      </div>
      {poster && (
        <figcaption className="mt-1.5 text-label text-ink-faint">
          Poster photo:{' '}
          <a href={poster.credit.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-ink-muted">
            {poster.credit.author}
          </a>{' '}
          · {poster.credit.license}
        </figcaption>
      )}
    </figure>
  )
}

function CopyCaption({ text }) {
  const [state, setState] = useState('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <ActionButton variant="ghost" icon={state === 'copied' ? Check : Copy} iconPosition="left" onClick={copy}>
        {state === 'copied' ? 'Caption copied' : 'Copy caption'}
      </ActionButton>
      <span aria-live="polite" className="text-label text-ink-faint">
        {state === 'failed' && 'Copy blocked by the browser — select the text instead.'}
      </span>
    </span>
  )
}

/**
 * The programme showcase — share-ready stories a fund manager can put in an
 * LP letter or a public post: a photo, a headline figure pulled live from
 * the data layer, the evidence behind it, a video slot (pending until the
 * field team uploads footage) and a one-click caption that carries the
 * photo credit its licence requires. Photos flagged `showsPeople` are noted
 * as needing consented replacements before public use.
 */
export default function ProgrammeShowcase() {
  const { openEvidence } = useEvidenceDrawer()
  const workspace = useWorkspace()

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {PROGRAMME_STORIES.map((story) => {
        const photo = getMediaById(story.mediaId)
        const stat = resolveStat(story.statSource, workspace)
        const evidence = story.evidenceIds.map(getEvidenceById).filter(Boolean)
        const yoursClause = stat.yours ? `, ${stat.yours} ${stat.yoursLabel}` : ''
        const caption = `${story.title}: ${stat.gross} ${stat.label} across the whole programme${yoursClause}. ${story.summary} Evidence on record in ForestOS (demo data). Photo: ${photo.credit.author}, ${photo.credit.license}.`
        return (
          <article key={story.id} className="flex flex-col">
            <MediaFigure asset={photo} />
            <p className="mt-4 font-mono text-label uppercase tracking-label-wide text-forest-accent">{story.programme}</p>
            <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">{story.title}</h3>
            <p className="mt-2 text-3xl font-bold leading-none tabular-nums text-ink">
              {stat.gross}
              <span className="ml-2 text-compact font-medium text-ink-muted">{stat.label}, whole programme</span>
            </p>
            {stat.yours && (
              <p className="mt-1 text-compact tabular-nums text-ink-muted">
                <span className="font-semibold text-ink">{stat.yours}</span> {stat.yoursLabel}
              </p>
            )}
            <p className="mt-3 text-compact leading-relaxed text-ink-muted">{story.summary}</p>

            <div className="mt-4">
              <VideoSlot posterMediaId={story.video.posterMediaId} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <CopyCaption text={caption} />
              {evidence.map((record) => (
                <ActionButton key={record.id} variant="text" onClick={() => openEvidence(record.id)}>
                  {record.title}
                </ActionButton>
              ))}
            </div>
            {photo.showsPeople && (
              <p className="mt-2 text-label text-warning">
                Shows identifiable people — replace with a consented field photo before public use.
              </p>
            )}
          </article>
        )
      })}
    </div>
  )
}
