import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import Character, { POSES } from '../components/Character'
import Jar from '../components/Jar'
import { useCharacterRefs, useJarRefs } from '../components/usePitchRefs'

gsap.registerPlugin(ScrollTrigger)

const X_CONSUMER_START = 60
const X_JAR = 300
const Y_GROUND = 560
const X_PORTAL = 500
const Y_PORTAL = 360
const X_FORESTOS = 500
const Y_FORESTOS = 220
const X_BRAND = 180
const Y_BRAND = 120
const X_RETAILER = 820
const Y_RETAILER = 120
const X_STEWARD = 500
const Y_STEWARD = 60

export default function Scene3Journey() {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef(null)

  // Character refs
  const consumerRefs = useCharacterRefs()
  const brandRefs = useCharacterRefs()
  const retailerRefs = useCharacterRefs()
  const stewardRefs = useCharacterRefs()

  // Jar refs
  const jarRefs = useJarRefs()

  // Other SVG element refs
  const phoneGroupRef = useRef(null)
  const phoneScreenRef = useRef(null)
  const portalRingRef = useRef(null)
  const portalCoreRef = useRef(null)
  const forestosGroupRef = useRef(null)
  const forestosShieldRef = useRef(null)
  const forestosLeafRef = useRef(null)
  const proofTokenRef = useRef(null)
  const fieldBgRef = useRef(null)
  const connectionBrandRef = useRef(null)
  const connectionRetailerRef = useRef(null)
  const connectionStewardRef = useRef(null)
  const proofLineRef = useRef(null)
  const scanBeamRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    if (!rootRef.current) return undefined

    const g = (obj, key) => obj[key].current
    const at = (node, vars) => { if (node) gsap.set(node, vars) }

    // Starting layout
    at(g(consumerRefs, 'group'), { x: X_CONSUMER_START, y: Y_GROUND - 120 })
    at(g(jarRefs, 'group'), { x: X_JAR, y: Y_GROUND - 120 })
    at(phoneGroupRef.current, { x: X_CONSUMER_START + 30, y: Y_GROUND - 160, opacity: 0, scale: 0.8 })
    at(portalRingRef.current, { x: X_JAR + 30, y: Y_GROUND - 260, opacity: 0, scale: 0.2 })
    at(portalCoreRef.current, { opacity: 0, scale: 0.4 })
    at(forestosGroupRef.current, { x: X_PORTAL, y: Y_PORTAL, opacity: 0 })
    at(forestosShieldRef.current, { scale: 0.4, transformOrigin: '0px 0px' })
    at(forestosLeafRef.current, { rotation: 12, transformOrigin: '0px 0px' })
    at(g(brandRefs, 'group'), { x: X_BRAND, y: Y_BRAND, opacity: 0 })
    at(g(retailerRefs, 'group'), { x: X_RETAILER, y: Y_RETAILER, opacity: 0 })
    at(g(stewardRefs, 'group'), { x: X_STEWARD, y: Y_STEWARD, opacity: 0 })
    at(proofTokenRef.current, { x: X_STEWARD, y: Y_STEWARD, opacity: 0 })
    at(jarRefs.glow, { opacity: 0, scale: 1 })
    at(phoneScreenRef.current, { opacity: 0 })
    at(fieldBgRef.current, { opacity: 0 })
    at(connectionBrandRef.current, { attr: { x2: X_PORTAL, y2: Y_PORTAL }, opacity: 0 })
    at(connectionRetailerRef.current, { attr: { x2: X_PORTAL, y2: Y_PORTAL }, opacity: 0 })
    at(connectionStewardRef.current, { attr: { x2: X_PORTAL, y2: Y_PORTAL }, opacity: 0 })
    at(proofLineRef.current, { attr: { x2: X_PORTAL, y2: Y_PORTAL }, opacity: 0 })
    at(scanBeamRef.current, { opacity: 0, attr: { x1: X_JAR + 30, y1: Y_GROUND - 260, x2: X_JAR + 30, y2: Y_GROUND - 260 } })

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 18%',
        end: 'bottom 18%',
        scrub: 0.5,
      },
    })

    // 1. Consumer approaches jar, reaches toward it (0.00-0.18)
    tl.to(g(consumerRefs, 'group'), { x: X_JAR - 110, duration: 0.12 }, 0)
    tl.to(g(consumerRefs, 'rArm'), {
      attr: { d: "M4.5 -12 C 2 -20, 16 -34, 22 -48" },
      duration: 0.1, ease: 'power2.out',
    }, 0.08)

    // 2. Jar lifts, QR glow activates (0.18-0.30)
    tl.to(g(jarRefs, 'group'), { y: Y_GROUND - 260, duration: 0.1 }, 0.18)
    tl.to(jarRefs.glow, { opacity: 0.6, duration: 0.05 }, 0.26)
    tl.to(jarRefs.glow, { opacity: 0.25, duration: 0.05 }, 0.31)

    // 3. Phone raises from consumer's hand toward jar (0.30-0.45)
    tl.to(phoneGroupRef.current, { opacity: 1, duration: 0.05 }, 0.32)
    tl.to(phoneScreenRef.current, { opacity: 1, duration: 0.03 }, 0.37)
    tl.to(phoneGroupRef.current, {
      x: X_JAR + 30, y: Y_GROUND - 260, duration: 0.13, ease: 'power2.inOut',
    }, 0.35)

    // 4. Scan pulse: jar glow intensifies, consumer's reaching arm pulls back (0.45-0.55)
    tl.to(scanBeamRef.current, {
      opacity: 0.5,
      attr: { x1: X_JAR - 30, y1: Y_GROUND - 260 },
      duration: 0.04,
    }, 0.45)
    tl.to(jarRefs.glow, { opacity: 0.9, scale: 1.3, duration: 0.04 }, 0.45)
    tl.to(g(consumerRefs, 'rArm'), {
      attr: { d: POSES.standing.rArm },
      duration: 0.06, ease: 'power2.out',
    }, 0.47)
    tl.to(scanBeamRef.current, { opacity: 0, duration: 0.04 }, 0.49)
    tl.to(jarRefs.glow, { opacity: 0.15, duration: 0.04 }, 0.49)

    // 5. Phone becomes portal at jar position (0.55-0.65)
    tl.to(phoneGroupRef.current, { opacity: 0, scale: 0.8, duration: 0.05 }, 0.55)
    tl.to(portalRingRef.current, {
      opacity: 1, scale: 1, x: X_JAR + 30, y: Y_GROUND - 260, duration: 0.08,
    }, 0.55)
    tl.to(portalRingRef.current, { scale: 1.4, duration: 0.04 }, 0.62)
    tl.to(portalCoreRef.current, { opacity: 1, scale: 1, duration: 0.06 }, 0.59)

    // 6. Consumer and jar move through portal to center (0.65-0.75)
    tl.to(g(consumerRefs, 'group'), { x: X_PORTAL, y: Y_PORTAL, opacity: 0, duration: 0.08 }, 0.65)
    tl.to(g(jarRefs, 'group'), { x: X_PORTAL, y: Y_PORTAL, opacity: 0, duration: 0.08 }, 0.65)
    tl.to(fieldBgRef.current, { opacity: 1, duration: 0.1 }, 0.67)
    tl.to(portalRingRef.current, { opacity: 0, duration: 0.05 }, 0.72)

    // 7. ForestOS mark appears at center (0.75-0.85)
    tl.to(forestosGroupRef.current, { opacity: 1, duration: 0.05 }, 0.75)
    tl.to(forestosShieldRef.current, { scale: 1, duration: 0.06 }, 0.75)
    tl.to(forestosLeafRef.current, { rotation: -12, duration: 0.06, ease: 'back.out(1.4)' }, 0.8)

    // 8. Branch lines radiate outward, actors appear with purposeful poses (0.85-0.97)
    tl.to(connectionBrandRef.current, { opacity: 1, attr: { x2: X_BRAND, y2: Y_BRAND }, duration: 0.07 }, 0.87)
    tl.to(connectionRetailerRef.current, { opacity: 1, attr: { x2: X_RETAILER, y2: Y_RETAILER }, duration: 0.07 }, 0.89)
    tl.to(connectionStewardRef.current, { opacity: 1, attr: { x2: X_STEWARD, y2: Y_STEWARD }, duration: 0.07 }, 0.91)

    tl.to(g(brandRefs, 'group'), { opacity: 1, duration: 0.04 }, 0.9)
    tl.to(g(retailerRefs, 'group'), { opacity: 1, duration: 0.04 }, 0.93)
    tl.to(g(stewardRefs, 'group'), { opacity: 1, duration: 0.04 }, 0.95)
    tl.to([g(brandRefs, 'group'), g(retailerRefs, 'group'), g(stewardRefs, 'group')], {
      scale: 1.06, duration: 0.02, yoyo: true, repeat: 1, transformOrigin: '0px 0px',
    }, 0.97)

    // 10. Proof returns to ForestOS (0.97-1.00)
    tl.to(proofLineRef.current, { opacity: 1, attr: { x1: X_PORTAL, y1: Y_PORTAL }, duration: 0.02 }, 0.975)
    tl.to(proofTokenRef.current, { opacity: 1, duration: 0.02 }, 0.975)
    tl.to(proofTokenRef.current, { x: X_PORTAL, y: Y_PORTAL, duration: 0.03, ease: 'power2.inOut' }, 0.99)

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [reduced, consumerRefs, brandRefs, retailerRefs, stewardRefs, jarRefs])

  if (reduced) {
    return (
      <div ref={rootRef} className="pitch-scene pitch-scene-pad">
        <div className="max-w-3xl">
          <p className="pitch-label mb-3">Scene 03 — The hidden journey</p>
          <h2 className="pitch-display pitch-headline-sm mb-4">
            Behind the scan is a chain.
          </h2>
          <p className="pitch-body mb-6">
            Consumer → Product → Scan → ForestOS → Brand · Retailer ·
            Conservation → Verified proof.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {['Consumer', 'Brand', 'Retailer', 'ForestOS', 'Conservation'].map((n) => (
              <div key={n} className="rounded-xl border border-pitch-line bg-pitch-card p-4">
                <p className="pitch-label">{n}</p>
                <p className="pitch-body-sm">Connected by the scan.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="pitch-scene pitch-scene-pad">
      <p className="pitch-label mb-3">Scene 03 — The hidden journey</p>
      <h2 className="pitch-display pitch-headline-sm mb-2">
        What happens behind the scan.
      </h2>
      <p className="pitch-body mb-6 max-w-2xl">
        Scroll to follow one jar through the chain — from the consumer to
        ForestOS, out to the brand and the retailer, and back as proof.
      </p>

      <svg
        viewBox="0 0 1000 720"
        className="w-full h-auto"
        role="img"
        aria-label="The hidden journey — scroll to follow"
      >
        <defs>
          <linearGradient id="portalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pitch-forest)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--pitch-forest)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect ref={fieldBgRef} x="0" y="0" width="1000" height="720" rx="24" fill="var(--pitch-paper)" opacity={0} />

        <line x1="40" y1={Y_GROUND} x2="960" y2={Y_GROUND} stroke="var(--pitch-line-strong)" strokeWidth="1" strokeDasharray="4 6" />

        <line ref={connectionBrandRef} x1={X_PORTAL} y1={Y_PORTAL} x2={X_PORTAL} y2={Y_PORTAL} stroke="var(--pitch-forest)" strokeWidth="1.6" strokeDasharray="5 4" opacity={0} />
        <line ref={connectionRetailerRef} x1={X_PORTAL} y1={Y_PORTAL} x2={X_PORTAL} y2={Y_PORTAL} stroke="var(--pitch-forest)" strokeWidth="1.6" strokeDasharray="5 4" opacity={0} />
        <line ref={connectionStewardRef} x1={X_PORTAL} y1={Y_PORTAL} x2={X_PORTAL} y2={Y_PORTAL} stroke="var(--pitch-forest)" strokeWidth="1.6" strokeDasharray="5 4" opacity={0} />
        <line ref={proofLineRef} x1={X_PORTAL} y1={Y_PORTAL} x2={X_STEWARD} y2={Y_STEWARD} stroke="var(--pitch-honey-deep)" strokeWidth="1.6" strokeDasharray="3 5" opacity={0} />

        {/* Scan beam (phone → jar QR, appears during scan) */}
        <line ref={scanBeamRef} x1={X_JAR + 30} y1={Y_GROUND - 260} x2={X_JAR + 30} y2={Y_GROUND - 260} stroke="var(--pitch-honey)" strokeWidth="1.5" strokeDasharray="2 3" opacity={0} />

        <g ref={consumerRefs.group}>
          <Character type="consumer" scale={1}
            headRef={consumerRefs.head}
            torsoRef={consumerRefs.torso}
            lArmRef={consumerRefs.lArm}
            rArmRef={consumerRefs.rArm}
            lLegRef={consumerRefs.lLeg}
            rLegRef={consumerRefs.rLeg}
          />
        </g>

        <g ref={jarRefs.group}>
          <circle ref={jarRefs.glow} cx={50} cy={50} r={64} fill="var(--pitch-honey)" opacity={0} />
          <Jar width={96}
            bodyRef={jarRefs.body}
            lidRef={jarRefs.lid}
            labelRef={jarRefs.label}
            qrRef={jarRefs.qr}
            glowRef={jarRefs.glow}
          />
        </g>

        <g ref={phoneGroupRef}>
          <rect x={-22} y={-34} width={44} height={68} rx={8} fill="var(--pitch-card)" stroke="var(--pitch-ink)" strokeWidth="1.6" />
          <rect ref={phoneScreenRef} x={-18} y={-30} width={36} height={40} rx={4} fill="var(--pitch-forest)" />
          <circle cx={0} cy={26} r={5} fill="none" stroke="var(--pitch-ink)" strokeWidth="1.6" />
        </g>

        <g ref={portalRingRef}>
          <circle cx={0} cy={0} r={34} fill="none" stroke="var(--pitch-forest)" strokeWidth="1.2" strokeDasharray="3 4" />
          <circle ref={portalCoreRef} cx={0} cy={0} r={26} fill="url(#portalGrad)" stroke="var(--pitch-forest)" strokeWidth="1.6" />
        </g>

        <g ref={forestosGroupRef}>
          <g ref={forestosShieldRef}>
            <path d="M0 -22 L14 -12 L14 6 Q14 18 0 22 Q-14 18 -14 6 L-14 -12 Z" fill="var(--pitch-card)" stroke="var(--pitch-forest)" strokeWidth="1.6" />
          </g>
          <g ref={forestosLeafRef}>
            <path d="M0 -9 Q6 0 0 9 Q-6 0 0 -9 Z" fill="var(--pitch-forest)" />
            <path d="M0 -7 L0 7" stroke="var(--pitch-paper)" strokeWidth="0.8" />
          </g>
        </g>

        <g ref={brandRefs.group}>
          <Character type="brand" scale={0.85} pose="pointing"
            headRef={brandRefs.head} torsoRef={brandRefs.torso}
            lArmRef={brandRefs.lArm} rArmRef={brandRefs.rArm}
            lLegRef={brandRefs.lLeg} rLegRef={brandRefs.rLeg}
          />
          <text x={0} y={38} textAnchor="middle" className="pitch-svg-label" style={{ fill: 'var(--pitch-ink)' }}>Brand</text>
        </g>

        <g ref={retailerRefs.group}>
          <Character type="retailer" scale={0.85} pose="thumbsup"
            headRef={retailerRefs.head} torsoRef={retailerRefs.torso}
            lArmRef={retailerRefs.lArm} rArmRef={retailerRefs.rArm}
            lLegRef={retailerRefs.lLeg} rLegRef={retailerRefs.rLeg}
          />
          <text x={0} y={38} textAnchor="middle" className="pitch-svg-label" style={{ fill: 'var(--pitch-ink)' }}>Retailer</text>
        </g>

        <g ref={stewardRefs.group}>
          <Character type="steward" scale={0.85} pose="offering"
            headRef={stewardRefs.head} torsoRef={stewardRefs.torso}
            lArmRef={stewardRefs.lArm} rArmRef={stewardRefs.rArm}
            lLegRef={stewardRefs.lLeg} rLegRef={stewardRefs.rLeg}
          />
          <text x={0} y={38} textAnchor="middle" className="pitch-svg-label" style={{ fill: 'var(--pitch-ink)' }}>Conservation</text>
        </g>

        <g ref={proofTokenRef}>
          <circle cx={0} cy={0} r={8} fill="var(--pitch-honey)" stroke="var(--pitch-ink)" strokeWidth="1.2" />
          <path d="M-3 0 L-1 2.5 L3.5 -2.5" fill="none" stroke="var(--pitch-card)" strokeWidth="1.2" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  )
}
