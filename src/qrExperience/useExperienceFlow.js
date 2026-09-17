import { useCallback, useMemo, useState } from 'react'
import {
  loadPassport,
  passportStats,
  recordScan,
  resetPassport,
  savePassport,
  storageAvailable,
} from '../lib/visitorPassport'

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
 * The journey's state machine for one experience.
 *
 * The passport is no longer session-only. It loads from `visitorPassport`
 * (which survives a reload and spans every tenant), so a returning scanner
 * arrives with the collection and status they already built — Edwin's
 * "every scan should progressively build something around that person".
 *
 * `startAt` lets the view drop a returning visitor straight into `verify`:
 * they have already scanned a code to get here, so replaying the scan
 * simulation on the second pack would be theatre.
 */
export function useExperienceFlow({ experienceId, batch, startAt = 'scan', onScanAnother }) {
  const [stageIndex, setStageIndex] = useState(() => Math.max(STAGES.indexOf(startAt), 0))
  const [passport, setPassport] = useState(loadPassport)
  // Whether the pack just recorded was new to this passport, so Earn can say
  // "added to your collection" or "you've scanned this one before" honestly.
  const [lastScanWasNew, setLastScanWasNew] = useState(null)

  // Re-enter at `startAt` whenever the experience changes — a "scan another"
  // walk to a different community changes the id without remounting. Adjusted
  // during render (React's documented pattern for resetting state on a prop
  // change) rather than in an effect, which would render twice.
  const entryKey = `${experienceId}:${startAt}`
  const [prevEntryKey, setPrevEntryKey] = useState(entryKey)
  if (entryKey !== prevEntryKey) {
    setPrevEntryKey(entryKey)
    setStageIndex(Math.max(STAGES.indexOf(startAt), 0))
    setLastScanWasNew(null)
  }

  const stage = STAGES[stageIndex]
  const stats = useMemo(() => passportStats(passport), [passport])
  const durable = useMemo(() => storageAvailable(), [])

  const advance = useCallback(() => {
    setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
  }, [])

  const completeParticipation = useCallback(() => {
    setPassport((current) => {
      const { passport: next, isNew } = recordScan(current, {
        batchId: batch.id,
        tenantSlug: experienceId,
        brand: batch.brand ?? null,
        product: batch.product ?? null,
      })
      setLastScanWasNew(isNew)
      return savePassport(next)
    })
    setStageIndex((i) => Math.min(i + 1, STAGES.length - 1))
  }, [batch.id, batch.brand, batch.product, experienceId])

  // Walk to the next community's pack. The passport is untouched — that is the
  // whole point, it carries across.
  const scanAnother = useCallback(() => {
    onScanAnother?.()
  }, [onScanAnother])

  const startOver = useCallback(() => {
    setPassport(resetPassport())
    setLastScanWasNew(null)
    setStageIndex(0)
  }, [])

  return {
    stage,
    stageIndex,
    passport,
    stats,
    durable,
    lastScanWasNew,
    advance,
    completeParticipation,
    scanAnother,
    startOver,
  }
}
