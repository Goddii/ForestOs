// Shared scale math for the funder console's charts. Every chart measures
// from zero so a bar's length or a line's height is proportional to the
// value it shows (dataviz skill: no truncated axes on a trust product).

const NICE_STEPS = [1, 2, 2.5, 5, 10]

/**
 * Round a positive number up to the next "nice" axis maximum (1, 2, 2.5 or 5
 * times a power of ten).
 *
 * @param {number} value
 * @returns {number}
 */
export function niceCeiling(value) {
  if (!(value > 0)) return 1
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalized = value / magnitude
  const step = NICE_STEPS.find((candidate) => normalized <= candidate)
  return step * magnitude
}

/**
 * The top of a zero-based y-axis: the metric's declared fixed scale (e.g. a
 * 0–100 index or a percentage) when it has one and every value fits inside
 * it, otherwise a nice ceiling above the largest value.
 *
 * @param {number[]} values
 * @param {number} [scaleMax]
 * @returns {number}
 */
export function chartDomainMax(values, scaleMax) {
  const max = Math.max(0, ...values)
  if (scaleMax && max <= scaleMax) return scaleMax
  return niceCeiling(max)
}

/**
 * The fraction `part / total`, clamped to 0–1, for sizing bars against a
 * total (0 when the total is empty).
 *
 * @param {number} part
 * @param {number} total
 * @returns {number}
 */
export function shareOf(part, total) {
  if (!(total > 0)) return 0
  return Math.min(1, Math.max(0, part / total))
}
