import { PLATFORM } from '../../lib/platformData'

const protectedStat = PLATFORM.stats.find((stat) => stat.id === 'protected')

const TIERS = [
  {
    numeral: 'I',
    name: 'Every Cup',
    stat: '8–11 m²',
    statLabel: 'protected per verified cup',
    body: 'Each batch is geolocated against a forest baseline before the pack ships — the metres it protects are printed on the passport, not estimated after the fact.',
  },
  {
    numeral: 'II',
    name: 'Buffer Belt',
    stat: `${protectedStat.value} ha`,
    statLabel: protectedStat.unit,
    body: "Every sponsoring brand's block joins a single, continuous tea-farm buffer running along the forest edge.",
  },
  {
    numeral: 'III',
    name: 'Forest Line',
    stat: '940 km',
    statLabel: 'of protected forest edge, 16 counties',
    body: 'The belt itself becomes the boundary: five water towers held by a living ring of smallholder tea farms.',
  },
  {
    numeral: 'IV',
    name: 'Continental Canopy',
    stat: null,
    statLabel: "Kenya's five water towers, then the region",
    body: 'The same ledger and the same buffer model, extended past this belt as the League grows.',
  },
]

/**
 * The scale narrative: four tiers from a single verified cup to a
 * continental ambition. Every stat here is a real figure already used
 * elsewhere on the page (the covenant hectares, the belt-wide kilometres,
 * the per-cup protection range from the batch records) — Tier IV is
 * deliberately left without an invented number.
 */
export default function AmbitionRoadmap() {
  return (
    <div>
      <h3 className="font-display text-2xl leading-tight text-bone sm:text-3xl">
        We aspire to be a continental canopy.
      </h3>
      <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-sage-300">
        The same model, at four scales: one cup, one belt, one country's forest
        line, and past it.
      </p>

      <ol className="mt-8 space-y-8 border-l border-bone/15 pl-6 sm:pl-8">
        {TIERS.map((tier) => (
          <li key={tier.numeral} className="relative">
            <span
              className="absolute -left-[calc(1.5rem+3px)] top-1 h-[6px] w-[6px] rounded-full bg-amber-400 sm:-left-[calc(2rem+3px)]"
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
  )
}
