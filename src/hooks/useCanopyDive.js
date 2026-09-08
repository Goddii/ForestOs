import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Length of the pinned scroll-window, as a fraction of viewport height.
const DIVE_DISTANCE = '+=150%'
// Frame zoom at the bottom of the dive — the "pull through the fog".
const DIVE_SCALE = 1.5
// Bias the zoom just above centre, where the canopy sits in frame.
const DIVE_ORIGIN = '50% 42%'
// Overlays must clear the frame within the first third of the window.
const EGRESS_FRACTION = 0.3
// Drift distance for the exiting overlays.
const EGRESS_RISE = -50
// Scrub catch-up in seconds — smooths coarse webm keyframe seeks.
const SCRUB = 0.5

// Narrative sequence: three statements sweep the middle of the window, one per
// 20% band (30-50-70-90%), each entering, holding, then clearing before the next.
const STORY_START = 0.3
const STORY_BAND = 0.2
const STORY_IN = 0.05 // fraction of the window a line takes to appear
const STORY_OUT = 0.06 // fraction it takes to leave
const STORY_OUT_OFFSET = 0.14 // into each band before the line starts leaving
const STORY_ENTER_Y = 24 // starts just below centre
const STORY_HOLD_Y = -20 // resting position once shown
const STORY_EXIT_Y = -44 // keeps drifting up on the way out

/**
 * "Dive into the canopy" — the hero's scroll-driven handoff to the 3D map.
 *
 * A single pinned ScrollTrigger opens a dedicated scroll-window over `heroRef`.
 * Across that window it:
 *   1. pins the hero so it holds still while the animation plays;
 *   2. scrubs the background `<video>` playback head to scroll progress, bound to
 *      `currentTime` only after `loadedmetadata` so `duration` is defined;
 *   3. zooms the frame from 1x to 1.5x for a sense of physical descent;
 *   4. fades and lifts the text, CTA and hotspots (`[data-egress]`) out of frame
 *      during the first 30% so the canopy fills the screen;
 *   5. reveals three narrative statements (`[data-story]`) one at a time across
 *      the 30-90% band, each clearing before the next and all gone by 100%;
 * then releases the pin so the Cesium map scrolls up from the bottom and takes
 * over exactly where the dive ends.
 *
 * All GSAP work is scoped through `gsap.context(fn, heroRef)`, so every tween,
 * the ScrollTrigger, and its pin-spacer are fully reverted on unmount, on a
 * dependency change, or on a React re-run — no leaked triggers or stale pins.
 */
export function useCanopyDive(heroRef, videoRef, { enabled = true } = {}) {
  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    if (!hero || !video || !enabled) return

    video.pause()

    let ctx
    let removeMetaListener = () => {}

    const build = () => {
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) return

      ctx = gsap.context(() => {
        // Proxy value so the video's currentTime can ride a scrubbed timeline.
        const playhead = { t: 0 }

        // Normalise the timeline to a length of 1 so positions read as
        // fractions of the scroll-window (GSAP's default tween duration is 0.5).
        const tl = gsap.timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: DIVE_DISTANCE,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        })

        // (2) True video scrubbing — playback head tracks the whole window.
        tl.to(
          playhead,
          {
            t: duration,
            onUpdate: () => {
              if (video.readyState < 1) return
              video.currentTime = Math.min(playhead.t, duration - 0.05)
            },
          },
          0,
        )

        // (3) The dive — physical zoom for spatial depth.
        tl.fromTo(
          video,
          { scale: 1, transformOrigin: DIVE_ORIGIN },
          { scale: DIVE_SCALE },
          0,
        )

        // (4) Parallax egress — overlays fade + drift up within the first third.
        tl.to(
          '[data-egress]',
          {
            autoAlpha: 0,
            y: EGRESS_RISE,
            ease: 'power1.in',
            duration: EGRESS_FRACTION,
          },
          0,
        )

        // Atmosphere — deepen the forest grade as the descent progresses.
        tl.fromTo(
          '[data-descent-grade]',
          { opacity: 0.12 },
          { opacity: 0.82 },
          0,
        )

        // (5) Narrative sequence — three statements fade through the mid-window,
        // concurrent with the ongoing video scrub + scale, each clearing the
        // frame before the next enters and all gone before the pin releases.
        for (let i = 0; i < 3; i += 1) {
          const line = `[data-story="${i + 1}"]`
          const bandStart = STORY_START + i * STORY_BAND
          tl.fromTo(
            line,
            { autoAlpha: 0, y: STORY_ENTER_Y },
            { autoAlpha: 1, y: STORY_HOLD_Y, duration: STORY_IN, ease: 'power2.out' },
            bandStart,
          )
          tl.to(
            line,
            { autoAlpha: 0, y: STORY_EXIT_Y, duration: STORY_OUT, ease: 'power2.in' },
            bandStart + STORY_OUT_OFFSET,
          )
        }
      }, hero)

      ScrollTrigger.refresh()
    }

    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      build()
    } else {
      const onMeta = () => build()
      video.addEventListener('loadedmetadata', onMeta, { once: true })
      removeMetaListener = () => video.removeEventListener('loadedmetadata', onMeta)
    }

    return () => {
      removeMetaListener()
      ctx?.revert()
    }
  }, [heroRef, videoRef, enabled])
}
