/**
 * Scan and engagement aggregation for the Brand Portal. Pure functions over
 * daily scan records (data/brand/scans.js); a real scan log slots in without
 * changing anything here. Counts are rounded whole scans, and location is
 * held to a privacy floor: a place with fewer scans than the floor is never
 * shown under its own name.
 */

const DAY_MS = 86_400_000
const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10)

/** The first day of a window of `length` days ending on `end` (inclusive). */
export function rangeFrom(end, length) {
  return isoDay(Date.parse(end) - (length - 1) * DAY_MS)
}

const inRange = (from, to) => (record) => record.date >= from && record.date <= to

/** @param {Array<{ scans: number, uniqueDevices: number }>} records */
export function sumScans(records) {
  return records.reduce(
    (acc, record) => ({ scans: acc.scans + record.scans, uniqueDevices: acc.uniqueDevices + record.uniqueDevices }),
    { scans: 0, uniqueDevices: 0 },
  )
}

/**
 * One row per calendar day from `from` to `to`, summed across experiences,
 * with days that had no scans present as zero (a gap is data, not a hole).
 */
export function dailyTotals(records, from, to) {
  const byDate = new Map()
  for (const record of records.filter(inRange(from, to))) {
    const entry = byDate.get(record.date) ?? { scans: 0, uniqueDevices: 0 }
    byDate.set(record.date, { scans: entry.scans + record.scans, uniqueDevices: entry.uniqueDevices + record.uniqueDevices })
  }
  const rows = []
  for (let ms = Date.parse(from); ms <= Date.parse(to); ms += DAY_MS) {
    const date = isoDay(ms)
    rows.push({ date, ...(byDate.get(date) ?? { scans: 0, uniqueDevices: 0 }) })
  }
  return rows
}

/** Scans in [from, to] against the same number of days just before; `pct` is null with no prior scans. */
export function periodChange(records, from, to) {
  const length = Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1
  const previousTo = isoDay(Date.parse(from) - DAY_MS)
  const previousFrom = rangeFrom(previousTo, length)
  const current = sumScans(records.filter(inRange(from, to))).scans
  const previous = sumScans(records.filter(inRange(previousFrom, previousTo))).scans
  return { current, previous, pct: previous > 0 ? Math.round(((current - previous) / previous) * 100) : null }
}

/**
 * How far readers get through the experience. `fromPrevious` is the share of
 * the previous stage that reached this one; the biggest drop is the stage
 * with the lowest step conversion.
 */
export function stageFunnel(totalScans, stageRates, stages) {
  const rows = stages.map((stage, index) => ({ ...stage, count: Math.round(totalScans * (stageRates[index] ?? 0)) }))
  const withConversion = rows.map((row, index) => ({
    ...row,
    fromPrevious: index === 0 || rows[index - 1].count === 0 ? null : Math.round((row.count / rows[index - 1].count) * 100),
  }))
  const steps = withConversion.filter((row) => row.fromPrevious !== null)
  const biggestDrop = steps.reduce((worst, row) => (worst === null || row.fromPrevious < worst.fromPrevious ? row : worst), null)
  return { rows: withConversion, biggestDropKey: biggestDrop?.key ?? null }
}

/**
 * Scans by county or country. Places under the floor are pooled into one
 * "Other locations" row, and so is a lone suppressed place: its count could
 * otherwise be read straight off the row.
 *
 * @param {number} totalScans
 * @param {Array<[string, 'county' | 'country', number]>} geography  place, kind, share of scans
 * @param {number} floor
 */
export function geographyRows(totalScans, geography, floor) {
  return applyFloor(countPlaces(totalScans, geography), floor)
}

const countPlaces = (totalScans, geography) => geography.map(([label, kind, share]) => ({ label, kind, count: Math.round(totalScans * share) }))

/**
 * Geography across several experiences: places are merged first and the
 * floor applied after, so a place is judged on its combined count.
 *
 * @param {Array<{ totalScans: number, geography: Array<[string, string, number]> }>} parts
 * @param {number} floor
 */
export function mergedGeographyRows(parts, floor) {
  const merged = new Map()
  for (const part of parts) {
    for (const row of countPlaces(part.totalScans, part.geography)) {
      const entry = merged.get(row.label)
      merged.set(row.label, entry ? { ...entry, count: entry.count + row.count } : row)
    }
  }
  return applyFloor([...merged.values()], floor)
}

/**
 * Stage rates across several experiences, weighted by each one's scans, so
 * a busy experience counts for more than a quiet one.
 *
 * @param {Array<{ scans: number, rates: number[] }>} parts
 * @returns {number[]}
 */
export function weightedRates(parts) {
  const total = parts.reduce((sum, part) => sum + part.scans, 0)
  if (parts.length === 0 || total === 0) return parts[0]?.rates ?? []
  return parts[0].rates.map((_, index) => {
    const weighted = parts.reduce((sum, part) => sum + part.scans * (part.rates[index] ?? 0), 0) / total
    return Math.round(weighted * 1000) / 1000
  })
}

function applyFloor(counted, floor) {
  const shown = counted.filter((row) => row.count >= floor).sort((a, b) => b.count - a.count)
  const pooled = counted.filter((row) => row.count < floor && row.count > 0)
  if (pooled.length === 0) return shown
  const other = { label: 'Other locations', kind: 'mixed', count: pooled.reduce((sum, row) => sum + row.count, 0), places: pooled.length, isOther: true }
  return [...shown, other]
}

const LINK_KINDS = [
  { key: 'cta', present: (c) => Boolean(c.cta?.href), label: (c) => c.cta.label, href: (c) => c.cta.href },
  { key: 'social', present: (c) => c.socialLinks.length > 0, label: (c) => c.socialLinks.map((link) => link.network).join(', '), href: (c) => c.socialLinks[0].href },
  { key: 'music', present: (c) => Boolean(c.musicLink), label: () => 'Music link', href: (c) => c.musicLink },
  { key: 'community', present: (c) => Boolean(c.communityLink), label: () => 'Community link', href: (c) => c.communityLink },
]

/** Taps on each link an experience actually carries. */
export function linkRows(totalScans, rates, customisation) {
  return LINK_KINDS.filter((kind) => kind.present(customisation)).map((kind) => {
    const rate = rates[kind.key] ?? 0
    return {
      key: kind.key,
      label: kind.label(customisation),
      href: kind.href(customisation),
      taps: Math.round(totalScans * rate),
      ratePct: Math.round(rate * 1000) / 10,
    }
  })
}
