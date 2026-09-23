import { motion } from 'framer-motion'
import { imgArtistPhoto, imgChapterLineHero, imgPulseDot } from '../assets'
import { FOCUS_RING, HomeIndicator, Reveal, Screen, STAGGER, StatusBar, useLoopsEnabled } from '../chrome'

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1]

// Radial vignette from Figma node 4:6.
const VIGNETTE =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 402 520' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(20.1 0 0 26 201 260)'><stop stop-color='rgba(0,0,0,0)' offset='0.35'/><stop stop-color='rgba(4,13,7,0.82)' offset='1'/></radialGradient></defs></svg>\")"

function PulseDot() {
  const isEnabled = useLoopsEnabled()
  if (!isEnabled) return <img alt="" className="block shrink-0 size-[7px]" src={imgPulseDot} />
  return (
    <motion.img
      alt=""
      className="block shrink-0 size-[7px]"
      src={imgPulseDot}
      initial={{ opacity: 0.35, scale: 0.85 }}
      animate={{ opacity: [0.35, 1], scale: [0.85, 1.45] }}
      transition={{ duration: 0.7, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
    />
  )
}

/** CH. 02 — Figma "nyashinski-hero" (node 3:39): artist photo with a slow push-in, then the manifesto quote. */
export default function ArtistHero({ onNext }) {
  return (
    <Screen name="nyashinski-hero" className="justify-start">
      <StatusBar className="absolute left-0 right-0 top-0 z-10" />

      <Reveal delay={STAGGER.top} className="h-[520px] overflow-clip relative shrink-0 w-full" data-name="hero-image-block">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.35, scale: 1.09, x: -10, y: 14 }}
          whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 6, ease: 'easeInOut', opacity: { duration: 1.15, ease: EASE_OUT_QUINT } }}
          data-name="artist-photo"
        >
          <img alt="Nyashinski, portrait composed from lyric typography" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgArtistPhoto} />
        </motion.div>
        <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} aria-hidden />
        <div className="absolute bg-gradient-to-b from-[rgba(4,13,7,0)] h-[240px] inset-x-0 to-[#040d07] to-[78%] top-[280px]" aria-hidden />
        <div className="absolute bg-gradient-to-b from-[rgba(4,13,7,0.72)] h-[120px] inset-x-0 to-[rgba(4,13,7,0)] top-0" aria-hidden />
        <div className="absolute flex gap-[6px] items-center inset-x-0 px-[24px] py-[12px] top-[8px] lg:top-[34px]" data-name="chapter-indicator">
          <p className="font-['Geist'] font-bold leading-[normal] shrink-0 text-[#00ff87] text-[11px] uppercase whitespace-nowrap">CH. 02</p>
          <div className="h-0 relative shrink-0 w-[220px]" aria-hidden>
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgChapterLineHero} />
            </div>
          </div>
          <p className="font-['Geist'] font-normal leading-[normal] shrink-0 text-[11px] text-[rgba(255,255,255,0.38)] whitespace-nowrap">02 / 07</p>
        </div>
        <Reveal
          delay={0.65}
          distance={0}
          duration={0.6}
          className="absolute backdrop-blur-[4px] bg-[rgba(0,255,135,0.12)] border border-[rgba(0,255,135,0.25)] border-solid flex gap-[6px] items-center left-[24px] px-[12px] py-[6px] rounded-[20px] top-[464px]"
          data-name="quote-badge"
        >
          <PulseDot />
          <p className="font-['Geist'] font-bold leading-[normal] text-[#00ff87] text-[10px] whitespace-nowrap">ARTIST MANIFESTO</p>
        </Reveal>
      </Reveal>

      <Reveal delay={0.9} distance={34} className="flex flex-col gap-[10px] items-start pt-[28px] px-[24px] relative shrink-0 w-full" data-name="quote-content">
        <div className="flex gap-[10px] items-center shrink-0 w-full" aria-hidden>
          <div className="bg-[#e2a743] h-[52px] rounded-[2px] shrink-0 w-[3px]" />
          <div className="flex flex-col gap-[2px] items-start whitespace-nowrap">
            <p className="font-['Syne'] font-extrabold leading-[0.75] text-[#e2a743] text-[48px]">&quot;</p>
            <p className="font-['Geist'] font-bold leading-[normal] text-[9px] text-[rgba(226,167,67,0.5)] uppercase">Nyashinski</p>
          </div>
        </div>
        <blockquote className="font-['Syne'] font-semibold leading-[1.35] text-[23px] text-white w-full">
          We don&apos;t just drop bars. We plant roots. Music is our ancestral rhythm, and trees are our future legacy.
        </blockquote>
        <div className="flex gap-[8px] items-center pt-[4px] shrink-0 w-full">
          <div className="bg-[#00ff87] h-[2px] rounded-[1px] shrink-0 w-[20px]" aria-hidden />
          <p className="font-['Geist'] font-bold leading-[normal] text-[#00ff87] text-[12px] uppercase whitespace-nowrap">Nyashinski</p>
        </div>
      </Reveal>

      <Reveal delay={STAGGER.bottom} className="flex flex-col gap-[16px] items-center mt-auto pb-[12px] pt-[32px] px-[24px] relative shrink-0 w-full" data-name="bottom-action">
        <motion.button
          type="button"
          onClick={onNext}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: [0, 0.72, 0.35, 0.72], y: [8, 0, 8, 0] }}
          viewport={{ once: true }}
          transition={{ delay: 1.8, duration: 3.2, ease: 'easeInOut' }}
          className={`flex gap-[8px] items-center rounded-[4px] hover:!opacity-100 ${FOCUS_RING}`}
          data-name="swipe-hint"
        >
          <span className="bg-[#4f6359] h-px rounded-[1px] w-[16px]" aria-hidden />
          <span className="font-['Geist'] font-medium leading-[normal] text-[#4f6359] text-[10px] uppercase whitespace-nowrap">Discover the Landscape</span>
          <span className="bg-[#4f6359] h-px rounded-[1px] w-[16px]" aria-hidden />
        </motion.button>
        <HomeIndicator />
      </Reveal>
    </Screen>
  )
}
