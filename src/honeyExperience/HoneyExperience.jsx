import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Download,
  Droplet,
  ExternalLink,
  Fingerprint,
  Leaf,
  MapPin,
  Menu,
  Share2,
  ShieldCheck,
  Sparkles,
  TreePine,
  Users,
  X,
} from 'lucide-react'

import CountUp from '../components/ui/CountUp'
import AnimatedContent from './components/AnimatedContent'
import { Card } from './components/HoneyCard'
import DecryptText from './components/DecryptText'
import SegmentTabs from './components/SegmentTabs'
import SwipeToast from './components/SwipeToast'
import Magnet from './components/Magnet'
import SloshGauge from './components/SloshGauge'
import ProductMobile from './components/ProductMobile'

import './honey.css'

const ease = [0.22, 1, 0.36, 1]

const beesImage = '/media/honey/bees.jpg'
const brandLogo = '/media/honey/logobrees.jpeg'
const handsImage = '/media/honey/hands.jpg'
const honeyVideo = '/media/honey/honey_video.mp4'
const waterTreeVideo = '/media/honey/watertree.mp4'

function Button({ children, className = '', onClick, ariaLabel, ariaExpanded }) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`dewdrop relative inline-flex items-center justify-center overflow-hidden transition-transform duration-200 ${className}`}
    >
      {children}
    </motion.button>
  )
}

function Badge({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full ${className}`}>{children}</span>
}

// Tabs/TabsList/TabsTrigger removed — the segmented control now lives in
// components/SegmentTabs.jsx (ARIA tab semantics + spring thumb).

function Accordion({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

function AccordionContent({ open, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 28, mass: 0.75 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Card now lives in components/HoneyCard.jsx — one radius (rounded-3xl,
// 24px = --honey-radius), GlareHover honey-glint as the hover affordance,
// AnimatedContent entrance. Callers must not pass a radius class.

// Reveal keeps its old call signature (distance 20, same easing feel) but
// delegates to the shared AnimatedContent wrapper.
const Reveal = (props) => <AnimatedContent distance={20} {...props} />

const stats = [
  { value: 100, suffix: '%', label: 'Pure Organic', icon: Sparkles },
  { value: 17.2, suffix: '%', label: 'Moisture', icon: Droplet },
  { value: 42, suffix: '', label: 'Hives Protected', icon: ShieldCheck },
]

const flavors = [
  { label: 'Floral notes', value: 92, note: 'Wild orchid · acacia' },
  { label: 'Density', value: 78, note: 'Slow, velvet body' },
  { label: 'Smoothness', value: 88, note: 'Silken finish' },
  { label: 'Wild aroma', value: 84, note: 'Forest floor · citrus' },
]

function HoneyMark() {
  // The brand logo ships as a JPEG on a white ground, so it becomes a
  // circular badge: the image fills the chip edge-to-edge inside a 2px
  // amber ring (the ring keeps the mark's glow language; the white corners
  // of the JPEG become the badge itself, so nothing seams against the
  // dark UI). Decorative — the adjacent wordmark carries the name for
  // screen readers.
  return (
    <div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-amber-400 p-[2px] shadow-[0_0_24px_rgba(232,168,92,.35)]">
      <img
        src={brandLogo}
        alt=""
        width={36}
        height={36}
        draggable="false"
        className="size-full rounded-full object-cover"
      />
      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-emerald-950 bg-cream" />
    </div>
  )
}

function SectionLabel({ number, children }) {
  return (
    <div className="mb-3.5 flex items-center gap-2.5">
      <span className="font-mono text-xs font-bold tracking-widest text-amber-400">{number}</span>
      <span className="h-px w-6 bg-amber-500/50" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/70">{children}</span>
    </div>
  )
}

function BlurWords({ text }) {
  return (
    <span className="inline-flex flex-wrap gap-x-[0.2em]">
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.15 + index * 0.08, duration: 0.65, ease }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

function LiquidParticles({ reduced }) {
  const count = reduced ? 0 : 12
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-amber-300/70 shadow-[0_0_20px_rgba(245,158,11,.55)]"
          style={{
            width: `${4 + (index % 4) * 3}px`,
            height: `${4 + (index % 4) * 3}px`,
            left: `${8 + ((index * 19) % 87)}%`,
            top: `${12 + ((index * 23) % 73)}%`,
          }}
          animate={reduced ? {} : { y: [0, -8 - (index % 3) * 5, 0], x: [0, index % 2 ? 4 : -4, 0], opacity: [0.25, 0.9, 0.25] }}
          transition={reduced ? {} : { duration: 2.8 + (index % 4) * 0.65, delay: index * 0.16, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function StoryMarquee({ reduced }) {
  const messages = ['QR SCAN ACCEPTED', 'ORIGIN LOCKED', 'PURITY 100%', 'FOREST IMPACT VERIFIED', 'FAIR-PAY CONFIRMED']
  const repeated = [...messages, ...messages]
  return (
    <div className="relative z-10 overflow-hidden border-y border-amber-300/15 bg-amber-400 py-2.5 text-emerald-950">
      <motion.div
        className="flex items-center gap-6 whitespace-nowrap"
        animate={reduced ? {} : { x: ['0%', '-50%'] }}
        transition={reduced ? {} : { duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {repeated.map((message, index) => (
          <span key={`${message}-${index}`} className="flex items-center gap-6 text-xs font-extrabold uppercase tracking-[0.18em]">
            {message} <Sparkles className="size-3" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function HoneyStream({ progress, reduced }) {
  const scaleY = useTransform(progress, [0, 1], [0.02, 1])
  return (
    <div className="pointer-events-none absolute right-1.5 top-20 bottom-24 z-40 w-1" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-amber-200/15" />
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,.6)]"
      />
      <motion.div
        style={{ top: useTransform(progress, [0, 1], ['0%', '98%']) }}
        animate={reduced ? {} : { scale: [0.85, 1.15, 0.85] }}
        transition={reduced ? {} : { duration: 2, repeat: Infinity }}
        className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,158,11,.8)]"
      />
    </div>
  )
}

export default function HoneyExperience() {
  const pageRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [certificateOpen, setCertificateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const { scrollYProgress } = useScroll({ container: pageRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const scrollToSection = (id) => {
    setMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }
  }

  // Escape closes the nav dropdown (critique: user control gap).
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const shareBatch = async () => {
    const shareData = {
      title: "Bree's Bees — Forest Honey",
      text: 'See the verified journey and conservation impact of Batch #FB-8842.',
      url: window.location.href,
    }
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined)
    } else {
      await navigator.clipboard?.writeText(window.location.href)
      showToast('Batch link copied')
    }
  }

  const downloadCertificate = () => {
    const certificate = `BREE'S BEES — CERTIFICATE OF PURITY\n\nBatch: FB-8842\nOrigin: Nyayo Tea Zones, Kenya\nMoisture: 17.2%\nOrganic purity: 100%\nForestOS hash: 0x7AF2...88C4\n\nVerified by ForestOS Conservation Verification Engine.`
    const file = new Blob([certificate], { type: 'application/pdf' })
    const href = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = href
    link.download = 'brees-bees-FB-8842-certificate.pdf'
    link.click()
    URL.revokeObjectURL(href)
    showToast('Certificate downloaded')
  }

  const stepsRef = useRef(null)
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.15 })
  const jarsRef = useRef(null)
  const { scrollYProgress: jarsProgress } = useScroll({ container: pageRef, target: jarsRef, offset: ['start end', 'end start'] })

  return (
    <MotionConfig reducedMotion="user">
    <div className="isolate min-h-svh bg-[#040d07] lg:flex lg:items-center lg:justify-center lg:gap-16 lg:p-16">
      <div className="hidden lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-4">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          ForestOS · QR scan experience
        </p>
        <p className="font-display text-5xl font-semibold leading-[1.05] text-white">Scan it on your phone.</p>
        <p className="font-sans text-sm leading-relaxed text-[rgba(255,255,255,0.6)]">
          &quot;Bree&apos;s Bees Forest Honey&quot; opens when a customer scans the QR code on the jar. This is a live
          preview of that mobile build — every interaction works exactly as it does on a phone.
        </p>
      </div>

      <div className="relative mx-auto h-[100dvh] w-full max-w-[430px] overflow-hidden lg:h-[844px] lg:w-[390px] lg:max-w-none lg:rounded-[52px] lg:border-[10px] lg:border-[#161616] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] transform-gpu">
        {/* Dynamic Island and Home Bar for realistic phone chrome */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[10px] z-[60] hidden h-[22px] w-[110px] -translate-x-1/2 rounded-full bg-[#0a0a0a] lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[6px] left-1/2 z-[60] hidden h-[4px] w-[120px] -translate-x-1/2 rounded-full bg-white/30 lg:block"
        />

        {/* Pinned video plane — the canopy ground. Lives at the phone-frame
            level (not inside the scrolling main), so it stays fixed while
            content scrolls over it: the hero and the Section 01 intro read as
            one continuous video world. Section 01's internal wash fades it to
            the page ground before the first step card; every section below
            paints opaquely over it. */}
        <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden bg-[#021b15]">
          <video
            className="size-full object-cover object-center opacity-70"
            src={honeyVideo}
            poster={beesImage}
            autoPlay={!reduced}
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,44,34,.22)_0%,rgba(2,44,34,.08)_30%,rgba(2,44,34,.55)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(245,158,11,.22),transparent_35%)]" />
        </div>

        <HoneyStream progress={smoothProgress} reduced={reduced} />

        <main ref={pageRef} className="relative h-full overflow-y-auto overflow-x-hidden text-white selection:bg-amber-300/70 selection:text-emerald-950 honey-safe-top">
          <div className="aurora-bg pointer-events-none fixed inset-0 z-0 opacity-55" />
          
          {/* Scroll progress: the right-edge honey stream below is the one
              indicator — the duplicate 2px top bar was removed. */}

          {/* Sticky Mobile Header */}
          <header className="sticky top-0 z-50 px-3 pt-3">
            <nav className="flex items-center justify-between rounded-full border border-white/20 bg-emerald-950/55 px-3 py-2 text-white shadow-lg shadow-emerald-950/20 backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <HoneyMark />
                <div>
                  <div className="font-display text-base font-semibold leading-none tracking-tight drop-shadow-[0_1px_2px_rgba(2,44,34,.6)]">Bree&apos;s Bees</div>
                  <div className="mt-0.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber-300/80 drop-shadow-[0_1px_2px_rgba(2,44,34,.6)]">Forest Honey</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="gap-1.5 border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-mono font-medium text-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  #FB-8842
                </Badge>
                <Magnet className="shrink-0">
                  <Button
                    ariaLabel="Toggle navigation menu"
                    ariaExpanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="honey-chrome-button size-11 rounded-full border border-white/10 bg-white/5 text-white"
                  >
                    {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                  </Button>
                </Magnet>
              </div>
            </nav>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mt-2 rounded-2xl border border-white/10 bg-emerald-950/95 p-4 text-white shadow-2xl backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
                    <Badge className="gap-1.5 bg-emerald-400/10 px-2.5 py-1 text-xs font-mono text-emerald-200">
                      <CircleCheck className="size-3 text-emerald-400" /> ForestOS Verified · Batch #FB-8842
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-xs font-semibold">
                    {[
                      { label: '01 Origin & Traceability', id: 'section-origin' },
                      { label: '02 Conservation Impact', id: 'section-impact' },
                      { label: '03 Sensory & Lab Report', id: 'section-sensory' },
                      { label: '04 The Jars', id: 'section-jars' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-white/80 transition hover:bg-white/10 hover:text-white"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-3 text-amber-300" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Hero Section — transparent: the pinned video plane behind
              main provides the ground, so the video continues past the hero
              and behind the Section 01 intro below. */}
          <section className="relative min-h-[560px] text-white flex flex-col justify-end">
            <LiquidParticles reduced={reduced} />

            <div className="relative z-10 flex flex-col justify-end px-4 pb-6 pt-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
              >
                <motion.div animate={reduced ? {} : { y: [0, -6, 0] }} transition={reduced ? {} : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <Badge className="mb-4 gap-1.5 border border-amber-300/30 bg-amber-300/10 px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-200 backdrop-blur-md">
                    <Leaf className="size-3" /> Forest Honey Edition · 2025
                  </Badge>
                </motion.div>
                <div className="honey-heading font-display text-5xl font-medium leading-[0.88] tracking-[-0.04em] text-white drop-shadow-[0_2px_4px_rgba(2,44,34,.7)]">
                  <BlurWords text="Pure wild" />
                  <br />
                  <BlurWords text="forest" /> <span className="font-serif italic text-amber-400">honey.</span>
                </div>
                <p className="mt-4 text-xs leading-5 text-white/80 drop-shadow-[0_1px_2px_rgba(2,44,34,.7)]">
                  Harvested from protected canopy buffer zones of Nyayo Tea Zones. Every jar is traceable, fair-paid, and verified by ForestOS.
                </p>
              </motion.div>

              {/* Hero stats: 3 vertical-stacked cards in 3 cols */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.85, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.35 + index * 0.08, type: 'spring', stiffness: 180 }}
                      className="flex flex-col justify-between rounded-2xl border border-white/12 bg-white/[0.08] p-2.5 backdrop-blur-xl"
                    >
                      <div className="grid size-6 place-items-center rounded-full bg-amber-400/15 text-amber-300">
                        <Icon className="size-3" />
                      </div>
                      <div className="mt-3">
                      <div className="tnum font-mono text-sm font-bold text-white tracking-tight">
                        <CountUp to={stat.value} duration={1.6} />
                        {stat.suffix}
                      </div>
                      <div className="mt-0.5 font-sans text-xs font-medium leading-tight text-white/70">{stat.label}</div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          <StoryMarquee reduced={reduced} />

          {/* Section 01: Origin & Traceability */}
          <section id="section-origin" className="relative z-10 px-4 py-12">
            {/* Wash over the pinned video: transparent behind the intro (the
                video is the extender), ramping to the page ground before the
                first step card so the stack sits on solid ground. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-[#021b15]/0 from-0% via-[#021b15]/60 via-24% to-[#021b15] to-44%"
            />
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative">
              <Reveal className="drop-shadow-[0_1px_2px_rgba(2,44,34,.75)]">
                <SectionLabel number="01">Origin & traceability</SectionLabel>
                <div className="honey-heading font-display text-3xl font-medium leading-[1.05] tracking-tight">
                  From canopy to jar,
                  <br />
                  <span className="font-serif italic text-amber-300">nothing is hidden.</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-emerald-100/75">
                  Follow the people, place and proof behind this exact harvest.
                </p>
              </Reveal>

              {/* Steps hung off a gliding amber rail — the stepper pattern.
                  Scroll-linked fill grows the rail as the steps enter view. */}
              <div ref={stepsRef} className="relative mt-7 flex flex-col gap-4 pl-9">
                <div aria-hidden="true" className="absolute left-[13px] top-3 bottom-3 w-px bg-amber-400/20" />
                <motion.div
                  aria-hidden="true"
                  className="absolute left-[13px] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: stepsInView ? 1 : 0 }}
                  transition={{ duration: 1.4, ease }}
                />
                {/* Step 01 */}
                <Reveal className="relative">
                  <span className="absolute -left-9 top-4 z-10 grid size-7 place-items-center rounded-full border-2 border-emerald-950 bg-amber-400 text-xs font-bold tabular-nums text-emerald-950 shadow-[0_0_12px_rgba(232,168,92,0.35)]">1</span>
                  <Card className="relative h-[320px] overflow-hidden bg-emerald-900 p-4 text-white shadow-xl shadow-emerald-950/20">
                    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:2rem_2rem]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,158,11,.16),transparent_40%)]" />
                    <div className="relative flex items-center justify-between">
                      <Badge className="gap-1.5 bg-white/10 px-2.5 py-1 text-xs font-medium backdrop-blur">
                        <MapPin className="size-3 text-amber-300" /> Geofence active
                      </Badge>
                      <span className="font-mono text-xs text-white/70">SAT · 14 JUN 25</span>
                    </div>
                    <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
                      <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2.4 }} className="relative">
                        <span className="absolute -inset-4 animate-ping rounded-full border border-amber-300/40" />
                        <span className="grid size-10 place-items-center rounded-full border-4 border-white bg-amber-400 text-emerald-950 shadow-xl">
                          <MapPin className="size-4 fill-current" />
                        </span>
                      </motion.div>
                    </div>                      <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-emerald-950/80 p-3.5 backdrop-blur-xl">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Step 01</div>
                            <div className="mt-1 font-display text-xl font-semibold leading-tight">The Forest Canopy</div>
                            <div className="mt-1 text-xs leading-4 text-white/75">Protected buffer zone · Nyayo Tea Zones</div>
                          </div>
                        </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-xs text-white/70">
                        <span>-0.367, 35.283</span>
                        <span className="text-emerald-300">± 3.2 m</span>
                      </div>
                    </div>
                  </Card>
                </Reveal>

                {/* Step 02 */}
                <Reveal delay={0.06} className="relative">
                  <span className="absolute -left-9 top-4 z-10 grid size-7 place-items-center rounded-full border-2 border-emerald-950 bg-amber-400 text-xs font-bold tabular-nums text-emerald-950 shadow-[0_0_12px_rgba(232,168,92,0.35)]">2</span>
                  <Card className="overflow-hidden border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
                    <div className="h-40 w-full overflow-hidden">
                    <img src={handsImage} alt="Hands nurturing a forest seedling" className="size-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Step 02</span>
                        <Badge className="gap-1 bg-emerald-900/90 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                          <Users className="size-2.5" /> Community managed
                        </Badge>
                      </div>
                      <div className="mt-1.5 font-display text-xl font-semibold leading-tight">Beekeeper & hive care</div>
                      <p className="mt-2 text-xs leading-5 text-emerald-100/75">
                        Handcrafted and sustainably harvested by the Kiptunga collective.
                      </p>
                    </div>
                  </Card>
                </Reveal>

                {/* Step 03 */}
                <Reveal delay={0.1} className="relative">
                  <span className="absolute -left-9 top-4 z-10 grid size-7 place-items-center rounded-full border-2 border-emerald-950 bg-amber-400 text-xs font-bold tabular-nums text-emerald-950 shadow-[0_0_12px_rgba(232,168,92,0.35)]">3</span>
                  <Card className="border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Step 03</span>
                        <div className="mt-1 font-display text-xl font-semibold leading-tight">ForestOS verification</div>
                      </div>
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-emerald-300">
                        <Fingerprint className="size-4" />
                      </div>
                    </div>
                    <Button
                      onClick={() => setVerifyOpen(!verifyOpen)}
                      ariaExpanded={verifyOpen}
                      className="mt-4 w-full justify-between rounded-xl bg-emerald-950 px-3.5 py-3 font-mono text-xs text-emerald-100"
                    >
                      <DecryptText text="0x7AF2 ··· 2E91 ··· 88C4" />
                      <span className="flex items-center gap-1 font-sans text-xs font-bold uppercase tracking-wider text-amber-300">
                        Verify <ChevronDown className={`size-3 transition-transform ${verifyOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </Button>
                    <Accordion>
                      <AccordionContent open={verifyOpen}>
                        <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-xl border border-emerald-300/10 bg-emerald-400/[0.06] p-3 text-xs">
                          <div>
                            <span className="block text-xs text-emerald-100/70">Network</span>
                            <span className="mt-0.5 flex items-center gap-1 font-mono text-xs font-semibold">Polygon PoS <ExternalLink className="size-2.5" /></span>
                          </div>
                          <div>
                            <span className="block text-xs text-emerald-100/70">Status</span>
                            <span className="mt-0.5 flex items-center gap-1 font-mono text-xs font-semibold text-emerald-300"><Check className="size-2.5" /> Immutable</span>
                          </div>
                          <div className="col-span-2 border-t border-white/10 pt-2 text-xs text-emerald-100/70">All custody events match the sealed harvest record.</div>
                        </div>
                      </AccordionContent>
                    </Accordion>
                  </Card>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Section 02: Conservation Impact */}
          <section id="section-impact" className="relative z-10 bg-[#021b15] px-4 pb-12">
            <Reveal>
              <Card className="relative overflow-hidden border border-amber-300/15 bg-emerald-950 text-white shadow-2xl p-5">
                <video className="absolute inset-0 size-full object-cover opacity-60" src={waterTreeVideo} autoPlay={!reduced} muted loop playsInline />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-emerald-950/80 to-emerald-950" />
          <LiquidParticles reduced={reduced} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <SectionLabel number="02">Conservation impact</SectionLabel>
                    <Badge className="gap-1 border border-white/15 bg-emerald-950/60 px-2 py-1 text-xs font-bold uppercase tracking-wider text-amber-200 backdrop-blur-xl">
                      <Droplet className="size-2.5" /> Living water
                    </Badge>
                  </div>

                  <div className="honey-heading font-display text-3xl font-medium leading-[1.05]">
                    Your jar leaves
                    <br />
                    the forest <span className="font-serif italic text-amber-400">richer.</span>
                  </div>
                  <p className="mt-2.5 text-xs leading-5 text-white/75">
                    Impact is calculated against ForestOS satellite canopy data and verified payout records.
                  </p>

                  {/* Canopy gauge — de-nested: divider sections on the panel,
                      not cards-inside-cards. SloshGauge (reactbits port) chases
                      its level on a damped spring. */}
                  <div className="mt-6 flex items-center gap-5 border-t border-white/10 pt-6">
                    <SloshGauge
                      value={86}
                      liquidColor="#e8a85c"
                      glassColor="#022c22"
                      width={92}
                      height={168}
                      radius={18}
                      ariaLabel="Canopy fill: 86 percent of target"
                      className="shrink-0 border border-white/10"
                    />
                    <div>
                      <div className="grid size-8 place-items-center rounded-full bg-amber-400/15 text-amber-300">
                        <TreePine className="size-4" />
                      </div>
                      <div className="tnum mt-2 font-display text-5xl font-medium leading-none text-white">
                        <CountUp to={5} duration={1.8} />
                      </div>
                      <div className="mt-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                        Native trees
                        <br />
                        preserved
                      </div>
                    </div>
                    <Sparkles className="ml-auto size-4 text-amber-300/60" aria-hidden="true" />
                  </div>

                  {/* Impact stats — flat, hairline-divided blocks */}
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                    <div>
                      <div className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/70">Canopy offset</div>
                      <div className="tnum mt-2 font-display text-2xl font-medium text-amber-300 leading-none">
                        <CountUp to={12.5} duration={1.8} /> <span className="font-mono text-xs text-white/75">kg CO₂</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-white/70">Fair-pay</span>
                        <CircleCheck className="size-3.5 text-emerald-300" />
                      </div>
                      <div className="tnum mt-2 font-display text-2xl font-medium text-white leading-none">
                        <CountUp to={100} duration={1.8} />%
                      </div>
                      <div className="mt-1 text-xs leading-tight text-white/70">Direct to guardians</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          </section>

          {/* Section 03: Sensory & Lab */}
          <section id="section-sensory" className="relative z-10 border-t border-white/8 bg-[#02241c] px-4 py-12">
            <div>
              <Reveal>
                <SectionLabel number="03">Sensory & lab</SectionLabel>
                <div className="honey-heading font-display text-3xl font-medium tracking-tight leading-[1.05]">
                  Wild by nature.
                  <br />
                  <span className="font-serif italic text-amber-300">Exact by science.</span>
                </div>
                <SegmentTabs
                  className="mt-4"
                  label="Sensory data view"
                  value={activeTab}
                  onChange={setActiveTab}
                  tabs={[
                    { id: 'profile', label: 'Flavor profile' },
                    { id: 'lab', label: 'Lab results' },
                  ]}
                />
              </Reveal>

              <Reveal className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' ? (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Photo card */}
                      <Card className="relative h-48 bg-amber-400">
                        <img src={beesImage} alt="Golden forest honey and bees" className="absolute inset-0 size-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
                        <div className="absolute inset-x-4 bottom-4 text-white">
                          <Badge className="bg-amber-300 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-950">Rare harvest</Badge>
                          <div className="mt-1.5 font-serif text-2xl italic">Warm, floral, untamed.</div>
                        </div>
                      </Card>

                      {/* Sensory fingerprint card */}
                      <Card stagger={1} className="border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                        <div className="mb-6 flex items-center justify-between">
                          <div>
                            <div className="font-display text-xl font-semibold leading-tight">Sensory fingerprint</div>
                            <div className="mt-0.5 font-mono text-xs text-emerald-100/70">Panel · Nairobi Lab 04</div>
                          </div>
                          <Badge className="bg-emerald-300/10 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-300/20">A+ GRADE</Badge>
                        </div>
                        <div className="space-y-4">
                          {flavors.map((flavor, index) => (
                            <div key={flavor.label}>
                              <div className="mb-1.5 flex items-end justify-between">
                                <div>
                                  <div className="text-xs font-bold leading-none">{flavor.label}</div>
                                  <div className="mt-1 font-sans text-xs text-emerald-100/70">{flavor.note}</div>
                                </div>
                                <span className="tnum font-mono text-xs font-semibold text-amber-300">{flavor.value}</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                  initial={{ scaleX: 0 }}
                                  whileInView={{ scaleX: flavor.value / 100 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.1, duration: 0.8, ease }}
                                  className="h-full w-full origin-left rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lab"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="flex flex-col gap-3"
                    >
                      {[
                        ['17.2%', 'Moisture content', 'Optimal range: 16–18%'],
                        ['0.21%', 'Mineral ash', 'Natural forest signature'],
                        ['0', 'Additives detected', 'Pure single-origin honey'],
                      ].map(([value, label, note], index) => (
                        <Card key={label} stagger={index} className="border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-emerald-100/70">{label}</span>
                            <CircleCheck className="size-4 text-emerald-300" />
                          </div>
                          <div className="tnum mt-2 font-mono text-3xl font-semibold text-white">{value}</div>
                          <div className="mt-1 font-sans text-xs text-emerald-100/75">{note}</div>
                        </Card>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>

              {/* Certificate of Purity accordion */}
              <Reveal className="mt-4">
                <Card className={`border border-white/10 bg-white/[0.06] px-4 shadow-2xl backdrop-blur-xl ${certificateOpen ? 'honey-seal' : ''}`}>
                  <Button ariaExpanded={certificateOpen} onClick={() => setCertificateOpen(!certificateOpen)} className="w-full justify-between py-4 text-left">
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-amber-400 text-emerald-950"><ShieldCheck className="size-4" /></span>
                      <span>
                        <span className="block text-xs font-bold">Certificate of Purity</span>
                        <span className="mt-0.5 block font-mono text-xs text-emerald-100/75">ForestOS Accredited Lab</span>
                      </span>
                    </span>
                    <ChevronDown className={`size-4 text-emerald-100/70 transition-transform ${certificateOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  <Accordion>
                    <AccordionContent open={certificateOpen}>
                      <div className="flex flex-col gap-3 border-t border-white/10 py-4">
                        <p className="text-xs leading-4 text-emerald-100/70">
                          Batch FB-8842 passed pollen origin, pesticide residue, sugar profile, and moisture authentication on 14 June 2025.
                        </p>
                        <Button onClick={downloadCertificate} className="gap-2 rounded-full bg-emerald-950 border border-white/10 px-4 py-2.5 text-xs font-bold text-white">
                          <Download className="size-3.5" /> Download PDF
                        </Button>
                      </div>
                    </AccordionContent>
                  </Accordion>
                </Card>
              </Reveal>
            </div>
          </section>

          {/* Section 04: The Jars — hanging canopy shelf */}
          <section id="section-jars" ref={jarsRef} className="relative z-10 border-t border-white/8 bg-[#021b15] px-4 py-12">
            <Reveal>
              <SectionLabel number="04">The collection</SectionLabel>
              <div className="honey-heading font-display text-3xl font-medium leading-[1.05] tracking-tight">
                Three jars, <span className="font-serif italic text-amber-300">one forest.</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-emerald-100/75">
                The same verified harvest — batch FB-8842 — hung out to dry in three sizes. Choose how much of it comes home with you.
              </p>
            </Reveal>
            <ProductMobile progress={jarsProgress} reduced={reduced} />
          </section>

          {/* Footer */}
          <footer className="relative z-10 bg-emerald-950 px-4 pt-12 pb-[calc(7rem+env(safe-area-inset-bottom))] text-white">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-8">
              <div>
                <HoneyMark />
                <div className="honey-heading mt-4 font-display text-2xl font-semibold">Bree&apos;s Bees</div>
                <p className="mt-1 text-xs leading-5 text-white/70">Forest honey that protects the places it comes from.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-[0.14em] text-white/75">
                <ShieldCheck className="size-3.5 text-emerald-300" /> Protected by ForestOS Traceability
              </div>
            </div>
          </footer>

          {/* Fixed Bottom Reorder Bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-300/10 bg-emerald-950/85 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl honey-safe-bottom">
            <div className="flex items-center gap-2">
              <Button onClick={() => showToast('Batch FB-8842 added to your order')} className="liquid-shine h-12 flex-1 gap-2 rounded-full bg-amber-400 px-4 text-xs font-extrabold text-emerald-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300">
                Reorder This Exact Batch <ArrowUpRight className="size-3.5" />
              </Button>              <Magnet className="shrink-0">
                <Button ariaLabel="Share batch story" onClick={shareBatch} className="honey-chrome-button size-12 rounded-full border border-white/10 bg-white/10 text-white shadow-sm backdrop-blur">
                  <Share2 className="size-4" />
                </Button>
              </Magnet>
            </div>
          </div>

          <AnimatePresence>
            {toast && <SwipeToast message={toast} onDismiss={() => setToast('')} reduced={reduced} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
    </MotionConfig>
  )
}
