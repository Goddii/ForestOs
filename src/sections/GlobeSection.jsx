import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import '../lib/cesiumBootstrap'
import Reveal from '../components/Reveal'
import ErrorBoundary from '../components/ErrorBoundary'
import Globe from '../components/Globe'
import SectionIntro from '../components/ui/SectionIntro'
import BatchGlobeHud from '../components/globe/BatchGlobeHud'
import BeltGlobeHud from '../components/globe/BeltGlobeHud'
import PlotTelemetryDrawer from '../components/PlotTelemetryDrawer'
import { useProofFlyIn } from '../hooks/useProofFlyIn'
import { ERAS, GLOBE_FOCI } from '../lib/mock'
import { BELT_BLOCKS } from '../lib/platformData'
import { useBatch } from '../lib/batchContext'

// Soft radial fade that blends the round globe frame into the dark section.
const GLOBE_VIGNETTE =
  'radial-gradient(120% 78% at 50% 42%, transparent 50%, rgba(8,20,14,0.34) 78%, rgba(8,20,14,0.9) 100%)'

const globeFallback = (
  <div className="grid h-full place-items-center bg-forest-900 p-8 text-center">
    <p className="max-w-sm text-sm text-bone-300">
      The 3D globe could not start here. The record below stands on its own.
    </p>
  </div>
)

/**
 * The scroll-in 3D Cesium section, shared by the batch view and the macro home.
 *
 * `macroMode` swaps the batch recovery map + era toggle + telemetry drawer for
 * the belt-wide polygons + region selector tabs. The container, edge vignette,
 * scroll-triggered fly-in and camera cleanup are identical either way.
 *
 * In macro mode the selected block is controlled by the parent (`activeBlockId`
 * + `onSelectBlock`) so a partner card elsewhere on the page can drive the map.
 */
export default function GlobeSection({ macroMode = false, activeBlockId = null, onSelectBlock }) {
  const BATCH = useBatch()
  const reduced = useReducedMotion()

  const [era, setEra] = useState(ERAS.today.key)
  const [activeFocusId, setActiveFocusId] = useState(null)

  const mapRef = useRef(null)
  const cameraRef = useRef(null)
  const flyInPendingRef = useRef(false)

  const handleCameraReady = useCallback((camera) => {
    cameraRef.current = camera
    if (flyInPendingRef.current) {
      flyInPendingRef.current = false
      camera.flyRegion()
    }
  }, [])

  const handleFlyIn = useCallback(() => {
    if (cameraRef.current) cameraRef.current.flyRegion()
    else flyInPendingRef.current = true
  }, [])

  // Batch mode — focus a point of interest and open its telemetry drawer.
  const focusOn = useCallback((focusId) => {
    const focus = GLOBE_FOCI.find((entry) => entry.id === focusId)
    if (!focus) return
    setActiveFocusId(focusId)
    cameraRef.current?.flyFocus(focus)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setActiveFocusId(null)
    cameraRef.current?.flyOverview()
  }, [])

  useProofFlyIn(mapRef, handleFlyIn, { enabled: !reduced })

  // Macro mode: fly the camera whenever the parent-controlled block changes
  // (a HUD tab, a globe polygon pick, or a partner card elsewhere on the page).
  useEffect(() => {
    if (!macroMode) return
    const block = BELT_BLOCKS.find((entry) => entry.id === activeBlockId)
    if (block) cameraRef.current?.flyFocus(block)
    else cameraRef.current?.flyOverview()
  }, [macroMode, activeBlockId])

  const activeFocus = GLOBE_FOCI.find((entry) => entry.id === activeFocusId) ?? null
  const handleFeaturePick = macroMode ? onSelectBlock : focusOn

  return (
    <section id="proof" className="relative z-10 scroll-mt-20 bg-forest-950">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20 sm:px-8 sm:pt-28">
        {macroMode ? (
          <SectionIntro
            eyebrow="5 blocks · 14,250 ha · 5 water towers"
            title="Five forest blocks, held as one contiguous buffer."
            body="Mau, the Aberdares, Mt. Kenya, Cherangany and Mt. Elgon — the water towers that feed every major river. Select a block to fly to its sector."
          />
        ) : (
          <SectionIntro
            title="The same ridge line, fifteen years apart."
            body={
              <>
                South West Mau, above the Kiptunga block. Switch between 2015 and
                today &mdash; the canopy you are looking at is the buffer
                Batch&nbsp;#{BATCH.id} pays to keep standing.
              </>
            }
          />
        )}
      </div>

      <Reveal className="relative">
        <div
          ref={mapRef}
          className="relative h-[68svh] min-h-[420px] w-full overflow-hidden border-y border-bone/10 bg-forest-900 sm:h-[82svh]"
        >
          <ErrorBoundary fallback={globeFallback}>
            <Globe
              macroMode={macroMode}
              era={era}
              activeId={activeBlockId}
              reducedMotion={Boolean(reduced)}
              onCameraReady={handleCameraReady}
              onFeaturePick={handleFeaturePick}
            />
          </ErrorBoundary>

          {/* Edge vignette — blends the globe into the surrounding dark theme */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: GLOBE_VIGNETTE }}
          />

          {/* HUD */}
          <div className="pointer-events-none absolute inset-0 z-20 p-4 sm:p-6">
            {macroMode ? (
              <BeltGlobeHud activeBlockId={activeBlockId} onSelectBlock={onSelectBlock} />
            ) : (
              <BatchGlobeHud
                era={era}
                onEraChange={setEra}
                centreName={BATCH.collectionCentre.name}
                activeFocusId={activeFocusId}
                onFocus={focusOn}
              />
            )}
          </div>

          {!macroMode && (
            <PlotTelemetryDrawer focus={activeFocus} onClose={handleCloseDrawer} />
          )}
        </div>
      </Reveal>
    </section>
  )
}
