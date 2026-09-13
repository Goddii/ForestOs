import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'

// river-500 — the project's existing accent for "data / verification",
// reused here rather than introducing a new colour for the same idea.
const POINT_COLOR = '#6fa5a0'
const COLS = 16
const ROWS = 10
const SPACING = 1.5
const SWEEP_PERIOD_SEC = 9

function buildGrid() {
  const positions = new Float32Array(COLS * ROWS * 3)
  let i = 0
  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row < ROWS; row += 1) {
      positions[i++] = (col - (COLS - 1) / 2) * SPACING
      positions[i++] = 0
      positions[i++] = (row - (ROWS - 1) / 2) * SPACING
    }
  }
  return positions
}

/** Points straight down at the grid once, on mount — a satellite's-eye view. */
function OverheadCamera() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 16, 6)
    camera.lookAt(0, 0, 0)
  }, [camera])
  return null
}

/**
 * One slow pass of a scan line across the plot grid — each point it
 * crosses briefly brightens, echoing "every plot geolocated" from the
 * footer's own copy rather than being decoration for its own sake.
 */
function ScanSweep({ enabled }) {
  const lineRef = useRef(null)
  const pointsMatRef = useRef(null)
  const positions = useMemo(buildGrid, [])

  useFrame((state) => {
    if (!enabled) return
    const t = (state.clock.elapsedTime % SWEEP_PERIOD_SEC) / SWEEP_PERIOD_SEC
    const x = (t - 0.5) * COLS * SPACING * 1.15
    if (lineRef.current) lineRef.current.position.x = x
    if (pointsMatRef.current) {
      pointsMatRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.06
    }
  })

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          color={POINT_COLOR}
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </points>
      <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, ROWS * SPACING * 1.3]} />
        <meshBasicMaterial color={POINT_COLOR} transparent opacity={0.45} depthWrite={false} />
      </mesh>
    </>
  )
}

/**
 * A quiet plot-grid with one slow scanning pass — MacroFooter's own comment
 * asks for a WebGL treatment "when a licensed replacement is ready"; this
 * needs no footage at all, so it fills that gap now rather than waiting.
 * `active` follows the same useInViewport contract as VideoTerrainScene and
 * CanopyBackdrop. Reduced motion renders one static frame (`demand`).
 */
export default function SatelliteGrid({ active = true }) {
  const reduced = useReducedMotion()
  const frameloop = !active ? 'never' : reduced ? 'demand' : 'always'

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: 40, near: 1, far: 60 }}
      frameloop={frameloop}
    >
      <OverheadCamera />
      <ScanSweep enabled={active && !reduced} />
    </Canvas>
  )
}
