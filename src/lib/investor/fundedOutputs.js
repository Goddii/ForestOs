/**
 * Split a funder's output indicators for the overview: outputs with some
 * verified work lead as headline figures, while outputs where work has been
 * reported but none of it verified yet are listed separately rather than
 * shown as a large "0 verified". Indicators the funder has not paid for at
 * all are dropped. Each row gains `pending`: reported work still awaiting
 * verification.
 *
 * @template {{ fundedVerified: number, fundedReported: number }} T
 * @param {T[]} progress
 * @returns {{ verified: Array<T & { pending: number }>, unverified: Array<T & { pending: number }> }}
 */
export function splitFundedOutputs(progress) {
  const funded = progress
    .filter((row) => row.fundedReported > 0)
    .map((row) => ({ ...row, pending: row.fundedReported - row.fundedVerified }))
  return {
    verified: funded.filter((row) => row.fundedVerified > 0),
    unverified: funded.filter((row) => row.fundedVerified === 0),
  }
}

const MAX_SINGLE_ROW = 5

/**
 * How many outputs sit side by side on desktop: up to five fit one row;
 * beyond that, rows of three when that divides evenly, otherwise rows of
 * four (the last row's items stretch to fill, so no empty cells remain).
 *
 * @param {number} count
 * @returns {number}
 */
export function desktopColumns(count) {
  if (count <= MAX_SINGLE_ROW) return Math.max(1, count)
  return count % 3 === 0 ? 3 : 4
}
