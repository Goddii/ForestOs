import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Generic mega-menu dropdown — osapiens' multi-column pattern, reusing the
 * exact glass-popover + blur-settle interaction `Hotspot.jsx` established
 * (outside click / Escape to close, identical easing and shadow). Both nav
 * dropdowns ("The Record", "Partners") render through this one component so
 * the interaction logic exists in a single place.
 *
 * A column item with neither `to` nor `href` renders inert with a "Soon"
 * badge instead of linking anywhere — used for offering pages not built yet,
 * so the menu can preview the full plan without shipping dead links.
 */
export default function NavMegaMenu({ label, columns, panelWidthClass = 'w-[min(90vw,32rem)]', gridColsClass = 'sm:grid-cols-2' }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const panelId = useId()
  const reduced = usePrefersReducedMotion()

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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="hidden items-center gap-1 px-1 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300 transition-colors hover:text-bone sm:inline-flex"
      >
        {label}
        <ChevronDown
          className={'h-3 w-3 transition-transform duration-200 ' + (open ? 'rotate-180' : '')}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={reduced ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduced ? undefined : { opacity: 0, y: 8, filter: 'blur(6px)' }}
            transition={{ duration: 0.28, ease: EASE }}
            className={
              'absolute left-1/2 top-full z-30 mt-3 -translate-x-1/2 rounded-2xl border border-bone/12 bg-forest-900/90 p-6 backdrop-blur-md shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)] sm:p-7 ' +
              panelWidthClass
            }
          >
            <div className={'grid gap-6 ' + gridColsClass}>
              {columns.map((col) => (
                <div key={col.label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">{col.label}</p>
                  {col.note && <p className="mt-1 text-[11px] leading-snug text-sage-300">{col.note}</p>}
                  <ul className="mt-3 space-y-3">
                    {col.links.map((item) => {
                      const content = (
                        <>
                          <span className="font-display text-lg leading-tight text-bone transition-colors group-hover:text-amber-400">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-snug text-sage-300">{item.note}</span>
                        </>
                      )
                      const inert = !item.href && !item.to
                      return (
                        <li key={item.label}>
                          {inert ? (
                            <div className="opacity-60">
                              {content}
                              <span className="mt-1.5 inline-block rounded-full border border-bone/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">
                                Soon
                              </span>
                            </div>
                          ) : item.href ? (
                            <a href={item.href} onClick={() => setOpen(false)} className="group block">
                              {content}
                            </a>
                          ) : (
                            <Link to={item.to} onClick={() => setOpen(false)} className="group block">
                              {content}
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
