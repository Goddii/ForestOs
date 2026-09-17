import { useEffect } from 'react'
import MacroNav from '../../components/home/MacroNav'
import MacroFooter from '../../components/home/MacroFooter'
import SolutionHero from '../../components/solutions/SolutionHero'
import SolutionImpactStats from '../../components/solutions/SolutionImpactStats'
import SolutionProblem from '../../components/solutions/SolutionProblem'
import SolutionModules from '../../components/solutions/SolutionModules'
import SolutionTestimonial from '../../components/solutions/SolutionTestimonial'
import SolutionFaq from '../../components/solutions/SolutionFaq'
import SolutionCrossPromo from '../../components/solutions/SolutionCrossPromo'
import SolutionFinalCta from '../../components/solutions/SolutionFinalCta'

/**
 * Shared template for every "Partners" offering page (osapiens-depth
 * solution template). One content object drives the whole page, so adding
 * the remaining offerings is a data file plus a thin route wrapper, not a
 * new page built from scratch.
 */
export default function SolutionPage({ content }) {
  useEffect(() => {
    document.title = `${content.eyebrow} — ForestOS`
  }, [content.eyebrow])

  return (
    <>
      <MacroNav />
      <main>
        <SolutionHero
          segment={content.segment}
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
          image={content.heroImage}
          imageAlt={content.heroImageAlt}
          stats={content.heroStats}
        />
        <SolutionImpactStats eyebrow={content.impact.eyebrow} stats={content.impact.stats} />
        <SolutionProblem problem={content.problem} solution={content.solution} />
        <SolutionModules modules={content.modules} />
        <SolutionTestimonial testimonial={content.testimonial} />
        <SolutionFaq faq={content.faq} />
        <SolutionCrossPromo crossPromo={content.crossPromo} />
        <SolutionFinalCta finalCta={content.finalCta} />
      </main>
      <MacroFooter />
    </>
  )
}
