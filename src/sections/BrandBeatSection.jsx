import { ArrowUp } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionIntro from '../components/ui/SectionIntro'
import Cop32Milestone from '../components/home/Cop32Milestone'
import { useBatch } from '../lib/batchContext'
import { resolveBrand } from '../lib/brands'

function scrollToProof() {
  document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** The brand name + product + (when it has one) the artist's line. */
function BrandIdentity({ batch, brand }) {
  return (
    <div>
      <p className="font-display text-3xl leading-tight text-bone sm:text-4xl">{batch.brand}</p>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
        {batch.product}
      </p>
      {brand?.line && (
        <blockquote className="mt-5 border-l border-bone/15 pl-4">
          <p className="font-display text-xl italic leading-[1.35] text-bone-300 sm:text-2xl">
            {brand.line}
          </p>
          <cite className="mt-2 block font-mono text-[10px] uppercase not-italic tracking-[0.18em] text-sage-500">
            {brand.attribution}
          </cite>
        </blockquote>
      )}
    </div>
  )
}

/** Beat 1 — who put their name on this batch, and why. With rich art it is a
 *  two-column plate; without, it is a plain lockup that lets the section head
 *  carry the weight. */
function BrandLockup({ batch, brand }) {
  if (!brand?.beatImage) return <BrandIdentity batch={batch} brand={brand} />
  return (
    <div className="grid gap-6 rounded-3xl border border-bone/15 bg-forest-950/40 p-5 backdrop-blur-sm sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-10">
      <figure className="overflow-hidden rounded-2xl border border-bone/15 lg:order-2">
        <picture>
          <source srcSet={`${brand.beatImage}.webp`} type="image/webp" />
          <img
            src={`${brand.beatImage}.jpg`}
            alt={brand.beatImageAlt}
            width={1400}
            height={788}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </figure>
      <div className="lg:order-1">
        <BrandIdentity batch={batch} brand={brand} />
      </div>
    </div>
  )
}

/** Beat 2 — the covenant this one pack keeps funded. */
function BlockFunded({ batch }) {
  const { block } = batch
  return (
    <div className="rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8">
      <h3 className="font-display text-2xl text-bone">What this pack holds open</h3>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-bone-300">
        Batch&nbsp;#{batch.id} is pressed against {block.bufferZone}. Its premium keeps{' '}
        <span className="text-bone">{block.covenantHa.toLocaleString()} ha</span> under covenant,{' '}
        <span className="text-bone">{block.patrolsThisMonth} ranger patrols</span> on the boundary this
        month, and <span className="text-bone">{block.seedlingsPlanted.toLocaleString()} seedlings</span>{' '}
        in the ground.
      </p>
      <button
        type="button"
        onClick={scrollToProof}
        className="group mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300 transition-colors hover:text-bone"
      >
        <ArrowUp
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        See the ridge this batch protects
      </button>
    </div>
  )
}

/** Beat 3 — what the brand adds on top of the picker premium. */
function BrandContribution({ brand }) {
  const items = [
    { v: `+KES ${brand.conservationKesPerPack}`, k: 'per pack, into the buffer fund' },
    { v: `KES ${(brand.conservationFundKes / 1_000_000).toFixed(1)}M`, k: 'directed to conservation so far' },
    { v: brand.packsSold.toLocaleString(), k: 'packs carrying the covenant' },
  ]
  return (
    <div className="rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8">
      <h3 className="font-display text-2xl text-bone">On top of the picker premium</h3>
      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.k}>
            <dt className="tnum font-display text-3xl leading-none text-bone sm:text-4xl">{it.v}</dt>
            <dd className="mt-1.5 text-[12px] leading-snug text-sage-300">{it.k}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/**
 * The public batch's brand beat — who sponsors this batch's sector, the covenant
 * one pack keeps funded, what the brand adds to the fund, and where it sits in
 * the belt standings. Additive: it sits after the impact records and before the
 * passport export, and renders nothing for an unbranded batch.
 */
export default function BrandBeatSection() {
  const BATCH = useBatch()
  if (!BATCH.brand) return null
  const brand = resolveBrand(BATCH.brandId)

  const standingLine = brand
    ? brand.rank === 1
      ? `${brand.name} leads the belt this quarter — ${brand.treesFunded.toLocaleString()} trees funded across ${brand.sector}.`
      : `${brand.name} sits #${brand.rank} on the belt — ${brand.treesFunded.toLocaleString()} trees funded across ${brand.sector}.`
    : null

  return (
    <section className="relative z-10 overflow-hidden bg-forest-950">
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
        <SectionIntro
          eyebrow={`Batch #${BATCH.id} · ${BATCH.brand}`}
          title="The name on this batch."
          body={`${BATCH.brand} adopted this sector of the belt — funding its plucker premium and conservation covenant, and reporting against it in the ESG portal.`}
        />

        <Reveal className="mt-12 block">
          <BrandLockup batch={BATCH} brand={brand} />
        </Reveal>

        <div className={'mt-4 grid gap-4 ' + (brand?.conservationKesPerPack ? 'lg:grid-cols-2' : '')}>
          <Reveal className="block" delay={0.04}>
            <BlockFunded batch={BATCH} />
          </Reveal>
          {brand?.conservationKesPerPack && (
            <Reveal className="block" delay={0.08}>
              <BrandContribution brand={brand} />
            </Reveal>
          )}
        </div>

        {brand?.campaign && (
          <Reveal className="mt-4 block" delay={0.1}>
            <Cop32Milestone compact />
            {standingLine && (
              <p className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-bone-300">
                {standingLine}
              </p>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
