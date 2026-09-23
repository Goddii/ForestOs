import Reveal from '../components/Reveal'
import LoopingVideo from '../components/LoopingVideo'

/**
 * The turn from music to product — "this isn't just tea, it has an origin."
 * Real footage (`tea-pour.webm`, an existing asset already used by
 * `qrExperience/data.js`'s `scanLoop`), not a generated or stock substitute.
 *
 * @param {{ product: string, landmark: string, region: string, onContinue: () => void }} props
 */
export default function TeaReveal({ product, landmark, region, onContinue }) {
  return (
    <section className="relative overflow-hidden bg-bone px-6 py-24 text-ink sm:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint">
            {product}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">
            This isn't just tea.
            <br />
            It has an origin.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-muted">
            Every pack in the Guardian Edition traces back to one real place —
            not a slogan, a location.
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-800 px-6 py-3 font-sans text-sm font-semibold text-bone transition-colors duration-200 hover:bg-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-800/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
          >
            See the forest
          </button>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative overflow-hidden rounded-2xl">
            <LoopingVideo src="/media/tea-pour.webm" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-300">
                The forest belt
              </p>
              <p className="mt-1 font-display text-2xl text-bone">{landmark}</p>
              <p className="font-mono text-[11px] text-bone-500">{region}, Kenya · verified origin</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
