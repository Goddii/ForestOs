import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { terrainHeightAt } from './terrainHeight'
import { mulberry32 } from './noise'
import { CANOPY_BASE_COLOR, CANOPY_VARIANT_COLOR } from './palette'

const TREE_COUNT = 240
const AREA_HALF_WIDTH = 62
const AREA_Z_MIN = -78
const AREA_Z_MAX = 26
// Keep the tea-row band clear of canopy so the foreground rows read distinctly.
const CLEAR_Z_MIN = -40
const CLEAR_Z_MAX = -6
const SCATTER_SEED = 1337

function scatterTrees() {
  const rng = mulberry32(SCATTER_SEED)
  const items = []
  for (let i = 0; i < TREE_COUNT; i += 1) {
    const x = (rng() - 0.5) * 2 * AREA_HALF_WIDTH
    const z = AREA_Z_MIN + rng() * (AREA_Z_MAX - AREA_Z_MIN)
    if (z > CLEAR_Z_MIN && z < CLEAR_Z_MAX) continue
    items.push({
      x,
      z,
      scale: 1.3 + rng() * 2.1,
      rotationY: rng() * Math.PI * 2,
      tint: rng(),
    })
  }
  return items
}

/** Midground canopy — one instanced low-poly cone draw call for the forest. */
export default function CanopyTrees() {
  const meshRef = useRef(null)
  const instances = useMemo(() => scatterTrees(), [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const base = new THREE.Color(CANOPY_BASE_COLOR)
    const variant = new THREE.Color(CANOPY_VARIANT_COLOR)

    instances.forEach((item, i) => {
      const groundY = terrainHeightAt(item.x, item.z)
      dummy.position.set(item.x, groundY + item.scale * 0.9, item.z)
      dummy.rotation.set(0, item.rotationY, 0)
      dummy.scale.setScalar(item.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      color.copy(base).lerp(variant, item.tint * 0.5)
      mesh.setColorAt(i, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [instances])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, instances.length]} frustumCulled={false}>
      <coneGeometry args={[1.1, 2.4, 6]} />
      <meshStandardMaterial flatShading roughness={1} metalness={0} />
    </instancedMesh>
  )
}
