import { ERAS } from '../lib/mock'

const OPTIONS = [ERAS['2015'], ERAS.today]

/** Segmented "2015 vs. Today" control driving the satellite-recovery state. */
export default function TimeToggle({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Satellite era"
      className="inline-flex rounded-full border border-bone/15 bg-forest-950/70 p-1 backdrop-blur"
    >
      {OPTIONS.map((era) => {
        const active = value === era.key
        return (
          <button
            key={era.key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(era.key)}
            className={
              'rounded-full px-4 py-1.5 font-mono text-xs font-medium tracking-[0.12em] transition-colors duration-200 ' +
              (active
                ? 'bg-amber-400 text-forest-950'
                : 'text-sage-300 hover:text-bone')
            }
          >
            {era.label.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
