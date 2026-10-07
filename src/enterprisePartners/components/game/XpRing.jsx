import { tierProgress } from '../../lib/game'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

const RADIUS = 34
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * The progress ring the brief asks to "always be visible" (5.5). Canopy XP is
 * the only thing it draws: a ForestOS-native score with no cash value, kept
 * strictly separate from the Bonga concept.
 */
export default function XpRing({ xp = 0, label = 'Canopy XP', size = 'md', className = '' }) {
  const { tier, nextTier, toNext, pct } = tierProgress(xp)
  const reduced = usePrefersReducedMotion()
  const compact = size === 'sm'

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'} ${className}`}>
      <div
        className={`relative shrink-0 ${compact ? 'h-10 w-10' : 'h-[72px] w-[72px]'}`}
        role="img"
        aria-label={`${xp} Canopy XP. ${tier.label} tier.${nextTier ? ` ${toNext} XP to ${nextTier.label}.` : ' Top tier reached.'}`}
      >
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r={RADIUS} className="fill-none stroke-forest-800" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            className={`fill-none stroke-amber-400 ${reduced ? '' : 'ep-ring-progress'}`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
          />
        </svg>
        <span
          className={`absolute inset-0 grid place-items-center font-mono tabular-nums text-bone ${compact ? 'text-[9px]' : 'text-[11px]'}`}
        >
          {xp}
        </span>
      </div>
      <div className="min-w-0">
        {compact ? null : (
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-sage-500">{label}</p>
        )}
        <p
          className={`truncate font-display leading-tight text-bone ${compact ? 'text-[13px]' : 'text-lg'}`}
        >
          {tier.label}
        </p>
        {nextTier ? (
          <p
            className={`leading-snug text-bone-500 ${compact ? 'font-mono text-[9px]' : 'text-[11px]'}`}
          >
            {toNext} XP to {nextTier.label}
          </p>
        ) : (
          <p className={`leading-snug text-river-400 ${compact ? 'font-mono text-[9px]' : 'text-[11px]'}`}>
            Top tier reached
          </p>
        )}
      </div>
    </div>
  )
}
