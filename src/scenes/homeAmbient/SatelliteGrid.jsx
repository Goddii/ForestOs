import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// river-500 — the project's existing accent for "data / verification",
// reused here rather than introducing a new colour for the same idea.
const POINT_COLOR = '#6fa5a0'
// A lighter tint of the same hue, not a different colour — "lit up", not
// "different status".
const HIGHLIGHT_COLOR = '#c3ebe6'
const COLS = 16
const ROWS = 10
const SPACING = 1.5
const SWEEP_PERIOD_SEC = 9
// How close (in world units) a point needs to be to the sweep line to
// brighten, and how sharply that falls off with distance.
const HIGHLIGHT_RADIUS = 2.4

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

/** Every point starts at the base colour — avoids a black flash on the
    first frame, and is the only frame reduced-motion visitors ever see. */
function buildBaseColors(count) {
  const base = new THREE.Color(POINT_COLOR)
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    colors[i * 3] = base.r
    colors[i * 3 + 1] = base.g
    colors[i * 3 + 2] = base.b
  }
  return colors
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
 * crosses actually brightens (a per-vertex colour rewrite every frame,
 * not just a uniform pulse), echoing "every plot geolocated" from the
 * footer's own copy rather than being decoration for its own sake.
 */
function ScanSweep({ enabled }) {
  const lineRef = useRef(null)
  const pointsRef = useRef(null)
  const positions = useMemo(buildGrid, [])
  const initialColors = useMemo(() => buildBaseColors(COLS * ROWS), [])
  const base = useMemo(() => new THREE.Color(POINT_COLOR), [])
  const highlight = useMemo(() => new THREE.Color(HIGHLIGHT_COLOR), [])
  const scratch = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = (state.clock.elapsedTime % SWEEP_PERIOD_SEC) / SWEEP_PERIOD_SEC
    const sweepX = (t - 0.5) * COLS * SPACING * 1.15
    if (lineRef.current) lineRef.current.position.x = sweepX
    if (!enabled) return

    const colorAttr = pointsRef.current?.geometry.attributes.color
    const posAttr = pointsRef.current?.geometry.attributes.position
    if (!colorAttr || !posAttr) return

    for (let i = 0; i < posAttr.count; i += 1) {
      const distance = Math.abs(posAttr.getX(i) - sweepX)
      const proximity = Math.max(0, 1 - distance / HIGHLIGHT_RADIUS)
      scratch.copy(base).lerp(highlight, proximity)
      colorAttr.setXYZ(i, scratch.r, scratch.g, scratch.b)
    }
    colorAttr.needsUpdate = true
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[initialColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
      <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, ROWS * SPACING * 1.3]} />
        <meshBasicMaterial color={HIGHLIGHT_COLOR} transparent opacity={0.35} depthWrite={false} />
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
