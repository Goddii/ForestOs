/**
 * Which batches a buying organisation may see, and how precisely. Pure —
 * the workspace builder applies these before anything renders.
 */

/**
 * A batch's relationship to one buyer:
 *  - `allocated`  on one of this buyer's commitments
 *  - `available`  unsold and on nobody's commitment, so offered to every buyer
 *  - `hidden`     sold to, or reserved by, someone else (or auction volume)
 *
 * @param {{ traceId: ?string, brand: ?string, channel: string }} record
 * @param {string} orgId
 * @param {Array<{ offtakerOrgId: string, batchTraceIds: string[], status: string }>} commitments
 * @returns {'allocated' | 'available' | 'hidden'}
 */
export function batchAccess(record, orgId, commitments) {
  if (!record.traceId || record.channel === 'auction') return 'hidden'
  const holders = commitments.filter(
    (commitment) => commitment.status !== 'cancelled' && commitment.batchTraceIds.includes(record.traceId),
  )
  if (holders.some((commitment) => commitment.offtakerOrgId === orgId)) return 'allocated'
  if (holders.length === 0 && !record.brand) return 'available'
  return 'hidden'
}

/**
 * A head count as the buyer may see it: exact at or above the floor,
 * otherwise "fewer than N" so a small group can't be singled out.
 *
 * @param {number} count
 * @param {number} floor
 * @returns {string}
 */
export function formatCount(count, floor) {
  if (count < floor) return `fewer than ${floor}`
  return count.toLocaleString('en-US')
}

/**
 * Plot coordinates at the precision a role may see: three decimals (~100 m)
 * for roles with plot geolocation, two (~1 km) otherwise.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {boolean} precise
 * @returns {string}
 */
export function formatCoords(lat, lon, precise) {
  const dp = precise ? 3 : 2
  return `${Math.abs(lat).toFixed(dp)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lon).toFixed(dp)}° ${lon < 0 ? 'W' : 'E'}`
}
