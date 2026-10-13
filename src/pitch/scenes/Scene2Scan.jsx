import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scene 2 — THE SCAN.
 *
 * After the visitor has scrolled past the hero (and optionally opened the
 * real /honey experience), this scene says:
 *
 *   YOU JUST BECAME THE CONSUMER.
 *   But what happens behind the scan?
 *
 * A full-width forest-green field fills the viewport. As the visitor
 * scrolls, the green recedes and the SVG system-map from Scene 3 fades
 * in underneath — the transition into the animated journey.
 *
 * Reduced motion: the field is solid green, text is statically visible.
 */
export default function Scene2Scan() {
  const reduced = usePrefersReducedMotion()
  const containerRef = useRef(null)
  const fieldRef = useRef(null)
  const overRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    if (!fieldRef.current || !overRef.current) return undefined

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
    })

    const tl = gsap.timeline({ scrollTrigger: st })
    tl.to(fieldRef.current, { opacity: 1, duration: 0.3 }, 0)
    tl.to(overRef.current, { opacity: 0, duration: 0.4 }, 0.1)

    return () => {
      st.kill()
      tl.kill()
    }
  }, [reduced])

  return (
    <section
      ref={containerRef}
      className="pitch-scene relative flex min-h-[120vh] items-center justify-center overflow-hidden bg-pitch-paper"
    >
      {/* Forest-green field */}
    <div
      ref={fieldRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, var(--pitch-forest-soft) 0%, var(--pitch-forest-soft) 100%)',
        opacity: reduced ? 1 : 0,
      }}
    />

      {/* Scan overlay — fades out to reveal Scene 3 */}
      <div
        ref={overRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <p className="pitch-label mb-6 text-pitch-ink-soft">
          Scene 02 — The scan
        </p>
        <h2 className="pitch-display pitch-headline-md text-pitch-ink mb-6">
          YOU JUST BECAME THE CONSUMER.
        </h2>
        <p className="pitch-body text-pitch-ink-soft mb-2">
          But what happens behind the scan?
        </p>
        <p className="pitch-body-sm text-pitch-ink-faint">
          The chain that follows is where commerce meets conservation.
        </p>
      </div>
    </section>
  )
}
