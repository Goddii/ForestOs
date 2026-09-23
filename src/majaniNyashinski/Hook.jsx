import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import Waveform from './Waveform'

// Cheap SVG-noise grain — a data URI, not a shipped image asset. Kept at a
// low opacity as texture, never as a fake-imagery substitute for the real
// photo beneath it.
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const EASE = [0.16, 1, 0.3, 1]

/**
 * The hook — full-screen Nyashinski portrait, premium/editorial tone. A
 * slow GSAP-driven Ken Burns zoom (no video scrub, unlike the home hero's
 * `useCanopyDive` — this is a single real photo, `nyashinski-ritual.jpg`)
 * plus typography reveal and a waveform detail. GSAP/ScrollTrigger loaded
 * dynamically, matching `useCanopyDive`'s bundle-splitting convention —
 * nothing here needs the ~44KB (gzip) chunk before the visitor scrolls.
 *
 * @param {{ onEnter: () => void }} props
 */
export default function Hook({ onEnter }) {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    if (!section || !image || reduced) return

    let ctx
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          gsap.fromTo(
            image,
            { scale: 1.04 },
            {
              scale: 1.18,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
              },
            },
          )
        }, section)
      },
    )

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [reduced])

  return (
    <section ref={sectionRef} className="relative h-svh overflow-hidden bg-ink">
      <img
        ref={imageRef}
        src="/media/brand/nyashinski-tin.jpg"
        alt="Majani × Nyashinski Guardian Edition tea tin, refill pouch and beaded bracelet"
        className="absolute inset-0 h-full w-full object-cover object-[28%_center]"
        fetchPriority="high"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_URL }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone-500"
        >
          Majani × Nyashinski
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="mt-3 font-display text-5xl leading-[0.98] text-bone sm:text-7xl"
        >
          A different kind
          <br />
          of listening
          <br />
          experience.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mt-8 flex items-center gap-4"
        >
          <Waveform active className="h-6 w-24 text-bone/60" barClassName="bg-bone/60" />
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex items-center gap-2 rounded-full border border-bone/40 px-6 py-3 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone/60"
          >
            Enter
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">
              ↓
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
