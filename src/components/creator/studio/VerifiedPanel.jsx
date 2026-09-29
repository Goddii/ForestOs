import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Panel } from './CreativePanels'

/**
 * The verified ForestOS layer as the creator sees it in the editor: shown
 * as read-only fields so it is obvious what the experience will say, and
 * that none of it can be changed here. A figure whose method is still
 * pending is shown with that status, never as verified.
 */
export default function VerifiedPanel({ verified, storyPath }) {
  const facts = [...verified.landscape, ...verified.activity, ...verified.pending]
  return (
    <Panel
      title="ForestOS data"
      aside={
        <span className="inline-flex items-center gap-1.5 text-compact font-semibold text-forest-accent-dark">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Locked
        </span>
      }
    >
      <p className="-mt-2 mb-4 text-compact text-ink-muted">
        From batch {verified.batchId} ({verified.traceId}), {verified.verification.standard.toLowerCase()}, {verified.verification.status.toLowerCase()}. You cannot change these values; they update when the record does.
      </p>
      <dl className="grid gap-2 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.id} className="rounded-xl bg-canvas px-3.5 py-2.5">
            <dt className="flex items-center justify-between gap-2 text-compact text-ink-faint">
              {fact.label}
              <Lock className="h-3 w-3 shrink-0" aria-label="Locked" />
            </dt>
            <dd className="mt-0.5 text-compact font-semibold text-ink">{fact.value}</dd>
            {fact.status === 'method_pending' && <dd className="mt-1 text-compact text-warning">Not shown to scanners until the method is agreed</dd>}
          </div>
        ))}
      </dl>
      <Link to={storyPath} className="mt-4 inline-block text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
        Where these come from
      </Link>
    </Panel>
  )
}
