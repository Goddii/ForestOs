import { useCallback, useMemo, useState } from 'react'
import {
  loadPassport,
  passportStats,
  recordScan,
  savePassport,
  storageAvailable,
} from '../../lib/visitorPassport'
import { CANOPY_TIERS, XP_AWARDS } from '../data/game'

/** Stable empty array so a stampless passport keeps its memo dependencies. */
const NO_STAMPS = []

/**
 * The adopted plot's own key. It deliberately lives outside the passport and
 * outside the session reset: plot adoption is the return hook (brief 5.6), so
 * it has to survive a brand switch, a new QR and a reload.
 */
const ADOPTED_PLOT_KEY = 'forestos.enterprise.adopted-plot.v1'

function loadAdoptedPlotId() {
  try {
    return window.localStorage.getItem(ADOPTED_PLOT_KEY) || null
  } catch {
    return null
  }
}

function saveAdoptedPlotId(plotId) {
  try {
    if (plotId) window.localStorage.setItem(ADOPTED_PLOT_KEY, plotId)
    else window.localStorage.removeItem(ADOPTED_PLOT_KEY)
  } catch {
    // Private windows and blocked storage: the journey still renders, the
    // adoption is simply session-only, which the UI already says.
  }
  return plotId || null
}
import {
  applicableQuestEntries,
  hasBothBrandStamps,
  hasOtherBrandStamp,
  nextBestAction,
  selectSessionQuests,
  tierProgress,
  totalCanopyXp,
} from '../lib/game'

/**
 * Gamified mission ladder — one mission unlocks per stage advance.
 *
 * The `play` stage is Claim vs Fact (brief 5.3), placed after the impact or
 * conservation beat and before the reward, in both brands.
 */
export const ENTERPRISE_STAGES = {
  safaricom: [
    'scan',
    'verify',
    'impact',
    'canopy',
    'play',
    'bonga',
    'share',
    'passport',
  ],
  'java-house': [
    'scan',
    'verify',
    'trace',
    'conservation',
    'canopy',
    'play',
    'bonga',
    'passport',
  ],
}

export const STAGE_XP = {
  scan: 10,
  verify: 25,
  impact: 20,
  trace: 20,
  conservation: 25,
  canopy: 30,
  play: XP_AWARDS.miniGame,
  bonga: 15,
  share: 20,
  passport: 40,
}

const ENTERPRISE_TIERS = CANOPY_TIERS

/** Flow context the quests read. Mirrors the keys declared in `data/game.js`. */
const EMPTY_QUEST_CTX = {
  beatsOpened: 0,
  canopyExplored: false,
  plotsVerified: 0,
  pledgeDone: false,
}

export function useEnterpriseFlow({
  brandId,
  brandSlug,
  batch,
  startAt = 'scan',
  forestRef,
  verificationStatus,
}) {
  const stages = ENTERPRISE_STAGES[brandId] ?? ENTERPRISE_STAGES.safaricom
  const [stageIndex, setStageIndex] = useState(() =>
    Math.max(stages.indexOf(startAt), 0),
  )
  const [passport, setPassport] = useState(loadPassport)
  const [trailXp, setTrailXp] = useState(0)
  const [missionsDone, setMissionsDone] = useState([])
  const [questCtx, setQuestCtx] = useState(EMPTY_QUEST_CTX)
  const [tierUp, setTierUp] = useState(null)
  const [adoptedPlotId, setAdoptedPlotId] = useState(loadAdoptedPlotId)

  const entryKey = `${brandId}:${startAt}:${forestRef}:${verificationStatus}`
  const [prevEntryKey, setPrevEntryKey] = useState(entryKey)
  if (entryKey !== prevEntryKey) {
    // A different brand, reference or verification outcome is a new session:
    // reset the stage, the trail XP and this session's quest context. The
    // passport deliberately survives — that is what "progressively builds"
    // means (brief 4).
    setPrevEntryKey(entryKey)
    setStageIndex(Math.max(stages.indexOf(startAt), 0))
    setTrailXp(0)
    setMissionsDone([])
    setQuestCtx(EMPTY_QUEST_CTX)
    setTierUp(null)
  }

  const stage = stages[stageIndex] ?? stages[0]
  const stats = useMemo(
    () => passportStats(passport, ENTERPRISE_TIERS),
    [passport],
  )
  const durable = useMemo(() => storageAvailable(), [])

  const stamps = passport.stamps ?? NO_STAMPS

  // One view for the drawer (capped), one for the economy (uncapped). The
  // three-quest cap limits attention, not what a completed quest pays.
  const questEntries = useMemo(
    () =>
      selectSessionQuests({
        brandId,
        ctx: { ...questCtx, bothBrands: hasBothBrandStamps(stamps) },
        hasOtherBrandStamp: hasOtherBrandStamp(stamps, brandId),
        limit: 3,
      }),
    [brandId, questCtx, stamps],
  )

  const earnedQuests = useMemo(
    () =>
      applicableQuestEntries({
        brandId,
        ctx: { ...questCtx, bothBrands: hasBothBrandStamps(stamps) },
        hasOtherBrandStamp: hasOtherBrandStamp(stamps, brandId),
      }),
    [brandId, questCtx, stamps],
  )

  const xp = useMemo(
    () => totalCanopyXp({ trailXp, quests: earnedQuests, stamps }),
    [trailXp, earnedQuests, stamps],
  )

  const progress = useMemo(() => tierProgress(xp), [xp])

  // Announce a tier-up exactly once per crossing, never on first mount. Same
  // "adjust state while rendering" shape as the entry-key reset above, which
  // keeps it out of the render output and off the effect chain.
  const [prevTierId, setPrevTierId] = useState(progress.tier.id)
  if (prevTierId !== progress.tier.id) {
    const was = ENTERPRISE_TIERS.findIndex((t) => t.id === prevTierId)
    const now = ENTERPRISE_TIERS.findIndex((t) => t.id === progress.tier.id)
    setPrevTierId(progress.tier.id)
    if (now > was) setTierUp(progress.tier)
  }

  const missionProgress = useMemo(() => {
    const total = stages.length
    const current = stageIndex + 1
    return { current, total, pct: Math.round((current / total) * 100) }
  }, [stageIndex, stages.length])

  /** Record a quest-relevant action. Additive for counts, sticky for flags. */
  const recordQuestEvent = useCallback((patch) => {
    setQuestCtx((ctx) => ({
      beatsOpened: Math.max(ctx.beatsOpened, patch.beatsOpened ?? 0),
      plotsVerified: Math.max(ctx.plotsVerified, patch.plotsVerified ?? 0),
      canopyExplored: ctx.canopyExplored || Boolean(patch.canopyExplored),
      pledgeDone: ctx.pledgeDone || Boolean(patch.pledgeDone),
    }))
  }, [])

  const advance = useCallback(() => {
    setStageIndex((i) => {
      const next = Math.min(i + 1, stages.length - 1)
      const prevStage = stages[i]
      // Award the stage's trail XP once, on the way out of it.
      if (prevStage && !missionsDone.includes(prevStage)) {
        setMissionsDone((m) => [...m, prevStage])
        setTrailXp((x) => x + (STAGE_XP[prevStage] ?? 10))
      }
      const nextStage = stages[next]
      if (nextStage === 'passport' && verificationStatus === 'verified') {
        setPassport((current) => {
          const { passport: nextPassport } = recordScan(current, {
            batchId: batch.id,
            tenantSlug: brandSlug,
            brand: brandId,
            product: batch.product,
          })
          return savePassport(nextPassport)
        })
      }
      return next
    })
  }, [
    batch.id,
    batch.product,
    brandId,
    brandSlug,
    missionsDone,
    stages,
    verificationStatus,
  ])

  const jumpTo = useCallback(
    (targetStage) => {
      const idx = stages.indexOf(targetStage)
      if (idx >= 0) setStageIndex(idx)
    },
    [stages],
  )

  const dismissTierUp = useCallback(() => setTierUp(null), [])

  /** Adopt a plot — persisted, and never cleared by a session reset. */
  const adoptPlot = useCallback((plotId) => {
    setAdoptedPlotId(saveAdoptedPlotId(plotId))
  }, [])

  return {
    stages,
    stage,
    stageIndex,
    passport,
    stats,
    tiers: ENTERPRISE_TIERS,
    durable,
    xp,
    trailXp,
    missionsDone,
    quests: questEntries,
    nextAction: nextBestAction(questEntries),
    tier: progress.tier,
    nextTier: progress.nextTier,
    toNextTier: progress.toNext,
    tierPct: progress.pct,
    tierUp,
    dismissTierUp,
    adoptedPlotId,
    adoptPlot,
    missionProgress,
    recordQuestEvent,
    advance,
    jumpTo,
  }
}
