import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import CanopyTrees from '../act1V2/CanopyTrees'
import MistParticles from '../act1V2/MistParticles'
import {
  FOG_COLOR,
  HEMI_SKY_COLOR,
  HEMI_GROUND_COLOR,
  SUN_LIGHT_COLOR,
  FILL_LIGHT_COLOR,
} from '../act1V2/palette'

/**
 * Gentle pointer-driven camera drift — a held glimpse, not a dive. Unlike
 * Act1Scene's full scroll-piloted flythrough, the canopy here just holds
 * still with a small parallax nudge, so it reads as "the ledger's own
 * backdrop is alive" without competing with the data in front of it.
 */
function DriftRig({ enabled }) {
  useFrame((state) => {
    if (!enabled) return
    const targetX = state.pointer.x * 6
    const targetY = 10 + state.pointer.y * 2
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04)
    state.camera.lookAt(0, 4, -20)
  })
  return null
}

/**
 * A quiet glimpse of the same low-poly canopy Act1Scene uses for the batch
 * QR story — reused, not duplicated, as an ambient backdrop behind
 * BeltLedger's data instead of a full-screen hero moment. Same palette,
 * same trees, same mist; a different frame and a held camera instead of a
 * scroll-scrubbed dive.
 *
 * `active` should be driven by useInViewport, same contract as
 * VideoTerrainScene — frameloop stops entirely once scrolled out of view.
 * Under reduced motion the parallax is disabled but the frame still renders
 * once (`frameloop="demand"`), so the canopy is still visible, just still.
 */
export default function CanopyBackdrop({ active = true }) {
  const reduced = useReducedMotion()
  const frameloop = !active ? 'never' : reduced ? 'demand' : 'always'

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: 52, near: 1, far: 200, position: [0, 10, 38] }}
      frameloop={frameloop}
    >
      <fogExp2 attach="fog" args={[FOG_COLOR, 0.00028]} />
      <hemisphereLight args={[HEMI_SKY_COLOR, HEMI_GROUND_COLOR, 0.45]} />
      <directionalLight position={[-20, 18, 10]} intensity={0.7} color={SUN_LIGHT_COLOR} />
      <directionalLight position={[18, 8, -20]} intensity={0.15} color={FILL_LIGHT_COLOR} />
      <DriftRig enabled={!reduced} />
      <Suspense fallback={null}>
        <CanopyTrees />
        <MistParticles />
      </Suspense>
    </Canvas>
  )
}
