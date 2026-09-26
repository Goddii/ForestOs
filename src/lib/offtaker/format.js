/** "1,840 kg" — every volume in the portal is made tea in kilograms unless labelled otherwise. */
export const formatKg = (value) => `${value.toLocaleString('en-US')} kg`

/** "Oct 2026" from "2026-10". */
export function formatMonth(period) {
  const [year, month] = period.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}
