import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// Real button affordances (visual-system brief §1) in place of bare
// "TEXT →" links — a ghost button (1px border, fills on hover) for
// secondary actions, a filled pill for primary ones. Every variant shares
// the same focus ring and transition so keyboard and hover feedback are
// consistent everywhere this is used.
const VARIANTS = {
  ghost:
    'border border-line text-ink-muted hover:border-forest-accent/40 hover:bg-forest-accent-soft hover:text-forest-accent-dark',
  primary:
    'border border-forest-accent bg-forest-accent text-white hover:border-forest-accent-dark hover:bg-forest-accent-dark',
  text: 'border border-transparent text-forest-accent hover:text-forest-accent-dark',
}

/**
 * @param {{
 *   to?: string,
 *   onClick?: () => void,
 *   type?: 'button' | 'submit',
 *   variant?: 'ghost' | 'primary' | 'text',
 *   icon?: import('lucide-react').LucideIcon | null,
 *   iconPosition?: 'left' | 'right',
 *   disabled?: boolean,
 *   title?: string,
 *   className?: string,
 *   children: import('react').ReactNode,
 * }} props
 */
export default function ActionButton({
  to,
  onClick,
  type = 'button',
  variant = 'ghost',
  icon: Icon = ArrowRight,
  iconPosition = 'right',
  disabled = false,
  title,
  className = '',
  children,
}) {
  const padding = variant === 'text' ? 'px-0 py-0' : 'px-3.5 py-1.5'
  const classes = `inline-flex items-center gap-1.5 rounded-full font-sans text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-ink-muted ${padding} ${VARIANTS[variant]} ${className}`

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} title={title} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} className={classes}>
      {content}
    </button>
  )
}
