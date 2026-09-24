import { useState } from 'react'

// Served from /public/media (copied in during project setup).
const FOREST_VIDEO = '/media/forest1.webm'
// Both files carry a keyframe every 10 frames (0.4s), so each scroll-scrub
// seek decodes at most 10 frames — the original 5.12s spacing made every
// seek decode up to ~128 1080p frames and the dive stuttered. The 720p
// version (~3.6MB vs ~5.8MB) is for phones, where the extra resolution of
// the 1080p master isn't visible behind the grade.
const FOREST_VIDEO_MOBILE = '/media/forest1-720.webm'
const MOBILE_QUERY = '(max-width: 767px)'

// Picked once at mount — swapping `src` later would reset the playhead and
// `duration` that useCanopyDive's scrub is built on.
function pickForestVideo() {
  if (typeof window === 'undefined' || !window.matchMedia) return FOREST_VIDEO
  return window.matchMedia(MOBILE_QUERY).matches ? FOREST_VIDEO_MOBILE : FOREST_VIDEO
}
// One still frame of the same footage — paints instantly while the video
// buffers, instead of a flat bg-forest-950 fill.
const FOREST_POSTER = '/media/forest1-poster.jpg'

/**
 * Fixed, full-viewport cinematic background. The hero drives its playback head
 * and zoom via useCanopyDive; later (opaque) sections scroll over it and cover it.
 */
export default function BackgroundVideo({ videoRef }) {
  const [src] = useState(pickForestVideo)

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-forest-950">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        poster={FOREST_POSTER}
        muted
        playsInline
        preload="auto"
        fetchPriority="high"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Static base grade so the fixed frame always anchors type at the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(8,20,14,0.55) 100%),' +
            'linear-gradient(to bottom, rgba(8,20,14,0.35) 0%, transparent 22%, transparent 55%, rgba(8,20,14,0.9) 100%)',
        }}
      />
    </div>
  )
}
