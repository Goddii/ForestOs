// Tiny hand-rolled value noise — no external noise dependency, keeps the
// diorama's terrain/ridge generation self-contained and bundle-light.

export function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
  return s - Math.floor(s)
}

function fade(t) {
  return t * t * (3 - 2 * t)
}

export function valueNoise2D(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = fade(xf)
  const v = fade(yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  const ab = a + (b - a) * u
  const cd = c + (d - c) * u
  return ab + (cd - ab) * v
}

/** Fractal Brownian motion — layered value noise, normalised to 0..1. */
export function fbm2D(x, y, octaves = 4) {
  let total = 0
  let amplitude = 0.5
  let frequency = 1
  let max = 0
  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise2D(x * frequency, y * frequency) * amplitude
    max += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return total / max
}

/** Deterministic PRNG so instance scatter is stable across renders/SSR. */
export function mulberry32(seed) {
  let state = seed
  return function next() {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
