import { motion } from 'framer-motion'
import { Leaf, ArrowRight, RefreshCw } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * The reward moment: an achievement, not a transaction. No speculative
 * mechanics, no currency — a badge, a status, and a step toward the next one.
 *
 * What changed for v2: this screen reads the durable passport, so it can show
 * a collection that is genuinely larger than it was on the last scan, and a
 * status that can move. A pack already in the collection says so rather than
 * pretending to be new — the honest version of repeat engagement.
 */
export default function EarnScreen({ copy, experience, stats, isNewScan, onContinue }) {
  const reduced = usePrefersReducedMotion()
  const { totalStamps } = experience.collection
  const earnedCount = Math.min(stats.experiences, totalStamps)
  const repeat = isNewScan === false

  return (
    <div className="flex min-h-dvh flex-col bg-forest-950 px-6 pb-8 pt-20">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-7 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sage-300">
          {repeat ? 'Welcome back' : copy.earnHeadline}
        </p>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="grid h-24 w-24 place-items-center rounded-full border-2 border-amber-400 bg-amber-400/10"
        >
          {repeat ? (
            <RefreshCw className="h-9 w-9 text-amber-400" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Leaf className="h-10 w-10 text-amber-400" strokeWidth={1.75} aria-hidden="true" />
          )}
        </motion.div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl text-bone">{stats.tier.label}</h1>
          <p className="text-[14px] text-bone-300">
            {repeat
              ? 'You have scanned this tin before — it is already in your collection.'
              : `Added to your ${experience.communityName}.`}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[13px] text-sage-300">
          <span>
            {stats.experiences} verified {stats.experiences === 1 ? 'product' : 'products'}
          </span>
          <span>
            {stats.communities} {stats.communities === 1 ? 'community' : 'communities'}
          </span>
          {stats.repeatScans > 0 && <span>{stats.scans} scans total</span>}
        </div>

        <div className="w-full space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            {stats.nextTier ? `Next status · ${stats.nextTier.label}` : 'Top status reached'}
          </p>
          <div className="flex gap-1.5">
            {Array.from({ length: totalStamps }, (_, i) => (
              <span
                key={i}
                className="h-2 flex-1 rounded-full"
                style={{
                  backgroundColor:
                    i < earnedCount
                      ? 'var(--color-amber-400)'
                      : 'color-mix(in srgb, var(--color-bone) 14%, transparent)',
                }}
              />
            ))}
          </div>
          <p className="text-[13px] text-bone-500">
            {stats.nextTier
              ? `${stats.toNextTier} more verified ${stats.toNextTier === 1 ? 'product' : 'products'} to reach ${stats.nextTier.label}`
              : `${experience.collection.seriesLabel} — complete`}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-forest-950 transition-transform active:scale-[0.98]"
        >
          See your passport
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
