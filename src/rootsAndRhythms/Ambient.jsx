import { seededRandom } from './seeded'

const PARTICLE_COUNT = 28

const PARTICLES = (() => {
  const random = seededRandom(2026)
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    left: random() * 100,
    delay: random() * 12,
    dur: 9 + random() * 10,
    dx: (random() - 0.5) * 80,
    rot: random() * 720 - 360,
    size: 4 + random() * 6,
    opacity: 0.15 + random() * 0.4,
  }))
})()

const ORBS = [
  { x: -60, y: 80, size: 220, color: 'rgba(29,185,84,0.06)', dur: 14 },
  { x: 220, y: 300, size: 180, color: 'rgba(78,254,161,0.04)', dur: 18 },
  { x: 40, y: 580, size: 260, color: 'rgba(29,185,84,0.05)', dur: 22 },
  { x: 280, y: 720, size: 160, color: 'rgba(78,254,161,0.06)', dur: 16 },
]

const LAYER = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }

/** Leaf-shaped motes drifting up the frame, plus soft drifting glow orbs. */
export default function Ambient() {
  return (
    <div aria-hidden="true" className="rr-decor">
      <div style={{ ...LAYER, backgroundImage: 'url(/media/forest1-poster.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.1 }} />
      <div style={LAYER}>
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.4,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `rgba(78,254,161,${p.opacity * 0.6})`,
              boxShadow: `0 0 ${p.size}px rgba(29,185,84,${p.opacity * 0.5})`,
              animationName: 'rr-leaf-float',
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              '--dx': `${p.dx}px`,
              '--rot': `${p.rot}deg`,
            }}
          />
        ))}
      </div>
      <div style={LAYER}>
        {ORBS.map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              animation: `rr-orb-drift ${orb.dur}s ease-in-out infinite`,
              animationDelay: `${i * 3.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
