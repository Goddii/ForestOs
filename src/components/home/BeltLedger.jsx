import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CountUp from '../ui/CountUp'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useInViewport } from '../../hooks/useInViewport'
import { BELT_BLOCKS } from '../../lib/platformData'

const SORTED_BLOCKS = [...BELT_BLOCKS].sort((a, b) => b.hectares - a.hectares)
const TOTAL_COUNTIES = new Set(BELT_BLOCKS.flatMap((b) => b.counties)).size
const TOTAL_HECTARES = BELT_BLOCKS.reduce((sum, b) => sum + b.hectares, 0)
const TOTAL = SORTED_BLOCKS.length

// How far (px) or how fast (px/s) a drag has to travel before it counts as
// a swipe rather than springing back to centre.
const SWIPE_DISTANCE = 90
const SWIPE_VELOCITY = 500
// How long the stack holds on a card before auto-advancing.
const AUTOPLAY_MS = 4500

// Real photos of each block, sourced from Wikimedia Commons under
// CC BY-SA (credited in-card, bottom-right of each photo, per the
// licence's attribution requirement). Cherangany's source photo included
// identifiable people who hadn't consented to appearing on a commercial
// site, so it's cropped to the tree line above them, not used as shot.
const BLOCK_PHOTOS = {
  mau: {
    jpg: '/media/forests/mau.jpg',
    webp: '/media/forests/mau.webp',
    credit: {
      name: 'Galkey',
      url: 'https://commons.wikimedia.org/wiki/File:Mau_Forest_natural_spring.jpg',
    },
  },
  aberdares: {
    jpg: '/media/forests/aberdares.jpg',
    webp: '/media/forests/aberdares.webp',
    credit: {
      name: 'Tony0991',
      url: 'https://commons.wikimedia.org/wiki/File:Aberdare_range.jpg',
    },
  },
  'mt-kenya': {
    jpg: '/media/forests/mt-kenya.jpg',
    webp: '/media/forests/mt-kenya.webp',
    credit: {
      name: 'Daniel Case',
      url: 'https://commons.wikimedia.org/wiki/File:Montane_forest_with_understory,_Mount_Kenya.jpg',
    },
  },
  cherangany: {
    jpg: '/media/forests/cherangany.jpg',
    webp: '/media/forests/cherangany.webp',
    credit: {
      name: 'Shadybiwott33',
      url: 'https://commons.wikimedia.org/wiki/File:Kapolet_Forest.jpg',
    },
  },
  'mt-elgon': {
    jpg: '/media/forests/mt-elgon.jpg',
    webp: '/media/forests/mt-elgon.webp',
    credit: {
      name: 'Josep M. Gracia',
      url: 'https://commons.wikimedia.org/wiki/File:ELGON_-_Montane_forest_in_Mount_Elgon_National_Park,_Kenya,_2012.jpg',
    },
  },
}

const cardVariants = {
  enter: (dir) => ({ x: dir > 0 ? 320 : -320, opacity: 0, scale: 0.94 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -320 : 320, opacity: 0, scale: 0.94 }),
}

/** The front, draggable card — a direct-manipulation "flick through the
    blocks" gesture rather than a passive list. Its own real photo sits
    behind the figures, under a wash heavy enough to hold every line of
    type legible, same principle as the rest of the site's Video-Bleed
    Section Rule. */
function BlockCard({ block, index, direction, reduced, onSwipe, onDragStart, onDragEnd }) {
  const photo = BLOCK_PHOTOS[block.id]

  return (
    <motion.div
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={
        reduced
          ? { duration: 0.15 }
          : { type: 'spring', stiffness: 320, damping: 32 }
      }
      drag={reduced ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      whileDrag={{ cursor: 'grabbing' }}
      onDragStart={onDragStart}
      onDragEnd={(_event, info) => {
        onDragEnd()
        if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe('next')
        else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe('prev')
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${TOTAL}: ${block.name}`}
      className="absolute inset-0 z-10 cursor-grab touch-pan-y rounded-3xl border border-bone/10 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.65)] active:cursor-grabbing"
    >
      {/* Clipping lives on this static child, never the transformed/dragged
          parent above — Chromium can fail to clip a child to a rounded,
          overflow-hidden box while that same box is mid-transform, which is
          exactly what let the photo spill past the card's corners while
          dragging or animating in/out. */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <picture>
          <source srcSet={photo.webp} type="image/webp" />
          <img
            src={photo.jpg}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/78 via-forest-950/45 to-forest-950/82" />

        <div className="relative p-8 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-300">{block.sector}</p>
          <h3 className="mt-2 max-w-[22ch] font-display text-2xl text-bone sm:text-3xl">{block.name}</h3>

          <p className="tnum mt-8 font-display text-5xl leading-none text-bone sm:text-6xl">
            <CountUp to={block.hectares} separator="," duration={1.2} />
          </p>
          <p className="mt-1.5 text-[12px] text-bone-300">hectares under covenant</p>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-300">
            {block.counties.length} counties · {block.collectionCentres.length} collection centres
          </p>
        </div>

        <a
          href={photo.credit.url}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-4 font-mono text-[8px] uppercase tracking-[0.1em] text-bone/45 transition-colors duration-200 hover:text-bone/80"
        >
          Photo: {photo.credit.name} · CC BY-SA
        </a>
      </div>
    </motion.div>
  )
}

/**
 * The belt, quantified — sits right after GlobeSection, which shows and
 * names the five blocks on the 3D map; this turns that same list into a
 * physical, draggable stack instead of a scrolling one. The sticky claim
 * (two-weight headline, same serif, hierarchy from colour alone) holds the
 * left column while a card for each block sits in the right, swiped or
 * clicked through — one live card, two flattened ones stacked behind it as
 * a visual "more here" cue.
 */
export default function BeltLedger() {
  const reduced = usePrefersReducedMotion()
  const [sectionRef, inView] = useInViewport({ rootMargin: '0px' })
  const [[index, direction], setState] = useState([0, 0])
  const [paused, setPaused] = useState(false)

  const go = (way) => {
    setState(([current]) => {
      const next = way === 'next' ? (current + 1) % TOTAL : (current - 1 + TOTAL) % TOTAL
      return [next, way === 'next' ? 1 : -1]
    })
  }

  const jumpTo = (target) => {
    setState(([current]) => (target === current ? [current, direction] : [target, target > current ? 1 : -1]))
  }

  // Auto-advances one card at a time — paused on hover, mid-drag, out of
  // view, or when the visitor asked for reduced motion (WCAG 2.2.2: an
  // auto-moving carousel needs a way to stop, and "never starts" satisfies
  // that as well as a pause button would). Re-armed on every index change,
  // whether that change came from the timer itself or a manual swipe/click,
  // so a manual interaction always buys a full interval before the next
  // auto-advance rather than fighting the timer.
  useEffect(() => {
    if (reduced || !inView || paused) return
    const id = setInterval(() => go('next'), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [reduced, inView, paused, index])

  const active = SORTED_BLOCKS[index]

  return (
    <section
      ref={sectionRef}
      id="belt-ledger"
      className="relative z-10 scroll-mt-20 overflow-hidden bg-forest-950 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
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
            hectare count, county list and collection centres. Drag through them.
          </p>
        </div>

        <div>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Forest blocks"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative h-[300px] sm:h-[320px]"
          >
            {/* Two flattened cards stacked behind the live one — a "more
                here" cue, not interactive themselves. Each carries the
                actual photo of the block coming up next in the stack
                (heavily darkened), rather than a flat colour panel, so the
                deck reads as a stack of real photos at graduated sizes
                instead of a bare shape sitting behind a much busier one. */}
            {[2, 1].map((offset) => {
              const upcoming = SORTED_BLOCKS[(index + offset) % TOTAL]
              const upcomingPhoto = BLOCK_PHOTOS[upcoming.id]
              return (
                <div
                  key={offset}
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden rounded-3xl border border-bone/5"
                  style={{
                    transform: `translateY(${offset * 10}px) scale(${1 - offset * 0.035})`,
                    zIndex: 10 - offset,
                  }}
                >
                  <picture>
                    <source srcSet={upcomingPhoto.webp} type="image/webp" />
                    <img
                      src={upcomingPhoto.jpg}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-forest-950/72" />
                </div>
              )
            })}

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <BlockCard
                key={active.id}
                block={active}
                index={index}
                direction={direction}
                reduced={reduced}
                onSwipe={go}
                onDragStart={() => setPaused(true)}
                onDragEnd={() => setPaused(false)}
              />
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => go('prev')}
              aria-label="Previous forest block"
              className="grid h-9 w-9 place-items-center rounded-full border border-bone/15 text-bone-300 transition-colors duration-200 hover:border-bone/30 hover:text-bone"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2">
              {SORTED_BLOCKS.map((block, i) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`Show ${block.name}`}
                  aria-current={i === index}
                  className={
                    'h-1.5 rounded-full transition-all duration-300 ' +
                    (i === index ? 'w-6 bg-river-500' : 'w-1.5 bg-bone/20 hover:bg-bone/35')
                  }
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go('next')}
              aria-label="Next forest block"
              className="grid h-9 w-9 place-items-center rounded-full border border-bone/15 text-bone-300 transition-colors duration-200 hover:border-bone/30 hover:text-bone"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 flex items-baseline justify-between border-t border-amber-400/25 pt-6">
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
