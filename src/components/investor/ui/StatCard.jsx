import CountUp from '../../ui/CountUp'

// The repeated "big number + label" pattern (project capital figures,
// landscape summary stats, project-page glance stats) consolidated into one
// component (visual-system brief §5) instead of four near-identical inline
// components. Numbers are sans-serif and bold with tabular figures — serif
// stays reserved for page/section titles, never data (brief §3).
const SIZE_CLASSES = {
  sm: 'text-2xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-[2.75rem]',
  xl: 'text-4xl sm:text-5xl',
}

/**
 * @param {{
 *   label: string,
 *   value: number | string,
 *   unit?: string,
 *   accent?: boolean,
 *   size?: 'sm' | 'md' | 'lg' | 'xl',
 *   duration?: number,
 *   separator?: string,
 *   interactive?: boolean,
 *   onClick?: () => void,
 *   className?: string,
 *   children?: import('react').ReactNode,
 * }} props
 */
export default function StatCard({
  label,
  value,
  unit,
  accent = false,
  size = 'md',
  duration = 1.4,
  separator = '',
  interactive = false,
  onClick,
  className = '',
  children,
}) {
  const Wrapper = interactive ? 'button' : 'div'

  return (
    <Wrapper
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={`group text-left ${
        interactive
          ? 'cursor-pointer rounded-xl transition-all duration-200 ease-in-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50'
          : ''
      } ${className}`}
    >
      <p
        className={`font-sans font-bold leading-none tabular-nums ${SIZE_CLASSES[size]} ${
          accent ? 'text-forest-accent' : 'text-ink'
        }`}
      >
        {typeof value === 'number' ? (
          <CountUp to={value} duration={duration} separator={separator} />
        ) : (
          value
        )}
        {unit && <span className="ml-1 text-base font-semibold text-ink-muted">{unit}</span>}
      </p>
      <p className="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </p>
      {children}
    </Wrapper>
  )
}
