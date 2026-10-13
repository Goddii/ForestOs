/**
 * Adapted from reactbits.dev's AnimatedContent
 * (https://reactbits.dev/animations/animated-content).
 *
 * The original drives its timeline with GSAP ScrollTrigger; this port keeps
 * the same props/API (distance, direction, reverse, scale, threshold, delay)
 * but runs on framer-motion's `whileInView`, which is the engine the honey
 * experience already uses — one scroll-observer system, no GSAP scroller
 * wiring against the phone-frame scroll container, and free
 * reduced-motion handling via <MotionConfig reducedMotion="user">.
 */
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export default function AnimatedContent({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.7,
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.12,
  delay = 0,
  className = '',
  ...props
}) {
  const axis = direction === 'horizontal' ? 'x' : 'y'
  const offset = reverse ? -distance : distance

  return (
    <motion.div
      className={className}
      initial={{ [axis]: offset, scale, opacity: animateOpacity ? initialOpacity : 1 }}
      whileInView={{ [axis]: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
