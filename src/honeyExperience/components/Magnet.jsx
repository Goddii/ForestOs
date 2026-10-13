/**
 * Magnetic wrapper — pattern adapted from reactbits.dev's "Magnet"
 * (https://reactbits.dev/animations/magnet): children ease toward the
 * cursor on spring physics and settle back on leave.
 *
 * Only engages behind a real hovering fine pointer (the honey.css hover-gate
 * pattern); touch devices see a plain, static wrapper. Intended for the
 * small round chrome buttons (share, menu), not full-width pills.
 */
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Magnet({ children, className = '', strength = 0.32, max = 8 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  const enabled =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMouseMove = (event) => {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    x.set(Math.max(-max, Math.min(max, dx * strength)))
    y.set(Math.max(-max, Math.min(max, dy * strength)))
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  )
}
