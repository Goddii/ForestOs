import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { imgCircleX, imgPause, imgSplashBg } from './assets'

const START_SECONDS = 74 // 01:14
const TOTAL_SECONDS = 225 // 03:45

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Sticky bottom-of-screen mini Spotify player with a working play/pause + progress tick and a dismiss control. */
export default function SpotifyPlayer() {
  const [isVisible, setIsVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(START_SECONDS)

  useEffect(() => {
    if (!isPlaying) return undefined
    const id = setInterval(() => {
      setElapsedSeconds((current) => Math.min(current + 1, TOTAL_SECONDS))
    }, 1000)
    return () => clearInterval(id)
  }, [isPlaying])

  if (!isVisible) return null

  const progressRatio = elapsedSeconds / TOTAL_SECONDS

  return (
    <div
      className="sticky z-20 backdrop-blur-[15px] bg-[rgba(8,15,11,0.8)] border-[rgba(255,255,255,0.1)] border-solid border-t bottom-0 content-stretch flex flex-col gap-[12px] items-start left-0 pb-[20px] pt-[12px] px-[16px] right-0"
      data-node-id="2:66"
      data-name="sticky-spotify-player"
    >
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="2:67" data-name="player-row">
        <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center max-w-[260px] min-w-px relative" data-node-id="2:68" data-name="player-media-block">
          <div className="border border-[#1db954] border-solid relative rounded-[8px] shrink-0 size-[44px]" data-node-id="2:69" data-name="album-art">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[8px]">
              <img alt="" className="absolute max-w-none object-cover rounded-[8px] size-full" src={imgSplashBg} />
              <div className="absolute bg-[rgba(29,185,84,0.1)] inset-0 rounded-[8px]" />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="2:70" data-name="track-details">
            <p className="font-['Inter:Bold'] font-bold overflow-hidden relative shrink-0 text-[12px] text-ellipsis text-white w-full">
              Sound of the Shield
            </p>
            <p className="font-['Inter:Regular'] font-normal overflow-hidden relative shrink-0 text-[#8e9f95] text-[11px] text-ellipsis w-full">
              Nyashinski • Voiceover &amp; Ambient
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[14px] items-center relative shrink-0" data-node-id="2:73" data-name="player-actions">
          <button
            type="button"
            onClick={() => setIsPlaying((current) => !current)}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="bg-[#1db954] content-stretch drop-shadow-[0px_0px_3px_#1db954] flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px] transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a08]"
            data-node-id="2:74"
            data-name="play-button"
          >
            {isPlaying ? (
              <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-node-id="2:75" data-name="icon-pause">
                <div className="relative shrink-0 size-[16px]" data-node-id="2:95" data-name="pause">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPause} />
                </div>
              </div>
            ) : (
              <Play className="size-[14px] fill-[#070a08] text-[#070a08]" strokeWidth={0} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss player"
            className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[20px] rounded-full transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff9d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a08]"
            data-node-id="2:77"
            data-name="icon-spotify"
          >
            <div className="relative shrink-0 size-[20px]" data-node-id="2:104" data-name="circle-x">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX} />
            </div>
          </button>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="2:79" data-name="scrubber-container">
        <div className="bg-[rgba(255,255,255,0.15)] content-stretch flex h-[4px] items-start overflow-clip relative rounded-[2px] shrink-0 w-full" data-node-id="2:80" data-name="progress-bar-track">
          <div
            className="bg-[#1db954] h-full relative shrink-0"
            style={{ width: `${progressRatio * 100}%` }}
            data-node-id="2:81"
            data-name="progress-fill"
          />
        </div>
        <div className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-start justify-between leading-[normal] not-italic relative shrink-0 text-[#8e9f95] text-[9px] w-full whitespace-nowrap" data-node-id="2:82" data-name="progress-times">
          <p className="relative shrink-0">{formatTime(elapsedSeconds)}</p>
          <p className="relative shrink-0">{formatTime(TOTAL_SECONDS)}</p>
        </div>
      </div>
    </div>
  )
}
