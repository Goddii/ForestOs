import { useCallback, useEffect, useState } from 'react'

const SKIP_SECONDS = 15
const TICK_MS = 1000

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Simulated playback for the CH. 06 player (no audio file exists for this
 * prototype). Starts paused, matching the Figma frame's play glyph. With
 * repeat on, the track loops at the end instead of stopping.
 */
export default function useTrackPlayback({ startSeconds, totalSeconds }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(startSeconds)

  const clamp = useCallback((seconds) => Math.min(Math.max(seconds, 0), totalSeconds), [totalSeconds])

  useEffect(() => {
    if (!isPlaying) return undefined
    const id = setInterval(() => {
      setElapsedSeconds((current) => (current + 1 >= totalSeconds && isRepeat ? 0 : clamp(current + 1)))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [isPlaying, isRepeat, totalSeconds, clamp])

  if (isPlaying && elapsedSeconds >= totalSeconds) setIsPlaying(false)

  return {
    isPlaying,
    isShuffle,
    isRepeat,
    elapsedSeconds,
    progressRatio: elapsedSeconds / totalSeconds,
    togglePlay: () => {
      if (elapsedSeconds >= totalSeconds) setElapsedSeconds(0)
      setIsPlaying((current) => !current)
    },
    toggleShuffle: () => setIsShuffle((current) => !current),
    toggleRepeat: () => setIsRepeat((current) => !current),
    skipBack: () => setElapsedSeconds((current) => clamp(current - SKIP_SECONDS)),
    skipForward: () => setElapsedSeconds((current) => clamp(current + SKIP_SECONDS)),
    seekToRatio: (ratio) => setElapsedSeconds(clamp(Math.round(ratio * totalSeconds))),
  }
}
