import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import Reveal from '../components/Reveal'

/**
 * Identity, not a gamification gimmick — becoming a Guardian is framed as
 * who you are now, not points earned. "Guardian" and "Guardian Edition" are
 * the real product/collection names (`BRANDS.nyashinski.product`), not
 * invented terminology.
 *
 * @param {{ editionName: string, onContinue: () => void }} props
 */
export default function GuardianReveal({ editionName, onContinue }) {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="grid min-h-svh place-items-center bg-ink px-6 py-24 text-center text-bone sm:px-10">
      <div className="max-w-lg">
        <motion.div
          initial={reduced ? false : { scale: 0.85, opacity: 0 }}
          whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-400/50 text-emerald-400"
        >
          <span className="font-display text-2xl">G</span>
        </motion.div>

        <Reveal delay={0.1} className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-bone-500">
            {editionName}
          </p>
          <h2 className="mt-3 font-display text-5xl leading-[1.0] sm:text-6xl">
            You're in.
            <br />
            Welcome, Guardian.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-bone-300">
            Not a badge you collect — a role you carry. Every pack you trace
            back here is one more reason this forest stays standing.
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-bone/40 px-6 py-3 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            See who else is in
          </button>
        </Reveal>
      </div>
    </section>
  )
}
