import { useEffect, useState } from 'react'
import SpotifyIcon from './SpotifyIcon'
import { FONT_SERIF, GREEN, INK, TYPE } from './tokens'

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(id)
  }, [])

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 20px 0',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: `radial-gradient(circle, #2a6b3c, ${INK})`,
            border: '1px solid rgba(29,185,84,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'rr-glow-pulse 3s ease-in-out infinite',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '15px' }}>🌿</span>
        </div>
        <div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: '19px', fontWeight: 700, color: '#fff', letterSpacing: '0.12em', lineHeight: 1 }}>TERRA TEA</div>
          <div style={{ ...TYPE.label, fontSize: '9.5px', letterSpacing: '0.16em', marginTop: '3px' }}>CONSERVATION BLEND</div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          background: 'rgba(29,185,84,0.09)',
          border: '1px solid rgba(29,185,84,0.22)',
          borderRadius: '100px',
          animation: 'rr-float-badge 3s ease-in-out infinite',
        }}
      >
        <SpotifyIcon size={14} />
        <div>
          <div style={{ ...TYPE.label, fontSize: '9px', letterSpacing: '0.1em' }}>PARTNER</div>
          <div style={{ ...TYPE.label, fontSize: '10px', color: GREEN, fontWeight: 600, letterSpacing: '0.1em' }}>SPOTIFY</div>
        </div>
      </div>
    </nav>
  )
}
