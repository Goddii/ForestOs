import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { VIDEO_TERRAIN_FRAGMENT, VIDEO_TERRAIN_VERTEX } from './videoTerrainShaders'

const SEGMENTS_X = 72
const SEGMENTS_Y = 40
// UV-space box-blur radius the shaders sample at — smooths the video's own
// per-pixel noise before it drives displacement/shading, so the surface
// reads as stable relief rather than a shimmering "wave" riding the footage.
const BLUR_RADIUS = 0.022

/**
 * A plane sized to fill the camera frustum at z=0, subdivided finely enough
 * that the video-driven vertex displacement (see `videoTerrainShaders.js`)
 * reads as real relief rather than a flat, tilted video. Reduced-motion
 * visitors get the video's first frame with no displacement animation.
 */
export default function VideoTerrain({
  src,
  active = true,
  shadeRange = [0.72, 1.18],
  displacement = 0.18,
}) {
  const { viewport } = useThree()
  const reduced = useReducedMotion()
  const materialRef = useRef(null)

  const video = useMemo(() => {
    const el = document.createElement('video')
    el.src = src
    el.crossOrigin = 'anonymous'
    el.loop = true
    el.muted = true
    el.playsInline = true
    el.autoplay = !reduced
    el.disablePictureInPicture = true
    if (reduced) {
      // An off-DOM <video> that's never played may never decode a frame,
      // leaving the texture blank. Play briefly, then freeze on that frame.
      el.play()
        .then(() => el.pause())
        .catch(() => {})
    } else {
      el.play().catch(() => {})
    }
    return el
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  useEffect(() => () => video.pause(), [video])

  // Stop decoding once the section scrolls out of view — every mounted
  // section's video would otherwise keep playing simultaneously, which is a
  // real source of scroll jank as more sections join the page.
  useEffect(() => {
    if (reduced) return
    if (active) video.play().catch(() => {})
    else video.pause()
  }, [active, reduced, video])

  const texture = useMemo(() => {
    const tex = new THREE.VideoTexture(video)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [video])

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(1, 1, SEGMENTS_X, SEGMENTS_Y),
    [],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uDisplacement: { value: reduced ? 0 : displacement },
      uEdgeSoftness: { value: 0.22 },
      uShadeMin: { value: shadeRange[0] },
      uShadeMax: { value: shadeRange[1] },
      uBlurRadius: { value: BLUR_RADIUS },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [texture, reduced, shadeRange[0], shadeRange[1], displacement],
  )

  useFrame(() => {
    if (!reduced) texture.needsUpdate = true
  })

  // Fill the visible frustum at z=0, matching the section's aspect so the
  // footage reads edge-to-edge like an `object-cover` video, not a letterboxed one.
  const planeWidth = viewport.width * 1.05
  const planeHeight = viewport.height * 1.05

  return (
    <mesh geometry={geometry} scale={[planeWidth, planeHeight, 1]}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VIDEO_TERRAIN_VERTEX}
        fragmentShader={VIDEO_TERRAIN_FRAGMENT}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
