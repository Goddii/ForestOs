import { AnimatePresence, motion } from 'framer-motion'
import { imgPassDivider, imgUserAvatar } from '../assets'
import { BottomAction, ChapterIndicator, FOCUS_RING, Reveal, Screen, SectionTitle, STAGGER, StatusBar, useLoopsEnabled } from '../chrome'
import { Burst, PRESS, SwapLabel, TiltCard, useBurst } from '../fx'
import { BorderBeam, DecryptedText, StarBorder } from '../fxLibrary'
import WhatsAppCommunityLink from '../../components/community/WhatsAppCommunityLink'
import { DEMO_FAN_ID, STARTING_AUDIO_BADGES } from '../data'

const pad = (count) => String(count).padStart(2, '0')

/** Number that springs up/down when it changes (odometer-style flip). */
function FlipCount({ value, unit, className }) {
  return (
    <span className={`inline-flex items-baseline gap-[5px] ${className}`}>
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="inline-block tabular-nums"
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </span>
      {unit}
    </span>
  )
}

function PulsingAvatar() {
  const isEnabled = useLoopsEnabled()
  return (
    <motion.img
      alt=""
      className="block shrink-0 size-[56px] rounded-full"
      src={imgUserAvatar}
      width="56"
      height="56"
      animate={isEnabled ? { boxShadow: ['0 0 0 0 rgba(0,255,135,0.35)', '0 0 0 8px rgba(0,255,135,0)'] } : { boxShadow: '0 0 0 0 rgba(0,255,135,0)' }}
      transition={isEnabled ? { duration: 2.2, repeat: Infinity } : { duration: 0.2 }}
    />
  )
}

/** CH. 07 — Figma "community-loop" (node 3:243): the fan's member passport, fed by the CH. 05 pledge. */
export default function CommunityLoop({ seedsSown, hasJoined, onJoin }) {
  const [burstKey, fireBurst] = useBurst()
  const handleJoin = () => {
    if (hasJoined) return
    fireBurst()
    onJoin()
  }

  return (
    <Screen name="community-loop">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={7} />
        <SectionTitle eyebrow="THE FUTURE LOOP" lead="COMMUNITY" accent="PASSPORT" />
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col gap-[20px] items-start px-[24px] relative shrink-0 w-full" data-name="passport-panel">
        <TiltCard className="rounded-[20px]">
          <div className="relative bg-[#0c1f17] border border-[#00ff87] border-solid drop-shadow-[0px_4px_12px_rgba(0,255,135,0.2)] flex flex-col gap-[20px] items-start p-[24px] rounded-[20px] w-full" data-name="pass-card">
            <div className="flex items-center justify-between w-full">
              <p className="font-['Syne'] font-extrabold leading-[normal] text-[16px] text-white whitespace-nowrap">FOREST OS</p>
              <div className="bg-[#00ff87] flex items-start px-[8px] py-[4px] rounded-[4px]">
                <p className="font-['Geist'] font-extrabold leading-[normal] text-[#040d07] text-[9px] whitespace-nowrap">
                  <SwapLabel id={String(hasJoined)}>{hasJoined ? 'COLLECTIVE ✓' : 'MEMBER PASS'}</SwapLabel>
                </p>
              </div>
            </div>
            <div className="flex gap-[16px] items-center w-full">
              <PulsingAvatar />
              <div className="[word-break:break-word] flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px">
                <p className="font-['Syne'] font-bold text-[18px] text-white w-full">
                  <DecryptedText text={DEMO_FAN_ID} speed={55} />
                </p>
                <p className="font-['Geist'] font-normal text-[#8a9f96] text-[12px] whitespace-nowrap">Level 2 Forest Guardian • Rift Valley</p>
              </div>
            </div>
            <div className="h-0 relative w-full" aria-hidden>
              <div className="absolute inset-[-1px_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgPassDivider} />
              </div>
            </div>
            <div className="flex items-start justify-between leading-[normal] w-full whitespace-nowrap">
              <div className="flex flex-col gap-[4px] items-start">
                <p className="font-['Geist'] font-normal text-[#8a9f96] text-[11px]">TREES SOWN</p>
                <p className="font-['Syne'] font-bold text-[#00ff87] text-[18px]" aria-live="polite">
                  <FlipCount value={seedsSown} unit={seedsSown === 1 ? 'Seed' : 'Seeds'} />
                </p>
              </div>
              <div className="flex flex-col gap-[4px] items-start">
                <p className="font-['Geist'] font-normal text-[#8a9f96] text-[11px]">AUDIO BADGES</p>
                <p className="font-['Syne'] font-bold text-[#e2a743] text-[18px]">
                  {pad(STARTING_AUDIO_BADGES)} Badge
                </p>
              </div>
            </div>
            <BorderBeam size={110} duration={8} />
          </div>
        </TiltCard>

        <div className="flex flex-col gap-[12px] items-start w-full" data-name="join-community-flow">
          <p className="font-['Geist'] font-normal leading-[1.5] text-[#8a9f96] text-[14px] w-full">
            Connect with millions of fans worldwide backing the reforestation movement. Get early access to future campaigns, vinyl drop priorities, and voting power on targeted ForestOS reserves.
          </p>
          <StarBorder className="w-full rounded-[12px]">
            <motion.button
              type="button"
              onClick={handleJoin}
              aria-pressed={hasJoined}
              {...(hasJoined ? {} : PRESS)}
              className={`relative bg-[#e2a743] flex items-center justify-center px-[24px] py-[16px] rounded-[12px] w-full transition-[filter] hover:brightness-110 ${FOCUS_RING}`}
              data-name="join-button"
            >
              <Burst burstKey={burstKey} color="#fff3d6" />
              <span className="font-['Geist'] font-bold leading-[normal] text-[#040d07] text-[16px] whitespace-nowrap" aria-live="polite">
                <SwapLabel id={String(hasJoined)}>{hasJoined ? 'WELCOME TO THE COLLECTIVE ✓' : 'JOIN THE ANTHEM COLLECTIVE'}</SwapLabel>
              </span>
            </motion.button>
          </StarBorder>
          <WhatsAppCommunityLink groupName="Anthem Collective" memberCount="12.8K" fontClass="font-['Geist']" />
        </div>
      </Reveal>

      <BottomAction label="ForestOS verified eco-ecosystem" labelClassName="font-semibold text-[11px] uppercase" />
    </Screen>
  )
}
