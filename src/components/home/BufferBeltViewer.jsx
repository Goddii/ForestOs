import { Suspense, lazy } from 'react'
import { PARTNERS } from '../../lib/platformData'
import { useInViewport } from '../../hooks/useInViewport'
import DeferredMount from '../util/DeferredMount'
import ErrorBoundary from '../ErrorBoundary'

const VideoTerrainScene = lazy(() => import('../../scenes/videoTerrain/VideoTerrainScene'))

const lead = PARTNERS[0]

// Same convention as GlobeSection's fallback: if the scene can't start, say
// so where it would have been, rather than leave the "move your cursor" copy
// pointing at an empty frame.
const terrainFallback = (
  <div className="absolute inset-0 grid place-items-center p-8 text-center">
    <p className="max-w-sm text-sm text-bone-300">
      The 3D view could not start here. The belt’s record stands on its own.
    </p>
  </div>
)

/**
 * The buffer belt itself, full-bleed — same Video-Bleed Section Rule every
 * other section on this page follows (fixed video plane, opaque wash at the
 * seams, content in a layer above), except the "video" is a live WebGL
 * scene: a plane whose relief is displaced from the real footage's own
 * luminance, with the camera genuinely moving in 3D as the pointer moves.
 * No bordered card — the terrain bleeds straight into the section.
 *
 * Uses an explicit `h-[85svh]` (not `min-h`) — the Canvas's internal wrapper
 * sizes itself via `height: 100%`, which cannot resolve against an
 * auto-height ancestor, so an auto/min-height section collapses the canvas
 * to the browser's 150px default. Same reason `Act1Scene` uses `h-[100svh]`.
 *
 * `VideoTerrainScene` is lazy-imported, but unlike GlobeSection this
 * section was never gated behind `DeferredMount` — network profiling
 * (Fast 3G + 4x CPU throttle, cold cache) showed its `import()` firing
 * immediately on Home's first render, right alongside the hero's own
 * critical requests: the react-three-fiber/three.js chunk (~225KB gzip)
 * and this section's own 5MB video both started competing for bandwidth
 * before the visitor had scrolled anywhere. `useInViewport`'s `active`
 * flag already stops the video *playing* off-screen, but the chunk and
 * the byte fetch it triggers had no equivalent gate on when they *start*.
 * `minScrollY` is tuned to this section's actual position on the page
 * (measured at ~4090px), so the fetch has a full screen or two of lead
 * time to land before the visitor scrolls this far, without starting at
 * page load and racing the hero.
 */
export default function BufferBeltViewer() {
  const [sectionRef, inView] = useInViewport()

  return (
    <section
      id="buffer-belt"
      ref={sectionRef}
      className="relative z-10 h-[85svh] scroll-mt-20 overflow-hidden bg-forest-950"
    >
      <DeferredMount placeholder={null} minScrollY={2400}>
        {/* A WebGL/R3F failure must cost only the terrain, not the page —
            without this an error in the Canvas unmounts the whole Home tree.
            The section's copy and dark ground still render around it, with a
            short note in the terrain's place. */}
        <ErrorBoundary fallback={terrainFallback}>
          <Suspense fallback={null}>
            <VideoTerrainScene src="/media/field1.mp4" active={inView} />
          </Suspense>
        </ErrorBoundary>
      </DeferredMount>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-forest-950 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-6xl px-6 pt-20 sm:px-8 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage-500">
          {lead.block} · {lead.hectares.toLocaleString()} ha under covenant
        </p>
        <h2 className="mt-3 max-w-[20ch] font-display text-3xl leading-[1.08] text-bone sm:text-5xl">
          The buffer belt, up close.
        </h2>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-sage-300">
          A tea-farm corridor running the forest edge, built from the real
          footage itself. Move your cursor across the frame to look around it.
        </p>
      </div>

      <p className="pointer-events-none absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-300 sm:bottom-10 sm:left-8">
        {lead.sector} · {lead.counties} counties
      </p>
    </section>
  )
}
