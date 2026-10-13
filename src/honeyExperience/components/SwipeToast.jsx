/**
 * Toast pattern adapted from reactbits.dev's "Swipe Toast"
 * (https://reactbits.dev/components/swipe-toast): a confirmation pill you
 * can drag down to dismiss, which also auto-dismisses.
 *
 * Positioned above the fixed reorder bar *including* the iOS safe-area
 * inset, so it can never land on top of the CTA (the collision the layout
 * critique flagged). Drag is disabled under reduced motion — dismissal then
 * relies on the auto-timeout and the close affordance.
 */
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

export default function SwipeToast({ message, onDismiss, reduced = false }) {
  return (
    <motion.div
      role="status"
      drag={reduced ? false : 'y'}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.7, bottom: 0 }}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (info.offset.y < -24 || info.velocity.y < -320) onDismiss()
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{ bottom: 'calc(4.5rem + 0.5rem + env(safe-area-inset-bottom))' }}
      className="fixed left-1/2 z-[60] flex -translate-x-1/2 cursor-grab touch-none items-center gap-2 rounded-full border border-white/10 bg-emerald-950 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl active:cursor-grabbing"
    >
      <Check className="size-3.5 shrink-0 text-emerald-300" />
      <span className="whitespace-nowrap">{message}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
        className="ml-1 grid size-5 shrink-0 place-items-center rounded-full text-white/50 transition hover:text-white"
      >
        <X className="size-3" />
      </button>
    </motion.div>
  )
}
