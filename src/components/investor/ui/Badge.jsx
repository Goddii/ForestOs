// Reusable status pill (visual-system brief §4): a filled background plus
// matching text, not bare colored text — the previous pass used icon+text
// with no containment, which reads as a label rather than a badge. Instant
// scanability comes from the background fill, not just the text color.
const TONE_STYLES = {
  verified: 'border-forest-accent/20 bg-forest-accent-soft text-forest-accent-dark',
  live: 'border-emerald-500/25 bg-emerald-50 text-emerald-700',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  danger: 'border-danger/25 bg-danger-soft text-danger',
  neutral: 'border-line bg-canvas-sunk text-ink-faint',
}

/**
 * @param {{
 *   tone?: 'verified' | 'live' | 'warning' | 'danger' | 'neutral',
 *   icon?: import('lucide-react').LucideIcon,
 *   children: import('react').ReactNode,
 *   className?: string,
 * }} props
 */
export default function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] ${TONE_STYLES[tone]} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden="true" />}
      {children}
    </span>
  )
}
