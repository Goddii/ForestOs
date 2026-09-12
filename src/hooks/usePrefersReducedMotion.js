import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Same contract as framer-motion's `useReducedMotion` (a boolean, updates
 * live if the OS setting changes) without pulling framer-motion's runtime
 * into a bundle that otherwise doesn't need it — this and `useReducedMotion`
 * are interchangeable at every call site.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
