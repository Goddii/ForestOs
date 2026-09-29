import { TYPE } from './tokens'

const ITEMS = [
  '🌿 78,400 trees planted',
  '☁️ 2,100m altitude',
  '💧 Binaural 8D audio',
  '🌍 Kenya Tea Belt',
  '🎵 Spotify x Terra Tea',
  '🌱 Carbon Neutral Blend',
  '♻️ B Corp Certified',
]

// Two copies side by side so translating by -50% loops seamlessly.
const LOOPED = [...ITEMS, ...ITEMS]

export default function MarqueeBand() {
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(29,185,84,0.12)',
        borderBottom: '1px solid rgba(29,185,84,0.12)',
        background: 'rgba(29,185,84,0.04)',
        padding: '11px 0',
      }}
    >
      <div style={{ display: 'flex', gap: '32px', whiteSpace: 'nowrap', width: 'max-content', animation: 'rr-marquee 24s linear infinite' }}>
        {LOOPED.map((item, i) => (
          <span key={i} aria-hidden={i >= ITEMS.length} style={{ ...TYPE.caption, fontSize: '17px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.01em', flexShrink: 0 }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
