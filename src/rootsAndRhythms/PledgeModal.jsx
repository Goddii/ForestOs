import { useEffect, useRef } from 'react'
import { imgMossHand } from './assets'
import { seededRandom } from './seeded'
import { FONT_SERIF, GREEN, INK, MINT, TYPE } from './tokens'

const CONFETTI_COUNT = 16

const CONFETTI = (() => {
  const random = seededRandom(921)
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    left: 10 + random() * 80,
    top: random() * 60,
    dur: 0.6 + random() * 0.6,
    delay: 0.3 + i * 0.06,
    color: i % 2 === 0 ? GREEN : MINT,
  }))
})()

const SECONDARY_BUTTON = {
  flex: 1,
  padding: '14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '100px',
  ...TYPE.action,
  color: 'rgba(255,255,255,0.75)',
  cursor: 'pointer',
}

const SHARE_DATA = { title: 'Roots & Rhythms', text: 'I just pledged a tree with Terra Tea.', url: typeof window === 'undefined' ? '' : window.location.href }

/** Bottom sheet confirming the pledge. Closes on backdrop click, Escape or either button. */
export default function PledgeModal({ onClose }) {
  const doneRef = useRef(null)

  useEffect(() => {
    const trigger = document.activeElement
    doneRef.current?.focus()
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (trigger instanceof HTMLElement) trigger.focus()
    }
  }, [onClose])

  const share = () => {
    if (navigator.share) navigator.share(SHARE_DATA).catch(() => {})
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(4,12,6,0.88)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rr-pledge-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '390px',
          background: 'linear-gradient(180deg, #0F2415 0%, #0B1910 100%)',
          border: '1px solid rgba(29,185,84,0.18)',
          borderRadius: '28px 28px 0 0',
          overflow: 'hidden',
          animation: 'rr-modal-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
          <img
            src={imgMossHand}
            alt="Moss hand offering a sprout"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', animation: 'rr-scale-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(15,36,21,0.9) 100%)' }} />
          {CONFETTI.map((dot, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="rr-decor"
              style={{ position: 'absolute', left: `${dot.left}%`, top: `${dot.top}%`, width: 6, height: 6, borderRadius: '50%', background: dot.color, opacity: 0, animation: `rr-ripple-out ${dot.dur}s ease-out forwards`, animationDelay: `${dot.delay}s` }}
            />
          ))}
          <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 12px', background: 'rgba(11,25,16,0.78)', backdropFilter: 'blur(8px)', border: '1px solid rgba(29,185,84,0.5)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px', animation: 'rr-float-badge 2s ease-in-out infinite' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, animation: 'rr-pulse-dot 1.2s ease-in-out infinite' }} />
            <span style={{ ...TYPE.label, color: GREEN, letterSpacing: '0.12em' }}>+1 TREE PLEDGED</span>
          </div>
        </div>
        <div style={{ padding: '24px 28px 40px' }}>
          <h3 id="rr-pledge-title" style={{ fontFamily: FONT_SERIF, fontSize: '38px', fontWeight: 600, color: '#fff', lineHeight: 1.08, marginBottom: '12px', animation: 'rr-fade-up 0.5s ease 0.3s both' }}>
            Your trace is<br /><em style={{ color: GREEN }}>now rooted.</em>
          </h3>
          <p style={{ ...TYPE.body, marginBottom: '24px', animation: 'rr-fade-up 0.5s ease 0.45s both' }}>
            One tree will be planted in Kenya&apos;s Nyayo Tea Belt on your behalf. You&apos;ll receive a geolocation tag when it breaks ground.
          </p>
          <div style={{ display: 'flex', gap: '10px', animation: 'rr-fade-up 0.5s ease 0.6s both' }}>
            <button
              ref={doneRef}
              type="button"
              onClick={onClose}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(29,185,84,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
              style={{ flex: 1, padding: '14px', background: GREEN, border: 'none', borderRadius: '100px', ...TYPE.action, color: INK, cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            >
              ✓ Done
            </button>
            <button type="button" onClick={share} style={SECONDARY_BUTTON}>Share Trace</button>
          </div>
        </div>
      </div>
    </div>
  )
}
