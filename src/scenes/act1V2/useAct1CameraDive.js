import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Length of the pinned scroll-window, as a fraction of viewport height.
const DIVE_DISTANCE = '+=180%'
// Scrub catch-up in seconds — smooths coarse scroll input into a glide.
const SCRUB = 0.6
// Overlay chrome must clear the frame within the first quarter of the window.
const EGRESS_FRACTION = 0.25
const EGRESS_RISE = -40

// Three camera keyframes: high overview → descending glide → low, level pass
// through the tea belt. Each leg gets its own GSAP ease so the motion
// accelerates/decelerates instead of tracking scroll linearly.
const CAMERA_KEYFRAMES = [
  { at: 0, pos: { x: 0, y: 54, z: 46 }, look: { x: 0, y: 14, z: -30 } },
  { at: 0.5, pos: { x: 5, y: 24, z: 8 }, look: { x: 1, y: 9, z: -55 }, ease: 'power1.inOut' },
  { at: 1, pos: { x: 9, y: 9, z: -24 }, look: { x: 2, y: 6, z: -92 }, ease: 'power2.out' },
]

/**
 * Drives the Act I v2 camera dive: pins the section, scrubs a shared
 * `cameraState` object across scroll-window keyframes, and fades the intro
 * chrome (`[data-act1-egress]`) out within the first quarter of the dive.
 *
 * Mirrors `useCanopyDive`'s pin/scrub/context-revert shape, but scrubs a
 * plain camera-state object (read by `CameraRig` via `useFrame`) instead of a
 * video's `currentTime`.
 */
export function useAct1CameraDive(sectionRef, cameraState, { enabled = true } = {}) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !enabled) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: DIVE_DISTANCE,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      })

      for (let i = 1; i < CAMERA_KEYFRAMES.length; i += 1) {
        const from = CAMERA_KEYFRAMES[i - 1]
        const to = CAMERA_KEYFRAMES[i]
        const span = to.at - from.at
        tl.to(cameraState.pos, { ...to.pos, duration: span, ease: to.ease }, from.at)
        tl.to(cameraState.look, { ...to.look, duration: span, ease: to.ease }, from.at)
      }

      tl.fromTo(
        '[data-act1-egress]',
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: EGRESS_RISE, ease: 'power1.in', duration: EGRESS_FRACTION },
        0,
      )
    }, section)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [sectionRef, cameraState, enabled])
}
