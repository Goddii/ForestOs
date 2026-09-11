import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from './noise'
import { MIST_COLOR } from './palette'

const COUNT = 70
const BOUNDS = { xMin: -45, xMax: 45, yMin: 1, yMax: 16, zMin: -85, zMax: 40 }
const DRIFT_SPEED = 0.32
const SCATTER_SEED = 77
const SPRITE_SIZE = 64

// A soft radial-gradient dot, generated once — reads as a mist mote instead
// of a hard-edged point sprite, with zero image asset to fetch.
function buildMistSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = SPRITE_SIZE
  canvas.height = SPRITE_SIZE
  const ctx = canvas.getContext('2d')
  const center = SPRITE_SIZE / 2
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.35)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function scatterMist() {
  const rng = mulberry32(SCATTER_SEED)
  const positions = new Float32Array(COUNT * 3)
  const seeds = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i += 1) {
    positions[i * 3] = BOUNDS.xMin + rng() * (BOUNDS.xMax - BOUNDS.xMin)
    positions[i * 3 + 1] = BOUNDS.yMin + rng() * (BOUNDS.yMax - BOUNDS.yMin)
    positions[i * 3 + 2] = BOUNDS.zMin + rng() * (BOUNDS.zMax - BOUNDS.zMin)
    seeds[i] = rng() * Math.PI * 2
  }
  return { positions, seeds }
}

/** A few dozen drifting mist motes — one Points draw call, no textures. */
export default function MistParticles() {
  const pointsRef = useRef(null)
  const { positions, seeds } = useMemo(() => scatterMist(), [])
  const sprite = useMemo(() => buildMistSprite(), [])
  useEffect(() => () => sprite.dispose(), [sprite])

  useFrame((state, delta) => {
    const geometry = pointsRef.current?.geometry
    if (!geometry) return
    const position = geometry.attributes.position
    const t = state.clock.elapsedTime

    for (let i = 0; i < COUNT; i += 1) {
      const x = position.getX(i) + Math.sin(t * 0.15 + seeds[i]) * 0.015
      const y = position.getY(i) + Math.cos(t * 0.2 + seeds[i]) * 0.008
      let z = position.getZ(i) + delta * DRIFT_SPEED
      if (z > BOUNDS.zMax) z = BOUNDS.zMin
      position.setXYZ(i, x, y, z)
    }
    position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        color={MIST_COLOR}
        size={1.4}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        fog
      />
    </points>
  )
}
