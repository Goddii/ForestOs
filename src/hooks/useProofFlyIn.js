import { useEffect, useRef } from 'react'

// The section must be at least this visible before the fly-in launches.
const THRESHOLD = 0.28

/**
 * Fires `onEnter` exactly once — the first time `ref`'s element is at least
 * ~28% visible in the viewport. Used to launch the #proof camera fly-in on the
 * initial scroll into the section and never again, even across fast scrolling
 * that flips the section in and out of view repeatedly.
 *
 * The observer disconnects itself the moment it fires, and on unmount, so no
 * listener outlives the section.
 */
export function useProofFlyIn(ref, onEnter, { enabled = true } = {}) {
  const firedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || firedRef.current) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio >= THRESHOLD,
        )
        if (!hit || firedRef.current) return
        firedRef.current = true
        observer.disconnect()
        onEnter()
      },
      { threshold: [THRESHOLD] },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [ref, onEnter, enabled])
}
