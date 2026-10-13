import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import QrCode from '../../components/brand/QrCode'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const HONEY_URL = 'https://forest-os-nine.vercel.app/honey'

export default function Scene1Hero() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef(null)
  const [qrSize] = useState(180)

  // Parallax drift of the jar on scroll — a subtle cinematic cue.
  useEffect(() => {
    if (reduced || !sectionRef.current) return undefined
    const img = sectionRef.current.querySelector('.pitch-hero-jar')
    if (!img) return undefined
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.6,
    })
    const tl = gsap.timeline({ scrollTrigger: st })
    tl.to(img, { y: -18, duration: 0.5 }, 0)
    return () => { st.kill(); tl.kill() }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="pitch-scene relative flex min-h-[110vh] items-center justify-center overflow-hidden bg-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
         style={{
          background: 'radial-gradient(circle, var(--pitch-forest-soft) 0%, rgba(232,242,236,0) 65%)',
          opacity: 0.7,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <p className="pitch-label mb-6">One jar. One scan. One verified story.</p>

        <h1 className="pitch-display pitch-headline-lg text-pitch-ink mb-6">
          What if this jar
          <br />
          <span className="text-pitch-forest italic">could prove</span>
          <br />
          what it helped protect?
        </h1>

        <div className="mb-10 flex justify-center">
          <img
            src="/pitch/bree.jpeg"
            alt="Bree's Bees Forest Honey — single jar"
            className="pitch-hero-jar h-auto w-64 object-contain"
            loading="eager"
          />
        </div>

        <p className="pitch-body mb-12 max-w-xl">
          Scan the jar. Enter the experience. Behind that single scan is a
          chain — from the consumer to the brand, the retailer, ForestOS, and
          the landscape that gets protected by it.
        </p>

        <div className="mb-6 flex flex-col items-center gap-6">
          <div className="rounded-[1.25rem] border border-pitch-line bg-pitch-card p-6 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
            <QrCode value={HONEY_URL} label="Bree's Bees honey scan link" size={qrSize} />
            <p className="pitch-label mt-4 text-[10px] text-pitch-ink-faint">
              forest-os-nine.vercel.app/honey
            </p>
          </div>

          <a
            href={HONEY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-pitch-forest px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-pitch-forest-deep"
          >
            SCAN THE REAL EXPERIENCE
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pitch-ink-faint">
            Scroll to discover
          </span>
          <div className="h-16 w-px bg-pitch-ink-faint animate-pulse" style={{ animationDuration: '1.8s' }} />
        </div>
      </div>
    </section>
  )
}
