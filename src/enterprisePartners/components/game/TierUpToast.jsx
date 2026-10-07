import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

/**
 * Tier-up is one short animation (brief 5.5), announced politely for screen
 * readers and skipped entirely under reduced motion. Tiers unlock content,
 * never discounts — the copy says so.
 */
export default function TierUpToast({ tier, onDismiss, duration = 4200 }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!tier) return undefined
    const id = window.setTimeout(() => onDismiss?.(), duration)
    return () => window.clearTimeout(id)
  }, [tier, duration, onDismiss])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 safe-area-inset-bottom">
      <AnimatePresence>
        {tier ? (
          <motion.div
            key={tier.id}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border ep-brand-border bg-forest-900/95 p-4 shadow-lg backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Tier up
            </p>
            <p className="mt-1 font-display text-xl text-bone">{tier.label}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-bone-400">{tier.unlocks}</p>
            <button
              type="button"
              onClick={() => onDismiss?.()}
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500 underline-offset-4 hover:text-bone hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
            >
              Dismiss
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
