import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { terrainHeightAt } from './terrainHeight'
import { mulberry32 } from './noise'
import { TEA_ROW_BASE_COLOR, TEA_ROW_VARIANT_COLOR } from './palette'

const ROW_COUNT = 9
const ROW_Z_START = -8
const ROW_Z_GAP = 3.4
const BUSHES_PER_ROW = 26
const ROW_X_SPAN = 50
const ROW_CURVE_AMPLITUDE = 3.2
const SCATTER_SEED = 4242

function layoutTeaRows() {
  const rng = mulberry32(SCATTER_SEED)
  const items = []
  for (let row = 0; row < ROW_COUNT; row += 1) {
    const z = ROW_Z_START - row * ROW_Z_GAP
    const phase = row * 0.7
    for (let i = 0; i < BUSHES_PER_ROW; i += 1) {
      const t = i / (BUSHES_PER_ROW - 1)
      const x = (t - 0.5) * ROW_X_SPAN + Math.sin(i * 0.6 + phase) * ROW_CURVE_AMPLITUDE
      items.push({
        x,
        z: z + Math.sin(i * 0.6 + phase) * 0.4,
        scale: 0.85 + rng() * 0.4,
        tint: rng(),
      })
    }
  }
  return items
}

/** Foreground tea-bush rows, following the terrain's gentle curve. */
export default function TeaRows() {
  const meshRef = useRef(null)
  const instances = useMemo(() => layoutTeaRows(), [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const base = new THREE.Color(TEA_ROW_BASE_COLOR)
    const variant = new THREE.Color(TEA_ROW_VARIANT_COLOR)

    instances.forEach((item, i) => {
      const groundY = terrainHeightAt(item.x, item.z)
      dummy.position.set(item.x, groundY + 0.32 * item.scale, item.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(item.scale, item.scale * 0.55, item.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      color.copy(base).lerp(variant, item.tint * 0.6)
      mesh.setColorAt(i, color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [instances])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, instances.length]} frustumCulled={false}>
      <sphereGeometry args={[0.6, 7, 5]} />
      <meshStandardMaterial flatShading roughness={0.9} metalness={0} />
    </instancedMesh>
  )
}
