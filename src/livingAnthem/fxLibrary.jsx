/**
 * Components adapted from open-source React animation libraries (copied
 * source, not npm packages — both libraries are distributed that way):
 *
 * - BorderBeam — Magic UI (MIT), https://magicui.design/docs/components/border-beam
 * - DecryptedText, Magnet, StarBorder — React Bits by David Haz
 *   (MIT + Commons Clause: free to use inside a product), https://reactbits.dev
 *
 * Adapted to plain JSX + framer-motion (the project's motion library) and
 * trimmed to the modes this route uses. StarBorder's keyframes live in the
 * route's <style> block (`la-star-top` / `la-star-bottom`).
 */
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion'
import { useLoopsEnabled } from './chrome'

/** Magic UI BorderBeam: a gradient light that laps the container's rounded border. */
export function BorderBeam({ size = 90, duration = 7, delay = 0, colorFrom = '#00ff87', colorTo = '#e2a743', borderWidth = 1.5 }) {
  const isEnabled = useLoopsEnabled()
  if (!isEnabled) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={{ '--beam-width': `${borderWidth}px` }}
    >
      <motion.div
        className="absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent"
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)`, '--color-from': colorFrom, '--color-to': colorTo }}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration, delay: -delay }}
      />
    </div>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/'

function scramble(text, revealedCount) {
  return [...text]
    .map((char, index) => (index < revealedCount || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join('')
}

/** React Bits DecryptedText ("view", sequential mode): glyphs resolve left→right once in view. */
export function DecryptedText({ text, speed = 45, className = '', encryptedClassName = 'opacity-60' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(0)
  const [display, setDisplay] = useState(text)
  const isDone = prefersReducedMotion || revealed >= text.length

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return undefined
    let count = 0
    const id = setInterval(() => {
      count += 1
      setRevealed(count)
      setDisplay(scramble(text, count))
      if (count >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [isInView, prefersReducedMotion, speed, text])

  const shown = isDone ? text : display
  return (
    <span ref={ref} className="inline-block whitespace-pre-wrap">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...shown].map((char, index) => (
          // Fixed-length string: index is the stable identity of each glyph slot.
          <span key={index} className={isDone || index < revealed ? className : encryptedClassName}>
            {char}
          </span>
        ))}
      </span>
    </span>
  )
}

const MAGNET_SPRING = { stiffness: 260, damping: 18, mass: 0.5 }

/** React Bits Magnet: the child drifts toward a nearby pointer (springs instead of CSS transitions). */
export function Magnet({ children, padding = 60, strength = 4, className = '' }) {
  const ref = useRef(null)
  const isEnabled = useLoopsEnabled()
  const x = useSpring(0, MAGNET_SPRING)
  const y = useSpring(0, MAGNET_SPRING)

  useEffect(() => {
    if (!isEnabled) {
      x.set(0)
      y.set(0)
      return undefined
    }
    const handleMove = (event) => {
      if (!ref.current) return
      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const dx = event.clientX - (left + width / 2)
      const dy = event.clientY - (top + height / 2)
      const isNear = Math.abs(dx) < width / 2 + padding && Math.abs(dy) < height / 2 + padding
      x.set(isNear ? dx / strength : 0)
      y.set(isNear ? dy / strength : 0)
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [padding, isEnabled, strength, x, y])

  return (
    <motion.div ref={ref} style={{ x, y }} className={`relative inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

/** React Bits StarBorder: two light "stars" orbit the edge of a CTA. */
export function StarBorder({ color = '#fff3d6', speed = '5s', className = '', children }) {
  const isEnabled = useLoopsEnabled()
  const glow = {
    background: `radial-gradient(circle, ${color}, transparent 10%)`,
    animationDuration: speed,
    animationPlayState: isEnabled ? 'running' : 'paused',
  }
  return (
    <div className={`relative overflow-hidden py-[1.5px] ${className}`}>
      <div aria-hidden className="absolute bottom-[-11px] right-[-250%] z-0 h-1/2 w-[300%] rounded-full opacity-70 animate-[la-star-bottom_linear_infinite_alternate] motion-reduce:hidden" style={glow} />
      <div aria-hidden className="absolute left-[-250%] top-[-10px] z-0 h-1/2 w-[300%] rounded-full opacity-70 animate-[la-star-top_linear_infinite_alternate] motion-reduce:hidden" style={glow} />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
