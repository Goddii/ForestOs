import { motion } from 'framer-motion'
import { Pause } from 'lucide-react'
import { imgArtwork, imgCircleX, imgMusic, imgPlayCircle, imgPulse, imgRepeat, imgShuffle, imgSkipBack, imgSkipForward } from '../assets'
import { BottomAction, ChapterIndicator, FOCUS_RING, Reveal, Screen, SectionTitle, STAGGER, StatusBar, useLoopsEnabled } from '../chrome'
import { DecryptedText, Magnet } from '../fxLibrary'
import { PLATFORM_LINKS, TRACK, WAVE_HEIGHTS } from '../data'
import useTrackPlayback, { formatTime } from '../useTrackPlayback'

const BAR_BOUNCE = 0.55 // playing bars dip to 55% of their Figma height
const KEY_SEEK_SECONDS = 5

/** The Figma waveform, doubling as the seek slider (click, or arrow keys when focused). */
function Waveform({ progressRatio, elapsedSeconds, isPlaying, onSeek }) {
  const isEnabled = useLoopsEnabled()
  const isBouncing = isPlaying && isEnabled
  const playedBars = Math.round(progressRatio * WAVE_HEIGHTS.length)
  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    onSeek((event.clientX - rect.left) / rect.width)
  }
  const handleKeyDown = (event) => {
    const step = KEY_SEEK_SECONDS / TRACK.totalSeconds
    if (event.key === 'ArrowRight') onSeek(progressRatio + step)
    if (event.key === 'ArrowLeft') onSeek(progressRatio - step)
  }
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={TRACK.totalSeconds}
      aria-valuenow={elapsedSeconds}
      aria-valuetext={formatTime(elapsedSeconds)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex gap-[4px] h-[24px] items-center shrink-0 w-full cursor-pointer rounded-[4px] ${FOCUS_RING}`}
      data-name="waves"
    >
      {WAVE_HEIGHTS.map((height, index) => (
        <motion.div
          // Static list — bar order never changes, so the index is a stable key.
          key={index}
          className={`rounded-[3px] shrink-0 w-[6px] transition-colors duration-300 ${index < playedBars ? 'bg-[#00ff87]' : 'bg-[#4f6359]'}`}
          style={{ height }}
          animate={isBouncing ? { scaleY: [1, BAR_BOUNCE, 1] } : { scaleY: 1 }}
          transition={isBouncing ? { duration: 0.5 + (index % 5) * 0.12, repeat: Infinity, ease: 'easeInOut', delay: index * 0.03 } : { duration: 0.2 }}
        />
      ))}
    </div>
  )
}

function BreathingArtwork({ isPlaying }) {
  const isEnabled = useLoopsEnabled()
  const isBreathing = isPlaying && isEnabled
  return (
    <motion.img
      alt="Mau Anthem cover art: a glowing tree of sound waves"
      className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full"
      src={imgArtwork}
      animate={isBreathing ? { scale: [1, 1.035, 1] } : { scale: 1 }}
      transition={isBreathing ? { duration: 1.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
    />
  )
}

const IDLE_GLOW = '0 4px 12px rgba(0,255,135,0.2)'

function PlayButton({ isPlaying, onToggle }) {
  const isEnabled = useLoopsEnabled()
  const isPulsing = isPlaying && isEnabled
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      aria-pressed={isPlaying}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      animate={isPulsing ? { boxShadow: ['0 0 0 0 rgba(0,255,135,0.45)', '0 0 0 14px rgba(0,255,135,0)'] } : { boxShadow: IDLE_GLOW }}
      transition={isPulsing ? { boxShadow: { duration: 1.4, repeat: Infinity } } : {}}
      className={`bg-[#00ff87] flex items-center justify-center rounded-[28px] size-[56px] ${FOCUS_RING}`}
      data-name="play-glowing-circle"
    >
      {isPlaying ? (
        <Pause className="size-[22px] fill-[#040d07] text-[#040d07]" strokeWidth={0} aria-hidden="true" />
      ) : (
        <img alt="" className="block size-[24px]" src={imgPlayCircle} />
      )}
    </motion.button>
  )
}

function IconToggle({ icon, label, isActive, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
      whileTap={{ scale: 0.85, rotate: -8 }}
      className={`relative flex items-center justify-center size-[24px] rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'} ${FOCUS_RING}`}
    >
      <img alt="" className="block size-[24px]" src={icon} />
      {isActive && <motion.span layoutId={`la-toggle-dot-${label}`} className="absolute -bottom-[7px] size-[4px] rounded-full bg-[#00ff87]" />}
    </motion.button>
  )
}

function IconButton({ icon, label, onClick }) {
  return (
    <motion.button type="button" onClick={onClick} aria-label={label} whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.12 }} className={`flex items-center justify-center size-[24px] rounded-full ${FOCUS_RING}`}>
      <img alt="" className="block size-[24px]" src={icon} />
    </motion.button>
  )
}

function PlatformLink({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, borderColor: 'rgba(0,255,135,0.45)' }}
      whileTap={{ scale: 0.96 }}
      className={`bg-[#0a1812] border border-[rgba(255,255,255,0.08)] border-solid flex flex-[1_0_0] gap-[8px] items-center justify-center min-w-px px-[16px] py-[12px] rounded-[12px] ${FOCUS_RING}`}
    >
      <img alt="" className="block size-[18px]" src={icon} />
      <span className="font-['Geist'] font-semibold leading-[normal] text-[12px] text-white whitespace-nowrap">{label}</span>
    </motion.a>
  )
}

/** CH. 06 — Figma "music-reward" (node 3:167): unlocked pre-release with a working (simulated) player. */
export default function MusicReward({ onNext }) {
  const playback = useTrackPlayback(TRACK)
  const { isPlaying, isShuffle, isRepeat, elapsedSeconds, progressRatio } = playback

  return (
    <Screen name="music-reward">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={6} />
        <SectionTitle eyebrow="REWARD" lead="THE LIVING" accent="ANTHEM" />
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col gap-[20px] items-start px-[24px] relative shrink-0 w-full" data-name="player-panel">
        <div className="bg-[#0a1812] border border-[rgba(255,255,255,0.08)] border-solid flex flex-col gap-[16px] items-start p-[20px] rounded-[24px] shrink-0 w-full" data-name="track-card">
          <div className="flex h-[220px] items-start overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="artwork">
            <BreathingArtwork isPlaying={isPlaying} />
            <div className="absolute bg-[rgba(0,0,0,0.8)] flex gap-[6px] items-center left-[12px] px-[10px] py-[4px] rounded-[12px] top-[12px]" data-name="live-indicator">
              <img alt="" className="block size-[6px] animate-pulse motion-reduce:animate-none" src={imgPulse} />
              <p className="font-['Geist'] font-bold leading-[normal] text-[9px] text-white whitespace-nowrap">
                <DecryptedText text="PRE-RELEASE UNLOCKED" speed={35} />
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[4px] items-start leading-[normal] shrink-0 w-full">
            <h3 className="font-['Syne'] font-bold text-[22px] text-white w-full">{TRACK.title}</h3>
            <p className="font-['Geist'] font-normal text-[#8a9f96] text-[14px] w-full">{TRACK.byline}</p>
          </div>

          <div className="flex flex-col gap-[8px] items-start shrink-0 w-full">
            <Waveform progressRatio={progressRatio} elapsedSeconds={elapsedSeconds} isPlaying={isPlaying} onSeek={playback.seekToRatio} />
            <div className="flex font-['Geist'] font-normal items-start justify-between leading-[normal] text-[#8a9f96] text-[11px] w-full whitespace-nowrap tabular-nums">
              <p>{formatTime(elapsedSeconds)}</p>
              <p>{formatTime(TRACK.totalSeconds)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between shrink-0 w-full" data-name="player-actions">
            <IconToggle icon={imgShuffle} label="Shuffle" isActive={isShuffle} onClick={playback.toggleShuffle} />
            <IconButton icon={imgSkipBack} label="Back 15 seconds" onClick={playback.skipBack} />
            <Magnet padding={40} strength={5}>
              <PlayButton isPlaying={isPlaying} onToggle={playback.togglePlay} />
            </Magnet>
            <IconButton icon={imgSkipForward} label="Forward 15 seconds" onClick={playback.skipForward} />
            <IconToggle icon={imgRepeat} label="Repeat" isActive={isRepeat} onClick={playback.toggleRepeat} />
          </div>
        </div>

        <div className="flex gap-[12px] items-start shrink-0 w-full" data-name="platforms">
          <PlatformLink href={PLATFORM_LINKS.spotify} icon={imgCircleX} label="Open Spotify" />
          <PlatformLink href={PLATFORM_LINKS.appleMusic} icon={imgMusic} label="Apple Music" />
        </div>
      </Reveal>

      <BottomAction label="THE COMMUNITY OF SENTINELS" onNext={onNext} />
    </Screen>
  )
}
