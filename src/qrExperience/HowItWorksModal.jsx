import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

/**
 * A optional, dismissible preview of the six-step journey — reached only via
 * "How it works" on the scan screen, never forced in front of the primary
 * "Enter experience" CTA. The animation itself (`public/media/how-it-works.gif`,
 * generated with the `stix` skill) is deliberately a plain diagrammatic
 * stick-figure strip rather than photo/video, so it stays visually distinct
 * from the real forest/tea imagery the rest of the batch uses everywhere else.
 */
export default function HowItWorksModal({ open, onClose }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="How the Majani Passport works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/80 px-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-bone/15 bg-bone shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
          >
            <img
              src="/media/how-it-works.gif"
              alt="A stick figure scans a product, gets verified, discovers its story, plants a seedling, earns a badge, and holds up a passport."
              className="block w-full"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-forest-950/70 text-bone-300 transition-colors hover:text-bone"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <p className="px-5 py-4 text-center text-[13px] text-ink-muted">
              Scan → Verify → Discover → Participate → Earn → Belong.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
