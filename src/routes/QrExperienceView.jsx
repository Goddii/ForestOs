import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { resolveExperience } from '../qrExperience/data'
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
import { useThemeFonts } from '../hooks/useThemeFonts'

const SCREEN_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
}

/**
 * The QR → Experience batch — an isolated, additive prototype living at
 * `/qr-experience`. It demonstrates the client's reframed product: a brand
 * or community (here, Nyashinski's "Majani Passport") owns the consumer
 * experience, ForestOS is the trust/verification/participation layer
 * underneath it, surfaced only where it matters (the Verify screen's
 * "Powered by ForestOS" line, and the Proof screen's bridge to the real
 * `/batch/:batchId` GIS record).
 *
 * This does not touch `/`, `/batch/:batchId`, `/passport/:tenantSlug/:batchId`
 * or any dashboard route — see `src/App.jsx` for the one added `<Route>`.
 *
 * Unlike the public site's long-scroll pages, this is a state machine: one
 * screen visible at a time (`useExperienceFlow`), matching the brief's "QR
 * code entry app" feel rather than a scrollytelling page.
 */
export default function QrExperienceView() {
  const { experienceId } = useParams()
  const experience = useMemo(() => resolveExperience(experienceId), [experienceId])
  const batch = useMemo(() => experience.getBatch(), [experience])
  const { stage, passport, advance, completeParticipation, scanAnother } = useExperienceFlow(batch.id)
  const reduced = usePrefersReducedMotion()

  useThemeFonts(experience.theme)

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
      <VerifyScreen copy={experience.copy} brand={experience.brand} batch={batch} onContinue={advance} />
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
        passport={passport}
        totalStamps={experience.collection.totalStamps}
        onContinue={advance}
      />
    ),
    passport: (
      <PassportScreen
        copy={experience.copy}
        passport={passport}
        belongCta={experience.belongCta}
        collection={experience.collection}
        onScanAnother={scanAnother}
      />
    ),
  }

  return (
    <div className={`${experience.theme} min-h-dvh`}>
      <ExperienceProgress stage={stage} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage}
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
