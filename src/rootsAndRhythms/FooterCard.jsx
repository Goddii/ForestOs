import { Reveal } from './Reveal'
import SpotifyIcon from './SpotifyIcon'
import { GREEN, TEXT_2, TYPE } from './tokens'

const CERTS = [
  { icon: '🌱', label: 'Carbon Neutral' },
  { icon: '♻️', label: 'B Corp' },
  { icon: '🌍', label: 'Rainforest Alliance' },
]
const SOCIALS = ['𝕏', 'IG', 'TK']

const hover = (background, borderColor, transform) => (e) => {
  e.currentTarget.style.background = background
  if (borderColor) e.currentTarget.style.borderColor = borderColor
  if (transform) e.currentTarget.style.transform = transform
}

export default function FooterCard() {
  return (
    <footer style={{ padding: '28px 20px 0' }}>
      <Reveal animation="fade-up" delay={0.05}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {CERTS.map(({ icon, label }) => (
              <div
                key={label}
                onMouseEnter={hover('rgba(29,185,84,0.08)', 'rgba(29,185,84,0.2)')}
                onMouseLeave={hover('rgba(255,255,255,0.04)', 'rgba(255,255,255,0.07)')}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '100px', transition: 'background 0.2s ease, border-color 0.2s ease' }}
              >
                <span aria-hidden="true" style={{ fontSize: '10px' }}>{icon}</span>
                <span style={{ ...TYPE.ui, fontSize: '11px', fontWeight: 500, color: TEXT_2 }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <button
              type="button"
              disabled
              title="Demo — not linked to Spotify"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(29,185,84,0.09)', border: '1px solid rgba(29,185,84,0.22)', borderRadius: '100px', cursor: 'default', transition: 'background 0.2s ease, transform 0.2s ease' }}
            >
              <SpotifyIcon size={12} />
              <span style={{ ...TYPE.ui, color: GREEN }}>Open Playlist</span>
            </button>
            <div aria-hidden="true" style={{ display: 'flex', gap: '8px' }}>
              {SOCIALS.map((s) => (
                <div
                  key={s}
                  onMouseEnter={hover('rgba(255,255,255,0.1)', null, 'scale(1.1)')}
                  onMouseLeave={hover('rgba(255,255,255,0.05)', null, 'scale(1)')}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s ease, transform 0.2s ease' }}
                >
                  <span style={{ ...TYPE.label, letterSpacing: '0.04em' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...TYPE.small, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
            © 2026 Terra Tea · Conservation Partnership · Nairobi, Kenya<br />
            Spotify integration subject to terms of service.
          </div>
        </div>
      </Reveal>
    </footer>
  )
}
