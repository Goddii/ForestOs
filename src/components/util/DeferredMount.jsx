import { useEffect, useState } from 'react'

/**
 * Renders `placeholder` until the viewer has scrolled at least `minScrollY`
 * pixels, then swaps in `children` for good.
 *
 * The heavy Cesium globe lives below a pinned, full-viewport hero. Mounting it
 * on first render makes the whole page paint at a few FPS while the earth loads
 * — right when the canopy dive needs the frame budget. A plain "is it near the
 * viewport" check fires immediately too, because the GSAP pin spacer that
 * pushes the globe down does not exist yet on that first render. Gating on a
 * real scroll distance sidesteps both problems: by the time the viewer has
 * scrolled past the hero, the dive is done and the globe is still off-screen.
 */
export default function DeferredMount({ children, placeholder, minScrollY = 500 }) {
  const [show, setShow] = useState(
    () => typeof window !== 'undefined' && window.scrollY >= minScrollY,
  )

  useEffect(() => {
    if (show) return undefined
    const onScroll = () => {
      if (window.scrollY >= minScrollY) setShow(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [show, minScrollY])

  return show ? children : placeholder
}
