import { CAPITAL_TIMELINE } from '../../data/investor'

const STATE_STYLE = {
  complete: { dot: 'bg-risk-low', text: 'text-ink' },
  active: { dot: 'bg-forest-accent', text: 'text-ink' },
  upcoming: { dot: 'bg-line-strong', text: 'text-ink-faint' },
}

/**
 * Capital deployment timeline (build brief §7). Every step is explicitly
 * demo data — see the header comment in src/data/investor/capital.js —
 * never presented as a real historical record.
 */
export default function CapitalTimeline() {
  return (
    <ol className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
      {CAPITAL_TIMELINE.map((step) => {
        const style = STATE_STYLE[step.state]
        return (
          <li key={step.period} className="relative border-t-2 border-line pt-4">
            <span
              className={`absolute -top-[5px] left-0 h-2 w-2 rounded-full ${style.dot}`}
              aria-hidden="true"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {step.period}
            </p>
            <p className={`mt-1 text-[15px] font-semibold leading-tight ${style.text}`}>{step.label}</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-muted">{step.detail}</p>
          </li>
        )
      })}
    </ol>
  )
}
