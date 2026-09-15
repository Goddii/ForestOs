import { STAGE_LABELS } from './useExperienceFlow'

const VISIBLE_STAGES = ['scan', 'verify', 'discover', 'participate', 'earn', 'passport']

/**
 * A thin step readout, not a decorative dial — it exists so the visitor can
 * feel "how much deeper the experience goes" without a heavy nav bar on a
 * screen that's otherwise full-bleed media. Hidden on the scan screen itself
 * (nothing to show progress against yet).
 */
export default function ExperienceProgress({ stage }) {
  if (stage === 'scan') return null
  const currentLabel = STAGE_LABELS[stage]
  const currentVisibleIndex = VISIBLE_STAGES.indexOf(currentLabel === 'Discover' ? 'discover' : stage)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-6 pt-[max(1rem,env(safe-area-inset-top))]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5">
        {VISIBLE_STAGES.map((s, i) => (
          <span
            key={s}
            className="h-[3px] w-6 rounded-full transition-colors duration-500"
            style={{
              backgroundColor:
                i <= currentVisibleIndex ? 'var(--color-amber-400)' : 'color-mix(in srgb, var(--color-bone) 18%, transparent)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
