import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useInViewport } from '../hooks/useInViewport'

/**
 * Decorative, muted, looping background video for a section (not the fixed
 * hero layer). Paused on its first frame when the viewer prefers reduced
 * motion, matching the reduced-motion convention used across the page — and
 * paused/resumed as the section scrolls out of and back into view, so a
 * section a visitor has long scrolled past doesn't keep decoding video.
 */
export default function LoopingVideo({ src, className, playbackRate = 1 }) {
  const reduced = useReducedMotion()
  const videoRef = useRef(null)
  const [viewportRef, inView] = useInViewport()

  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    node.playbackRate = playbackRate

    if (reduced) {
      node.pause()
      return
    }
    if (inView) node.play().catch(() => {})
    else node.pause()
  }, [reduced, playbackRate, inView])

  return (
    <video
      ref={(node) => {
        videoRef.current = node
        viewportRef.current = node
      }}
      className={className}
      src={src}
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
