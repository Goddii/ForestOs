import { imgTrackArt } from './assets'
import { Reveal } from './Reveal'
import SpotifyIcon from './SpotifyIcon'
import { GREEN, INK, MINT, TYPE } from './tokens'

const BAR_HEIGHTS = [4, 8, 14, 20, 16, 10, 18, 12, 22, 16, 8, 20, 14, 6, 18]
const TRACK_SECONDS = 312
const SEEK_STEP = 5
const RING_DELAYS = [0, 0.4, 0.8]

function formatTime(percent) {
  const seconds = Math.floor((percent / 100) * TRACK_SECONDS)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function SoundWave({ isPlaying }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '28px' }}>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: isPlaying ? `${h}px` : '4px',
            borderRadius: '2px',
            background: GREEN,
            boxShadow: isPlaying ? '0 0 5px rgba(29,185,84,0.6)' : 'none',
            transformOrigin: 'center',
            animation: isPlaying ? `rr-wave-bar ${0.55 + (i % 5) * 0.13}s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.06}s`,
            transition: 'height 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

function RingExpander() {
  return RING_DELAYS.map((delay) => (
    <div
      key={delay}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: -4,
        borderRadius: '14px',
        border: '1px solid rgba(29,185,84,0.5)',
        animation: 'rr-ripple-out 1.8s ease-out infinite',
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
      }}
    />
  ))
}

function PlayGlyph({ isPlaying }) {
  return isPlaying ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={INK} aria-hidden="true"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
  )
}

const scale = (event, value) => { event.currentTarget.style.transform = `scale(${value})` }

/** Glass player card. Playback is simulated (a ticking scrubber), as in the design. */
export default function TrackPlayer({ isPlaying, progress, onToggle, onSeek }) {
  const seek = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    onSeek(((event.clientX - rect.left) / rect.width) * 100)
  }

  const handleSliderKey = (event) => {
    const target = { ArrowRight: progress + SEEK_STEP, ArrowUp: progress + SEEK_STEP, ArrowLeft: progress - SEEK_STEP, ArrowDown: progress - SEEK_STEP, Home: 0, End: 100 }[event.key]
    if (target === undefined) return
    event.preventDefault()
    onSeek(Math.min(100, Math.max(0, target)))
  }

  return (
    <section style={{ padding: '20px 20px 0' }}>
      <Reveal animation="card-rise" delay={0.1}>
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: `1px solid ${isPlaying ? 'rgba(29,185,84,0.25)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: isPlaying ? '0 0 50px rgba(29,185,84,0.18), inset 0 1px 0 rgba(255,255,255,0.06)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
          }}
        >
          <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: `1px solid ${isPlaying ? 'rgba(29,185,84,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'border-color 0.4s ease',
                  animation: isPlaying ? 'rr-spin-slow 8s linear infinite' : 'none',
                }}
              >
                <img src={imgTrackArt} alt="Track art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {isPlaying && <RingExpander />}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ ...TYPE.title, fontSize: '19px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '3px' }}>
                Rainfall over the Tea Canopies
              </div>
              <div style={{ ...TYPE.small, marginBottom: '6px' }}>
                Binaural 8D · Forest Soundscapes
              </div>
              <SoundWave isPlaying={isPlaying} />
            </div>

            <button
              type="button"
              onClick={onToggle}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onMouseEnter={(e) => scale(e, 1.1)}
              onMouseLeave={(e) => scale(e, 1)}
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: isPlaying ? GREEN : 'rgba(29,185,84,0.13)',
                border: '1px solid rgba(29,185,84,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                flexShrink: 0,
                animation: isPlaying ? 'rr-glow-pulse 2s ease-in-out infinite' : 'none',
              }}
            >
              <PlayGlyph isPlaying={isPlaying} />
            </button>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <div
              role="slider"
              tabIndex={0}
              aria-label="Track position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              onClick={seek}
              aria-valuetext={`${formatTime(progress)} of ${formatTime(100)}`}
              onKeyDown={handleSliderKey}
              style={{ padding: '9px 0', margin: '-9px 0 -2px', cursor: 'pointer' }}
            >
              <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '2px',
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${GREEN}, ${MINT})`,
                  backgroundSize: '200%',
                  animation: isPlaying ? 'rr-shimmer-bar 2s linear infinite' : 'none',
                  boxShadow: '0 0 8px rgba(29,185,84,0.5)',
                  transition: 'width 0.2s linear',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px rgba(29,185,84,0.9)' }} />
              </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ ...TYPE.label, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>{formatTime(progress)}</span>
              <div title="Demo — not linked to Spotify" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <SpotifyIcon size={10} />
                <span style={{ ...TYPE.ui, fontSize: '11px', color: GREEN }}>Open in Spotify</span>
              </div>
              <span style={{ ...TYPE.label, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>{formatTime(100)}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
