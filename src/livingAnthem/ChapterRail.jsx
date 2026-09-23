import { useCallback, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { FOCUS_RING } from './chrome'

const CHAPTER_NAMES = ['Scan', 'Manifesto', 'Landscape', 'Oracle', 'Activation', 'Reward', 'Passport']

// A chapter counts as active once its top passes 40% down the viewport.
const ACTIVE_PROBE = 0.4

/**
 * Scroll HUD (not in the Figma frames, added for navigation): a spring-
 * smoothed progress hairline across the top and a vertical dot rail whose
 * active pill glides between chapters via a shared layout animation.
 */
export default function ChapterRail({ scrollRef, onSelect }) {
  // Scroll tracking lives here (not in the route) so scrolling re-renders
  // only this rail, never the seven chapter trees.
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  const syncActive = useCallback(
    (top) => {
      const container = scrollRef.current
      if (!container) return
      const probe = top + container.clientHeight * ACTIVE_PROBE
      const index = [...container.children].findLastIndex((section) => section.offsetTop <= probe)
      setActiveIndex(Math.max(index, 0))
    },
    [scrollRef],
  )
  useMotionValueEvent(scrollY, 'change', syncActive)

  return (
    <>
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[2px] origin-left bg-[#00ff87] shadow-[0_0_8px_#00ff87]" style={{ scaleX }} />
      <nav aria-label="Chapters" className="absolute right-[6px] top-1/2 z-40 -translate-y-1/2">
        <ol className="flex flex-col items-center gap-[10px]">
          {CHAPTER_NAMES.map((name, index) => {
            const isActive = index === activeIndex
            return (
              <li key={name} className="relative flex h-[18px] w-[10px] items-center justify-center">
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-label={`Chapter ${index + 1}: ${name}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group relative flex size-full items-center justify-center rounded-full ${FOCUS_RING}`}
                >
                  <span className="block size-[4px] rounded-full bg-[rgba(138,159,150,0.45)] transition-colors group-hover:bg-white" />
                  {isActive && (
                    <motion.span
                      layoutId="la-rail-active"
                      className="absolute left-1/2 top-0 h-[18px] w-[4px] -translate-x-1/2 rounded-full bg-[#00ff87] shadow-[0_0_8px_#00ff87]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
