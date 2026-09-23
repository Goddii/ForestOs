import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { imgLeaf20 } from '../assets'
import { Burst, PRESS, SwapLabel, useBurst } from '../fx'
import { BorderBeam } from '../fxLibrary'
import { BottomAction, ChapterIndicator, FOCUS_RING, Reveal, Screen, SectionTitle, STAGGER, StatusBar, useLoopsEnabled } from '../chrome'

function SwayingLeaf() {
  const isEnabled = useLoopsEnabled()
  return (
    <motion.img
      alt=""
      className="block size-[20px]"
      src={imgLeaf20}
      animate={isEnabled ? { rotate: [0, -10, 0, 8, 0] } : { rotate: 0 }}
      transition={isEnabled ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 } : { duration: 0.2 }}
    />
  )
}

/**
 * CH. 05 — Figma "participate" (node 3:132). "Plant a seed" is a demo
 * pledge (payments are the backend team's) that adds a seed to the
 * CH. 07 passport; the event schedule expands in place.
 */
export default function Participate({ onNext, hasPledged, onPledge }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [burstKey, fireBurst] = useBurst()

  const handlePledge = () => {
    fireBurst()
    onPledge()
  }

  return (
    <Screen name="participate">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={5} />
        <SectionTitle eyebrow="ACTIVATION" lead="CLAIM YOUR" accent="ANCESTRY" />
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col gap-[16px] items-start px-[24px] relative shrink-0 w-full" data-name="actions-list">
        <div className="relative bg-[#0c1f17] border-[#00ff87] border-[1.5px] border-solid drop-shadow-[0px_4px_12px_rgba(0,255,135,0.2)] flex flex-col gap-[12px] items-start p-[20px] rounded-[16px] shrink-0 w-full" data-name="action-card-1">
          <div className="flex items-center justify-between w-full">
            <p className="font-['Geist'] font-bold leading-[normal] text-[#00ff87] text-[11px] whitespace-nowrap">POPULAR RITUAL</p>
            <SwayingLeaf />
          </div>
          <h3 className="font-['Syne'] font-bold leading-[normal] text-[20px] text-white w-full">Plant a Live Sentinel</h3>
          <p className="font-['Geist'] font-normal leading-[1.5] text-[#8a9f96] text-[13px] w-full">
            Fund the planting of a verified indigenous tree. Receive telemetry coordinates and Nyashinski&apos;s exclusive live voice message.
          </p>
          <motion.button
            type="button"
            onClick={handlePledge}
            disabled={hasPledged}
            {...(hasPledged ? {} : PRESS)}
            className={`relative bg-[#00ff87] flex items-center justify-center px-[20px] py-[12px] rounded-[8px] w-full transition-[filter] duration-150 enabled:hover:brightness-110 disabled:cursor-default ${FOCUS_RING}`}
          >
            <Burst burstKey={burstKey} />
            <span className="font-['Geist'] font-bold leading-[normal] text-[#040d07] text-[14px] whitespace-nowrap" aria-live="polite">
              <SwapLabel id={hasPledged ? 'done' : 'idle'}>{hasPledged ? 'SEED PLEDGED ✓ — ADDED TO PASSPORT' : 'PLANT A SEED — $10'}</SwapLabel>
            </span>
          </motion.button>
          <BorderBeam duration={6} />
        </div>

        <div className="bg-[#0a1812] border border-[rgba(255,255,255,0.08)] border-solid flex flex-col gap-[12px] items-start p-[20px] rounded-[16px] shrink-0 w-full" data-name="action-card-2">
          <h3 className="font-['Syne'] font-bold leading-[normal] text-[18px] text-white w-full">Join localized planting events</h3>
          <p className="font-['Geist'] font-normal leading-[1.5] text-[#8a9f96] text-[13px] w-full">
            Connect with local conservation networks in the Rift Valley and surrounding Nairobi watersheds.
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsScheduleOpen((current) => !current)}
            aria-expanded={isScheduleOpen}
            aria-controls="la-event-schedule"
            className={`border border-[#8a9f96] border-solid flex items-center justify-center px-[20px] py-[12px] rounded-[8px] w-full transition-colors duration-200 hover:border-white hover:bg-white/5 ${FOCUS_RING}`}
          >
            <span className="font-['Geist'] font-semibold leading-[normal] text-[14px] text-white whitespace-nowrap">
              <SwapLabel id={String(isScheduleOpen)}>{isScheduleOpen ? 'HIDE EVENT SCHEDULE' : 'VIEW EVENT SCHEDULE'}</SwapLabel>
            </span>
          </motion.button>
          <AnimatePresence initial={false}>
            {isScheduleOpen && (
              <motion.p
                id="la-event-schedule"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="font-['Geist'] font-normal leading-[1.5] overflow-hidden text-[#8a9f96] text-[12px] w-full"
              >
                Planting dates are being confirmed with Rift Valley conservation partners. Your member pass will be notified the moment the first event opens.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      <BottomAction label="HEAR THE HARMONY" onNext={onNext} />
    </Screen>
  )
}
