import { useEffect, useState } from 'react'

const MS_PER_DAY = 24 * 60 * 60 * 1000
// The days figure only ever changes on a date boundary, so an hourly tick is
// ample and keeps the section idle between checks.
const TICK_MS = 60 * 60 * 1000

function daysUntil(target) {
  const diff = target - Date.now()
  return diff <= 0 ? 0 : Math.ceil(diff / MS_PER_DAY)
}

/**
 * Whole days remaining until `isoDate` (never negative). Recomputed on mount
 * and once an hour thereafter; the interval is cleared on unmount.
 *
 * @param {string} isoDate  e.g. '2026-11-09'
 * @returns {{ days: number }}
 */
export function useCountdown(isoDate) {
  const target = new Date(isoDate).getTime()
  const [days, setDays] = useState(() => daysUntil(target))

  useEffect(() => {
    // Re-sync from the event that matters (a date rollover) on a slow tick;
    // the initial value is already set by the useState initializer.
    const id = setInterval(() => setDays(daysUntil(target)), TICK_MS)
    return () => clearInterval(id)
  }, [target])

  return { days }
}
