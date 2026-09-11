import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import VideoTerrain from './VideoTerrain'

/**
 * Genuine camera parallax, not a CSS transform on a flat video: the camera
 * actually moves in 3D space as the pointer moves, so the video-driven
 * relief in `VideoTerrain` occludes and reveals itself realistically.
 */
function ParallaxRig({ enabled, range }) {
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state) => {
    if (!enabled) return
    target.current.set(state.pointer.x * range, state.pointer.y * range * 0.6, 0)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target.current.x, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, target.current.y, 0.05)
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * A full-bleed WebGL plane whose relief comes from a real video's own
 * luminance (see `VideoTerrain`), with the camera genuinely moving in 3D as
 * the pointer moves. Shared by every "real footage, up close" beat on the
 * page (the buffer belt, the corporate-gateway footer) rather than
 * duplicated per section.
 *
 * `active` should be driven by `useInViewport` — the Canvas's render loop
 * fully stops (`frameloop="never"`) and the underlying video pauses when
 * `false`, so a section scrolled out of view stops costing anything.
 */
export default function VideoTerrainScene({
  src,
  active = true,
  parallaxRange = 0.55,
  shadeRange = [0.72, 1.18],
  displacement = 0.18,
}) {
  const reduced = useReducedMotion()

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: 50, near: 0.1, far: 20, position: [0, 0, 5] }}
      frameloop={active ? 'always' : 'never'}
    >
      <ParallaxRig enabled={!reduced} range={parallaxRange} />
      <Suspense fallback={null}>
        <VideoTerrain src={src} active={active} shadeRange={shadeRange} displacement={displacement} />
      </Suspense>
    </Canvas>
  )
}
