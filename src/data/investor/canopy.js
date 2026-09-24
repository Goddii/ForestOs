// DEMO DATA — see src/data/investor/types.js (`CanopyComparison`).
//
// Before/after imagery for each conservation zone from Esri's World Imagery
// Wayback archive — every published version of World Imagery since 2014,
// served keyless as map tiles. Real imagery of this landscape, used as
// landscape context: the change it shows is NOT attributed to the programme.
//
// Releases were picked by eye per zone, not simply oldest/newest: the oldest
// releases here are black-and-white, cloudy or stitched from mismatched
// strips, and some recent ones are clouded over. Dates are Wayback *release*
// dates — when Esri published that version — not satellite capture dates,
// which can be earlier.

export const WAYBACK_TILE_URL =
  'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/{release}/{z}/{y}/{x}'

/** @type {import('./types').CanopyComparison[]} */
export const CANOPY_COMPARISONS = [
  {
    zoneId: 'conservation-kiptunga',
    tile: { z: 14, x: 9810, y: 8219 },
    baseline: { releaseId: '23383', date: '2014-12-03' },
    latest: { releaseId: '26334', date: '2026-08-05' },
  },
  {
    zoneId: 'conservation-kilombe',
    tile: { z: 14, x: 9808, y: 8222 },
    baseline: { releaseId: '14342', date: '2017-05-31' },
    latest: { releaseId: '27982', date: '2025-04-24' },
  },
]
