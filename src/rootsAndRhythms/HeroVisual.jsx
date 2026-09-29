import { imgMossArm } from './assets'
import { Reveal } from './Reveal'
import { GREEN, MINT, TYPE } from './tokens'

const DROPLETS = [
  { x: 22, y: 58 },
  { x: 52, y: 38 },
  { x: 70, y: 62 },
  { x: 38, y: 76 },
  { x: 82, y: 44 },
]

/** The moss-vine arm: idle until play, then it sways and water droplets appear. */
export default function HeroVisual({ isPlaying, onPlay }) {
  return (
    <section style={{ padding: '20px 20px 0' }}>
      <Reveal animation="scale-in" delay={0.05}>
        <div
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            height: '248px',
            border: `1px solid ${isPlaying ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.06)'}`,
            transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
            boxShadow: isPlaying ? '0 0 40px rgba(29,185,84,0.12)' : 'none',
          }}
        >
          <img
            src={imgMossArm}
            alt="Moss-vine arm dancing in forest canopy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              animation: isPlaying ? 'rr-sway 3s ease-in-out infinite' : 'none',
              transition: 'filter 0.6s ease',
              filter: isPlaying ? 'brightness(1.08) saturate(1.1)' : 'brightness(1)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(11,25,16,0.55) 0%, rgba(11,25,16,0.15) 50%, rgba(11,25,16,0.6) 100%)` }} />

          {DROPLETS.map((pos, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: 7,
                height: 9,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: 'rgba(78,254,161,0.75)',
                boxShadow: `0 0 10px ${MINT}80`,
                opacity: isPlaying ? 1 : 0,
                transform: isPlaying ? 'scale(1)' : 'scale(0)',
                transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
                animation: isPlaying ? `rr-sway ${1.1 + i * 0.35}s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}

          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <div
              style={{
                padding: '5px 10px',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isPlaying ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '100px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'border-color 0.4s ease',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isPlaying ? GREEN : 'rgba(255,255,255,0.25)',
                  animation: isPlaying ? 'rr-pulse-dot 1s ease-in-out infinite' : 'none',
                  transition: 'background 0.4s ease',
                }}
              />
              <span style={{ ...TYPE.label, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em' }}>
                {isPlaying ? 'SYNC · LIVE' : 'TAP PLAY TO ANIMATE'}
              </span>
            </div>
          </div>

          {!isPlaying && (
            <button
              type="button"
              onClick={onPlay}
              aria-label="Play the forest soundscape"
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.12)'; e.currentTarget.style.background = 'rgba(29,185,84,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)'; e.currentTarget.style.background = 'rgba(29,185,84,0.18)' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(29,185,84,0.18)',
                border: '2px solid rgba(29,185,84,0.55)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  )
}

