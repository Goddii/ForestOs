import { useEffect } from 'react'
import BatchHud from '../soundOfTheShield/BatchHud'
import { imgDesktopAmbient } from '../soundOfTheShield/assets'
import CommunityCard from '../soundOfTheShield/CommunityCard'
import HeaderBar from '../soundOfTheShield/HeaderBar'
import Leaderboard from '../soundOfTheShield/Leaderboard'
import PageBackground from '../soundOfTheShield/PageBackground'
import SpotifyPlayer from '../soundOfTheShield/SpotifyPlayer'
import SplashHero from '../soundOfTheShield/SplashHero'
import StoryPanel from '../soundOfTheShield/StoryPanel'
import TeaserCard from '../soundOfTheShield/TeaserCard'

const INTER_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'

// Below `lg`, stay fluid (capped at 430px) so the phone content never
// causes horizontal overflow on a real device narrower than the Figma
// frame's literal 390px. At `lg`+ the viewport is always far wider than
// 390px, so the frame pins to that exact width — matching the hero's
// hardcoded 390px full-bleed children precisely inside the device bezel.
const PHONE_WIDTH = 'w-full max-w-[430px] lg:w-[390px] lg:max-w-none'

/**
 * `/sound-of-the-shield` — Figma-sourced prototype ("qr-experience" file,
 * node 2:4 "sound-of-the-shield"), ported as-is. A Nyashinski × Nyayo Tea
 * Zones QR-scan landing: splash hero, live batch telemetry HUD, a
 * conservation leaderboard, the shield story/verification card, a
 * community CTA, an event teaser, and a sticky Spotify-style player — every
 * control (play/pause, tabs, notify, join, dismiss) is wired to real state.
 *
 * Below `lg`, the phone content renders full-bleed exactly as scanned on a
 * device. At `lg` and up it's presented inside a phone-frame device mockup
 * on an ambient backdrop — since the product truth is a QR-scan-triggered
 * mobile experience, desktop doesn't get an invented "native" reflow, it
 * gets an honest preview of the same mobile build, one visual system, no
 * device-detection branch.
 *
 * Isolated route — its own `src/soundOfTheShield/` folder, no shared
 * component or data-file edits. Loads Inter (the design's typeface) only
 * for the lifetime of this route, since the rest of the site doesn't use it.
 */
export default function SoundOfTheShield() {
  useEffect(() => {
    document.title = 'The Sound of the Shield — ForestOS'

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = INTER_FONT_HREF
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  return (
    <div className="isolate min-h-svh bg-[#070a08] lg:flex lg:items-center lg:justify-center lg:gap-16 lg:overflow-hidden lg:p-16">
      <div aria-hidden className="hidden lg:block lg:fixed lg:inset-0 lg:-z-10">
        <img alt="" className="absolute inset-0 size-full scale-110 object-cover" src={imgDesktopAmbient} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,10,8,0.35)_0%,rgba(7,10,8,0.94)_72%)]" />
      </div>

      <div className="hidden lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-4">
        <p className="font-['Inter'] text-[11px] font-bold uppercase tracking-[0.2em] text-[#00ff9d]">
          ForestOS · QR scan experience
        </p>
        <p className="font-['Inter'] text-[34px] font-black leading-[1.1] text-white">Scan it on your phone.</p>
        <p className="font-['Inter'] text-[14px] leading-relaxed text-[rgba(255,255,255,0.6)]">
          &quot;The Sound of the Shield&quot; opens when a fan scans the QR code printed on a Nyashinski × Nyayo Tea
          Zones pack. This is a live preview of that mobile build — every control in the frame works exactly as it
          does on a phone.
        </p>
      </div>

      <div
        className={`relative mx-auto flex min-h-svh ${PHONE_WIDTH} flex-col items-start overflow-x-clip bg-[#070a08] lg:min-h-0 lg:h-[844px] lg:overflow-y-auto lg:rounded-[52px] lg:border-[10px] lg:border-[#161616] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)]`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[10px] z-50 hidden h-[22px] w-[110px] -translate-x-1/2 rounded-full bg-[#0a0a0a] lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[8px] left-1/2 z-50 hidden h-[4px] w-[120px] -translate-x-1/2 rounded-full bg-white/25 lg:block"
        />

        <PageBackground />
        <SplashHero />
        <HeaderBar />
        <div className="content-stretch flex flex-col gap-[28px] items-start pb-[24px] pt-[24px] px-[16px] relative shrink-0 w-full">
          <BatchHud />
          <Leaderboard />
          <StoryPanel />
          <CommunityCard />
          <TeaserCard />
        </div>
        <SpotifyPlayer />
      </div>
    </div>
  )
}
