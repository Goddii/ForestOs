import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const NODES = [
  { id: 'consumer', label: 'Consumer', x: 180, y: 360, type: 'consumer', desc: 'Scans the jar. Enters the experience.' },
  { id: 'brand', label: 'Brand', x: 500, y: 180, type: 'brand', desc: 'Product differentiation. Traceable storytelling. Conservation evidence. Campaign data.' },
  { id: 'retailer', label: 'Retailer', x: 820, y: 180, type: 'retailer', desc: 'Shelf differentiation. Consumer engagement. Sustainability storytelling. Measurable participation.' },
  { id: 'forestos', label: 'ForestOS', x: 500, y: 360, type: 'steward', desc: 'Verification engine. Provenance chain. Evidence ledger. Cross-actor proof.' },
  { id: 'conservation', label: 'Conservation', x: 500, y: 540, type: 'steward', desc: 'Landscape activity. Verification. Funding trail. Impact reporting.' },
]

const LINKS = [
  { from: 'consumer', to: 'forestos' },
  { from: 'forestos', to: 'brand' },
  { from: 'forestos', to: 'retailer' },
  { from: 'forestos', to: 'conservation' },
  { from: 'conservation', to: 'forestos' },
]

function getNode(n) { return NODES.find(x => x.id === n) }
function getLength(line) { try { return line.getTotalLength() } catch { return 300 } }

export default function Scene4Ecosystem() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const [activeNode, setActiveNode] = useState(null)

  const lineRefs = useRef({})
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

    NODES.forEach((n, i) => {
      const ref = circleRefs.current[n.id]
      if (ref) tl.from(ref, { scale: 0, opacity: 0, duration: 0.15, ease: 'back.out(1.6)' }, i * 0.06)
    })

    LINKS.forEach((l, i) => {
      const ref = lineRefs.current[`${l.from}-${l.to}`]
      if (ref) tl.from(ref, { attr: { strokeDashoffset: getLength(ref) }, opacity: 0, duration: 0.12, ease: 'power2.out' }, 0.2 + i * 0.05)
    })

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill() }
  }, [reduced])

  function handleClick(id) {
    setActiveNode(id === activeNode ? null : id)
  }

  if (reduced) {
    return (
      <div ref={rootRef} className="pitch-scene pitch-scene-pad">
        <p className="pitch-label mb-3">Scene 04 — The ecosystem</p>
        <h2 className="pitch-display pitch-headline-sm mb-4">The scan connects commerce to the landscape.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-3xl">
          {NODES.map(n => (
            <button key={n.id} onClick={() => handleClick(n.id)} className={`rounded-xl border p-5 text-left transition-colors ${activeNode === n.id ? 'border-pitch-forest bg-pitch-forest-soft' : 'border-pitch-line bg-pitch-card'}`}>
              <p className="pitch-label">{n.label}</p>
              <p className="pitch-body-sm mt-2">{n.desc}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="pitch-scene pitch-scene-pad">
      <p className="pitch-label mb-3">Scene 04 — The ecosystem</p>
      <h2 className="pitch-display pitch-headline-sm mb-2">The scan connects commerce to the landscape.</h2>
      <p className="pitch-body mb-6 max-w-2xl">
        Click any actor to see what they receive. The chain is live.
      </p>

      <svg
        viewBox="0 0 1000 720"
        className="w-full h-auto"
        role="img"
        aria-label="Ecosystem map — click actors"
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 Z" fill="var(--pitch-forest)" />
          </marker>
        </defs>

        {LINKS.map(l => {
          const a = getNode(l.from)
          const b = getNode(l.to)
          if (!a || !b) return null
          const path = `M${a.x},${a.y} C${(a.x+b.x)/2},${a.y} ${(a.x+b.x)/2},${b.y} ${b.x},${b.y}`
          const isBack = l.from === 'conservation' && l.to === 'forestos'
          return (
            <path
              key={`${l.from}-${l.to}`}
              ref={el => { lineRefs.current[`${l.from}-${l.to}`] = el }}
              d={path}
              fill="none"
              stroke={isBack ? "var(--pitch-honey-deep)" : "var(--pitch-forest)"}
              strokeWidth={isBack ? 1.6 : 1.6}
              strokeDasharray={isBack ? "3 5" : "5 4"}
              markerEnd={isBack ? undefined : "url(#arrow)"}
              style={{ opacity: 0, strokeDashoffset: 300 }}
            />
          )
        })}

        {NODES.map(n => (
          <g key={n.id} onClick={() => handleClick(n.id)} style={{ cursor: 'pointer' }}>
            <circle
              ref={el => { circleRefs.current[n.id] = el }}
              cx={n.x} cy={n.y} r={56}
              fill="var(--pitch-forest-soft, #e8f2ec)"
              stroke="var(--pitch-forest, #176b45)"
              strokeWidth={activeNode === n.id ? 3 : 2}
              strokeDasharray={activeNode === n.id ? '4 2' : 'none'}
            />
            {/* Character representation — purposeful poses per role */}
            <g transform={`translate(${n.x},${n.y}) scale(1.1)`}>
              <circle cx={0} cy={-20} r={5.5} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
              <path d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
              {n.type === 'consumer' && (
                <>
                  <path d="M-4.5 -11 C -9 -7, -9 2, -6 6" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M4.5 -12 C 2 -20, 3 -34, 3 -46" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                  <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
                </>
              )}
              {n.type === 'brand' && (
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
              {n.type === 'retailer' && (
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
              {n.type === 'steward' && (
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
            <text x={n.x} y={n.y + 88} textAnchor="middle" className="pitch-svg-label" style={{ fill: 'var(--pitch-ink)' }}>
              {n.label}
            </text>
          </g>
        ))}

        {activeNode && (() => {
          const n = getNode(activeNode)
          return (
            <foreignObject x={50} y={50} width={900} height={220}>
              <div xmlns="http://www.w3.org/1999/xhtml" className="p-6 rounded-2xl bg-pitch-card border border-pitch-forest shadow-xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--pitch-ink)', maxWidth: '900px' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="pitch-display pitch-headline-sm text-pitch-forest">{n.label}</h3>
                  <button onClick={() => setActiveNode(null)} className="pitch-label text-pitch-ink-faint hover:text-pitch-ink">Close</button>
                </div>
                <p className="pitch-body">{n.desc}</p>
              </div>
            </foreignObject>
          )
        })()}
      </svg>
    </div>
  )
}
