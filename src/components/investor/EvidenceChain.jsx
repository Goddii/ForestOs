import { Check, X } from 'lucide-react'
import { getEvidenceChain } from '../../lib/investor/evidenceChain'

/**
 * "How do we know?" — a signature ForestOS component (design-review brief
 * §14): for an important claim, show which evidence types actually back it
 * instead of a single confidence label standing alone.
 *
 * @param {{
 *   status: import('../../data/investor/types').ConfidenceStatus,
 *   lastVerified?: string,
 *   className?: string,
 * }} props
 */
export default function EvidenceChain({ status, lastVerified, className = '' }) {
  const items = getEvidenceChain(status)

  return (
    <div className={className}>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
        How do we know?
      </p>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-1.5 text-[12px] font-medium">
            {item.present ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-forest-accent" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-ink-faint/50" strokeWidth={2} aria-hidden="true" />
            )}
            <span className={item.present ? 'text-ink-muted' : 'text-ink-faint/70'}>{item.label}</span>
          </li>
        ))}
      </ul>
      {lastVerified && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          Last verified {lastVerified}
        </p>
      )}
    </div>
  )
}
