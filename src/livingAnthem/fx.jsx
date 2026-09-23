/**
 * Micro-animation kit for `/living-anthem` — React Bits-style effects
 * (SplitText, ShinyText, TiltedCard, click-spark burst) rebuilt locally on
 * framer-motion, the project's existing motion library, instead of adding
 * packages. Everything respects `prefers-reduced-motion` via the route's
 * <MotionConfig reducedMotion="user"> plus explicit checks on loops.
 */
import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1]
const LETTER_STAGGER_S = 0.035
const TILT_MAX_DEG = 8
const SPRING = { stiffness: 220, damping: 18, mass: 0.6 }

/** Per-letter rise-in (React Bits "SplitText"), word-safe so lines still wrap between words. */
export function SplitText({ text, delay = 0, className = '' }) {
  const words = text.split(' ')
  let letterIndex = 0
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" aria-hidden>
          {[...word].map((char) => {
            const index = letterIndex++
            return (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ opacity: 0, y: '0.45em', rotateX: -70 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: delay + index * LETTER_STAGGER_S, ease: EASE_OUT_QUINT }}
              >
                {char}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

/** Amber metallic sweep clipped to the glyphs (React Bits "ShinyText"); keyframes live in the route. */
export function Shimmer({ children, className = '' }) {
  return (
    <span
      className={`bg-clip-text text-transparent animate-[la-shine_4.5s_linear_infinite] motion-reduce:animate-none ${className}`}
      style={{
        backgroundImage: 'linear-gradient(110deg, #e2a743 38%, #fff3d6 50%, #e2a743 62%)',
        backgroundSize: '250% 100%',
      }}
    >
      {children}
    </span>
  )
}

/** Pointer-tracked 3D tilt with spring return and a moving glare (React Bits "TiltedCard"). */
export function TiltCard({ children, className = '' }) {
  const prefersReducedMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [TILT_MAX_DEG, -TILT_MAX_DEG]), SPRING)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-TILT_MAX_DEG, TILT_MAX_DEG]), SPRING)
  const glareX = useTransform(pointerX, [0, 1], ['0%', '100%'])
  const glare = useTransform(glareX, (x) => `radial-gradient(circle at ${x} 20%, rgba(0,255,135,0.16), transparent 55%)`)

  const handleMove = (event) => {
    if (prefersReducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <div className="w-full [perspective:900px]">
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative ${className}`}
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ backgroundImage: glare }} />
      </motion.div>
    </div>
  )
}

const BURST_PARTICLES = 12
const BURST_RADIUS_PX = 70

/** One-shot radial particle burst (React Bits "ClickSpark"), re-fired whenever `burstKey` changes. */
export function Burst({ burstKey, color = '#00ff87' }) {
  return (
    <AnimatePresence>
      {burstKey > 0 && (
        <span key={burstKey} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10">
          {Array.from({ length: BURST_PARTICLES }, (_, index) => {
            const angle = (index / BURST_PARTICLES) * Math.PI * 2
            return (
              <motion.span
                key={index}
                className="absolute block size-[7px] rounded-[1px_6px_1px_6px]"
                style={{ backgroundColor: color, left: -3.5, top: -3.5 }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * BURST_RADIUS_PX,
                  y: Math.sin(angle) * BURST_RADIUS_PX,
                  opacity: 0,
                  scale: 1.1,
                  rotate: 180,
                }}
                transition={{ duration: 0.8, ease: EASE_OUT_QUINT }}
              />
            )
          })}
        </span>
      )}
    </AnimatePresence>
  )
}

/** Spring press/hover for primary CTAs. */
export const PRESS = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.96 },
  transition: { type: 'spring', stiffness: 400, damping: 22 },
}

/** Tracks a success flip so the label can animate between states. */
export function SwapLabel({ id, children, className = '' }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={id}
        className={`inline-block ${className}`}
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  )
}

/** Local state for firing a Burst: returns [burstKey, fire]. */
export function useBurst() {
  const [burstKey, setBurstKey] = useState(0)
  return [burstKey, () => setBurstKey((key) => key + 1)]
}
