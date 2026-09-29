import { imgCommunity } from './assets'
import { useInView } from './hooks'

// Per-letter image fill: `background-clip: text` on a parent skips descendants
// that carry their own transform/filter (the letter-drop animation does), so each
// letter clips the photo itself, sampling a slice of it by column and line.
const LETTER_ADVANCE = 24
const LINE_ADVANCE = 40
const FILL_SIZE = '340px auto'

/** Runs an rr-* entrance keyframe once, when the wrapper scrolls into view. */
export function Reveal({ children, animation = 'fade-up', delay = 0, threshold = 0.15 }) {
  const { ref, visible } = useInView(threshold)
  return (
    <div
      ref={ref}
      style={{
        animation: visible ? `rr-${animation} 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s both` : 'none',
        opacity: visible ? undefined : 0,
      }}
    >
      {children}
    </div>
  )
}

/** Letter-by-letter drop-in for the hero headline. */
export function AnimatedHeadline({ text, delay = 0, line = 0 }) {
  const { ref, visible } = useInView(0.3)
  return (
    <div ref={ref} style={{ display: 'inline', perspective: '400px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            animation: visible ? 'rr-letter-drop 0.5s cubic-bezier(0.22,1,0.36,1) both' : 'none',
            animationDelay: `${delay + i * 0.04}s`,
            opacity: visible ? undefined : 0,
            background: `url(${imgCommunity}) ${-20 - i * LETTER_ADVANCE}px ${-line * LINE_ADVANCE}px / ${FILL_SIZE}`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
