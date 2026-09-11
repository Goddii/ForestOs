import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { terrainHeightAt } from './terrainHeight'
import { TERRAIN_HIGH_COLOR, TERRAIN_LOW_COLOR } from './palette'

const WIDTH = 140
const DEPTH = 160
const SEGMENTS_X = 42
const SEGMENTS_Z = 48
const HEIGHT_SCALE = 9
const HEIGHT_BASE = -7

const lowColor = new THREE.Color(TERRAIN_LOW_COLOR)
const highColor = new THREE.Color(TERRAIN_HIGH_COLOR)

function buildTerrainGeometry() {
  const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, SEGMENTS_X, SEGMENTS_Z)
  geometry.rotateX(-Math.PI / 2)

  const position = geometry.attributes.position
  const colors = new Float32Array(position.count * 3)
  const tint = new THREE.Color()

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i)
    const z = position.getZ(i)
    const y = terrainHeightAt(x, z)
    position.setY(i, y)

    const t = THREE.MathUtils.clamp((y - HEIGHT_BASE) / HEIGHT_SCALE, 0, 1)
    tint.copy(lowColor).lerp(highColor, t)
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

/** Low-poly rolling ground — flat-shaded, vertex-coloured, no textures. */
export default function Terrain() {
  const geometry = useMemo(() => buildTerrainGeometry(), [])
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
    </mesh>
  )
}
