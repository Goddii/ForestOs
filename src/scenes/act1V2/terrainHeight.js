import { fbm2D } from './noise'

const HEIGHT_SCALE = 9
const HEIGHT_BASE = -7
const NOISE_FREQUENCY = 0.045

/** Shared ground-height sample so trees and tea rows sit on the same terrain. */
export function terrainHeightAt(x, z) {
  return fbm2D(x * NOISE_FREQUENCY, z * NOISE_FREQUENCY, 4) * HEIGHT_SCALE + HEIGHT_BASE
}
