import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sprout } from 'lucide-react'
import CountUp from '../../components/ui/CountUp'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * One participation type, implemented well, per the brief: explore one
 * conservation story. Expanding the card reveals the real Mariashoni block
 * figures already in `batch.block` (not invented) before the visitor commits
 * with "Take part" — so the action follows something they actually read,
 * rather than a bare confirm button.
 */
export default function ParticipateScreen({ copy, batch, onTakePart }) {
  const [expanded, setExpanded] = useState(false)
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex min-h-dvh flex-col bg-forest-950 px-6 pb-16 pt-24">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-2xl text-bone">{copy.participateHeadline}</h1>
          <p className="font-display text-xl text-amber-400">{copy.participateSub}</p>
          <p className="mt-2 text-[15px] text-bone-300">{copy.participateBody}</p>
        </div>

        <div className="rounded-2xl border border-bone/15 bg-forest-900/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-center gap-4 px-5 py-5 text-left"
            aria-expanded={expanded}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-400/40 bg-amber-400/10">
              <Sprout className="h-5 w-5 text-amber-400" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
                Your first action
              </span>
              <span className="block text-[15px] text-bone">{copy.participateActionLabel}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-sage-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid grid-cols-3 gap-4 border-t border-bone/10 px-5 py-5 text-center">
                  <div>
                    <p className="font-mono text-2xl text-bone">
                      <CountUp to={batch.block.covenantHa} duration={1.2} separator="," />
                    </p>
                    <p className="mt-1 text-[11px] text-sage-500">ha under covenant</p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl text-bone">
                      <CountUp to={batch.block.patrolsThisMonth} duration={1.2} />
                    </p>
                    <p className="mt-1 text-[11px] text-sage-500">patrols this month</p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl text-bone">
                      <CountUp to={batch.block.seedlingsPlanted} duration={1.2} separator="," />
                    </p>
                    <p className="mt-1 text-[11px] text-sage-500">seedlings planted</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onTakePart}
          disabled={!expanded}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-forest-950 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-bone/10 disabled:text-bone-500"
        >
          Take part
        </button>
      </div>
    </div>
  )
}
