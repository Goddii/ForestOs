import { useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useCanopyDive } from '../../hooks/useCanopyDive'
import Hotspot from '../Hotspot'

/**
 * The pinned "canopy dive" hero, shared by the batch view and the macro home.
 *
 * With motion: a full-viewport background video pinned by a ScrollTrigger,
 * scrubbed and zoomed by scroll, with the overlay UI drifting out
 * (`[data-egress]`) in the first third and the narrative statements
 * (`[data-story]`) fading through the middle.
 *
 * Reduced motion: no pin, no scrub. The section grows to its content and the
 * narrative statements render as a static list under the overlay.
 *
 * @param {import('react').RefObject} videoRef  ref to the fixed <BackgroundVideo>
 * @param {string[]} storyLines                 the mid-dive statements (3)
 * @param {Array}   [hotspots]                  optional spatial markers over the frame
 * @param {string|null} [cueLabel='Scroll to descend']  top scroll cue; null hides it
 * @param {import('react').ReactNode} children  bottom-anchored overlay; must contain
 *                                              an element with id="hero-heading"
 */
export default function CinematicHero({
  videoRef,
  storyLines,
  hotspots = [],
  cueLabel = 'Scroll to descend',
  children,
}) {
  const heroRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useCanopyDive(heroRef, videoRef, { enabled: !reduced })

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className={
        'relative w-full ' +
        (reduced
          ? 'flex min-h-[100svh] flex-col justify-end'
          : 'h-[100svh] overflow-hidden')
      }
    >
      {/* Deepening grade as the descent progresses */}
      <div
        aria-hidden="true"
        data-descent-grade
        className="pointer-events-none absolute inset-0 bg-forest-950 opacity-[0.12]"
      />

      {/* Bottom scrim so the overlay type holds contrast over a bright frame */}
      <div
        aria-hidden="true"
        data-egress
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-forest-950 via-forest-950/55 to-transparent"
      />

      {/* Spatial hotspots over the video frame */}
      {hotspots.length > 0 && (
        <div data-egress className="absolute inset-0">
          {hotspots.map((spot) => (
            <Hotspot key={spot.id} {...spot} />
          ))}
        </div>
      )}

      {/* Overlay content, anchored bottom-left */}
      <div
        data-egress
        className={reduced ? 'relative w-full' : 'absolute inset-x-0 bottom-0'}
      >
        <div className="mx-auto max-w-6xl px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-14">
          {children}

          {/* Reduced motion: the dive never runs, so the narrative that would
              sweep through it is shown here as a static list instead. */}
          {reduced && storyLines.length > 0 && (
            <ul className="mt-8 max-w-[46ch] space-y-1.5 border-t border-bone/15 pt-6 font-display text-lg leading-snug text-bone/90 sm:text-xl">
              {storyLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Scroll cue */}
      {cueLabel && !reduced && (
        <div
          aria-hidden="true"
          data-egress
          className="absolute inset-x-0 top-6 flex justify-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/60">
            {cueLabel}
          </span>
        </div>
      )}

      {/* Narrative sequence — revealed one line at a time during the pinned dive.
          Omitted entirely under reduced motion (shown as a static list above). */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
          {storyLines.map((line, i) => (
            <h2
              key={line}
              data-story={i + 1}
              className="invisible col-start-1 row-start-1 max-w-[26ch] text-center font-display text-3xl leading-[1.12] text-bone/90 opacity-0 [text-shadow:0_2px_24px_rgba(8,20,14,0.7)] sm:text-5xl sm:leading-[1.1]"
            >
              {line}
            </h2>
          ))}
        </div>
      )}
    </section>
  )
}
