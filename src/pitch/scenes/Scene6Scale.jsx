import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const DEFAULTS = {
  jarsPerMonth: 5000,
  scanRate: 12,
  treesPerJar: 5,
}

const MAXES = { jarsPerMonth: 50000, scanRate: 100, treesPerJar: 20 }
const LABELS = {
  jarsPerMonth: 'Jars sold per month',
  scanRate: 'Scan rate (%)',
  treesPerJar: 'Native trees preserved per jar',
}

export default function Scene6Scale() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)
  const [values, setValues] = useState({ ...DEFAULTS })

  const derived = {
    scansPerMonth: Math.round(values.jarsPerMonth * (values.scanRate / 100)),
    treesPerYear: values.jarsPerMonth * values.treesPerJar * 12,
    co2PerYear: values.jarsPerMonth * 12.5 * 12,
    shoppersWithBrand: Math.round(values.jarsPerMonth * (values.scanRate / 100)),
  }

  function handleChange(key, val) {
    const num = Math.max(0, Math.min(MAXES[key] || 100000, parseInt(val, 10) || 0))
    setValues(v => ({ ...v, [key]: num }))
  }

  function handleSlider(key, e) {
    handleChange(key, e.target.value)
  }

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

    tl.from('.scale-input', { y: 24, opacity: 0, duration: 0.1, stagger: 0.06, ease: 'power2.out' }, 0)

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill() }
  }, [reduced])

  return (
    <div ref={rootRef} className="pitch-scene pitch-scene-pad">
      <p className="pitch-label mb-3">Scene 06 — What happens if this scales?</p>
      <h2 className="pitch-display pitch-headline-sm mb-2">Adjust the assumptions. The model responds.</h2>
      <p className="pitch-body mb-8 max-w-xl text-pitch-ink-soft">
        All figures are illustrative. Replace with verified values before sharing.
      </p>

      <div className="space-y-6 max-w-lg">
        {Object.keys(DEFAULTS).map(key => (
          <div key={key} className="scale-input bg-pitch-card border border-pitch-line rounded-xl p-5">
            <label className="block pitch-label mb-2">{LABELS[key]}</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={MAXES[key]}
                value={values[key]}
                onChange={e => handleSlider(key, e)}
                className="flex-1 accent-pitch-forest h-2"
              />
              <input
                type="number"
                value={values[key]}
                onChange={e => handleChange(key, e.target.value)}
                min="0"
                max={MAXES[key]}
                className="w-24 px-3 py-2 rounded-lg border border-pitch-line bg-pitch-paper text-pitch-ink text-center focus:outline-none focus:ring-2 focus:ring-pitch-forest"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl">
        {[
          { label: 'Scans/month', value: derived.scansPerMonth.toLocaleString() },
          { label: 'Trees/year', value: derived.treesPerYear.toLocaleString() },
          { label: 'CO₂/year (kg)', value: derived.co2PerYear.toLocaleString() },
          { label: 'Shoppers with brand', value: derived.shoppersWithBrand.toLocaleString() },
        ].map((d, i) => (
          <div key={i} className="rounded-xl border border-pitch-line bg-pitch-card p-5 text-center">
            <p className="pitch-label">{d.label}</p>
            <p className="pitch-display pitch-headline-sm text-pitch-forest mt-1">{d.value}</p>
          </div>
        ))}
      </div>

      <p className="pitch-body-sm text-pitch-ink-faint mt-6 max-w-xl">
        No conversion formulas are manufactured. This demonstrates the model, not fabricated impact statistics.
      </p>
    </div>
  )
}
