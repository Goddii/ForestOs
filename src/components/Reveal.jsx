import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Scroll-into-view reveal: content is legible by default and settles from a
 * short blur + rise. Honors prefers-reduced-motion by rendering statically.
 */
export default function Reveal({ children, className, delay = 0, y = 22 }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{ duration: 0.72, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
