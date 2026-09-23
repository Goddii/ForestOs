// Scrolls to the element matching the current URL hash — used by pages
// linked to via a fragment (e.g. `#SITE-01`, `#D-04`) from breadcrumbs,
// the fund map, or cross-links elsewhere in the portal.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useHashScroll() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const target = document.getElementById(location.hash.slice(1))
    target?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [location.hash])
}
