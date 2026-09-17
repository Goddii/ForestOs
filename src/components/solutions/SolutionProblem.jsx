import Reveal from '../Reveal'

/**
 * "Your challenge. Our solution." — osapiens' problem/solution framing,
 * built from a left column of concrete pain points and a right column that
 * states ForestOS's answer once, plainly, rather than re-selling each point.
 */
export default function SolutionProblem({ problem, solution }) {
  return (
    <section className="relative bg-forest-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <Reveal className="block">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">{problem.eyebrow}</p>
            <h2 className="mt-3 max-w-[22ch] font-display text-3xl leading-[1.1] text-bone sm:text-4xl">
              {problem.title}
            </h2>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-bone-300">{problem.intro}</p>
          </Reveal>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {problem.points.map((point) => (
              <li key={point.title} className="border-t border-bone/10 pt-4">
                <p className="font-display text-lg leading-tight text-bone">{point.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-bone-300">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="block">
          <div className="rounded-2xl border border-amber-400/25 bg-forest-900/60 p-7 backdrop-blur-md sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400">{solution.eyebrow}</p>
            <h3 className="mt-3 font-display text-2xl leading-[1.15] text-bone sm:text-[1.75rem]">
              {solution.title}
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-bone-300">{solution.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
