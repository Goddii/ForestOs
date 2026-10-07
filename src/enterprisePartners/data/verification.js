/** Illustrative ForestOS reference tokens for the investor prototype only. */

export const DEMO_FOREST_REF = 'FOS-7K4M-29Q'
export const PENDING_FOREST_REF = 'FOS-PEND-01X'

/**
 * @returns {{ status: 'verified' | 'pending' | 'unverified', forestRef: string, batchId?: string }}
 */
export function resolveForestRef(rawRef) {
  const forestRef = (rawRef ?? '').trim().toUpperCase()
  if (!forestRef) {
    return { status: 'unverified', forestRef: '' }
  }
  if (forestRef === DEMO_FOREST_REF) {
    return { status: 'verified', forestRef, batchId: '921' }
  }
  if (forestRef === PENDING_FOREST_REF || forestRef.startsWith('FOS-PEND')) {
    return { status: 'pending', forestRef }
  }
  return { status: 'unverified', forestRef }
}
