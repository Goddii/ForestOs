import { useCallback, useEffect, useState } from 'react'
import Ambient from '../rootsAndRhythms/Ambient'
import CommunityRoots from '../rootsAndRhythms/CommunityRoots'
import FooterCard from '../rootsAndRhythms/FooterCard'
import ForestOsTrace from '../rootsAndRhythms/ForestOsTrace'
import HeroHeadline from '../rootsAndRhythms/HeroHeadline'
import HeroVisual from '../rootsAndRhythms/HeroVisual'
import MarqueeBand from '../rootsAndRhythms/MarqueeBand'
import NavBar from '../rootsAndRhythms/NavBar'
import NyayoZones from '../rootsAndRhythms/NyayoZones'
import PledgeModal from '../rootsAndRhythms/PledgeModal'
import RoadToCop32 from '../rootsAndRhythms/RoadToCop32'
import TraceCta from '../rootsAndRhythms/TraceCta'
import TrackPlayer from '../rootsAndRhythms/TrackPlayer'
import { FONT_HREF, INK } from '../rootsAndRhythms/tokens'
import '../rootsAndRhythms/rootsAndRhythms.css'

const START_PROGRESS = 38
const TICK_MS = 200
const TICK_STEP = 0.25

/**
 * `/roots-and-rhythms` — Figma-sourced prototype (Figma Make file
 * 4ABYYt2ksYWDevhr4rrwgS, "Luxury Tea Brand Web Experience"), ported as-is: a
 * Terra Tea × Spotify QR landing. A letter-drop "Roots & Rhythms" headline, a
 * glass player that drives the moss-arm visual (sway + water droplets), a
 * community tree counter, and a moss-fingerprint CTA that opens the pledge
 * sheet. Playback is simulated, exactly as in the design — there is no audio.
 *
 * The design is mobile-only (390px). Below `lg` it fills the device; at `lg`+
 * it's previewed in a phone frame, like the other QR prototypes. Isolated
 * route — own `src/rootsAndRhythms/` folder, no shared edits.
 */
export default function RootsAndRhythms() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(START_PROGRESS)
  const [isPledgeOpen, setIsPledgeOpen] = useState(false)

  useEffect(() => {
    document.title = 'Roots & Rhythms — ForestOS'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  useEffect(() => {
    if (!isPlaying) return undefined
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + TICK_STEP)), TICK_MS)
    return () => clearInterval(id)
  }, [isPlaying])

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), [])
  const play = useCallback(() => setIsPlaying(true), [])
  const closePledge = useCallback(() => setIsPledgeOpen(false), [])
  const openPledge = useCallback(() => setIsPledgeOpen(true), [])

  return (
    <div className="isolate min-h-svh bg-[#050c07] lg:flex lg:items-center lg:justify-center lg:gap-16 lg:p-16">
      <div className="hidden lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-4">
        <p className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-[0.2em] text-[#1DB954]">
          ForestOS · QR scan experience
        </p>
        <p className="font-['Cormorant_Garamond'] text-[44px] font-semibold leading-[1.05] text-white">Scan it on your phone.</p>
        <p className="font-['Inter'] text-[14px] leading-relaxed text-[rgba(255,255,255,0.6)]">
          &quot;Roots &amp; Rhythms&quot; opens when a drinker scans the QR code on a Terra Tea pack. This is a live
          preview of that mobile build — the player, the moss arm and the pledge all work as they do on a phone.
        </p>
      </div>

      <div
        className="rr-root relative mx-auto h-svh w-full max-w-[430px] overflow-hidden lg:h-[844px] lg:w-[390px] lg:max-w-none lg:rounded-[52px] lg:border-[10px] lg:border-[#161616] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)]"
        style={{ background: INK }}
      >
        <Ambient />
        <div inert={isPledgeOpen} className="rr-scroll relative z-[1] h-full overflow-y-auto pb-[100px]">
          <NavBar />
          <HeroHeadline />
          <div style={{ marginTop: '22px' }}>
            <MarqueeBand />
          </div>
          <TrackPlayer isPlaying={isPlaying} progress={progress} onToggle={togglePlay} onSeek={setProgress} />
          <HeroVisual isPlaying={isPlaying} onPlay={play} />
          <NyayoZones />
          <ForestOsTrace />
          <CommunityRoots />
          <RoadToCop32 />
          <TraceCta onPledge={openPledge} />
          <FooterCard />
        </div>
        {isPledgeOpen && <PledgeModal onClose={closePledge} />}
      </div>
    </div>
  )
}
