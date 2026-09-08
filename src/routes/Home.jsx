import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import BackgroundVideo from '../components/BackgroundVideo'
import DeferredMount from '../components/util/DeferredMount'
import MacroNav from '../components/home/MacroNav'
import MacroHero from '../components/home/MacroHero'
import ImpactTicker from '../components/home/ImpactTicker'
import PartnerShowcase from '../components/home/PartnerShowcase'
import MacroFooter from '../components/home/MacroFooter'

// Cesium is heavy — split it exactly as BatchView does so the hero paints first.
const GlobeSection = lazy(() => import('../sections/GlobeSection'))

// Reserve roughly the mounted section's height (intro + ~82svh map) so the
// lazy globe swap does not shove the page when it scrolls into view.
const GlobeLoading = (
  <section className="relative z-10 grid min-h-[90svh] place-items-center bg-forest-950">
    <span className="font-mono text-xs uppercase tracking-[0.24em] text-sage-500">
      Loading the belt map…
    </span>
  </section>
)

/**
 * The macro home — the same cinematic structure as BatchView (fixed video,
 * pinned canopy dive, scroll-in 3D globe, impact strip) framed for the whole
 * 940 km tea belt rather than a single batch.
 */
export default function Home() {
  const videoRef = useRef(null)
  const [activeBlockId, setActiveBlockId] = useState(null)

  useEffect(() => {
    document.title = 'ForestOS — Kenya’s Tea Buffer Belt'
  }, [])

  // A partner card selects its block and scrolls the belt map into view.
  const handleExploreBlock = useCallback((blockId) => {
    setActiveBlockId(blockId)
    document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <MacroNav />
      {/* Fixed full-viewport video, scrubbed by the hero dive — sits at -z-10,
          so every section after the hero must paint an opaque background. */}
      <BackgroundVideo videoRef={videoRef} />

      <main>
        <MacroHero videoRef={videoRef} />
        <DeferredMount placeholder={GlobeLoading} minScrollY={700}>
          <Suspense fallback={GlobeLoading}>
            <GlobeSection
              macroMode
              activeBlockId={activeBlockId}
              onSelectBlock={setActiveBlockId}
            />
          </Suspense>
        </DeferredMount>
        <ImpactTicker />
        <PartnerShowcase onExplore={handleExploreBlock} />
      </main>

      <MacroFooter />
    </>
  )
}
