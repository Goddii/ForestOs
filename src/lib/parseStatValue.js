/**
 * Splits a display string like "2,500+", "98.2%", "KES 18.4M" or "12,000+"
 * into the parts CountUp needs: whatever comes before the number, the
 * number itself (as a plain float, comma-stripped), how many decimal
 * places it was written with, and whatever comes after. Lets the stat
 * numbers in PLATFORM.stats stay authored as display-ready strings while
 * still animating just the numeric part.
 */
export function parseStatValue(display) {
  const match = display.match(/[\d,]+\.?\d*/)
  if (!match) return { prefix: display, number: 0, decimals: 0, suffix: '' }

  const raw = match[0]
  const prefix = display.slice(0, match.index)
  const suffix = display.slice(match.index + raw.length)
  const clean = raw.replace(/,/g, '')
  const decimals = clean.includes('.') ? clean.split('.')[1].length : 0

  return { prefix, number: Number(clean), decimals, suffix }
}
