import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * A pulsing spatial marker over the hero video. Tapping toggles a small
 * fact card; Escape or an outside tap closes it.
 */
export default function Hotspot({ x, y, label, title, body }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const cardId = useId()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const toLeft = x > 55
  const toTop = y > 52

  return (
    <div
      ref={rootRef}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={cardId}
        className="relative grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
      >
        <span className="sr-only">{title}</span>
        {!reduced && (
          <span
            className="absolute h-12 w-12 rounded-full bg-amber-400/25 motion-safe:animate-ping"
            style={{ animationDuration: '2.4s' }}
          />
        )}
        <span className="absolute h-7 w-7 rounded-full border border-bone/40" />
        <span
          className={
            'relative h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_14px_2px_rgba(232,168,92,0.55)] transition-transform duration-300 ' +
            (open ? 'scale-150' : 'scale-100')
          }
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={cardId}
            role="dialog"
            aria-label={title}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            transition={{ duration: 0.34, ease: EASE }}
            className="absolute z-30 w-64 rounded-xl border border-bone/12 bg-forest-900/85 p-4 backdrop-blur-md shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)]"
            style={{
              left: toLeft ? 'auto' : '1.25rem',
              right: toLeft ? '1.25rem' : 'auto',
              top: toTop ? 'auto' : '1.25rem',
              bottom: toTop ? '1.25rem' : 'auto',
            }}
          >
            <p className="font-mono text-[10px] font-medium tracking-[0.22em] text-sage-300">
              {label}
            </p>
            <p className="mt-2 font-display text-xl leading-tight text-bone">{title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-bone-300">{body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
