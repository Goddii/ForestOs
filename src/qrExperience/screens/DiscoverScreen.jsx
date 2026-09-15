import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import LoopingVideo from '../../components/LoopingVideo'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function DiscoverScreen({ copy, batch, media, onContinue }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative flex min-h-dvh flex-col">
      <LoopingVideo src={media.storyLoop} className="fixed inset-0 -z-10 h-full w-full object-cover" />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(8,20,14,0.5) 100%),' +
            'linear-gradient(to bottom, rgba(8,20,14,0.4) 0%, transparent 22%, transparent 60%, rgba(8,20,14,0.92) 100%)',
        }}
      />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between gap-12 px-6 py-24">
        <div className="space-y-3 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sage-300">{copy.discoverEyebrow}</p>
          <h1 className="font-display text-2xl text-bone">{batch.block.name}</h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">Kenya</p>
        </div>

        <div className="space-y-5 text-center">
          <p className="font-display text-xl leading-snug text-bone">{copy.discoverHeadline}</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {copy.discoverBeats.map((beat, i) => (
              <motion.span
                key={beat}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                className="text-[15px] text-bone-300"
              >
                {beat}
              </motion.span>
            ))}
          </div>
          <p className="text-[15px] text-bone-300">{copy.discoverClose}</p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bone/25 bg-forest-950/50 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-bone backdrop-blur-sm transition-transform active:scale-[0.98]"
        >
          Now see the proof
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
