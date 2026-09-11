import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { fbm2D } from './noise'
import { RIDGE_FAR_COLOR, RIDGE_NEAR_COLOR } from './palette'

const WIDTH = 260
const POINTS = 36
const BOTTOM_Y = -14

const LAYERS = [
  { z: -118, baseHeight: 14, amplitude: 10, seedOffset: 11, color: RIDGE_FAR_COLOR, opacity: 0.88 },
  { z: -78, baseHeight: 8, amplitude: 8, seedOffset: 47, color: RIDGE_NEAR_COLOR, opacity: 1 },
]

function buildRidgeGeometry({ z, baseHeight, amplitude, seedOffset }) {
  const positions = []
  for (let i = 0; i <= POINTS; i += 1) {
    const t = i / POINTS
    const x = (t - 0.5) * WIDTH
    const n = fbm2D((x + seedOffset) * 0.018, seedOffset, 3)
    const topY = baseHeight + n * amplitude
    positions.push(x, topY, z, x, BOTTOM_Y, z)
  }

  const indices = []
  for (let i = 0; i < POINTS; i += 1) {
    const a = i * 2
    const b = i * 2 + 1
    const c = (i + 1) * 2
    const d = (i + 1) * 2 + 1
    indices.push(a, c, b, b, c, d)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** Two faceted mountain silhouettes behind the terrain — background depth,
 * cheap enough to render unlit and let scene fog do the atmospheric fade. */
export default function RidgeLayers() {
  const geometries = useMemo(() => LAYERS.map(buildRidgeGeometry), [])
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries])

  return (
    <>
      {LAYERS.map((layer, i) => (
        <mesh key={layer.z} geometry={geometries[i]}>
          <meshBasicMaterial color={layer.color} transparent opacity={layer.opacity} fog />
        </mesh>
      ))}
    </>
  )
}
