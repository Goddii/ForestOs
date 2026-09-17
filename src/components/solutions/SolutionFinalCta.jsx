import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../Reveal'

export default function SolutionFinalCta({ finalCta }) {
  return (
    <section className="relative bg-forest-900">
      <Reveal className="mx-auto block max-w-3xl px-6 py-20 text-center sm:px-8 sm:py-28">
        <h2 className="max-w-[22ch] mx-auto font-display text-3xl leading-[1.12] text-bone sm:text-4xl">
          {finalCta.title}
        </h2>
        <p className="mt-4 max-w-[52ch] mx-auto text-[15px] leading-relaxed text-bone-300">
          {finalCta.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={finalCta.primary.to}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400 transition-colors duration-200 hover:border-amber-400 hover:bg-amber-400/10"
          >
            {finalCta.primary.label}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
          </Link>
          <Link
            to={finalCta.secondary.to}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-sage-300 underline decoration-sage-300/30 underline-offset-4 transition-colors hover:text-bone"
          >
            {finalCta.secondary.label}
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
