import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  { day: 'DAY 0', label: 'SETUP', desc: 'Product selected. Stores confirmed. Conservation landscape named. ForestOS verification configured.', color: '#176b45' },
  { day: 'DAY 30', label: 'LAUNCH', desc: 'Jars on shelf. QR live. First scans recorded. Brand & Retailer dashboards active.', color: '#176b45' },
  { day: 'DAY 60', label: 'MEASURE', desc: 'Scan data flowing. Conservation funding triggered. Brand/Retailer engagement measured. Mid-pilot review.', color: '#e8a85c' },
  { day: 'DAY 90', label: 'VERIFY', desc: 'ForestOS verification complete. Conservation proof delivered. Evidence package for both boards.', color: '#e8a85c' },
]

export default function Scene8Pilot() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)

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

    // Timeline line draws
    tl.from('.pilot-line', { attr: { strokeDashoffset: 800 }, opacity: 0, duration: 0.3, ease: 'power2.out' }, 0)

    // Phases appear
    PHASES.forEach((p, i) => {
      tl.from(`.pilot-phase-${i}`, { y: 30, opacity: 0, duration: 0.12, ease: 'power2.out' }, 0.15 + i * 0.1)
      tl.from(`.pilot-marker-${i}`, { scale: 0, opacity: 0, duration: 0.1, ease: 'back.out(1.6)' }, 0.15 + i * 0.1)
    })

    // Final evidence badge
    tl.from('.pilot-evidence', { scale: 0, opacity: 0, duration: 0.15, ease: 'back.out(1.6)' }, 0.7)

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill() }
  }, [reduced])

  if (reduced) {
    return (
      <div ref={rootRef} className="pitch-scene pitch-scene-pad">
        <p className="pitch-label mb-3">Scene 08 — 90-day pilot</p>
        <h2 className="pitch-display pitch-headline-lg text-center mb-4">LET'S TEST IT.</h2>
        <p className="pitch-body text-center mb-12 max-w-2xl mx-auto">
          90 days. One product. Selected stores. One named conservation landscape. ForestOS verification.
        </p>
        <div className="space-y-6 max-w-4xl">
          {PHASES.map((p, i) => (
            <div key={i} className="rounded-2xl border border-pitch-line bg-pitch-card p-6 flex gap-6">
              <div className="flex flex-col items-center shrink-0 w-24 relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: p.color }}>
                  {p.day.split(' ')[1]}
                </div>
                <p className="pitch-label mt-2 text-center">{p.label}</p>
              </div>
              <div className="flex-1">
                <p className="pitch-body">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="pitch-display pitch-headline-sm text-pitch-ink">At the end of 90 days, we don't just have a story.</p>
          <p className="pitch-display pitch-headline-sm text-pitch-forest mt-2">We have evidence.</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="pitch-scene pitch-scene-pad">
      <p className="pitch-label mb-3">Scene 08 — 90-day pilot</p>
      <h2 className="pitch-display pitch-headline-lg text-center mb-4">LET'S TEST IT.</h2>
      <p className="pitch-body text-center mb-12 max-w-2xl mx-auto">
        90 days. One product. Selected stores. One named conservation landscape. ForestOS verification.
      </p>

      <svg
        viewBox="0 0 1000 720"
        className="w-full h-auto"
        role="img"
        aria-label="90-day pilot timeline"
      >
        {/* Center timeline */}
        <path className="pilot-line" d="M500,80 L500,640" fill="none" stroke="var(--pitch-forest)" strokeWidth={2} strokeDasharray="8 6" style={{ opacity: 0, strokeDashoffset: 800 }} />

        {PHASES.map((p, i) => {
          const y = 160 + i * 140
          return (
            <g key={i} className={`pilot-phase-${i}`} style={{ opacity: 0, transform: 'translateY(30px)' }}>
              {/* Marker on line */}
              <circle className={`pilot-marker-${i}`} cx={500} cy={y} r={14} fill={p.color} style={{ transformOrigin: '500px 500px', transform: 'scale(0)' }} />
              <circle cx={500} cy={y} r={22} fill="none" stroke={p.color} strokeWidth={2} strokeDasharray="4 4" />

              {/* Phase card */}
              <foreignObject x={560} y={y - 60} width={380} height={120}>
                <div xmlns="http://www.w3.org/1999/xhtml" className="p-5 rounded-xl bg-pitch-card border border-pitch-line shadow-md" style={{ fontFamily: 'Archivo, sans-serif', color: '#17251c', width: '380px' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="pitch-label" style={{ backgroundColor: p.color, color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{p.day}</span>
                    <span className="pitch-label" style={{ color: p.color }}>{p.label}</span>
                  </div>
                  <p className="pitch-body-sm">{p.desc}</p>
                </div>
              </foreignObject>
            </g>
          )
        })}

        {/* Evidence badge at bottom */}
        <foreignObject x={300} y={620} width={400} height={80} className="pilot-evidence" style={{ opacity: 0, transform: 'scale(0)', transformOrigin: '500px 660px' }}>
          <div xmlns="http://www.w3.org/1999/xhtml" className="rounded-2xl bg-pitch-forest text-white p-6 text-center shadow-xl" style={{ fontFamily: 'Archivo, sans-serif', width: '400px' }}>
            <p className="pitch-display pitch-headline-sm mb-1">At the end of 90 days</p>
            <p className="pitch-body-sm font-semibold">we don't just have a story. We have evidence.</p>
          </div>
        </foreignObject>
      </svg>

      <div className="mt-10 text-center">
        <p className="pitch-display pitch-headline-sm text-pitch-ink">At the end of 90 days, we don't just have a story.</p>
        <p className="pitch-display pitch-headline-sm text-pitch-forest mt-2">We have evidence.</p>
      </div>
    </div>
  )
}
