/**
 * HoneyCard — the one card shell for the honey experience.
 *
 * Replaces the bespoke Card wrapper in HoneyExperience.jsx and ends the
 * radius conflict the critique flagged (rounded-[2rem] vs rounded-2xl on the
 * same element): the shell bakes `rounded-3xl` (24px, = --honey-radius) and
 * callers never pass a radius class of their own.
 *
 * Layers: AnimatedContent (reactbits-pattern scroll entrance, framer port)
 * > spring hover lift > GlareHover (reactbits port, amber honey-glint sweep
 * — the card's one hover affordance; hover only fires behind a fine
 * pointer, touch sees a static card).
 *
 * MUI CardActionArea rule: if a card has no real action, it carries no
 * chevron/arrow — the glare is feedback, not a promise of navigation.
 */
import { motion } from 'framer-motion'
import AnimatedContent from './AnimatedContent'
import GlareHover from './GlareHover'

export function Card({ children, className = '', stagger = 0, lift = true }) {
  return (
    <AnimatedContent delay={stagger * 0.08}>
      <motion.div
        whileHover={lift ? { y: -2 } : undefined}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        className="rounded-3xl"
      >
        <GlareHover
          className={`rounded-3xl ${className}`}
          glareColor="#ffd9a0"
          glareOpacity={0.4}
          glareSize={22}
          softness={0.7}
          rimGlint={false}
        >
          {children}
        </GlareHover>
      </motion.div>
    </AnimatedContent>
  )
}

export default Card
