import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { imgMapLayer } from '../livingAnthem/assets'
import ChapterRail from '../livingAnthem/ChapterRail'
import { STARTING_SEEDS_SOWN } from '../livingAnthem/data'
import ArtistHero from '../livingAnthem/screens/ArtistHero'
import CommunityLoop from '../livingAnthem/screens/CommunityLoop'
import DiscoverLandscape from '../livingAnthem/screens/DiscoverLandscape'
import MusicReward from '../livingAnthem/screens/MusicReward'
import Participate from '../livingAnthem/screens/Participate'
import ScanEntry from '../livingAnthem/screens/ScanEntry'
import VerifiedImpact from '../livingAnthem/screens/VerifiedImpact'

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Geist:wght@400;500;600;700;800&display=swap'

// Route-scoped keyframes: amber shimmer (fx.Shimmer) and StarBorder orbit (fxLibrary.StarBorder).
const ROUTE_KEYFRAMES = `
@keyframes la-shine{from{background-position:100% 0}to{background-position:-100% 0}}
@keyframes la-star-bottom{0%{transform:translate(0,0);opacity:1}100%{transform:translate(-100%,0);opacity:0}}
@keyframes la-star-top{0%{transform:translate(0,0);opacity:1}100%{transform:translate(100%,0);opacity:0}}
`

const SCREENS = [ScanEntry, ArtistHero, DiscoverLandscape, VerifiedImpact, Participate, MusicReward, CommunityLoop]

/**
 * `/living-anthem` — Figma-sourced prototype ("qr-experience" file
 * kf55qy2ZFFOZ69Um7HulYw, frames 3:10 → 3:243), ported as-is: a seven-
 * chapter Nyashinski × ForestOS QR story (scan → manifesto → landscape →
 * live telemetry → pledge → music reward → member passport).
 *
 * Chapters are full-height, scroll-snapped sections; each chapter's
 * "next" cue scrolls onward, and the CH. 05 pledge feeds the CH. 07
 * passport. Figma's entrance motion plays once per chapter, plus a layer
 * of micro-animations adapted from Magic UI and React Bits (see fx.jsx /
 * fxLibrary.jsx). Below `lg` it's the phone experience itself; at `lg`+
 * it's previewed in a phone frame (the design is mobile-only).
 *
 * Isolated route — own `src/livingAnthem/` folder, no shared edits.
 */
export default function LivingAnthem() {
  const scrollRef = useRef(null)
  const [hasPledged, setHasPledged] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  useEffect(() => {
    document.title = 'The Living Anthem — ForestOS'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  const goTo = useCallback((index) => {
    const section = scrollRef.current?.children[index]
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const screenProps = (index) => ({
    onNext: index < SCREENS.length - 1 ? () => goTo(index + 1) : undefined,
    hasPledged,
    onPledge: () => setHasPledged(true),
    seedsSown: STARTING_SEEDS_SOWN + (hasPledged ? 1 : 0),
    hasJoined,
    onJoin: () => setHasJoined(true),
  })

  return (
    <MotionConfig reducedMotion="user">
      <style>{ROUTE_KEYFRAMES}</style>
      <div className="isolate min-h-svh bg-[#040d07] lg:flex lg:items-center lg:justify-center lg:gap-16 lg:overflow-hidden lg:p-12">
        <div aria-hidden className="hidden lg:block lg:fixed lg:inset-0 lg:-z-10">
          <img alt="" className="absolute inset-0 size-full scale-110 object-cover blur-2xl opacity-40" src={imgMapLayer} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,13,7,0.3)_0%,rgba(4,13,7,0.95)_70%)]" />
        </div>

        <div className="hidden lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-4">
          <p className="font-['Geist'] text-[11px] font-bold uppercase tracking-[0.2em] text-[#00ff87]">ForestOS · QR scan experience</p>
          <p className="font-['Syne'] text-[34px] font-extrabold leading-[1.1] text-white">Scan it on your phone.</p>
          <p className="font-['Geist'] text-[14px] leading-relaxed text-[#8a9f96]">
            &quot;The Living Anthem&quot; opens when a fan scans a ForestOS × Nyashinski QR code: seven chapters from scan to
            member passport. This is a live preview of that mobile build — every control in the frame works as it does on a
            phone.
          </p>
        </div>

        <div className="relative h-svh w-full lg:h-[min(874px,calc(100svh-116px))] lg:w-[402px] lg:shrink-0 lg:overflow-hidden lg:rounded-[52px] lg:border-[10px] lg:border-[#161616] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] lg:box-content">
          <ChapterRail scrollRef={scrollRef} onSelect={goTo} />
          <main ref={scrollRef} className="h-full overflow-y-auto overflow-x-hidden snap-y snap-proximity overscroll-contain [scrollbar-width:none]">
            {SCREENS.map((ScreenComponent, index) => (
              // Fixed chapter order — the index is the chapter's identity.
              <ScreenComponent key={index} {...screenProps(index)} />
            ))}
          </main>
        </div>
      </div>
    </MotionConfig>
  )
}
