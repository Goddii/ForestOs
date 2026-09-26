import { motion } from 'framer-motion'
import { imgChevronDown, imgSplashBg, imgSplashGlow } from './assets'

/** Full-bleed splash: hero photo, gradient overlays, badge/title/subtitle, scroll cue. */
export default function SplashHero() {
  return (
    <div
      className="content-stretch flex flex-col h-[844px] items-center justify-center overflow-clip relative shrink-0 w-full"
      data-node-id="6:4"
      data-name="splash-hero"
    >
      <div className="absolute h-[844px] left-0 top-0 w-[390px]" data-node-id="6:5" data-name="splash-bg">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgSplashBg}
        />
      </div>
      <div
        className="absolute bg-gradient-to-b from-[rgba(7,8,8,0)] h-[444px] left-0 to-[#070a08] top-[400px] via-[#070a08] via-[70%] w-[390px]"
        data-node-id="6:6"
        data-name="splash-overlay-bottom"
      />
      <div
        className="absolute bg-gradient-to-b from-[rgba(7,10,8,0.8)] h-[200px] left-0 to-[rgba(7,8,8,0)] top-0 w-[390px]"
        data-node-id="6:7"
        data-name="splash-overlay-top"
      />
      <motion.div
        className="absolute h-[200px] left-1/2 top-[520px] w-[320px]"
        data-node-id="6:8"
        data-name="splash-glow"
        initial={{ opacity: 0.3, scaleX: 0.9, scaleY: 0.9 }}
        animate={{ opacity: [0.3, 0.8, 0.3, 0.6], scaleX: [0.9, 1.1, 0.9, 1], scaleY: [0.9, 1.1, 0.9, 1] }}
        transition={{
          opacity: { duration: 4, times: [0, 0.375, 0.75, 1], ease: 'easeInOut', repeat: Infinity },
          scaleX: { duration: 4, times: [0, 0.375, 0.75, 1], ease: [0.4, 0, 0.2, 1], repeat: Infinity },
          scaleY: { duration: 4, times: [0, 0.375, 0.75, 1], ease: [0.4, 0, 0.2, 1], repeat: Infinity },
        }}
      >
        <div className="absolute inset-[-20%_-12.5%]">
          <img alt="" className="block max-w-none size-full" src={imgSplashGlow} />
        </div>
      </motion.div>
      <div
        className="absolute content-stretch flex flex-col gap-[16px] items-center left-0 px-[24px] right-0 top-[560px]"
        data-node-id="6:9"
        data-name="splash-text-block"
      >
        <motion.div
          className="bg-[rgba(0,255,157,0.1)] border border-[rgba(0,255,157,0.4)] border-solid content-stretch flex items-start px-[12px] py-[5px] relative rounded-[100px] shrink-0"
          data-node-id="6:10"
          data-name="splash-badge"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: [0, 1, 1], y: [-15, 0, 0] }}
          transition={{
            opacity: { duration: 4, times: [0, 0.15, 1], ease: [[0.25, 0.1, 0.25, 1], 'linear'], repeat: Infinity },
            y: { duration: 4, times: [0, 0.15, 1], ease: [[0.25, 0.1, 0.25, 1], 'linear'], repeat: Infinity },
          }}
        >
          <p className="[word-break:break-word] font-['Inter'] font-bold leading-[normal] not-italic relative shrink-0 text-[#00ff9d] text-[10px] tracking-[0.012px] uppercase whitespace-nowrap">
            A NYASHINSKI × NYAYO TEA ZONES EXPERIENCE
          </p>
        </motion.div>
        <motion.p
          className="[word-break:break-word] font-['Inter'] font-black leading-[normal] min-w-full not-italic relative shrink-0 text-[30px] text-center text-white tracking-[-0.012px] w-[min-content]"
          data-node-id="6:12"
          data-name="splash-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: [0, 1, 1], y: [30, 0, 0] }}
          transition={{
            opacity: { duration: 4, times: [0, 0.2, 1], ease: [[0.4, 0, 0.2, 1], 'linear'], repeat: Infinity },
            y: { duration: 4, times: [0, 0.2, 1], ease: [[0.4, 0, 0.2, 1], 'linear'], repeat: Infinity },
          }}
        >
          THE SOUND OF THE SHIELD
        </motion.p>
        <motion.p
          className="[word-break:break-word] font-['Inter'] font-normal leading-[1.55] min-w-full not-italic relative shrink-0 text-[13px] text-[rgba(255,255,255,0.7)] text-center w-[min-content]"
          data-node-id="6:13"
          data-name="splash-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 0, 1, 1], y: [20, 20, 0, 0] }}
          transition={{
            opacity: { duration: 4, times: [0, 0.1, 0.3, 1], ease: ['linear', [0.4, 0, 0.2, 1], 'linear'], repeat: Infinity },
            y: { duration: 4, times: [0, 0.1, 0.3, 1], ease: ['linear', [0.4, 0, 0.2, 1], 'linear'], repeat: Infinity },
          }}
        >
          Where Music Meets Conservation
        </motion.p>
      </div>
      <motion.div
        className="absolute bottom-[24px] content-stretch flex flex-col gap-[6px] items-center left-1/2"
        data-node-id="6:14"
        data-name="scroll-indicator"
        initial={{ opacity: 0.5, y: 0 }}
        animate={{ opacity: [0.5, 1, 0.5, 1, 0.5, 0.7], y: [0, 8, 0, 8, 0, 6] }}
        transition={{
          opacity: { duration: 4, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut', repeat: Infinity },
          y: { duration: 4, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut', repeat: Infinity },
        }}
      >
        <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[normal] not-italic relative shrink-0 text-[9px] text-[rgba(255,255,255,0.4)] tracking-[0.0108px] uppercase whitespace-nowrap">
          SCROLL
        </p>
        <div
          className="bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[12px] shrink-0 size-[24px]"
          data-node-id="6:16"
          data-name="scroll-arrow"
        >
          <div className="relative shrink-0 size-[12px]" data-node-id="6:123" data-name="chevron-down">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronDown} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
