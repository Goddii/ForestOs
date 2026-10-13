import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { id: 'product', label: 'Product', x: 140, y: 360, type: null, desc: 'Bree\'s Bees Forest Honey. Single-origin. Verified harvest.' },
  { id: 'consumer', label: 'Consumer', x: 280, y: 360, type: 'consumer', desc: 'Scans the jar. Enters the verified experience.' },
  { id: 'scan', label: 'Scan', x: 420, y: 360, type: null, desc: 'QR unlocks ForestOS. Provenance locked.' },
  { id: 'forestos', label: 'ForestOS', x: 560, y: 360, type: 'steward', desc: 'Verification engine. Provenance chain. Evidence ledger.' },
  { id: 'verification', label: 'Verification', x: 700, y: 360, type: null, desc: 'Immutable record. Polygon PoS. Custody match.' },
  { id: 'conservation', label: 'Conservation', x: 840, y: 360, type: 'steward', desc: 'Landscape activity. Funding trail. Impact reporting.' },
  { id: 'brand', label: 'Brand', x: 560, y: 180, type: 'brand', desc: 'Differentiation. Traceable story. Conservation evidence. Campaign data.' },
  { id: 'retailer', label: 'Retailer', x: 700, y: 180, type: 'retailer', desc: 'Shelf differentiation. Engagement. Sustainability story. Measurable participation.' },
]

const PATH = [
  { from: 'product', to: 'consumer' },
  { from: 'consumer', to: 'scan' },
  { from: 'scan', to: 'forestos' },
  { from: 'forestos', to: 'verification' },
  { from: 'verification', to: 'conservation' },
  { from: 'forestos', to: 'brand' },
  { from: 'forestos', to: 'retailer' },
]

function getNode(id) { return STEPS.find(s => s.id === id) }
function getLength(line) { try { return line.getTotalLength() } catch { return 200 } }

export default function Scene5Follow() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const [activeStep, setActiveStep] = useState(null)
  const [jarPos, setJarPos] = useState({ x: 140, y: 360 })

  const pathRefs = useRef({})
  const circleRefs = useRef({})

  useEffect(() => {
    if (reduced) return undefined
    if (!rootRef.current) return undefined

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 0.5,
      },
    })

    STEPS.forEach((s, i) => {
      const ref = circleRefs.current[s.id]
      if (ref) tl.from(ref, { scale: 0, opacity: 0, duration: 0.1, ease: 'back.out(1.6)' }, i * 0.05)
    })

    PATH.forEach((p, i) => {
      const ref = pathRefs.current[`${p.from}-${p.to}`]
      if (ref) tl.from(ref, { attr: { strokeDashoffset: getLength(ref) }, opacity: 0, duration: 0.12 }, 0.3 + i * 0.05)
    })

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill() }
  }, [reduced])

  function handleClick(id) {
    setActiveStep(id === activeStep ? null : id)
    const target = getNode(id)
    if (target) {
      gsap.to(jarPos, { x: target.x, y: target.y, duration: 0.6, ease: 'power2.inOut', onUpdate: () => setJarPos({...jarPos}) })
    }
  }

  if (reduced) {
    return (
      <div ref={rootRef} className="pitch-scene pitch-scene-pad">
        <p className="pitch-label mb-3">Scene 05 — Follow one jar</p>
        <h2 className="pitch-display pitch-headline-sm mb-4">Click a node to follow the jar.</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-4xl">
          {STEPS.map(s => (
            <button key={s.id} onClick={() => handleClick(s.id)} className={`rounded-xl border p-4 text-left transition-colors ${activeStep === s.id ? 'border-pitch-forest bg-pitch-forest-soft' : 'border-pitch-line bg-pitch-card'}`}>
              <p className="pitch-label">{s.label}</p>
              <p className="pitch-body-sm mt-2">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="pitch-scene pitch-scene-pad">
      <p className="pitch-label mb-3">Scene 05 — Follow one jar</p>
      <h2 className="pitch-display pitch-headline-sm mb-2">Click any step to follow the jar through the chain.</h2>
      <p className="pitch-body mb-6 max-w-2xl">
        The jar animates to each actor. Click to see what they receive.
      </p>

      <svg
        viewBox="0 0 1000 720"
        className="w-full h-auto"
        role="img"
        aria-label="Follow one jar — click steps"
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 Z" fill="var(--pitch-forest)" />
          </marker>
        </defs>

        {PATH.map(p => {
          const a = getNode(p.from)
          const b = getNode(p.to)
          if (!a || !b) return null
          const midX = (a.x + b.x) / 2
          const ctrlY = a.y - 60
          const path = `M${a.x},${a.y} Q${midX},${ctrlY} ${b.x},${b.y}`
          return (
            <path
              key={`${p.from}-${p.to}`}
              ref={el => { pathRefs.current[`${p.from}-${p.to}`] = el }}
              d={path}
              fill="none"
              stroke="var(--pitch-forest)"
              strokeWidth={1.6}
              strokeDasharray="5 4"
              markerEnd="url(#arrow)"
              style={{ opacity: 0, strokeDashoffset: 200 }}
            />
          )
        })}

        {STEPS.map(s => (
          <g key={s.id} onClick={() => handleClick(s.id)} style={{ cursor: 'pointer' }}>
            <circle
              ref={el => { circleRefs.current[s.id] = el }}
              cx={s.x} cy={s.y} r={56}
              fill="var(--pitch-forest-soft, #e8f2ec)"
              stroke="var(--pitch-forest, #176b45)"
              strokeWidth={activeStep === s.id ? 3 : 2}
              strokeDasharray={activeStep === s.id ? '4 2' : 'none'}
            />
            {/* Character representation — purposeful poses per role */}
            <g transform={`translate(${s.x},${s.y}) scale(1.1)`}>
              <circle cx={0} cy={-20} r={5.5} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
              <path d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
              {s.type === 'consumer' && (
                <>
                  <path d="M-4.5 -11 C -9 -7, -9 2, -6 6" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M4.5 -12 C 2 -20, 3 -34, 3 -46" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                </>
              )}
              {s.type === 'brand' && (
                <>
                  <path d="M-4.5 -11 C -9 -7, -9 2, -6 6" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M4.5 -11 C 10 -15, 16 -18, 18 -6 C 20 0, 14 4, 10 2" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <g transform="translate(0,-2)">
                    <rect x={-6} y={-4} width={12} height={8} rx={2} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                    <path d="M-3 0h3.5" stroke="var(--pitch-forest)" strokeWidth="1.2" />
                  </g>
                </>
              )}
              {s.type === 'retailer' && (
                <>
                  <path d="M-4.5 -11 C -9 -7, -9 2, -6 6" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M4.5 -11 C 10 -15, 16 -18, 18 -6 C 20 0, 14 4, 10 2" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <g transform="translate(0,-2)">
                    <path d="M-7 2h14M-7 2l1-4h12l1 4M-4 2v3M3 2v3" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  </g>
                </>
              )}
              {s.type === 'steward' && (
                <>
                  <path d="M-4.5 -11 C -12 -14, -18 -8, -20 0" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M4.5 -11 C 12 -14, 18 -8, 20 0" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <g transform="translate(0,-2)">
                    <path d="M0 -5 Q4 0 0 4 Q-4 0 0 -5 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                    <path d="M0 -3 L0 3" stroke="var(--pitch-forest)" strokeWidth="1.2" />
                  </g>
                </>
              )}
            </g>
            {!s.type && s.id === 'product' && (
              <g transform={`translate(${s.x - 50},${s.y - 50})`}>
                {/* Jar glyph */}
                <circle cx={50} cy={50} r={30} stroke="var(--pitch-honey-deep)" strokeWidth="2.4" fill="rgba(232,168,92,0.15)" />
                <rect x={40} y={20} width={20} height={12} rx={2} fill="var(--pitch-forest)" stroke="var(--pitch-forest)" strokeWidth="1" />
              </g>
            )}
            <text x={s.x} y={s.y + 88} textAnchor="middle" className="pitch-svg-label" style={{ fill: 'var(--pitch-ink)' }}>
              {s.label}
            </text>
          </g>
        ))}

        {/* Moving jar */}
        <g transform={`translate(${jarPos.x - 50},${jarPos.y - 50})`}>
          <circle cx={50} cy={50} r={30} stroke="var(--pitch-honey-deep)" strokeWidth={2.4} fill="rgba(232,168,92,0.15)" />
          <rect x={40} y={20} width={20} height={12} rx={2} fill="var(--pitch-forest)" stroke="var(--pitch-forest)" strokeWidth={1} />
        </g>

        {activeStep && (() => {
          const s = getNode(activeStep)
          return (
            <foreignObject x={50} y={50} width={900} height={200}>
              <div xmlns="http://www.w3.org/1999/xhtml" className="p-6 rounded-2xl bg-pitch-card border border-pitch-forest shadow-xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--pitch-ink)', maxWidth: '900px' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="pitch-display pitch-headline-sm text-pitch-forest">{s.label}</h3>
                  <button onClick={() => setActiveStep(null)} className="pitch-label text-pitch-ink-faint hover:text-pitch-ink">Close</button>
                </div>
                <p className="pitch-body">{s.desc}</p>
              </div>
            </foreignObject>
          )
        })()}
      </svg>
    </div>
  )
}
