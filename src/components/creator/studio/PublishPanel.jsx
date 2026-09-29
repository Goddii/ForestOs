import { Link } from 'react-router-dom'
import { CheckCircle2, CircleAlert, ExternalLink } from 'lucide-react'
import { CodeStateBadge, StatusBadge, formatDate } from '../ui'
import { publishReadiness } from '../../../lib/creator/experience'

/**
 * Publish checks, the publish action, and the per-batch pack codes that
 * open this experience with the state of each (live, proof, scheduled, or
 * blocked while its batch awaits verification).
 */
export default function PublishPanel({ experience, codes, qrPath, onPublish }) {
  const { ready, checks } = publishReadiness(experience, experience.template)
  const isPublished = experience.status === 'published'

  return (
    <div className="grid gap-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Publish</h2>
          <StatusBadge status={experience.status} />
        </div>
        <ul className="mt-4 grid gap-2">
          {checks.map((check) => (
            <li key={check.id} className="flex gap-2.5 text-compact">
              {check.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-label="Done" />
              ) : (
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-label="To do" />
              )}
              <span>
                <span className={check.ok ? 'text-ink' : 'font-semibold text-ink'}>{check.label}</span>
                {!check.ok && <span className="block text-compact text-ink-muted">{check.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
        {isPublished ? (
          <p className="mt-4 text-compact text-ink-muted">Live since {formatDate(experience.publishedAt)}.</p>
        ) : (
          <button
            type="button"
            onClick={onPublish}
            disabled={!ready}
            className="mt-5 w-full rounded-full bg-forest-accent px-5 py-2.5 text-compact font-semibold text-white transition-colors hover:bg-forest-accent-dark active:translate-y-px disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-muted"
          >
            {ready ? 'Publish experience' : 'Finish the checks to publish'}
          </button>
        )}
      </div>

      <div className="border-t border-line pt-6">
        <h2 className="text-lg font-semibold text-ink">Pack codes</h2>
        <p className="mt-1 text-compact text-ink-muted">One code per batch, printed by ForestOS. Each opens this experience with its own batch record.</p>
        {codes.length === 0 ? (
          <p className="mt-3 text-compact text-ink-muted">No packs carry this experience yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {codes.map((code) => (
              <li key={code.id} className="flex items-center justify-between gap-3 py-2.5 text-compact">
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">Batch #{code.batchId}</span>
                  <span className="block truncate text-compact text-ink-faint">{code.product.name}</span>
                </span>
                <CodeStateBadge state={code.state} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-compact font-semibold">
          <Link to={qrPath} className="text-forest-accent hover:text-forest-accent-dark">
            All QR codes
          </Link>
          <a href={experience.template.route} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-forest-accent hover:text-forest-accent-dark">
            Preview experience <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
