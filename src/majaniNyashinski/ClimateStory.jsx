import Reveal from '../components/Reveal'
import LoopingVideo from '../components/LoopingVideo'
import CountUp from '../components/ui/CountUp'

/**
 * Editorial climate/COP32 beat — cultural framing, not a UN-government
 * aesthetic. COP32 is context the campaign is working toward, never a
 * confirmed partner — `disclaimer` (from `data.js`'s `COPY.climateDisclaimer`)
 * is rendered visibly, not buried in a footnote.
 *
 * @param {{
 *   host: string, dateLabel: string, treesFundedSoFar: number, disclaimer: string,
 *   onContinue: () => void,
 * }} props
 */
export default function ClimateStory({ host, dateLabel, treesFundedSoFar, disclaimer, onContinue }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 px-6 py-24 text-bone sm:px-10">
      <LoopingVideo
        src="/media/tea-farm.mp4"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-400">
            Climate action
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] sm:text-6xl">
            It doesn't start at COP.
            <br />
            It starts here.
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-6 max-w-xl">
          <p className="text-[15px] leading-relaxed text-bone-300">
            Kenya's communities, farmers and forests are already doing the
            work — one collaboration, one tin, one Guardian at a time.{' '}
            {host} hosts the next conversation on {dateLabel}; this campaign
            is looking toward it, not speaking for it.
          </p>
        </Reveal>

        <Reveal delay={0.22} className="mt-10 flex items-end gap-3">
          <p className="font-display text-5xl tabular-nums sm:text-6xl">
            <CountUp to={treesFundedSoFar} separator="," duration={1.6} />
          </p>
          <p className="pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-bone-500">
            trees funded so far
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-500">
            {disclaimer}
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-forest-900"
          >
            Become a Guardian
          </button>
        </Reveal>
      </div>
    </section>
  )
}
