import { useRef, useState } from 'react'

/**
 * Ported from reactbits.dev's SpotlightCard (JS + Tailwind variant),
 * adapted to the site's own glass-card tokens (rounded-2xl, bone/12 border,
 * forest-900 fill) instead of the source's neutral-900 default, and an
 * amber spotlight instead of white so the glow reads as this site's accent,
 * not a generic library default. Logic is otherwise unchanged from source:
 * a radial gradient tracks the cursor and fades in/out on hover or focus,
 * pointer-events-none so it never intercepts clicks on the card's content.
 */
export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(232, 168, 92, 0.16)' }) {
  const divRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(0.6)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={() => setOpacity(0.6)}
      onMouseLeave={() => setOpacity(0)}
      className={
        'relative overflow-hidden rounded-2xl border border-bone/12 bg-forest-900/85 backdrop-blur-md shadow-[0_18px_50px_-12px_rgba(0,0,0,0.55)] ' +
        className
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}
