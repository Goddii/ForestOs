// Buffer-belt geometry maths. NTZDC reports its buffer in km of boundary as
// well as hectares (audit §13), so both are derived from the segment's own
// centre line rather than typed in.

const EARTH_RADIUS_KM = 6371.0088

const toRad = (deg) => (deg * Math.PI) / 180

/**
 * Great-circle distance between two [lat, lon] points.
 *
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @returns {number} km
 */
function haversineKm([lat1, lon1], [lat2, lon2]) {
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/**
 * @param {Array<[number, number]>} points - [lat, lon] centre line
 * @returns {number} km
 */
export function polylineLengthKm(points) {
  let total = 0
  for (let index = 1; index < points.length; index += 1) {
    total += haversineKm(points[index - 1], points[index])
  }
  return total
}

/**
 * @param {number} lengthKm
 * @param {number} widthM
 * @returns {number} hectares
 */
export function bufferAreaHa(lengthKm, widthM) {
  return (lengthKm * 1000 * widthM) / 10_000
}
