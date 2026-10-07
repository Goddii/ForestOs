import { useCallback, useRef, useState } from 'react'
import { ERAS } from '../../lib/mock'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { ConceptTag, FadeIn, Kicker } from './ui'

const POSTER = '/media/forests/mau.webp'

export default function CanopyReveal({ onExplore }) {
  const reduced = usePrefersReducedMotion()
  const [pos, setPos] = useState(reduced ? 100 : 52)
  const ref = useRef(null)
  const exploredRef = useRef(false)

  const onInput = useCallback(
    (e) => {
      setPos(Number(e.target.value))
      // "Ridge Witness" completes the first time the reveal is actually used
      // (brief 5.4) — not merely when the stage is opened.
      if (!exploredRef.current) {
        exploredRef.current = true
        onExplore?.()
      }
    },
    [onExplore],
  )

  const era2015 = ERAS['2015']
  const eraToday = ERAS.today

  return (
    <FadeIn className="space-y-4">
      <div>
        <Kicker>Signature moment</Kicker>
        <h2 className="mt-2 font-display text-3xl text-bone">See the change.</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-bone-300">
          Drag across the forest buffer — satellite-era recovery storytelling from the ForestOS
          prototype, shown here with illustrative canopy figures.
        </p>
      </div>

      <div
        ref={ref}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-bone/15 bg-forest-900"
      >
        <img
          src={POSTER}
          alt="Kenyan highland forest buffer — illustrative canopy reference"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'saturate(0.55) brightness(0.72) sepia(0.25)' }}
          loading="lazy"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <img
            src={POSTER}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: 'saturate(1.05) brightness(1.02)' }}
            loading="lazy"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4">
          <span className="rounded-full bg-forest-950/75 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-300">
            {era2015.label} · {era2015.canopyCoverPct}% canopy
          </span>
          <span className="rounded-full bg-forest-950/75 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-river-400">
            {eraToday.label} · {eraToday.canopyCoverPct}% canopy
          </span>
        </div>

        <div
          className="absolute inset-y-0 w-0.5 bg-bone/80 shadow-[0_0_12px_rgba(243,238,227,0.35)]"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        />

        <label className="sr-only" htmlFor="canopy-slider">
          Compare 2015 and today forest canopy
        </label>
        <input
          id="canopy-slider"
          type="range"
          min={8}
          max={92}
          value={pos}
          onChange={onInput}
          className="absolute inset-x-4 bottom-4 h-11 w-[calc(100%-2rem)] cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bone [&::-webkit-slider-thumb]:bg-forest-950/90"
        />
      </div>

      <ConceptTag variant="illustrative">Illustrative · {era2015.caption}</ConceptTag>
    </FadeIn>
  )
}
