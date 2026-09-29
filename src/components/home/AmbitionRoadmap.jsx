import { useEffect, useRef, useState } from 'react'
import { PLATFORM } from '../../lib/platformData'

const protectedStat = PLATFORM.stats.find((stat) => stat.id === 'protected')

const TIERS = [
  {
    numeral: 'I',
    name: 'Every Cup',
    stat: '8–11 m²',
    statLabel: 'protected per verified cup',
    body: 'Each batch is geolocated against a forest baseline before the pack ships — the metres it protects are printed on the passport, not estimated after the fact.',
    image: '/media/tier-cup.webp',
  },
  {
    numeral: 'II',
    name: 'Buffer Belt',
    stat: `${protectedStat.value} ha`,
    statLabel: protectedStat.unit,
    body: "Every sponsoring brand's block joins a single, continuous tea-farm buffer running along the forest edge.",
    image: '/media/tier-buffer-belt.webp',
  },
  {
    numeral: 'III',
    name: 'Forest Line',
    stat: '940 km',
    statLabel: 'of protected forest edge, 16 counties',
    body: 'The belt itself becomes the boundary: five water towers held by a living ring of smallholder tea farms.',
    image: '/media/tier-forest-line.webp',
  },
  {
    numeral: 'IV',
    name: 'Continental Canopy',
    stat: null,
    statLabel: "Kenya's five water towers, then the region",
    body: 'The same ledger and the same buffer model, extended past this belt as the League grows.',
    image: '/media/tier-canopy.webp',
  },
]

// The tier counts as "being read" while it crosses this band around the
// middle of the viewport.
const READING_BAND = '-45% 0px -45% 0px'

/**
 * The scale narrative: four tiers from a single verified cup to a
 * continental ambition. Every stat here is a real figure already used
 * elsewhere on the page (the covenant hectares, the belt-wide kilometres,
 * the per-cup protection range from the batch records) — Tier IV is
 * deliberately left without an invented number.
 *
 * From `lg` up a sharp framed picture stays beside the list and crossfades to
 * the tier being read; below `lg` the list stands alone.
 */
export default function AmbitionRoadmap() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tierRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const crossing = entries.find((entry) => entry.isIntersecting)
        if (crossing) setActiveIndex(Number(crossing.target.dataset.index))
      },
      { rootMargin: READING_BAND },
    )
    tierRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
      <div>
        <h3 className="font-display text-2xl leading-tight text-bone sm:text-3xl">
          We aspire to be a continental canopy.
        </h3>
        <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-sage-300">
          The same model, at four scales: one cup, one belt, one country's forest
          line, and past it.
        </p>

        <ol className="mt-8 space-y-8 border-l border-bone/15 pl-6 sm:pl-8 lg:space-y-14">
          {TIERS.map((tier, index) => (
            <li
              key={tier.numeral}
              ref={(node) => {
                tierRefs.current[index] = node
              }}
              data-index={index}
              className={`relative transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                index === activeIndex ? '' : 'lg:opacity-70'
              }`}
            >
              <span
                className={`absolute -left-[calc(1.5rem+3px)] top-1 h-[6px] w-[6px] rounded-full transition-colors duration-300 motion-reduce:transition-none sm:-left-[calc(2rem+3px)] ${
                  index === activeIndex ? 'bg-amber-400' : 'bg-amber-400 lg:bg-sage-500'
                }`}
                aria-hidden="true"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage-500">
                Tier {tier.numeral}
              </p>
              <h4 className="mt-1 font-display text-xl text-bone sm:text-2xl">{tier.name}</h4>
              <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-bone-300">
                {tier.body}
              </p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px] uppercase tracking-[0.14em] text-sage-500">
                {tier.stat && <span className="tnum text-amber-400">{tier.stat}</span>}
                <span>{tier.statLabel}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-28 aspect-square overflow-hidden rounded-[22px] border border-bone/15 bg-forest-900 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
          {TIERS.map((tier, index) => (
            <img
              key={tier.numeral}
              src={tier.image}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              aria-hidden={index !== activeIndex}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/90 to-transparent px-6 pb-5 pt-16"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber-400">
              Tier {TIERS[activeIndex].numeral}
            </p>
            <p className="mt-1 font-display text-2xl text-bone">{TIERS[activeIndex].name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
