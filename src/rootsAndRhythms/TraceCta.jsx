import { useEffect, useRef, useState } from 'react'
import { imgMossFingerprint } from './assets'
import { Reveal } from './Reveal'
import { GREEN, TYPE } from './tokens'

const RIPPLE_DELAYS = [0, 0.6, 1.2]
const BURST_DELAYS = [0, 0.1, 0.2]
const BURST_MS = 550

/** The moss-fingerprint button: a ripple burst plays, then the pledge sheet opens. */
export default function TraceCta({ onPledge }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBursting, setIsBursting] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleTap = () => {
    if (isBursting) return
    setIsBursting(true)
    timer.current = setTimeout(() => {
      setIsBursting(false)
      onPledge()
    }, BURST_MS)
  }

  return (
    <section style={{ padding: '28px 20px 0', textAlign: 'center' }}>
      <Reveal animation="fade-up" delay={0}>
        <div style={{ marginBottom: '18px' }}>
          <span style={{ ...TYPE.label, letterSpacing: '0.2em' }}>
            Your ecological trace
          </span>
        </div>
      </Reveal>

      <Reveal animation="scale-in" delay={0.1}>
        <button
          type="button"
          onClick={handleTap}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label="Tap to leave your trace and pledge a tree"
          style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-block' }}
        >
          {RIPPLE_DELAYS.map((delay, i) => (
            <div
              key={delay}
              aria-hidden="true"
              className="rr-decor"
              style={{
                position: 'absolute',
                inset: `${-12 - i * 10}px`,
                borderRadius: '50% 50% 50% 50% / 45% 45% 55% 55%',
                border: `1px solid rgba(29,185,84,${0.12 - i * 0.03})`,
                opacity: isHovered ? 1 : 0.4,
                animation: `rr-ripple-out ${3 + i * 1.5}s ease-out infinite`,
                animationDelay: `${delay}s`,
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease',
              }}
            />
          ))}

          {isBursting && BURST_DELAYS.map((delay) => (
            <div
              key={delay}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '2px solid rgba(29,185,84,0.7)',
                animation: 'rr-ripple-out 0.5s ease-out forwards',
                animationDelay: `${delay}s`,
                pointerEvents: 'none',
              }}
            />
          ))}

          <div
            style={{
              width: 200,
              height: 224,
              borderRadius: '50% 50% 50% 50% / 45% 45% 55% 55%',
              overflow: 'hidden',
              position: 'relative',
              animation: 'rr-breathe 3.5s ease-in-out infinite',
              border: `1px solid ${isHovered ? 'rgba(29,185,84,0.45)' : 'rgba(29,185,84,0.2)'}`,
              transition: 'border-color 0.3s ease',
            }}
          >
            <img
              src={imgMossFingerprint}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 35%, rgba(11,25,16,0.45) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px 22px' }}>
              <div
                style={{
                  padding: '7px 14px',
                  background: isHovered ? 'rgba(29,185,84,0.2)' : 'rgba(11,25,16,0.75)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isHovered ? 'rgba(29,185,84,0.5)' : 'rgba(29,185,84,0.3)'}`,
                  borderRadius: '100px',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                }}
              >
                <span style={{ ...TYPE.action, fontSize: '10.5px', letterSpacing: '0.12em', color: GREEN, textAlign: 'center', lineHeight: 1.5 }}>
                  TAP TO LEAVE YOUR TRACE
                </span>
              </div>
            </div>
          </div>
        </button>
      </Reveal>

      <Reveal animation="fade-up" delay={0.3}>
        <div style={{ ...TYPE.lede, marginTop: '20px', fontSize: '26px', fontWeight: 400, lineHeight: 1.25 }}>
          &ldquo;Every sip plants<br />a living memory.&rdquo;
        </div>
      </Reveal>
    </section>
  )
}
