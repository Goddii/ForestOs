import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import Reveal from '../components/Reveal'
import Waveform from './Waveform'
import { trackEvent, EVENTS } from './analytics'

const SIMULATED_DURATION_S = 24

/**
 * The music moment. No real audio asset exists in this repo (confirmed
 * during audit — zero .mp3/.wav/.m4a anywhere), so this is an honest
 * simulated playback state, not a fake player claiming to stream: pressing
 * play advances a real timer and a reactive waveform, and the copy below it
 * always makes clear this is a preview gesture that hands off to Spotify —
 * never implying in-app audio is actually decoding. Same honesty pattern
 * `src/nyashinski/AudioToggle.jsx` already established for this campaign.
 *
 * @param {{ spotifyUrl: string, messageLabel: string, onSpotifyClick: () => void }} props
 */
export default function MusicMoment({ spotifyUrl, messageLabel, onSpotifyClick }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(0)

  useEffect(() => {
    if (!playing) return undefined

    startRef.current = performance.now() - elapsed * 1000
    const tick = (now) => {
      const next = (now - startRef.current) / 1000
      if (next >= SIMULATED_DURATION_S) {
        setElapsed(SIMULATED_DURATION_S)
        setPlaying(false)
        return
      }
      setElapsed(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally not re-anchoring on `elapsed`
  }, [playing])

  function handleToggle() {
    const next = !playing
    setPlaying(next)
    if (next) {
      if (elapsed >= SIMULATED_DURATION_S) setElapsed(0)
      trackEvent(EVENTS.PLAY_MUSIC)
    }
  }

  const progressPct = Math.min(100, (elapsed / SIMULATED_DURATION_S) * 100)

  return (
    <section className="relative flex min-h-svh flex-col justify-center bg-ink px-6 py-24 sm:px-10">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-400">
          {messageLabel}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-[1.02] text-bone sm:text-6xl">
          Press play.
          <br />
          Then hear the rest on Spotify.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 max-w-xl">
        <div className="rounded-2xl border border-bone/15 bg-bone/[0.04] p-6 backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleToggle}
              aria-pressed={playing}
              aria-label={playing ? 'Pause preview' : 'Play preview'}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-bone text-ink transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" />}
            </button>

            <div className="min-w-0 flex-1">
              <Waveform
                active={playing}
                className="h-10 w-full text-emerald-400/70"
                barClassName="bg-emerald-400/70"
              />
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-bone/15">
                <motion.div
                  className="h-full rounded-full bg-emerald-400"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                />
              </div>
            </div>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-500">
            Preview only — the full track lives on Spotify
          </p>

          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSpotifyClick}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Continue on Spotify
          </a>
        </div>
      </Reveal>
    </section>
  )
}
