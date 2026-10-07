import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export const EASE = [0.16, 1, 0.3, 1]

export function ConceptTag({ children, variant = 'concept' }) {
  const styles = {
    concept: 'border-bone/20 bg-bone/5 text-bone-300',
    proposed: 'border-amber-400/35 bg-amber-400/10 text-amber-400',
    illustrative: 'border-river-400/35 bg-river-400/10 text-river-400',
    tbc: 'border-sage-500/30 bg-forest-800/80 text-sage-300',
  }
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${styles[variant] ?? styles.concept}`}
    >
      {children}
    </span>
  )
}

export function VerificationBadge({ status }) {
  const map = {
    verified: {
      label: 'Verified',
      detail: 'Verified conservation record found.',
      className: 'border-river-400/45 bg-river-400/12 text-river-400',
      dot: 'bg-river-400',
    },
    pending: {
      label: 'Pending',
      detail: 'Verification is currently being processed.',
      className: 'border-amber-400/45 bg-amber-400/12 text-amber-400',
      dot: 'bg-amber-400',
    },
    unverified: {
      label: 'Unverified',
      detail: 'No verified conservation record found for this reference.',
      className: 'border-bone/25 bg-bone/5 text-bone-300',
      dot: 'bg-bone-500',
    },
  }
  const cfg = map[status] ?? map.unverified
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${cfg.className}`}
      role="status"
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} aria-hidden="true" />
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">{cfg.label}</p>
        <p className="mt-1 text-[13px] leading-relaxed opacity-90">{cfg.detail}</p>
      </div>
    </div>
  )
}

export function PartnerCta({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  const base =
    'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] transition-transform ep-motion active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-950'
  const variants = {
    primary: 'bg-amber-400 text-forest-950 hover:bg-amber-500',
    secondary:
      'border border-bone/25 bg-forest-950/50 text-bone backdrop-blur-sm hover:border-bone/40',
    ghost: 'border border-bone/15 text-bone-300 hover:text-bone',
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function Kicker({ children }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sage-500">{children}</p>
  )
}

export function DisplayHeadline({ children, as: Tag = 'h1', className = '' }) {
  return <Tag className={`font-display text-[2rem] leading-[1.08] text-bone sm:text-4xl ${className}`}>{children}</Tag>
}

export function FadeIn({ children, delay = 0, className = '' }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) {
    return <div className={className}>{children}</div>
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function ImpactCounter({ value, label, suffix = '', note }) {
  return (
    <div className="rounded-xl border border-bone/12 bg-forest-900/55 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">{label}</p>
      <p className="mt-2 font-mono text-2xl tabular-nums text-bone">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix ? <span className="ml-1 text-sm text-sage-300">{suffix}</span> : null}
      </p>
      {note ? (
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-sage-500">{note}</p>
      ) : null}
    </div>
  )
}
