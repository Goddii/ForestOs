import { useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import '../../lib/cesiumBootstrap'
import ErrorBoundary from '../ErrorBoundary'
import Globe from '../Globe'
import { ERAS } from '../../lib/mock'

const ERA_ORDER = [ERAS[2015], ERAS.today]

/**
 * The batch view's Cesium recovery globe (same imagery, same 2015 ⇄ Today
 * canopy mosaic) packaged for embedding in a campaign QR experience's phone
 * card. Each campaign passes a `theme` of Tailwind class strings so the
 * readout and toggle wear that campaign's type and accent, not the batch
 * console's. Camera input is off so a swipe over the card scrolls the page.
 * Lazy-load this module — it pulls in Cesium.
 */
export default function CanopyGlobeHud({ theme, fallback }) {
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
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: theme.edgeFade }} />

      {/* pb clears Cesium's bottom-left "Data attribution" link. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-[12px] px-[14px] pb-[30px]">
        <div className="flex flex-col gap-[2px]">
          <p className={`leading-none text-[30px] text-white tabular-nums ${theme.figure}`}>{current.canopyCoverPct}%</p>
          <p className={`text-[10px] uppercase tracking-[0.12em] ${theme.label}`}>Canopy cover</p>
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
                className={`rounded-full px-[12px] py-[6px] text-[11px] uppercase tracking-[0.08em] transition-colors ${theme.toggle} ${isActive ? theme.toggleActive : theme.toggleIdle}`}
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
