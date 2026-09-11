import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const lookTarget = new THREE.Vector3()

/**
 * Applies the shared, GSAP-driven `cameraState` (plain mutable object, not
 * React state) to the R3F camera every frame — keeps the scroll-scrubbed dive
 * off the React render loop entirely.
 */
export default function CameraRig({ cameraState }) {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.set(cameraState.pos.x, cameraState.pos.y, cameraState.pos.z)
    lookTarget.set(cameraState.look.x, cameraState.look.y, cameraState.look.z)
    camera.lookAt(lookTarget)
  })

  return null
}
