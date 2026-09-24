import { useEffect } from 'react'

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
// One frame of the 25fps footage — a scrub target closer than this to where
// the playhead already is would decode the same frame again, so it's skipped.
const FRAME_SECONDS = 1 / 25
// Idle loop: plays this opening slice, at real native playback (not a
// manually-scrubbed currentTime — see the hook doc below for why that
// matters), before the visitor scrolls, so the canopy feels alive rather
// than sitting frozen on frame 0.
const IDLE_LOOP_END = 7
// Loop-point and scroll-handoff cuts are masked with a brief opacity dip
// rather than shown as a hard jump — this is what makes both feel smooth.
const CUT_FADE_MS = 260

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
 * Before the visitor scrolls at all, the opening `IDLE_LOOP_END` seconds of
 * the background video play at real, native playback — a gentle "the scene
 * is alive" cue rather than a frozen first frame. This deliberately does
 * NOT reuse the scroll-scrub's technique of repeatedly setting `currentTime`
 * on a paused video: browsers only decode and paint a seek's target frame
 * when the seek is left to settle, and a paused video seeked 60 times a
 * second (an earlier version of this idle loop did exactly that) never gets
 * a chance to actually paint anything — the number advances, the picture
 * doesn't. Real playback has no such problem.
 *
 * Both the loop-point (looping back to 0) and the scroll-handoff (killing
 * the idle loop so the scrub below takes over `currentTime`) are hard cuts
 * in the underlying frame — masked with a brief opacity dip
 * (`CUT_FADE_MS`) rather than left as a visible jump. Skipped altogether if
 * the page is already scrolled on mount (a reload mid-page, a deep link) —
 * the scrub is the only source of truth then.
 *
 * A single pinned ScrollTrigger opens a dedicated scroll-window over `heroRef`.
 * Across that window it:
 *   1. pins the hero so it holds still while the animation plays;
 *   2. scrubs the background `<video>` playback head to scroll progress, bound to
 *      `currentTime` only after `loadedmetadata` so `duration` is defined;
 *   3. zooms the frame from 1x to 1.5x for a sense of physical descent;
 *   4. fades and lifts the text, CTA and hotspots (`[data-egress]`) out of frame
 *      during the first 30% so the canopy fills the screen;
 *   5. deepens a three-stop atmosphere grade (`[data-descent-grade]`) and pulses
 *      a transient mist band (`[data-mist-layer]`) through the 12-64% stretch;
 *   6. reveals three narrative statements (`[data-story]`) one at a time across
 *      the 30-90% band, each clearing before the next and all gone by 100%;
 * then releases the pin so the Cesium map scrolls up from the bottom and takes
 * over exactly where the dive ends.
 *
 * All GSAP work is scoped through `gsap.context(fn, heroRef)`, so every tween,
 * the ScrollTrigger, and its pin-spacer are fully reverted on unmount, on a
 * dependency change, or on a React re-run — no leaked triggers or stale pins.
 *
 * `gsap` and `gsap/ScrollTrigger` are dynamically imported inside the effect
 * rather than statically at module scope, so their ~44KB (gzip) doesn't sit
 * on the Home route's critical bundle. Nothing here needs GSAP before the
 * visitor scrolls — the idle loop above runs on native `video.play()` alone —
 * so the pin/scrub simply attaches a beat later once the chunk arrives.
 */
export function useCanopyDive(heroRef, videoRef, { enabled = true } = {}) {
  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    if (!hero || !video || !enabled) return

    video.pause()

    // Idle loop — only meaningful if the page hasn't already been scrolled
    // into the dive (a reload, a deep link straight to a lower section).
    let idleActive = window.scrollY <= 4
    let cutTimer = null

    // Dips opacity, runs `action` while the frame is hidden, fades back in —
    // hides a hard cut instead of showing it.
    const cutThrough = (action) => {
      video.style.transition = `opacity ${CUT_FADE_MS}ms ease`
      video.style.opacity = '0'
      clearTimeout(cutTimer)
      cutTimer = setTimeout(() => {
        action()
        video.style.opacity = '1'
      }, CUT_FADE_MS)
    }

    const onIdleTimeUpdate = () => {
      if (video.currentTime < IDLE_LOOP_END) return
      // Pausing stops further `timeupdate` events immediately, so this can't
      // re-fire and restart the fade mid-cut.
      video.pause()
      cutThrough(() => {
        video.currentTime = 0
        video.play().catch(() => {})
      })
    }
    const stopIdle = () => {
      if (!idleActive) return
      idleActive = false
      video.removeEventListener('timeupdate', onIdleTimeUpdate)
      cutThrough(() => video.pause())
    }
    if (idleActive) {
      video.addEventListener('timeupdate', onIdleTimeUpdate)
      video.play().catch(() => {})
      // Any scroll input at all hands control to the scrub below.
      window.addEventListener('scroll', stopIdle, { once: true, passive: true })
    }

    // Scrub seeks are coalesced: at most one seek is in flight, and while it
    // decodes only the latest requested time is remembered and applied on
    // `seeked`. Assigning `currentTime` on every scrub tick (~60/s) instead
    // queues seeks faster than the decoder can finish them, which stalls the
    // dive and eventually trips Chromium's PIPELINE_ERROR_DECODE, freezing
    // the hero for good. (The hero files are encoded with a keyframe every
    // 10 frames so each seek stays cheap — see BackgroundVideo.)
    let pendingSeek = null
    let lastTarget = 0
    const seekTo = (time) => {
      lastTarget = time
      if (video.seeking) {
        pendingSeek = time
        return
      }
      if (Math.abs(video.currentTime - time) < FRAME_SECONDS) return
      video.currentTime = time
    }
    const onSeeked = () => {
      if (pendingSeek === null) return
      const time = pendingSeek
      pendingSeek = null
      seekTo(time)
    }
    video.addEventListener('seeked', onSeeked)

    // A MediaError leaves the element dead (no more `seeked`, frozen frame).
    // Reload it once and return to where the scrub last asked to be, rather
    // than leaving the hero frozen for the rest of the visit.
    let hasRecovered = false
    const onVideoError = () => {
      if (hasRecovered) return
      hasRecovered = true
      pendingSeek = null
      const resumeAt = lastTarget
      video.addEventListener('loadedmetadata', () => seekTo(resumeAt), { once: true })
      video.load()
    }
    video.addEventListener('error', onVideoError)

    let ctx
    let cancelled = false
    let removeMetaListener = () => {}

    const build = (gsap, ScrollTrigger) => {
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
              seekTo(Math.min(playhead.t, duration - 0.05))
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

        // Mist band — a transient haze the dive passes through partway down,
        // in and back out before the narrative sequence below takes over.
        tl.fromTo(
          '[data-mist-layer]',
          { opacity: 0 },
          { opacity: 0.85, ease: 'sine.inOut', duration: 0.22 },
          0.12,
        )
        tl.to(
          '[data-mist-layer]',
          { opacity: 0, ease: 'sine.inOut', duration: 0.22 },
          0.42,
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

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        // Effect deps changed (or the component unmounted) before the chunk
        // arrived — the cleanup below already ran, nothing left to attach.
        if (cancelled) return

        gsap.registerPlugin(ScrollTrigger)
        const runBuild = () => build(gsap, ScrollTrigger)

        if (video.readyState >= 1 && Number.isFinite(video.duration)) {
          runBuild()
        } else {
          video.addEventListener('loadedmetadata', runBuild, { once: true })
          removeMetaListener = () => video.removeEventListener('loadedmetadata', runBuild)
        }
      },
    )

    return () => {
      cancelled = true
      removeMetaListener()
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onVideoError)
      window.removeEventListener('scroll', stopIdle)
      if (idleActive) video.removeEventListener('timeupdate', onIdleTimeUpdate)
      clearTimeout(cutTimer)
      ctx?.revert()
    }
  }, [heroRef, videoRef, enabled])
}
