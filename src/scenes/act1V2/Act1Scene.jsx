import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useReducedMotion } from 'framer-motion'
import { useAct1CameraDive } from './useAct1CameraDive'
import CameraRig from './CameraRig'
import Terrain from './Terrain'
import RidgeLayers from './RidgeLayers'
import CanopyTrees from './CanopyTrees'
import TeaRows from './TeaRows'
import MistParticles from './MistParticles'
import {
  FILL_LIGHT_COLOR,
  FOG_COLOR,
  HEMI_GROUND_COLOR,
  HEMI_SKY_COLOR,
  SKY_GRADIENT,
  SUN_LIGHT_COLOR,
} from './palette'

const INITIAL_CAMERA = {
  pos: { x: 0, y: 54, z: 46 },
  look: { x: 0, y: 14, z: -30 },
}
// A calmer static framing for reduced-motion visitors — no pin, no scrub.
const STATIC_CAMERA = {
  pos: { x: 5, y: 20, z: 12 },
  look: { x: 1, y: 8, z: -50 },
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

/**
 * Act I v2 — a stylised low-poly forest diorama, scroll-piloted by GSAP,
 * replacing the previous prerecorded-video canopy dive with a real 3D scene.
 */
export default function Act1Scene({ batchLabel }) {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()
  // A plain object, never replaced via its setter — GSAP mutates its numbers
  // directly and `CameraRig` reads them every frame. Avoids both a
  // ref-during-render read and a per-tick React re-render.
  const [cameraState] = useState(() => {
    const start = reduced ? STATIC_CAMERA : INITIAL_CAMERA
    return { pos: { ...start.pos }, look: { ...start.look } }
  })

  useAct1CameraDive(sectionRef, cameraState, { enabled: !reduced })

  return (
    <section
      ref={sectionRef}
      className={
        'relative w-full overflow-hidden ' + (reduced ? 'min-h-[100svh]' : 'h-[100svh]')
      }
      style={{ background: SKY_GRADIENT }}
    >
      <Canvas
        className="absolute inset-0"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ fov: 42, near: 1, far: 260, position: [cameraState.pos.x, cameraState.pos.y, cameraState.pos.z] }}
      >
        <fogExp2 attach="fog" args={[FOG_COLOR, 0.00018]} />
        <hemisphereLight args={[HEMI_SKY_COLOR, HEMI_GROUND_COLOR, 0.5]} />
        <directionalLight position={[-26, 22, 14]} intensity={0.95} color={SUN_LIGHT_COLOR} />
        <directionalLight position={[24, 10, -30]} intensity={0.18} color={FILL_LIGHT_COLOR} />
        <CameraRig cameraState={cameraState} />
        <Suspense fallback={null}>
          <RidgeLayers />
          <Terrain />
          <CanopyTrees />
          <TeaRows />
          <MistParticles />
        </Suspense>
      </Canvas>

      <div
        data-act1-egress
        className={
          'pointer-events-none absolute inset-x-0 bottom-0 flex flex-col px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-10 sm:pb-16 ' +
          (reduced ? 'relative pt-24' : '')
        }
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-sage-300"
        >
          Act I <span className="mx-2 text-sage-500">·</span> The Forest
          {batchLabel && (
            <>
              <span className="mx-2 text-sage-500">·</span>
              {batchLabel}
            </>
          )}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE_OUT_EXPO }}
          className="mt-4 max-w-[18ch] font-display text-4xl leading-[1.06] text-bone sm:max-w-[22ch] sm:text-6xl"
        >
          Before this leaf was yours, it was a forest we chose to keep.
        </motion.h1>
      </div>

      {!reduced && (
        <div data-act1-egress className="pointer-events-none absolute inset-x-0 top-16 flex justify-center sm:top-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60"
          >
            Scroll to descend
          </motion.span>
        </div>
      )}
    </section>
  )
}
