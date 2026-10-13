import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function Scene7Shared() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const refs = useRef({
    brand: { group: { current: null } },
    retailer: { group: { current: null } },
    forestos: { group: { current: null } },
    conservation: { group: { current: null } },
  })

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

    tl.to([refs.current.brand.group.current, refs.current.retailer.group.current], { opacity: 1, y: 0, duration: 0.15, stagger: 0.08, ease: 'power2.out' }, 0)
    tl.to(refs.current.forestos.group.current, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.2)
    tl.from('.shared-line-brand', { attr: { strokeDashoffset: 300 }, opacity: 0, duration: 0.1 }, 0.3)
    tl.from('.shared-line-retailer', { attr: { strokeDashoffset: 300 }, opacity: 0, duration: 0.1 }, 0.32)
    tl.to(refs.current.conservation.group.current, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.45)
    tl.from('.shared-line-conservation', { attr: { strokeDashoffset: 300 }, opacity: 0, duration: 0.1 }, 0.55)
    tl.to([refs.current.brand.group.current, refs.current.retailer.group.current, refs.current.forestos.group.current, refs.current.conservation.group.current], { scale: 1.05, duration: 0.03, yoyo: true, repeat: 1 }, 0.65)

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill() }
  }, [reduced])

  if (reduced) {
    return (
      <div ref={rootRef} className="pitch-scene pitch-scene-pad">
        <p className="pitch-label mb-3">Scene 07 — Shared conservation opportunity</p>
        <h2 className="pitch-display pitch-headline-sm mb-4">They don't need the same business objective to create shared conservation value.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 max-w-4xl">
          <div className="text-center p-6 rounded-2xl border border-pitch-line bg-pitch-card">
            <p className="pitch-label text-pitch-forest mb-2">Brand</p>
            <p className="pitch-body-sm">Differentiation. Traceable story. Conservation evidence.</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-pitch-line bg-pitch-card">
            <p className="pitch-label text-pitch-forest mb-2">Retailer</p>
            <p className="pitch-body-sm">Shelf differentiation. Engagement. Sustainability story.</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-pitch-line bg-pitch-card">
            <p className="pitch-label text-pitch-honey mb-2">Conservation</p>
            <p className="pitch-body-sm">Landscape activity. Verification. Funding trail. Impact.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="pitch-scene pitch-scene-pad">
      <p className="pitch-label mb-3">Scene 07 — Shared conservation opportunity</p>
      <h2 className="pitch-display pitch-headline-sm mb-2">They don't need the same business objective to create shared conservation value.</h2>
      <p className="pitch-body mb-6 max-w-2xl">
        Brand and Retailer enter independently. ForestOS connects them to conservation beneath the system.
      </p>

      <svg
        viewBox="0 0 1000 720"
        className="w-full h-auto"
        role="img"
        aria-label="Shared conservation — brand and retailer converge on ForestOS, then conservation"
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 Z" fill="var(--pitch-forest)" />
          </marker>
        </defs>

        <path className="shared-line-brand" d="M300,120 Q400,180 500,220" fill="none" stroke="var(--pitch-forest)" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#arrow)" style={{ opacity: 0, strokeDashoffset: 300 }} />
        <path className="shared-line-retailer" d="M700,120 Q600,180 500,220" fill="none" stroke="var(--pitch-forest)" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#arrow)" style={{ opacity: 0, strokeDashoffset: 300 }} />
        <path className="shared-line-conservation" d="M500,300 Q500,380 500,460" fill="none" stroke="var(--pitch-honey-deep)" strokeWidth="1.6" strokeDasharray="3 5" style={{ opacity: 0, strokeDashoffset: 300 }} />

        {/* Brand — thumbs up: participating in the shared system */}
        <g ref={el => { if (el) refs.current.brand.group.current = el }} transform="translate(300, 80) scale(0)" opacity={0}>
          <circle cx={0} cy={-20} r={5.5} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-4.5 -11 C -9 -7, -9 2, -6 6" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M4.5 -11 C 10 -15, 16 -18, 18 -6 C 20 0, 14 4, 10 2" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <g transform="translate(0,-2)">
            <rect x={-6} y={-4} width={12} height={8} rx={2} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
            <path d="M-3 0h3.5" stroke="var(--pitch-forest)" strokeWidth="1.2" />
          </g>
          <text x={0} y={90} textAnchor="middle" className="pitch-svg-label-forest">Brand</text>
          <text x={0} y={110} textAnchor="middle" className="pitch-svg-caption">Differentiation · Traceable story · Evidence</text>
        </g>

        {/* Retailer — thumbs up: participating in the shared system */}
        <g ref={el => { if (el) refs.current.retailer.group.current = el }} transform="translate(700, 80) scale(0)" opacity={0}>
          <circle cx={0} cy={-20} r={5.5} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-4.5 -11 C -9 -7, -9 2, -6 6" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M4.5 -11 C 10 -15, 16 -18, 18 -6 C 20 0, 14 4, 10 2" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <g transform="translate(0,-2)">
            <path d="M-7 2h14M-7 2l1-4h12l1 4M-4 2v3M3 2v3" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          </g>
          <text x={0} y={90} textAnchor="middle" className="pitch-svg-label-forest">Retailer</text>
          <text x={0} y={110} textAnchor="middle" className="pitch-svg-caption">Shelf diff · Engagement · Sustainability</text>
        </g>

        {/* ForestOS — offering pose: connects to both actors and conservation */}
        <g ref={el => { if (el) refs.current.forestos.group.current = el }} transform="translate(500, 220) scale(0)" opacity={0}>
          <circle cx={0} cy={-20} r={5.5} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-4.5 -11 C -12 -14, -18 -8, -20 0" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M4.5 -11 C 12 -14, 18 -8, 20 0" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <g transform="translate(0,-2)">
            <path d="M0 -5 Q4 0 0 4 Q-4 0 0 -5 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
            <path d="M0 -3 L0 3" stroke="var(--pitch-forest)" strokeWidth="1.2" />
          </g>
          <text x={0} y={100} textAnchor="middle" className="pitch-svg-title">ForestOS</text>
          <text x={0} y={118} textAnchor="middle" className="pitch-svg-caption">Verification · Provenance · Proof</text>
        </g>

        {/* Conservation — offering pose: receives value from the system */}
        <g ref={el => { if (el) refs.current.conservation.group.current = el }} transform="translate(500, 500) scale(0)" opacity={0}>
          <circle cx={0} cy={-20} r={5.5} stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M0 -14 C -5 -8, -4 4, 0 10 C 4 4, 5 -8, 0 -14 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-4.5 -11 C -12 -14, -18 -8, -20 0" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M4.5 -11 C 12 -14, 18 -8, 20 0" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M-3.5 10 L-6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <path d="M3.5 10 L 6 18" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
          <g transform="translate(0,-2)">
            <path d="M0 -5 Q4 0 0 4 Q-4 0 0 -5 Z" stroke="var(--pitch-forest)" strokeWidth="2.4" fill="none" />
            <path d="M0 -3 L0 3" stroke="var(--pitch-forest)" strokeWidth="1.2" />
          </g>
          <text x={0} y={95} textAnchor="middle" className="pitch-svg-label-forest">Conservation</text>
          <text x={0} y={115} textAnchor="middle" className="pitch-svg-caption">Landscape activity · Verification · Funding trail · Impact</text>
        </g>
      </svg>

      <p className="pitch-body mt-10 max-w-2xl text-center mx-auto">
        <strong className="text-pitch-forest">Brand</strong> and <strong className="text-pitch-forest">Retailer</strong> participate independently.
        <br />
        <strong className="text-pitch-honey">Conservation</strong> sits beneath the shared system — verified by ForestOS.
      </p>
    </div>
  )
}
