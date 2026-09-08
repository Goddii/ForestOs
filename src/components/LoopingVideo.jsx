import { useReducedMotion } from 'framer-motion'

/**
 * Decorative, muted, looping background video for a section (not the fixed
 * hero layer). Paused on its first frame when the viewer prefers reduced
 * motion, matching the reduced-motion convention used across the page.
 */
export default function LoopingVideo({ src, className, playbackRate = 1 }) {
  const reduced = useReducedMotion()

  return (
    <video
      ref={(node) => {
        if (!node) return
        node.playbackRate = playbackRate
        if (reduced) node.pause()
      }}
      className={className}
      src={src}
      autoPlay={!reduced}
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
