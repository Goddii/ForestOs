import { Suspense, lazy, useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import BackgroundVideo from '../components/BackgroundVideo'
import DeferredMount from '../components/util/DeferredMount'
import Hero from '../sections/Hero'
import ImpactSection from '../sections/ImpactSection'
import BrandBeatSection from '../sections/BrandBeatSection'
import PassportFooter from '../sections/PassportFooter'
import { BatchContext } from '../lib/batchContext'
import { resolveBatch } from '../lib/mock'

// Cesium is a large dependency — split it off so the hero paints first.
const GlobeSection = lazy(() => import('../sections/GlobeSection'))

const GlobeLoading = (
  <section className="relative z-10 grid min-h-[60svh] place-items-center bg-forest-950">
    <span className="font-mono text-xs uppercase tracking-[0.24em] text-sage-500">
      Loading the map…
    </span>
  </section>
)

/**
 * The QR-scan experience — the original single-page canopy dive, 3D proof map,
 * impact records and passport export — now living under `/batch/:batchId`. The
 * resolved batch flows to every section through BatchContext.
 */
export default function BatchView() {
  const { batchId } = useParams()
  const videoRef = useRef(null)
  const batch = useMemo(() => resolveBatch(batchId), [batchId])

  useEffect(() => {
    document.title = `ForestOS — Batch #${batch.id} Conservation Record`
  }, [batch.id])

  return (
    <BatchContext.Provider value={batch}>
      <a
        href="#proof"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-forest-950"
      >
        Skip to the conservation record
      </a>

      <Link
        to="/"
        className="fixed left-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-bone/15 bg-forest-950/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-300 backdrop-blur transition-colors hover:text-bone"
      >
        ForestOS
        <ArrowUpRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      </Link>

      <BackgroundVideo videoRef={videoRef} />

      <main>
        <Hero videoRef={videoRef} />
        <DeferredMount placeholder={GlobeLoading} minScrollY={700}>
          <Suspense fallback={GlobeLoading}>
            <GlobeSection />
          </Suspense>
        </DeferredMount>
        <ImpactSection />
        <BrandBeatSection />
        <PassportFooter />
      </main>
    </BatchContext.Provider>
  )
}
