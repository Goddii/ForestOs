import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/** Flips `visible` once when the element first scrolls into view. */
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold })
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

/** Eased 0 → target count, started when `active` turns true. */
export function useCountUp(target, duration = 1800, active = false) {
  const [value, setValue] = useState(0)
  const isReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!active) return undefined
    if (isReduced) return undefined
    let frame = 0
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.floor((1 - Math.pow(1 - t, 3)) * target))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration, isReduced])

  // Reduced motion: show the final figure at once instead of counting up.
  return isReduced && active ? target : value
}
