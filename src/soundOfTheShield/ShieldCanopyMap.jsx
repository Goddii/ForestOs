import { Suspense, lazy, useRef } from 'react'
import { useInView } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary'

// Cesium is heavy — split it off and only fetch it as the card nears view.
const CanopyGlobeHud = lazy(() => import('../components/globe/CanopyGlobeHud'))
const MOUNT_MARGIN = '0px 0px 300px 0px'

const SHIELD_GLOBE_THEME = {
  edgeFade: 'radial-gradient(130% 90% at 50% 45%, transparent 55%, rgba(7,10,8,0.85) 100%)',
  figure: "font-['Inter'] font-black",
  label: "font-['Inter'] font-semibold text-[#8e9f95]",
  toggle:
    "font-['Inter'] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a08]",
  toggleActive: 'bg-[#00ff9d] text-[#070a08]',
  toggleIdle: 'text-[#8e9f95] hover:text-white',
}

const mapNotice = (text) => (
  <div className="grid size-full place-items-center">
    <p className="font-['Inter'] font-semibold text-[#8e9f95] text-[11px] uppercase tracking-[0.12em]">{text}</p>
  </div>
)
const mapPending = mapNotice('Loading the canopy map…')
const mapUnavailable = mapNotice('The canopy map could not load here')

/** The shielded canopy itself: the batch record's live 2015 ⇄ Today Cesium map. */
export default function ShieldCanopyMap() {
  const mapRef = useRef(null)
  const isNearView = useInView(mapRef, { once: true, margin: MOUNT_MARGIN })

  return (
    <section aria-labelledby="shield-canopy-title" className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <div className="flex flex-col gap-[6px] w-full">
        <p className="font-['Inter'] font-bold text-[#00ff9d] text-[11px] uppercase">Canopy record</p>
        <h2 id="shield-canopy-title" className="font-['Inter'] font-extrabold text-[22px] leading-tight text-white">
          The forest this pack keeps standing
        </h2>
        <p className="font-['Inter'] text-[#8e9f95] text-[13px] leading-relaxed">
          The same ridge line, fifteen years apart. Switch between 2015 and today to see the canopy come back.
        </p>
      </div>
      <div
        ref={mapRef}
        className="relative h-[320px] w-full overflow-clip rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(18,26,21,0.4)]"
      >
        {isNearView ? (
          <ErrorBoundary fallback={mapUnavailable}>
            <Suspense fallback={mapPending}>
              <CanopyGlobeHud theme={SHIELD_GLOBE_THEME} fallback={mapUnavailable} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          mapPending
        )}
      </div>
    </section>
  )
}
