import LoopingVideo from '../LoopingVideo'
import { PLATFORM } from '../../lib/platformData'

/**
 * Platform-wide totals — "the origin". A four-up figure row bled over muted
 * tea-farm footage under a deep forest wash so the numerals stay legible.
 */
export default function ImpactTicker() {
  return (
    <section
      aria-label="Platform-wide totals"
      className="relative z-10 overflow-hidden bg-forest-950"
    >
      <LoopingVideo
        src="/media/tea-farm.mp4"
        playbackRate={0.75}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Deep forest wash — opaque at the seams, sheer in the middle band. */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/78 to-forest-950/95" />

      <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">
          Belt totals · illustrative figures
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col">
              <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-sage-500 lg:min-h-[3.4em]">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-3xl leading-none text-bone sm:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-1.5 text-[12px] text-bone-300">{stat.unit}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
                {stat.trend}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
