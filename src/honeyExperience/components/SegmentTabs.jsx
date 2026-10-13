/**
 * Honey segmented control — pattern adapted from reactbits.dev's
 * "Rubber Segment" (https://reactbits.dev/components/rubber-segment):
 * an active thumb that glides between options on a spring.
 *
 * Built on framer-motion's layoutId so the amber thumb physically travels
 * between tabs instead of crossfading. Full WAI-ARIA tab semantics
 * (tablist/tab/aria-selected, roving arrow-key focus) and a 44px minimum
 * target height — both were missing from the inline pills it replaces.
 */
import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function SegmentTabs({ tabs, value, onChange, className = '', label }) {
  const listRef = useRef(null)

  const onKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.id === value)
    if (index < 0) return
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length
    if (next === null) return
    event.preventDefault()
    onChange(tabs[next].id)
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`flex rounded-full border border-white/10 bg-white/[0.06] p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className="relative min-h-11 flex-1 rounded-full px-4 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
          >
            {active && (
              <motion.span
                layoutId="honey-seg-thumb"
                className="absolute inset-0 rounded-full bg-amber-400"
                transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
              />
            )}
            <span
              className={`relative z-10 text-xs font-semibold transition-colors duration-150 ${
                active ? 'text-emerald-950' : 'text-white/60'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
