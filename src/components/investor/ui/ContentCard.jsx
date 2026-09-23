// Structural card containment (visual-system brief §2): stat grids, report
// listings and other content that previously sat directly on the page
// canvas get a real surface — border, shadow, and its own background — so
// the page reads as layered software instead of a printed report. Reuses
// `--shadow-card` (already in index.css, unused until now).
const INTERACTIVE_CLASSES =
  'cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-forest-accent/40 hover:shadow-[0_1px_2px_rgba(20,32,25,0.05),0_16px_32px_-14px_rgba(20,32,25,0.18)]'

/**
 * @param {{
 *   as?: keyof JSX.IntrinsicElements,
 *   interactive?: boolean,
 *   onClick?: () => void,
 *   className?: string,
 *   children: import('react').ReactNode,
 * }} props
 */
export default function ContentCard({ as: Component = 'div', interactive = false, onClick, className = '', children, ...rest }) {
  return (
    <Component
      onClick={onClick}
      className={`rounded-2xl border border-line bg-card shadow-card ${interactive ? INTERACTIVE_CLASSES : ''} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
