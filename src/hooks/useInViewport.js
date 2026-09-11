import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether the returned ref's element is on (or near) screen, via
 * IntersectionObserver rather than a scroll listener. Used to pause
 * background video/WebGL work in sections the visitor has scrolled past —
 * every section keeps decoding and rendering by default otherwise, which
 * compounds into scroll jank as more sections mount.
 *
 * @param {{ rootMargin?: string, threshold?: number }} [options]
 * @returns {[import('react').RefObject, boolean]}
 */
export function useInViewport({ rootMargin = '200px 0px', threshold = 0 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
      threshold,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, inView]
}
