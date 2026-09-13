import { Suspense, lazy, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Reveal from '../Reveal'
import CountUp from '../ui/CountUp'
import { useInViewport } from '../../hooks/useInViewport'
import { BELT_BLOCKS } from '../../lib/platformData'

// Same split rationale as GlobeSection/BufferBeltViewer — three.js + r3f is
// a heavy chunk, so it loads lazily and only once this section is reachable.
const CanopyBackdrop = lazy(() => import('../../scenes/homeAmbient/CanopyBackdrop'))

const SORTED_BLOCKS = [...BELT_BLOCKS].sort((a, b) => b.hectares - a.hectares)
const TOTAL_COUNTIES = new Set(BELT_BLOCKS.flatMap((b) => b.counties)).size
const TOTAL_HECTARES = BELT_BLOCKS.reduce((sum, b) => sum + b.hectares, 0)

/**
 * One row of the ledger — its own IntersectionObserver so the belt-line dot
 * beside it can light up while that block is near the middle of the
 * viewport, a plain scroll-position cue rather than decoration.
 */
function LedgerRow({ block, delay }) {
  const [ref, active] = useInViewport({ rootMargin: '-42% 0px -42% 0px' })

  return (
    <Reveal delay={delay}>
      <div ref={ref} className="relative flex items-center gap-5 py-5 pl-8 sm:gap-8 sm:pl-10">
        <span
          aria-hidden="true"
          className={
            'absolute left-0 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-forest-950 transition-colors duration-300 ' +
            (active ? 'bg-river-500' : 'bg-forest-700')
          }
        />

        <div className="min-w-0 flex-1">
          <p className="font-display text-lg text-bone sm:text-xl">{block.name}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
            {block.counties.length} counties · {block.collectionCentres.length} collection centres
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="tnum font-display text-3xl leading-none text-bone sm:text-4xl">
            <CountUp to={block.hectares} separator="," duration={1.4} />
          </p>
          <p className="mt-1 text-[11px] text-bone-500">hectares under covenant</p>
        </div>
      </div>
    </Reveal>
  )
}

/**
 * The belt, quantified — sits right after GlobeSection, which shows and
 * names the five blocks on the 3D map; this turns that same list into a
 * ledger. A sticky claim (two-weight headline, same serif, hierarchy from
 * colour alone) holds the left column while the five blocks scroll past on
 * the right, each tallied against a belt-line spine that actually draws
 * itself in as the list scrolls (an SVG `pathLength` tied to scroll
 * progress via `useScroll`/`useTransform` — motion.dev's own pattern for
 * scroll-linked line drawing), with each row's dot lighting up as it nears
 * the middle of the viewport and its hectare figure counting up in place.
 */
export default function BeltLedger() {
  const [sectionRef, inView] = useInViewport({ rootMargin: '400px 0px' })
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start end', 'end start'],
  })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      id="belt-ledger"
      className="relative z-10 scroll-mt-20 overflow-hidden bg-forest-950 py-20 sm:py-28"
    >
      {/* A held glimpse of the same low-poly canopy Act1Scene uses for the
          batch story — an ambient backdrop, not a hero moment, so it only
          mounts once this section is reachable. The wash is opaque at the
          seams (Video-Bleed Section Rule, same as every other section) but
          genuinely sheer through the middle — a /70 mid-stop here once left
          only 30% of the canopy visible, which read as barely there. */}
      <Suspense fallback={null}>
        <CanopyBackdrop active={inView} />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/15 to-forest-950" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <img
            src="/media/forest1-poster.jpg"
            alt="Mist over the tea belt's forest canopy"
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="h-28 w-44 rounded-2xl object-cover shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] sm:h-32 sm:w-52"
          />

          <p className="mt-6 max-w-[20ch] font-display text-3xl leading-[1.1] sm:text-4xl">
            <span className="text-bone-500">Five forest blocks hold the edge.</span>{' '}
            <span className="text-bone">Every hectare is on this ledger.</span>
          </p>

          <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-sage-300">
            Mau, the Aberdares, Mt. Kenya, Cherangany and Mt. Elgon each carry their own
            hectare count, county list and collection centres, verified and summed below.
          </p>
        </div>

        <div>
          <div ref={listRef} className="relative divide-y divide-bone/10">
            {/* The belt-line spine — a faint full-height track plus a
                brighter stroke that draws itself in as the list scrolls,
                rather than sitting fully drawn from the first frame. */}
            <svg
              aria-hidden="true"
              className="absolute left-0 top-2 bottom-2 w-0.5 -translate-x-1/2 overflow-visible"
              viewBox="0 0 1 100"
              preserveAspectRatio="none"
            >
              <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--color-river-500)" strokeOpacity="0.18" strokeWidth="1" />
              <motion.line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="var(--color-river-500)"
                strokeOpacity="0.75"
                strokeWidth="1"
                style={{ pathLength }}
              />
            </svg>
            {SORTED_BLOCKS.map((block, index) => (
              <LedgerRow key={block.id} block={block} delay={index * 0.06} />
            ))}
          </div>

          <div className="mt-6 flex items-baseline justify-between border-t border-amber-400/25 pt-6 pl-8 sm:pl-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">
              Whole belt · {TOTAL_COUNTIES} counties
            </p>
            <p className="tnum font-display text-2xl text-amber-400">
              <CountUp to={TOTAL_HECTARES} separator="," duration={1.8} /> ha
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
