import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useInViewport } from '../hooks/useInViewport'

/**
 * Decorative, muted, looping background video for a section (not the fixed
 * hero layer). Paused on its first frame when the viewer prefers reduced
 * motion, matching the reduced-motion convention used across the page — and
 * paused/resumed as the section scrolls out of and back into view, so a
 * section a visitor has long scrolled past doesn't keep decoding video.
 *
 * `preload` starts at "none" and only flips to "auto" the first time the
 * section enters the viewport — otherwise every LoopingVideo on the page
 * (several screens below the fold) starts buffering at mount, competing with
 * the fixed hero video and the initial JS/CSS for bandwidth before the
 * visitor has scrolled at all. Once fetched it stays fetched (no reverting
 * to "none" on scroll-out — only playback pauses).
 */
export default function LoopingVideo({ src, className, playbackRate = 1 }) {
  const reduced = usePrefersReducedMotion()
  const videoRef = useRef(null)
  const [viewportRef, inView] = useInViewport()
  const loadedRef = useRef(false)

  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    node.playbackRate = playbackRate

    if (inView && !loadedRef.current) {
      loadedRef.current = true
      node.preload = 'auto'
      node.load()
    }

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
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
