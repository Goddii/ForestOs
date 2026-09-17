import { Plus } from 'lucide-react'
import Reveal from '../Reveal'

/**
 * Native <details>/<summary> accordion — full keyboard support and no
 * hand-rolled open-state logic, styled to the site's glass-card language.
 */
export default function SolutionFaq({ faq }) {
  return (
    <section className="relative bg-forest-900">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
        <Reveal className="block">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">Questions</p>
          <h2 className="mt-3 font-display text-3xl leading-[1.1] text-bone sm:text-4xl">
            What compliance teams ask first.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 block divide-y divide-bone/10 border-y border-bone/10">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg leading-snug text-bone">{item.q}</span>
                <Plus
                  className="mt-1 h-4 w-4 shrink-0 text-amber-400 transition-transform duration-200 group-open:rotate-45"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-bone-300">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
