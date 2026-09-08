import { ArrowUpRight } from 'lucide-react'
import LoopingVideo from '../LoopingVideo'
import SectionIntro from '../ui/SectionIntro'
import { PARTNERS, PARTNER_MAX_HECTARES } from '../../lib/platformData'

// Bento spans, largest block first — the grid carries the belt's real scale.
const SPANS = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2']

/**
 * Participating brands and the belt sectors they sponsor — "the consumer".
 * Muted tea-pour footage runs behind a heavy forest wash; each card is sized by
 * its block's hectares and flies the belt globe to that sector on click.
 *
 * @param {(blockId: string) => void} onExplore
 */
export default function PartnerShowcase({ onExplore }) {
  return (
    <section id="partners" className="relative z-10 scroll-mt-20 overflow-hidden bg-forest-950">
      <LoopingVideo
        src="/media/tea-pour.webm"
        playbackRate={0.8}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Heavy, moody wash — opaque at the seams, ~70% through the middle. */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/72 to-forest-950/92 backdrop-blur-[2px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
        <SectionIntro
          eyebrow="5 blocks · 5 sponsoring brands"
          title="Every sector of the belt has a name on it."
          body="Offtakers and consumer brands adopt a forest block, fund its plucker premium and conservation covenant, and report against it in the ESG portal."
        />

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {PARTNERS.map((partner, i) => {
            const fill = Math.round((partner.hectares / PARTNER_MAX_HECTARES) * 100)
            return (
              <li key={partner.id} className={SPANS[i] ?? 'lg:col-span-2'}>
                <button
                  type="button"
                  onClick={() => onExplore?.(partner.id)}
                  aria-label={`Fly the belt map to ${partner.block}, sponsored by ${partner.brand}`}
                  className="group flex w-full flex-col rounded-2xl border border-bone/15 bg-forest-950/40 p-5 text-left backdrop-blur-md transition-colors duration-200 hover:bg-forest-950/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-xl text-bone">{partner.brand}</p>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-sage-500 transition-colors group-hover:text-amber-400"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 text-[13px] text-bone-300">
                    sponsors the {partner.sector}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
                    {partner.counties} counties · {partner.centres} collection centres
                  </p>

                  <div className="mt-4 pt-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/15">
                      <div
                        className="h-full rounded-full bg-sage-500"
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
                      {partner.block} · {partner.hectares.toLocaleString()} ha
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
