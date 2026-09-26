import { Link } from 'react-router-dom'
import ContentCard from '../investor/ui/ContentCard'
import { AccessBadge, StageStatusBadge } from './StatusBadges'
import { JourneyStrip } from './TraceJourney'
import { useOfftakerPath } from './OfftakerWorkspaceContext'

/**
 * One batch at a glance: identity, volume, grade, where it came from, and
 * whether its journey holds. Links to the full batch view.
 *
 * @param {{ batch: import('../../data/offtaker/workspace').OfftakerWorkspace['batches'][number] }} props
 */
export default function BatchCard({ batch }) {
  const path = useOfftakerPath()
  const { journey } = batch
  return (
    <ContentCard className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={path(`batches/${batch.traceId}`)}
            className="whitespace-nowrap font-mono text-sm font-semibold text-ink underline-offset-4 hover:text-forest-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          >
            {batch.traceId}
          </Link>
          <p className="mt-0.5 text-xs text-ink-muted">
            {batch.centre?.name} collection centre, {batch.zone}
          </p>
        </div>
        <AccessBadge access={batch.access} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-line py-3">
        <div>
          <dt className="text-label text-ink-faint">Made tea</dt>
          <dd className="text-base font-bold tabular-nums text-ink">{batch.madeTeaKg.toLocaleString('en-US')} kg</dd>
        </div>
        <div>
          <dt className="text-label text-ink-faint">Grade</dt>
          <dd className="text-base font-bold text-ink">{batch.grade}</dd>
        </div>
        <div>
          <dt className="text-label text-ink-faint">Sealed</dt>
          <dd className="text-sm font-semibold tabular-nums text-ink">{batch.sealedAt}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <JourneyStrip journey={journey} />
        {journey.fullyTraced ? (
          <StageStatusBadge status="verified" />
        ) : journey.exceptions.length ? (
          <StageStatusBadge status="flagged" />
        ) : (
          <StageStatusBadge status="pending" />
        )}
      </div>
      <p className="mt-2 text-xs text-ink-faint">
        {journey.verifiedCount} of 5 supply stages verified
        {journey.exceptions.length > 0 && `, exception at ${journey.exceptions.join(', ')}`}
      </p>
    </ContentCard>
  )
}
