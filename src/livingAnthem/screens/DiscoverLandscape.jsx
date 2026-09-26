import { Suspense, lazy, useRef } from 'react'
import { useInView } from 'framer-motion'
import ErrorBoundary from '../../components/ErrorBoundary'
import { imgMapLayer } from '../assets'
import { DecryptedText } from '../fxLibrary'
import { BottomAction, ChapterIndicator, FOCUS_RING, Reveal, Screen, SectionTitle, STAGGER, StatusBar } from '../chrome'

// Cesium is heavy — split it off and only fetch it as the chapter nears view.
const CanopyGlobeHud = lazy(() => import('../../components/globe/CanopyGlobeHud'))

const ANTHEM_GLOBE_THEME = {
  edgeFade: 'radial-gradient(130% 90% at 50% 45%, transparent 55%, rgba(4,13,7,0.85) 100%)',
  figure: "font-['Syne'] font-extrabold",
  label: "font-['Geist'] font-bold text-[#8a9f96]",
  toggle: `font-['Geist'] font-bold ${FOCUS_RING}`,
  toggleActive: 'bg-[#00ff87] text-[#040d07]',
  toggleIdle: 'text-[#8a9f96] hover:text-white',
}
const MOUNT_MARGIN = '0px 0px 300px 0px'

const aerialStill = (
  <img
    alt="Aerial view of the Mau Forest Complex at sunrise"
    className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full"
    src={imgMapLayer}
  />
)

/** CH. 03 — Figma "discover-landscape" (node 3:65): the Mau Complex. */
export default function DiscoverLandscape({ onNext }) {
  const mapRef = useRef(null)
  const isNearView = useInView(mapRef, { once: true, margin: MOUNT_MARGIN })

  return (
    <Screen name="discover-landscape">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={3} />
        <SectionTitle eyebrow="THE MAU COMPLEX" lead="SACRED" accent="CANOPIES" />
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col gap-[20px] items-start px-[24px] relative shrink-0 w-full" data-name="landscape-panel">
        <div ref={mapRef} className="border border-[rgba(255,255,255,0.08)] border-solid flex h-[300px] items-start overflow-clip relative rounded-[16px] shrink-0 w-full bg-[#0a1812]" data-name="map-layer">
          {isNearView ? (
            <ErrorBoundary fallback={aerialStill}>
              <Suspense fallback={aerialStill}>
                <CanopyGlobeHud theme={ANTHEM_GLOBE_THEME} fallback={aerialStill} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            aerialStill
          )}
          <div className="pointer-events-none absolute z-20 flex flex-col inset-x-0 top-0 items-start p-[16px]" data-name="topo-lines">
            <div className="flex font-['Geist'] font-normal items-start justify-between leading-[normal] text-[#00ff87] text-[10px] w-full whitespace-nowrap">
              <p className="opacity-80"><DecryptedText text="0.0763° S" /></p>
              <p className="opacity-80"><DecryptedText text="35.7483° E" /></p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] items-start shrink-0 w-full" data-name="discover-text">
          <h3 className="font-['Syne'] font-bold leading-[normal] text-[18px] text-white w-full">Kenya’s Beating Ecological Heart</h3>
          <p className="font-['Geist'] font-normal leading-[1.6] text-[#8a9f96] text-[14px] w-full">
            The Mau Forest acts as the massive water tower sustaining millions of lives, countless wildlife species, and the unique cultural heritage of East Africa. This is the sacred sanctuary we are restoring.
          </p>
        </div>
      </Reveal>

      <BottomAction label="LIVE VERIFICATION DATA" onNext={onNext} />
    </Screen>
  )
}
