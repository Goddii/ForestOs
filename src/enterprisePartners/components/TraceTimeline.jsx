import { useState } from 'react'
import { TRACE_STEPS } from '../data/traceChain'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function TraceTimeline({ activeIndex = TRACE_STEPS.length - 1, compact = false }) {
  const reduced = usePrefersReducedMotion()
  const [focused, setFocused] = useState(activeIndex)

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {TRACE_STEPS.map((step, i) => {
        const active = i <= activeIndex
        const isFocus = focused === i
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => setFocused(i)}
            className={
              'group relative flex w-full items-stretch gap-3 rounded-xl border px-3 py-3 text-left transition-colors ep-motion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 ' +
              (isFocus
                ? 'border-river-400/40 bg-forest-900/80'
                : 'border-bone/10 bg-forest-900/40 hover:border-bone/20')
            }
          >
            <div className="flex flex-col items-center pt-0.5">
              <span
                className={
                  'grid h-8 w-8 place-items-center rounded-full border font-mono text-[10px] ' +
                  (active
                    ? 'ep-brand-border ep-brand-bg-soft ep-brand-accent ep-node-active'
                    : 'border-bone/15 text-sage-500')
                }
              >
                {i + 1}
              </span>
              {i < TRACE_STEPS.length - 1 ? (
                <span
                  className={
                    'mt-1 w-px flex-1 min-h-[12px] ' +
                    (active ? 'bg-river-400/50' : 'bg-bone/10')
                  }
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
                {step.label}
              </p>
              {!compact || isFocus ? (
                <p className="mt-1 text-[13px] leading-relaxed text-bone-300">{step.hint}</p>
              ) : null}
            </div>
            {!reduced && active && i === activeIndex ? (
              <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-river-400" aria-hidden="true" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
