/**
 * ForestOS Honey — Interactive Partnership Pitch.
 *
 * Entry point for the cinematic pitch experience. Single scroll, eight scenes.
 * This lives in its own folder (src/pitch) and does not touch any existing
 * route, page, or the live /honey consumer experience.
 *
 * Route: /pitch
 */
import { Suspense, lazy, useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useThemeFonts } from '../hooks/useThemeFonts'
import './pitch.css'
import Scene1Hero from './scenes/Scene1Hero'
import Scene2Scan from './scenes/Scene2Scan'
import Scene3Journey from './scenes/Scene3Journey'

const Scene4Ecosystem = lazy(() => import('./scenes/Scene4Ecosystem'))
const Scene5Follow = lazy(() => import('./scenes/Scene5Follow'))
const Scene6Scale = lazy(() => import('./scenes/Scene6Scale'))
const Scene7Shared = lazy(() => import('./scenes/Scene7Shared'))
const Scene8Pilot = lazy(() => import('./scenes/Scene8Pilot'))

const SceneFallback = () => (
  <div className="grid min-h-[60vh] place-items-center bg-pitch-paper">
    <span className="pitch-label text-pitch-ink-faint">Loading…</span>
  </div>
)

export default function Pitch() {
  const rootRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  useThemeFonts(reduced)

  useEffect(() => {
    document.title = 'ForestOS Honey — Interactive Pitch'
  }, [])

  return (
    <div ref={rootRef} className="pitch-root">
      <Scene1Hero />
      <Scene2Scan />
      <Scene3Journey />
      <Suspense fallback={<SceneFallback />}>
        <Scene4Ecosystem />
        <Scene5Follow />
        <Scene6Scale />
        <Scene7Shared />
        <Scene8Pilot />
      </Suspense>
    </div>
  )
}
