import { CheckCircle2 } from 'lucide-react'
import Reveal from '../Reveal'
import SpotlightCard from '../ui/SpotlightCard'

/**
 * The capability deep-dive — osapiens' per-module breakdown, one card per
 * real ForestOS mechanism (not a generic "feature grid"), each grounded in a
 * concrete stat rather than marketing adjectives. Cards use SpotlightCard
 * (ported from reactbits.dev, amber-tinted) for a cursor-tracking glow —
 * the page's one hover-interactive flourish, restrained to this one section.
 */
export default function SolutionModules({ modules }) {
  return (
    <section className="relative bg-forest-900">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">How it works</p>
          <h2 className="mt-3 max-w-[26ch] font-display text-3xl leading-[1.1] text-bone sm:text-4xl">
            Three mechanisms, one continuous record.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <Reveal key={mod.name} delay={i * 0.08}>
              <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl leading-tight text-bone">{mod.name}</h3>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-bone-300">{mod.description}</p>
                <ul className="mt-5 space-y-2 border-t border-bone/10 pt-5">
                  {mod.stats.map((stat) => (
                    <li key={stat} className="flex items-start gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-sage-300">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" strokeWidth={2.25} aria-hidden="true" />
                      {stat}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
