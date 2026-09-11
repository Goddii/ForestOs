import { ArrowUpRight } from 'lucide-react'
import { STANDINGS, resolveBrand } from '../../lib/brands'

/**
 * The lead brand, given room. An asymmetric editorial panel — product plate on
 * one side, the artist's conservation line and the block it holds on the other —
 * that flies the belt globe to its sector on the call to action. Sits above the
 * league table so the standings read as "and everyone chasing the leader".
 *
 * @param {(blockId: string) => void} onExplore
 */
export default function BrandFeature({ onExplore }) {
  const leader = resolveBrand(STANDINGS[0].brandId)
  if (!leader?.image) return null

  return (
    <div className="grid gap-6 rounded-3xl border border-bone/15 bg-forest-950/40 p-5 backdrop-blur-md sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
      <figure className="overflow-hidden rounded-2xl border border-bone/15">
        <picture>
          <source srcSet={`${leader.image}.webp`} type="image/webp" />
          <img
            src={`${leader.image}.jpg`}
            alt={leader.imageAlt}
            width={1400}
            height={933}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </figure>

      <div>
        <p className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-400/[0.12] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-400">
          #{leader.rank} on the belt this quarter
        </p>
        <p className="mt-4 font-display text-3xl leading-tight text-bone sm:text-4xl">
          {leader.name}
        </p>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
          {leader.product} · {leader.campaign}
        </p>

        <blockquote className="mt-5 border-l border-bone/15 pl-4">
          <p className="font-display text-xl italic leading-[1.35] text-bone-300 sm:text-2xl">
            {leader.line}
          </p>
          <cite className="mt-2 block font-mono text-[10px] uppercase not-italic tracking-[0.18em] text-sage-500">
            {leader.attribution}
          </cite>
        </blockquote>

        <p className="tnum mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-500">
          {leader.sector} · {leader.hectares.toLocaleString()} ha · {leader.treesFunded.toLocaleString()} trees funded
        </p>

        <button
          type="button"
          onClick={() => onExplore?.(leader.blockId)}
          aria-label={`Fly the belt map to ${leader.sector}, sponsored by ${leader.name}`}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 font-sans text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
        >
          Fly to the {leader.shortName} sector
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.25}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  )
}
