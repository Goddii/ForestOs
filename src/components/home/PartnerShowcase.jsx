import LoopingVideo from '../LoopingVideo'
import Reveal from '../Reveal'
import SectionIntro from '../ui/SectionIntro'
import BrandFeature from './BrandFeature'
import ImpactLeague from './ImpactLeague'
import Cop32Milestone from './Cop32Milestone'
import AmbitionRoadmap from './AmbitionRoadmap'
import EnablingPartners from './EnablingPartners'
import PartnerArchetypes from './PartnerArchetypes'
import { STANDINGS } from '../../lib/brands'

/**
 * Participating brands and the belt sectors they sponsor — "the consumer".
 * Muted tea-pour footage runs behind a heavy forest wash; a lead-brand feature
 * sits above a ranked Conservation Impact League, with every card and row flying
 * the belt globe to that block. The COP32 milestone is the finish line the
 * standings race toward.
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
          eyebrow={`${STANDINGS.length} sponsoring brands · 1 belt`}
          title="Every sector of the belt has a name on it."
          body="Consumer brands adopt a forest block, fund its plucker premium and conservation covenant, and report against it in the ESG portal. This is where they stand."
        />

        <Reveal className="mt-12 block">
          <BrandFeature onExplore={onExplore} />
        </Reveal>

        <Reveal className="mt-16 block" delay={0.05}>
          <ImpactLeague onExplore={onExplore} />
        </Reveal>

        <Reveal className="mt-10 block" delay={0.08}>
          <Cop32Milestone />
        </Reveal>

        <Reveal className="mt-16 block" delay={0.1}>
          <AmbitionRoadmap />
        </Reveal>

        <Reveal className="mt-14 block" delay={0.12}>
          <EnablingPartners />
        </Reveal>

        <Reveal className="mt-10 block" delay={0.14}>
          <PartnerArchetypes />
        </Reveal>
      </div>
    </section>
  )
}
