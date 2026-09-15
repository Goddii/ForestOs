import { useCallback, useState } from 'react'
import { createPassport, addStamp } from './data'

// The six client-specified states, in order. 'proof' is a sub-step of
// Discover (the "now see the proof" bridge to ForestOS's own GIS/proof
// system) — it shares the DISCOVER position in the progress indicator.
export const STAGES = ['scan', 'verify', 'discover', 'proof', 'participate', 'earn', 'passport']

export const STAGE_LABELS = {
  scan: 'Scan',
  verify: 'Verify',
  discover: 'Discover',
  proof: 'Discover',
  participate: 'Participate',
  earn: 'Earn',
  passport: 'Belong',
}

/**
 * Session-local state machine for the QR → Experience batch. No backend: the
 * passport is held in memory for the visit and grows by one stamp per
 * completed Participate → Earn step. "Scan another" re-enters at `verify`
 * (skipping the scan-simulation screen on repeat) with the same demo batch —
 * a second purchase of the same verified run is the honest mock here, since
 * there is only one real Nyashinski batch record to verify against.
 */
export function useExperienceFlow(batchId) {
  const [stageIndex, setStageIndex] = useState(0)
  const [passport, setPassport] = useState(createPassport)

  const stage = STAGES[stageIndex]

  const advance = useCallback(() => {
    setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
  }, [])

  const completeParticipation = useCallback(() => {
    setPassport((p) => addStamp(p, batchId))
    setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
  }, [batchId])

  const scanAnother = useCallback(() => {
    setStageIndex(STAGES.indexOf('verify'))
  }, [])

  return { stage, stageIndex, passport, advance, completeParticipation, scanAnother }
}
