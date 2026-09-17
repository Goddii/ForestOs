import { useCallback, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { nextExperienceId, resolveExperience } from '../qrExperience/data'
import { useExperienceFlow, STAGES } from '../qrExperience/useExperienceFlow'
import ExperienceProgress from '../qrExperience/ExperienceProgress'
import ScanEntry from '../qrExperience/screens/ScanEntry'
import VerifyScreen from '../qrExperience/screens/VerifyScreen'
import DiscoverScreen from '../qrExperience/screens/DiscoverScreen'
import ProofPreviewScreen from '../qrExperience/screens/ProofPreviewScreen'
import ParticipateScreen from '../qrExperience/screens/ParticipateScreen'
import EarnScreen from '../qrExperience/screens/EarnScreen'
import PassportScreen from '../qrExperience/screens/PassportScreen'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const SCREEN_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
}

/**
 * The QR → Experience journey at `/qr-experience/:experienceId`. A brand or
 * community (Nyashinski's "Majani Passport", Kapsara Rangers' supporter card)
 * owns the front end; ForestOS is the trust/verification/participation layer
 * underneath, surfaced only where it matters (the Verify screen's "Powered by
 * ForestOS" line, and the Proof screen's bridge to the real `/batch/:batchId`
 * GIS record).
 *
 * Two things make repeat engagement real rather than implied:
 *
 * 1. The passport is durable (`lib/visitorPassport`) — it survives a reload
 *    and spans both communities, so a second scan adds to a collection and
 *    can move the holder up a status ladder.
 * 2. "Scan another" walks to a *different community's* real pack (`?scanned`
 *    marks the arrival so the scan simulation is skipped), which is what
 *    demonstrates that the experience is swappable and the record is not.
 *
 * This does not touch `/`, `/batch/:batchId`, `/passport/:tenantSlug/:batchId`
 * or any dashboard route.
 */
export default function QrExperienceView() {
  const { experienceId } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const experience = useMemo(() => resolveExperience(experienceId), [experienceId])
  const batch = useMemo(() => experience.getBatch(), [experience])
  const reduced = usePrefersReducedMotion()

  // Arriving via "Scan another" means a code was already scanned — go straight
  // to Verify instead of replaying the simulated scan.
  const startAt = params.has('scanned') ? 'verify' : 'scan'

  const handleScanAnother = useCallback(() => {
    navigate(`/qr-experience/${nextExperienceId(experience.id)}?scanned=1`)
  }, [experience.id, navigate])

  const {
    stage,
    passport,
    stats,
    durable,
    lastScanWasNew,
    advance,
    completeParticipation,
    scanAnother,
    startOver,
  } = useExperienceFlow({
    experienceId: experience.id,
    batch,
    startAt,
    onScanAnother: handleScanAnother,
  })

  useEffect(() => {
    document.title = `${experience.communityName} — ${STAGES.includes(stage) ? stage : 'scan'}`
    document.documentElement.classList.add(experience.theme)
    return () => document.documentElement.classList.remove(experience.theme)
  }, [experience, stage])

  const screens = {
    scan: (
      <ScanEntry copy={experience.copy} media={experience.media} onEnter={advance} />
    ),
    verify: (
      <VerifyScreen
        copy={experience.copy}
        communityName={experience.communityName}
        batch={batch}
        onContinue={advance}
      />
    ),
    discover: (
      <DiscoverScreen copy={experience.copy} batch={batch} media={experience.media} onContinue={advance} />
    ),
    proof: <ProofPreviewScreen copy={experience.copy} batch={batch} onContinue={advance} />,
    participate: (
      <ParticipateScreen copy={experience.copy} batch={batch} onTakePart={completeParticipation} />
    ),
    earn: (
      <EarnScreen
        copy={experience.copy}
        experience={experience}
        stats={stats}
        isNewScan={lastScanWasNew}
        onContinue={advance}
      />
    ),
    passport: (
      <PassportScreen
        copy={experience.copy}
        experience={experience}
        passport={passport}
        stats={stats}
        durable={durable}
        belongCta={experience.belongCta}
        collection={experience.collection}
        onScanAnother={scanAnother}
        onStartOver={startOver}
      />
    ),
  }

  return (
    <div className={`${experience.theme} min-h-dvh`}>
      <ExperienceProgress stage={stage} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${experience.id}-${stage}`}
          initial={reduced ? false : SCREEN_TRANSITION.initial}
          animate={SCREEN_TRANSITION.animate}
          exit={reduced ? undefined : SCREEN_TRANSITION.exit}
          transition={SCREEN_TRANSITION.transition}
        >
          {screens[stage]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
