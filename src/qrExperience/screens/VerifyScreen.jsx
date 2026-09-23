import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function VerifyScreen({ copy, communityName, batch, onContinue }) {
  const reduced = usePrefersReducedMotion()
  const enter = (delay) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
        }

  return (
    <div className="flex min-h-dvh flex-col bg-forest-950 px-6 pb-4 pt-16">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-5">
        <motion.div {...enter(0)} className="flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-amber-400/40 bg-amber-400/10">
            <ShieldCheck className="h-7 w-7 text-amber-400" strokeWidth={2} aria-hidden="true" />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">Authentic</p>
          <h1 className="font-display text-4xl text-bone">Verified</h1>
        </motion.div>

        <motion.div {...enter(0.12)} className="text-center">
          <p className="font-display text-xl text-bone">{copy.verifyHeadline}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-bone-300">{copy.verifyBody}</p>
        </motion.div>

        <motion.div
          {...enter(0.24)}
          className="rounded-2xl border border-bone/15 bg-forest-900/60 p-5"
        >
          <dl className="grid grid-cols-2 gap-y-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">{communityName}</dt>
              <dd className="mt-1 text-[15px] text-bone">{batch.product}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">Batch</dt>
              <dd className="mt-1 font-mono text-[15px] text-bone">{batch.id}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">Origin</dt>
              <dd className="mt-1 text-[15px] text-bone">{batch.block.name}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">Status</dt>
              <dd className="mt-1 text-[15px] text-bone">{batch.verification.status}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-bone/10 pt-3 text-[13px] text-bone-300">
            This product has been verified through ForestOS.
          </p>
        </motion.div>

        <motion.p {...enter(0.32)} className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">
          Powered by ForestOS
        </motion.p>
      </div>

      <motion.button
        {...enter(0.4)}
        type="button"
        onClick={onContinue}
        className="mx-auto mt-6 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-forest-950 transition-transform active:scale-[0.98]"
      >
        Discover the story
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
      </motion.button>
    </div>
  )
}
