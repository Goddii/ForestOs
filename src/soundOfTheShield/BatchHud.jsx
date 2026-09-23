import { motion } from 'framer-motion'
import {
  imgClock,
  imgHudBgImage,
  imgHudRingInnerGlow,
  imgHudSegment1,
  imgHudSegment2,
  imgLeaf,
  imgTrees,
} from './assets'

/** Batch telemetry: section intro, rotating HUD ring, and the two metric cards. */
export default function BatchHud() {
  return (
    <div
      className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full"
      data-node-id="2:16"
      data-name="hero-section"
    >
      <div
        className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-center leading-[normal] not-italic relative shrink-0 text-center w-full"
        data-node-id="2:17"
        data-name="section-intro"
      >
        <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#00ff9d] text-[11px] tracking-[0.0165px] uppercase w-full">
          FOREST_OS CLIMATE TELEMETRY
        </p>
        <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[28px] text-white tracking-[-0.0084px] w-full">
          Sound of the Shield
        </p>
      </div>

      <motion.div
        className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[240px]"
        data-node-id="2:20"
        data-name="hud-ring-container"
        initial={{ rotate: 0, scaleX: 0.95, scaleY: 0.95 }}
        animate={{ rotate: [0, 360], scaleX: [0.95, 1.02, 0.95, 1], scaleY: [0.95, 1.02, 0.95, 1] }}
        transition={{
          rotate: { duration: 4, times: [0, 1], ease: 'linear', repeat: Infinity },
          scaleX: { duration: 4, times: [0, 0.375, 0.75, 1], ease: 'easeInOut', repeat: Infinity },
          scaleY: { duration: 4, times: [0, 0.375, 0.75, 1], ease: 'easeInOut', repeat: Infinity },
        }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 opacity-30 rounded-[100px] size-[200px] top-1/2"
          data-node-id="2:21"
          data-name="hud-bg-image"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        >
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[100px]">
            <img alt="" className="absolute max-w-none object-cover rounded-[100px] size-full" src={imgHudBgImage} />
            <div className="absolute bg-[rgba(7,10,8,0.6)] inset-0 rounded-[100px]" />
          </div>
        </motion.div>
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[220px] top-1/2"
          data-node-id="2:22"
          data-name="hud-ring-inner-glow"
        >
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHudRingInnerGlow} />
        </div>
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[240px] top-1/2"
          data-node-id="2:23"
          data-name="hud-segment-1"
        >
          <div className="absolute inset-[0.52%_-2.5%_-2.5%_30.4%]">
            <img alt="" className="block max-w-none size-full" src={imgHudSegment1} />
          </div>
        </div>
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[240px] top-1/2"
          data-node-id="2:24"
          data-name="hud-segment-2"
        >
          <div className="absolute bottom-1/4 left-0 right-[58.34%] top-[0.76%]">
            <img alt="" className="block max-w-none size-full" src={imgHudSegment2} />
          </div>
        </div>
        <motion.div
          className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[180px]"
          data-node-id="2:25"
          data-name="hud-center-text"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        >
          <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[#00ff9d] text-[11px] text-center tracking-[0.0088px] uppercase w-[min-content]">
            BATCH NYA-2026-8042
          </p>
          <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[15px] text-center text-white tracking-[-0.003px] w-[min-content]">
            Aberdare Buffer Zone
          </p>
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="2:28" data-name="harvest-row">
            <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[12px]" data-node-id="2:29" data-name="icon-clock">
              <div className="relative shrink-0 size-[12px]" data-node-id="2:89" data-name="clock">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgClock} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[11px] whitespace-nowrap">
              Harvested 06:15 AM
            </p>
          </div>
        </motion.div>
      </motion.div>

      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-node-id="2:32" data-name="metrics-grid">
        <div
          className="backdrop-blur-[8px] bg-[rgba(18,26,21,0.4)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[16px]"
          data-node-id="2:33"
          data-name="metric-card-left"
        >
          <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="2:34" data-name="metric-header-left">
            <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-node-id="2:35" data-name="icon-trees">
              <div className="relative shrink-0 size-[16px]" data-node-id="2:92" data-name="trees">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTrees} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[11px] tracking-[0.0022px] whitespace-nowrap">
              SHIELDED ZONE
            </p>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] min-w-full not-italic relative shrink-0 text-[18px] text-white w-[min-content]">
            4.2 m²
          </p>
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#8e9f95] text-[11px] w-[min-content]">
            Indigenous forest protected under project covenant.
          </p>
        </div>
        <div
          className="backdrop-blur-[8px] bg-[rgba(18,26,21,0.4)] border border-[rgba(255,255,255,0.1)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[16px]"
          data-node-id="2:40"
          data-name="metric-card-right"
        >
          <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="2:41" data-name="metric-header-right">
            <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-node-id="2:42" data-name="icon-leaf">
              <div className="relative shrink-0 size-[16px]" data-node-id="2:86" data-name="leaf">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLeaf} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[11px] tracking-[0.0022px] whitespace-nowrap">
              CO₂ SEQUESTERED
            </p>
          </div>
          <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] min-w-full not-italic relative shrink-0 text-[18px] text-white w-[min-content]">
            1.8 kg
          </p>
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#8e9f95] text-[11px] w-[min-content]">
            Real-time offset synced with ForestOS chain.
          </p>
        </div>
      </div>
    </div>
  )
}
