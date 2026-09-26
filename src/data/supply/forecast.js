// DEMO DATA — see src/lib/contracts/offtaker.js (`SupplyForecast`).
//
// Expected made-tea output per collection centre for the next quarter.
// Every figure is an estimate with a range, never a promise of supply: the
// basis says how it was produced, and the portal labels it "Estimated".

export const FORECAST_BASIS =
  "Estimated from the centre's last three months of accepted green leaf and its factory's conversion rate. Not a commitment to supply."

// [centreId, period, expectedKg, lowKg, highKg]
const SEED = [
  ['CC-KPT', '2026-10', 8600, 7400, 9500], ['CC-KPT', '2026-11', 9200, 7900, 10200], ['CC-KPT', '2026-12', 7800, 6500, 8900],
  ['CC-NES', '2026-10', 6900, 5900, 7700], ['CC-NES', '2026-11', 7300, 6200, 8200], ['CC-NES', '2026-12', 6100, 5100, 7000],
  ['CC-MAR', '2026-10', 6200, 5100, 7100], ['CC-MAR', '2026-11', 6700, 5500, 7600], ['CC-MAR', '2026-12', 5600, 4500, 6500],
  ['CC-TIN', '2026-10', 4500, 3700, 5200], ['CC-TIN', '2026-11', 4800, 3900, 5500], ['CC-TIN', '2026-12', 4000, 3200, 4700],
  ['CC-KAN', '2026-10', 5700, 4800, 6500], ['CC-KAN', '2026-11', 6100, 5200, 6900], ['CC-KAN', '2026-12', 5200, 4300, 6000],
  ['CC-WAN', '2026-10', 4100, 3500, 4700], ['CC-WAN', '2026-11', 4400, 3700, 5000], ['CC-WAN', '2026-12', 3700, 3000, 4300],
  ['CC-KAP', '2026-10', 4600, 3800, 5300], ['CC-KAP', '2026-11', 4900, 4000, 5600], ['CC-KAP', '2026-12', 4100, 3300, 4800],
]

/** @type {import('../../lib/contracts/offtaker').SupplyForecast[]} */
export const SUPPLY_FORECASTS = SEED.map(([centreId, period, expectedKg, lowKg, highKg]) => ({
  id: `FC-${centreId.slice(3)}-${period}`,
  centreId,
  period,
  expectedKg,
  lowKg,
  highKg,
  basis: FORECAST_BASIS,
}))

export const FORECAST_PERIODS = [...new Set(SUPPLY_FORECASTS.map((forecast) => forecast.period))]
