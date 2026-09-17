import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../Reveal'

/**
 * Cross-suite promotion — osapiens' "connected by design" carousel. An item
 * with a `to` links to its real solution page (a `group` so the label and
 * arrow both react on hover); an item without one renders inert with a
 * "Soon" badge instead, so nothing here 404s ahead of its page shipping.
 */
export default function SolutionCrossPromo({ crossPromo }) {
  return (
    <section className="relative bg-forest-950">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <Reveal className="block">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">{crossPromo.eyebrow}</p>
          <h2 className="mt-3 max-w-[32ch] font-display text-2xl leading-[1.15] text-bone sm:text-3xl">
            {crossPromo.title}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {crossPromo.items.map((item, i) => {
            const card = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-lg leading-tight text-bone transition-colors group-hover:text-amber-400">
                    {item.label}
                  </p>
                  {item.to ? (
                    <ArrowRight
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-sage-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-amber-400"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="shrink-0 rounded-full border border-bone/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">
                      Soon
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-bone-300">{item.note}</p>
              </>
            )
            return (
              <Reveal key={item.label} delay={i * 0.06}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="group block rounded-xl border border-bone/10 bg-forest-900/50 p-5 transition-colors hover:border-amber-400/25"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="rounded-xl border border-bone/10 bg-forest-900/50 p-5 opacity-70">{card}</div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
