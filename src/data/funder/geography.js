// DEMO DATA — see src/lib/contracts/programme.js (`BufferSegment`).
//
// Illustrative centre lines along the South West Mau forest edge near the
// existing demo landscape — digitised for the prototype, NOT surveyed NTZDC
// boundaries (audit §15: real buffer shapefiles still to be obtained).
// Length and area are derived from the geometry, never typed in.
import { bufferAreaHa, polylineLengthKm } from '../../lib/programme/geo'

const DEMO_SOURCE = 'Demo geometry, digitised for the prototype and not surveyed'

const SEGMENTS = [
  {
    id: 'seg-01',
    label: 'SEG-01 · Kiptunga north',
    zone: 'South West Mau',
    widthM: 100,
    tenure: 'ntzdc_buffer',
    landUse: 'tea',
    geometry: [[-0.57, 35.5], [-0.572, 35.515], [-0.575, 35.53]],
  },
  {
    id: 'seg-02',
    label: 'SEG-02 · Kiptunga east',
    zone: 'South West Mau',
    widthM: 100,
    tenure: 'ntzdc_buffer',
    landUse: 'gap',
    geometry: [[-0.575, 35.53], [-0.58, 35.545], [-0.586, 35.558]],
  },
  {
    id: 'seg-03',
    label: 'SEG-03 · Nessuit spur',
    zone: 'South West Mau',
    widthM: 100,
    tenure: 'ntzdc_buffer',
    landUse: 'fuelwood',
    geometry: [[-0.586, 35.558], [-0.595, 35.57], [-0.604, 35.58]],
  },
  {
    id: 'seg-04',
    label: 'SEG-04 · Kilombe ridge west',
    zone: 'South West Mau',
    widthM: 100,
    tenure: 'ntzdc_buffer',
    landUse: 'indigenous',
    geometry: [[-0.64, 35.49], [-0.648, 35.5], [-0.655, 35.512]],
  },
  {
    id: 'seg-05',
    label: 'SEG-05 · Kilombe ridge south',
    zone: 'South West Mau',
    widthM: 100,
    tenure: 'ntzdc_buffer',
    landUse: 'mixed',
    geometry: [[-0.655, 35.512], [-0.662, 35.525], [-0.668, 35.538]],
  },
  {
    id: 'seg-06',
    label: 'SEG-06 · Block C community edge',
    zone: 'South West Mau',
    widthM: 100,
    tenure: 'community_land',
    landUse: 'fuelwood',
    geometry: [[-0.69, 35.54], [-0.695, 35.552], [-0.7, 35.565]],
  },
]

/** @type {Array<import('../../lib/contracts/programme').BufferSegment & { areaHa: number }>} */
export const BUFFER_SEGMENTS = SEGMENTS.map((segment) => {
  const lengthKm = polylineLengthKm(segment.geometry)
  return {
    ...segment,
    lengthKm,
    areaHa: bufferAreaHa(lengthKm, segment.widthM),
    source: DEMO_SOURCE,
    accuracyM: 50,
  }
})

export const TENURE_LABELS = {
  ntzdc_buffer: 'NTZDC buffer (inside the gazetted reserve)',
  community_land: 'Community land adjacent',
  gazetted_forest: 'Gazetted forest',
}

export const LAND_USE_LABELS = {
  tea: 'Tea',
  fuelwood: 'Fuelwood',
  indigenous: 'Indigenous trees',
  gap: 'Gap, not yet planted',
  mixed: 'Mixed',
}

export function getSegment(id) {
  return BUFFER_SEGMENTS.find((segment) => segment.id === id) ?? null
}
