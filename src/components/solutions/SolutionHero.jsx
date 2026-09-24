import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../Reveal'
import CountUp from '../ui/CountUp'
import { parseStatValue } from '../../lib/parseStatValue'

/**
 * Full-bleed photographic hero for a solution/offering page — the same
 * register as the macro home's hero, scaled down to a single static frame
 * since this page is read, not scrolled through cinematically.
 */
const DEFAULT_CTA = { label: 'Request a Forest Edition', to: '/launch' }

/**
 * `cta` defaults to the site-wide "Request a Forest Edition" (consumer
 * product-edition flow) — pages for a role with a live portal (the
 * `/investor` Conservation Capital console) override it to send that role
 * straight in instead, via `content.finalCta.primary` in the page's data file.
 */
export default function SolutionHero({ segment, eyebrow, title, subtitle, image, imageAlt, stats, cta = DEFAULT_CTA }) {
  return (
    <section className="relative overflow-hidden bg-forest-950">
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-forest-950/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/30 to-transparent" />

      <Reveal className="relative mx-auto block max-w-6xl px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-300">{segment}</p>
        <p className="mt-4 inline-block rounded-full border border-amber-400/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-400">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-[18ch] font-display text-4xl leading-[1.08] text-bone sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-bone-300 sm:text-base">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to={cta.to}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400 transition-colors duration-200 hover:border-amber-400 hover:bg-amber-400/10"
          >
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
          </Link>
        </div>

        {stats?.length > 0 && (
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-bone/10 pt-6">
            {stats.map((stat) => {
              const { prefix, number, suffix } = parseStatValue(stat.value)
              return (
                <div key={stat.label}>
                  <dd className="tnum font-display text-2xl leading-none text-bone sm:text-3xl">
                    {prefix}
                    <CountUp to={number} separator="," duration={1.4} />
                    {suffix}
                  </dd>
                  <dt className="mt-1.5 text-[12px] leading-snug text-sage-300">{stat.label}</dt>
                </div>
              )
            })}
          </dl>
        )}
      </Reveal>
    </section>
  )
}
