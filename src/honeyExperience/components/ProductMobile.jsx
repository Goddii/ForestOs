/**
 * ProductMobile — "hanging from the canopy".
 *
 * The three Bree's Bees products hang from a hairline branch rail on thin
 * strings of different lengths (mixed image aspects make the shelf organic,
 * not gridded). Motion sequence:
 *   1. the rail draws itself in (scaleX),
 *   2. each string grows down from its tick (scaleY, staggered),
 *   3. each jar drops in and swings to rest on damped rotate keyframes,
 *   4. idle pendulum sway at a per-jar phase and period,
 *   5. scroll parallax: each jar drifts at its own rate while passing.
 * Hover (fine pointers) lifts the jar a few pixels.
 *
 * No chevrons or arrows: the jars are a display, not a promise of
 * navigation (MUI CardActionArea rule from the layout critique).
 * MotionConfig reducedMotion="user" collapses every transform to static.
 */
import { motion, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

const PRODUCTS = [
  {
    src: '/media/honey/1ltres.png',
    alt: "Bree's Bees forest honey — one litre jar",
    name: 'The Litre Jar',
    tag: '1 L',
    aspect: 'aspect-square',
    string: '1.75rem',
    sway: 1.1,
    swayDur: 6.5,
    drift: [-16, 16],
  },
  {
    src: '/media/honey/bree.jpeg',
    alt: "Bree's Bees forest honey — signature jar",
    name: "Bree's Reserve",
    tag: 'Classic',
    aspect: 'aspect-square',
    string: '3.25rem',
    sway: 1.5,
    swayDur: 8,
    drift: [-30, 30],
  },
  {
    src: '/media/honey/breetrre.jpeg',
    alt: 'Bee tree batch forest honey',
    name: 'Bee Tree Batch',
    tag: 'Limited',
    aspect: 'aspect-[335/597]',
    string: '1rem',
    sway: 0.85,
    swayDur: 5.6,
    drift: [-10, 10],
  },
]

function HangJar({ product, index, progress, reduced }) {
  const parallax = useTransform(progress, [0, 1], product.drift)
  const startAngle = -6 + index * 1.5

  return (
    <motion.div style={{ y: parallax }} className="flex flex-col items-center">
      {/* hang tick on the rail */}
      <span className="z-10 size-1.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(232,168,92,.6)]" aria-hidden="true" />
      {/* string */}
      <motion.div
        aria-hidden="true"
        className="w-px origin-top bg-gradient-to-b from-amber-300/70 to-white/25"
        style={{ height: product.string }}
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.15 + index * 0.12, ease }}
      />
      {/* entrance: drop + swing to rest */}
      <motion.div
        className="relative -mt-px"
        style={{ transformOrigin: 'top center' }}
        initial={reduced ? false : { rotate: startAngle, y: -12 }}
        animate={{
          rotate: reduced ? 0 : [startAngle, 3.5 - index, -1.5, 0],
          y: reduced ? 0 : [-12, 2, 0, 0],
        }}
        transition={{ duration: 1.15, delay: 0.25 + index * 0.12, ease: 'easeInOut', times: [0, 0.4, 0.7, 1] }}
      >
        {/* idle pendulum sway */}
        <motion.div
          style={{ transformOrigin: 'top center' }}
          animate={reduced ? {} : { rotate: [product.sway, -product.sway, product.sway] }}
          transition={reduced ? {} : { duration: product.swayDur, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
        >
          <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <figure className="rounded-3xl border border-white/10 bg-white/[0.06] p-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,.65)] backdrop-blur-xl">
              <div className={`overflow-hidden rounded-2xl bg-emerald-950/40 ${product.aspect}`}>
                <img
                  src={product.src}
                  alt={product.alt}
                  loading="lazy"
                  draggable="false"
                  className="size-full object-cover"
                />
              </div>
              <figcaption className="px-1 pb-1 pt-2 text-center">
                <div className="text-xs font-semibold leading-tight text-white">{product.name}</div>
                <div className="mt-0.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber-300/90">{product.tag}</div>
              </figcaption>
            </figure>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function ProductMobile({ progress, reduced = false }) {
  return (
    <div className="relative mt-8">
      {/* branch rail */}
      <motion.div
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease }}
        className="mx-2 h-px origin-center bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
      />
      <div className="grid grid-cols-3 items-start gap-3">
        {PRODUCTS.map((product, index) => (
          <HangJar key={product.src} product={product} index={index} progress={progress} reduced={reduced} />
        ))}
      </div>
    </div>
  )
}
