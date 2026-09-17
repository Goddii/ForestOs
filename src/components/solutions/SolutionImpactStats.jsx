import Reveal from '../Reveal'
import CountUp from '../ui/CountUp'
import { parseStatValue } from '../../lib/parseStatValue'

/**
 * The proof-density stat row — same shape and same CountUp treatment as
 * home's ImpactTicker (reactbits.dev's count-up, ported once and reused
 * everywhere a stat number appears), without the looping video bed — this
 * page is read, not descended into — so the platform's real totals still
 * ground the offering in the belt itself.
 */
export default function SolutionImpactStats({ eyebrow, stats }) {
  return (
    <section aria-label="Belt totals" className="relative bg-forest-900">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">{eyebrow}</p>

        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const { prefix, number, suffix } = parseStatValue(stat.value)
            return (
              <Reveal key={stat.id} delay={i * 0.06} className="flex flex-col">
                <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-sage-500 lg:min-h-[3.4em]">
                  {stat.label}
                </dt>
                <dd className="tnum mt-2 font-display text-3xl leading-none text-bone sm:text-4xl">
                  {prefix}
                  <CountUp to={number} separator="," duration={1.6} />
                  {suffix}
                </dd>
                <p className="mt-1.5 text-[12px] text-bone-300">{stat.unit}</p>
              </Reveal>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
