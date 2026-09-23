import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { imgCompass, imgLeaf32 } from '../assets'
import { BottomAction, ChapterIndicator, Reveal, Screen, SectionTitle, STAGGER, StatusBar } from '../chrome'
import { BorderBeam } from '../fxLibrary'
import { DEMO_LIVE_CARBON_TONS, DEMO_LIVE_TREE_COUNT } from '../data'

const COUNT_UP_SECONDS = 1.8
const numberFormat = (decimals) => new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/** Counts from 0 to `target` once the stat scrolls into view. */
function LiveNumber({ target, decimals = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const prefersReducedMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return undefined
    if (prefersReducedMotion) {
      setValue(target)
      return undefined
    }
    const controls = animate(0, target, { duration: COUNT_UP_SECONDS, ease: [0.22, 1, 0.36, 1], onUpdate: setValue })
    return () => controls.stop()
  }, [isInView, prefersReducedMotion, target])

  return (
    <span ref={ref} className="tabular-nums">
      {numberFormat(decimals).format(value)}
    </span>
  )
}

function StatCard({ label, value, footnote, footnoteClassName, icon, isHighlighted }) {
  const frame = isHighlighted ? 'bg-[#0c1f17] border-[#00ff87]' : 'bg-[#0a1812] border-[rgba(255,255,255,0.08)]'
  return (
    <div className={`border border-solid flex gap-[16px] items-center p-[20px] relative rounded-[16px] shrink-0 w-full ${frame}`}>
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px">
        <p className="font-['Geist'] font-bold text-[#8a9f96] text-[11px] uppercase whitespace-nowrap">{label}</p>
        <p className="font-['Syne'] font-extrabold text-[28px] text-white w-full">{value}</p>
        <p className={`font-['Geist'] font-normal text-[11px] whitespace-nowrap ${footnoteClassName}`}>{footnote}</p>
      </div>
      <motion.img
        alt=""
        className="block shrink-0 size-[32px]"
        src={icon}
        whileHover={{ rotate: isHighlighted ? -12 : 90, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      />
      {isHighlighted && <BorderBeam />}
    </div>
  )
}

/** CH. 04 — Figma "verified-impact" (node 3:94): live ForestOS telemetry. */
export default function VerifiedImpact({ onNext }) {
  return (
    <Screen name="verified-impact">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={4} />
        <SectionTitle eyebrow="TRUSTED TELEMETRY" lead="ForestOS" accent="ORACLE">
          <p className="font-['Geist'] font-normal leading-[normal] text-[#8a9f96] text-[14px] w-full">
            Real-time, cryptographically verified ecosystem impact. No speculation. Just truth.
          </p>
        </SectionTitle>
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col gap-[12px] items-start px-[24px] relative shrink-0 w-full" data-name="telemetry-dashboard">
        <StatCard
          isHighlighted
          label="VERIFIED TREES IN GROUND"
          value={<LiveNumber target={DEMO_LIVE_TREE_COUNT} />}
          footnote={<><span className="animate-pulse motion-reduce:animate-none">●</span> ForestOS telemetry active</>}
          footnoteClassName="text-[#00ff87]"
          icon={imgLeaf32}
        />
        <StatCard
          label="EST. CARBON CAPTURED (TONS)"
          value={<LiveNumber target={DEMO_LIVE_CARBON_TONS} decimals={1} />}
          footnote="Updated: Hourly"
          footnoteClassName="text-[#8a9f96]"
          icon={imgCompass}
        />
        <div className="bg-[#0a1812] border border-[rgba(255,255,255,0.08)] border-solid flex items-start p-[16px] rounded-[12px] shrink-0 w-full">
          <p className="flex-[1_0_0] font-['Geist'] font-normal leading-[1.5] min-w-px text-[#8a9f96] text-[12px]">
            <span className="font-bold text-[#00ff87]">Traceability Proof: </span>
            Every seedling is assigned a unique ForestOS cryptographic token, verified by decentralized ecological validators.
          </p>
        </div>
      </Reveal>

      <BottomAction label="JOIN THE RITUAL" onNext={onNext} />
    </Screen>
  )
}
