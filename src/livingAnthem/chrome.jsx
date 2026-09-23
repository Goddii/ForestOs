import { createContext, useContext, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { imgChapterLine, imgStatusBattery, imgStatusSignal, imgStatusWifi } from './assets'
import { CHAPTER_COUNT } from './data'
import { Shimmer, SplitText } from './fx'

// Figma motion: every screen's groups fade up 26px with ease (0.22,1,0.36,1)
// over 0.85s, staggered — top 0.12s, middle 0.26s, bottom 0.4s. Figma loops
// the whole 6s timeline for preview; here each group plays once on entry.
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1]
export const STAGGER = { top: 0.12, middle: 0.26, bottom: 0.4 }

export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff87] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040d07]'

export function Reveal({ delay = 0, distance = 26, duration = 0.85, className = '', children, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: EASE_OUT_QUINT }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Fake iOS status bar from the Figma frames — only drawn inside the desktop phone-frame preview (a real phone has its own). */
export function StatusBar({ className = 'relative shrink-0 w-full' }) {
  return (
    <div className={`hidden lg:flex items-center justify-between pb-[10px] pt-[14px] px-[24px] ${className}`} aria-hidden>
      <p className="font-['Geist'] font-semibold leading-[normal] text-[15px] text-white whitespace-nowrap">9:41</p>
      <div className="flex gap-[6px] items-center">
        <img alt="" className="block h-[11px] w-[17px]" src={imgStatusSignal} />
        <img alt="" className="block h-[11px] w-[15px]" src={imgStatusWifi} />
        <img alt="" className="block h-[11px] w-[25px]" src={imgStatusBattery} />
      </div>
    </div>
  )
}

export function ChapterIndicator({ chapter }) {
  const label = String(chapter).padStart(2, '0')
  return (
    <div className="flex gap-[6px] items-center px-[24px] py-[12px] relative shrink-0 w-full" data-name="chapter-indicator">
      <p className="font-['Geist'] font-bold leading-[normal] shrink-0 text-[#00ff87] text-[12px] uppercase whitespace-nowrap">CH. {label}</p>
      <motion.div
        className="flex-[1_0_0] h-0 min-w-px relative origin-left"
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT_QUINT }}
      >
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgChapterLine} />
        </div>
      </motion.div>
      <p className="font-['Geist'] font-normal leading-[normal] shrink-0 text-[#8a9f96] text-[12px] whitespace-nowrap">
        {label} / {String(CHAPTER_COUNT).padStart(2, '0')}
      </p>
    </div>
  )
}

/** Eyebrow + two-tone Syne headline used by chapters 3–7. */
export function SectionTitle({ eyebrow, lead, accent, children }) {
  return (
    <div className="[word-break:break-word] flex flex-col gap-[8px] items-start pt-[20px] px-[24px] relative shrink-0 w-full" data-name="section-title">
      <p className="font-['Geist'] font-bold leading-[normal] text-[#00ff87] text-[12px] uppercase whitespace-nowrap">{eyebrow}</p>
      <h2 className="font-['Syne'] font-extrabold leading-[1.1] text-[32px] text-white w-full">
        <SplitText text={lead} delay={0.2} /> <Shimmer>{accent}</Shimmer>
      </h2>
      {children}
    </div>
  )
}

/** The "next chapter" cue at the foot of every screen, wired to scroll onward. */
export function BottomAction({ label, onNext, labelClassName = 'font-medium text-[12px]', children }) {
  return (
    <Reveal delay={STAGGER.bottom} className="flex flex-col gap-[16px] items-center pb-[12px] px-[24px] relative shrink-0 w-full" data-name="bottom-action">
      {onNext ? (
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ y: -2, letterSpacing: '0.04em' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          className={`font-['Geist'] leading-[normal] text-[#8a9f96] whitespace-nowrap rounded-[4px] transition-colors duration-200 hover:text-white ${labelClassName} ${FOCUS_RING}`}
        >
          {label}
        </motion.button>
      ) : (
        <p className={`font-['Geist'] leading-[normal] text-[#8a9f96] whitespace-nowrap ${labelClassName}`}>{label}</p>
      )}
      {children}
      <HomeIndicator />
    </Reveal>
  )
}

/** iOS home-indicator bar — preview-frame only, like the status bar. */
export function HomeIndicator() {
  return (
    <div className="hidden lg:flex h-[34px] items-center justify-center shrink-0 w-full" aria-hidden>
      <div className="bg-[#8a9f96] h-[5px] rounded-[100px] w-[134px]" />
    </div>
  )
}

const LoopsEnabledContext = createContext(true)

/**
 * True while this chapter is on screen and the user hasn't asked for
 * reduced motion. Every infinite loop in the route reads it, so chapters
 * scrolled out of view stop animating instead of running forever.
 */
export function useLoopsEnabled() {
  return useContext(LoopsEnabledContext)
}

/** One full-height, scroll-snapped chapter. */
export function Screen({ name, children, className = 'justify-between' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.25 })
  const prefersReducedMotion = useReducedMotion()
  return (
    <LoopsEnabledContext.Provider value={isInView && !prefersReducedMotion}>
    <section
      ref={ref}
      className={`bg-[#040d07] flex flex-col items-start min-h-full relative shrink-0 w-full snap-start overflow-x-clip ${className}`}
      data-name={name}
    >
      {children}
    </section>
    </LoopsEnabledContext.Provider>
  )
}
