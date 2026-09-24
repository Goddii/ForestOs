import { useWorkspace } from './FunderWorkspaceContext'
import { formatCurrencyShort } from '../../lib/investor/format'

/**
 * The funding agreement's tranches: planned amount and milestone, and
 * whether the money has actually arrived. Received is a fact with a date;
 * a planned tranche never reads as received.
 */
export default function CapitalTimeline() {
  const { capital, asOf } = useWorkspace()

  return (
    <ol className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
      {capital.tranches.map((tranche) => {
        const isReceived = Boolean(tranche.receivedDate)
        const isLate = !isReceived && tranche.plannedDate < asOf
        return (
          <li key={tranche.id} className="relative border-t-2 border-line pt-4">
            <span
              className={`absolute -top-[5px] left-0 h-2 w-2 rounded-full ${isReceived ? 'bg-forest-accent' : isLate ? 'bg-warning' : 'bg-line-strong'}`}
              aria-hidden="true"
            />
            <p className="font-mono text-label uppercase tracking-label-wide text-ink-faint">
              {isReceived ? `Received ${tranche.receivedDate}` : `Planned ${tranche.plannedDate}`}
            </p>
            <p className={`mt-1 text-base font-semibold leading-tight ${isReceived ? 'text-ink' : 'text-ink-muted'}`}>
              {formatCurrencyShort(isReceived ? tranche.receivedKes : tranche.plannedKes)}
            </p>
            <p className="mt-1 text-xs leading-snug text-ink-muted">{tranche.milestone}</p>
            {isLate && <p className="mt-1 text-xs font-medium text-warning">Past its planned date, not yet received</p>}
          </li>
        )
      })}
    </ol>
  )
}
