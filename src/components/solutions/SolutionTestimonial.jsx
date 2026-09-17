import Reveal from '../Reveal'

/**
 * A single pull-quote. Explicitly labelled illustrative when no real
 * customer has given one yet — matching the "illustrative figures" honesty
 * convention ImpactTicker already uses for platform totals, extended to
 * quotes so this never reads as a fabricated endorsement.
 */
export default function SolutionTestimonial({ testimonial }) {
  return (
    <section className="relative bg-forest-950">
      <Reveal className="mx-auto block max-w-3xl px-6 py-16 text-center sm:px-8 sm:py-24">
        {testimonial.illustrative && (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            Illustrative — no live customer quote yet
          </p>
        )}
        <blockquote className="mt-5 font-display text-2xl leading-[1.3] text-bone sm:text-3xl">
          “{testimonial.quote}”
        </blockquote>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-300">
          {testimonial.name} · {testimonial.role}, {testimonial.org}
        </p>
      </Reveal>
    </section>
  )
}
