/**
 * Compact "KSh 50.0M" style formatting for the investor console's headline
 * figures. Pure formatting only — no data lives here.
 *
 * @param {number} value
 * @param {string} [currency]
 * @returns {string}
 */
export function formatCurrencyShort(value, currency = 'KSh') {
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(0)}K`
  return `${currency} ${value.toLocaleString('en-US')}`
}

/**
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  return value.toLocaleString('en-US')
}

/**
 * Millions to two decimals ("3.55M", "0.98M") for tables and ledgers where
 * figures must add up; formatCurrencyShort's one decimal is for headlines.
 *
 * @param {number} value
 * @param {string} [currency] - prefixed with a space when given
 * @returns {string}
 */
export function formatMillions(value, currency) {
  const figure = `${(value / 1_000_000).toFixed(2)}M`
  return currency ? `${currency} ${figure}` : figure
}
