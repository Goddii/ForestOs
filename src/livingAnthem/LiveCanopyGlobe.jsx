import { useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import '../lib/cesiumBootstrap'
import ErrorBoundary from '../components/ErrorBoundary'
import Globe from '../components/Globe'
import { ERAS } from '../lib/mock'
import { FOCUS_RING } from './chrome'

const ERA_ORDER = [ERAS[2015], ERAS.today]

// Fades the square globe viewport into the anthem's near-black card edge.
const EDGE_FADE = 'radial-gradient(130% 90% at 50% 45%, transparent 55%, rgba(4,13,7,0.85) 100%)'

/**
 * CH. 03's live map: the batch view's Cesium recovery globe (same imagery,
 * same 2015 ⇄ Today canopy mosaic), wearing the anthem's Syne/Geist + neon
 * HUD instead of the batch view's console chrome. Lazy-loaded by the chapter.
 */
export default function LiveCanopyGlobe({ fallback }) {
  const reduced = useReducedMotion()
  const [era, setEra] = useState(ERAS.today.key)
  const current = ERAS[era]

  const handleCameraReady = useCallback(
    (camera) => {
      if (!reduced) camera.flyRegion()
    },
    [reduced],
  )

  return (
    <>
      <ErrorBoundary fallback={fallback}>
        <Globe era={era} isInteractive={false} reducedMotion={Boolean(reduced)} onCameraReady={handleCameraReady} />
      </ErrorBoundary>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: EDGE_FADE }} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-[12px] px-[14px] pb-[30px]">
        <div className="flex flex-col gap-[2px]">
          <p className="font-['Syne'] font-extrabold leading-none text-[30px] text-white tabular-nums">{current.canopyCoverPct}%</p>
          <p className="font-['Geist'] font-bold text-[#8a9f96] text-[10px] uppercase tracking-[0.12em]">Canopy cover</p>
        </div>
        <div role="group" aria-label="Compare canopy by year" className="pointer-events-auto flex rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(4,13,7,0.8)] p-[3px] backdrop-blur-md">
          {ERA_ORDER.map(({ key, label }) => {
            const isActive = key === era
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setEra(key)}
                className={`rounded-full px-[12px] py-[6px] font-['Geist'] font-bold text-[11px] uppercase tracking-[0.08em] transition-colors ${FOCUS_RING} ${isActive ? 'bg-[#00ff87] text-[#040d07]' : 'text-[#8a9f96] hover:text-white'}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{`${current.label}: ${current.canopyCoverPct}% canopy cover. ${current.caption}`}</p>
    </>
  )
}
