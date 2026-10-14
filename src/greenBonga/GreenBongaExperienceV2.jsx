import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  CircleCheck,
  Coffee,
  Compass,
  ExternalLink,
  Gift,
  HelpCircle,
  Info,
  Layers,
  Leaf,
  Menu,
  Phone,
  RefreshCw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TreePine,
  X,
  Zap,
} from 'lucide-react'

import './greenBonga.css'

const ease = [0.22, 1, 0.36, 1]

// Media assets
const teaPourVideo = '/media/teapour.webm'
const teaPourPoster = '/media/tea-pour-poster.webp'
const teaFarmVideo = '/media/tea-farm.mp4'
const forestCanopyVideo = '/media/forest1-720.webm'
const javaGoldLabelImg = '/media/java/java-gold-label.avif'
const javaCupImg = '/media/java/cup.jpg'
const javaTeaPackImg = '/media/java/java_tea_2.jpg'
const mauForestImg = '/media/investor/mau-forest.webp'
const seedlingImg = '/media/investor/seedling-planted.webp'
const teaPickersImg = '/media/investor/tea-pickers.webp'
const riverPatrolImg = '/media/investor/river-patrol.webp'
const teaLandscapeImg = '/media/investor/tea-landscape.webp'
const safaricomLogo = '/media/logos/safaricom.svg'
const javaHouseLogo = '/media/logos/java-house.svg'

// Concept Parameters
const GREEN_BONGA_EARNED = 400
const NORMAL_EQUIVALENT = 100
const MULTIPLIER = 4
const BATCH_ID = 'JH-MAU-0842'
const PACK_PRICE_KES = 850
const GREEN_BONGA_TO_BUY = 1200

// African Geometric Decorative Linework (Original SVG Motif)
function AfricanPatternDivider({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center py-2 ${className}`} aria-hidden="true">
      <svg width="100%" height="16" viewBox="0 0 320 16" fill="none" className="max-w-[280px] opacity-75">
        <path
          d="M0 8 H100 M220 8 H320"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 3"
          className="text-[#d4a84b]/40"
        />
        <g transform="translate(110, 0)">
          {/* Central stylized diamond / chevron cluster */}
          <polygon points="10,8 18,2 26,8 18,14" fill="none" stroke="#d4a84b" strokeWidth="1.2" />
          <polygon points="26,8 34,2 42,8 34,14" fill="#c5382b" fillOpacity="0.3" stroke="#c5382b" strokeWidth="1.2" />
          <polygon points="42,8 50,2 58,8 50,14" fill="none" stroke="#8fe83a" strokeWidth="1.2" />
          <circle cx="18" cy="8" r="1.5" fill="#d4a84b" />
          <circle cx="34" cy="8" r="1.5" fill="#c5382b" />
          <circle cx="50" cy="8" r="1.5" fill="#8fe83a" />
        </g>
      </svg>
    </div>
  )
}

function SectionBadge({ children, icon: Icon, variant = 'java' }) {
  const styles = {
    java: 'border-[#d4a84b]/30 bg-[#d4a84b]/12 text-[#f3dfa8]',
    saf: 'border-[#8fe83a]/30 bg-[#8fe83a]/12 text-[#c8f99a]',
    forest: 'border-[#2ec4b6]/30 bg-[#2ec4b6]/12 text-[#a5f3ec]',
    neutral: 'border-white/15 bg-white/5 text-white/70',
  }

  return (
    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] backdrop-blur-md">
      {Icon && <Icon className="size-3 text-current" />}
      <span className={styles[variant] || styles.neutral}>{children}</span>
    </div>
  )
}

function VerificationPill({ status = 'verified' }) {
  const config = {
    verified: {
      bg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      label: 'Verified',
      note: 'Cryptographically anchored via ForestOS',
    },
    reported: {
      bg: 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300',
      dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
      label: 'Reported',
      note: 'Source: Safaricom FY25 ESG Sustainability Report',
    },
    illustrative: {
      bg: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
      label: 'Illustrative',
      note: 'Proposed prototype mechanics for demonstration',
    },
    pending: {
      bg: 'bg-slate-500/15 border-slate-500/35 text-slate-300',
      dot: 'bg-slate-400',
      label: 'Pending',
      note: 'Subject to future season field verification',
    },
  }

  const item = config[status] || config.illustrative

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider ${item.bg}`}
      title={item.note}
    >
      <span className={`size-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ProgressRail({ progress }) {
  const scaleY = useTransform(progress, [0, 1], [0.03, 1])
  const top = useTransform(progress, [0, 1], ['0%', '98%'])
  return (
    <div className="pointer-events-none absolute right-1.5 top-20 bottom-24 z-40 w-1" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#d4a84b] via-[#8fe83a] to-[#2ec4b6]"
      />
      <motion.div
        style={{ top }}
        animate={{ scale: [0.9, 1.25, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-[#8fe83a] shadow-[0_0_12px_rgba(143,232,58,.9)]"
      />
    </div>
  )
}

export default function GreenBongaExperience() {
  const pageRef = useRef(null)
  const toastTimer = useRef(null)
  const videoObserverRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [earnTab, setEarnTab] = useState('earn') // 'earn' | 'redeem' | 'rewards'
  const [counterValue, setCounterValue] = useState(0)
  const [proofOpen, setProofOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const { scrollYProgress } = useScroll({ container: pageRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 95, damping: 25, mass: 0.35 })

  useEffect(() => {
    document.title = 'Your Cup Has a Bigger Story — Java House × Green Bonga · ForestOS'
  }, [])

  // Smooth number rollup animation
  useEffect(() => {
    let frame
    const start = performance.now()
    const run = (now) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / 1300)
      const eased = 1 - (1 - t) ** 3
      setCounterValue(Math.round(GREEN_BONGA_EARNED * eased))
      if (t < 1) frame = requestAnimationFrame(run)
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [])

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(''), 3000)
  }

  const scrollToSection = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const shareExperience = async () => {
    const shareData = {
      title: 'Java Conservation Tea × Green Bonga',
      text: 'My cup of Java Conservation Tea unlocked 400 Green Bonga and verified indigenous buffer protection in the Mau forest.',
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href)
      showToast('Experience link copied to clipboard')
    }
  }

  return (
    <div className="isolate min-h-svh bg-[#080605] selection:bg-[#d4a84b]/40 selection:text-white lg:flex lg:items-center lg:justify-center lg:gap-14 lg:p-12">
      {/* Desktop Preview Sidebar — Framing the QR scan context */}
      <aside className="hidden lg:flex lg:w-[350px] lg:shrink-0 lg:flex-col lg:gap-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#c5382b] text-white shadow-lg shadow-[#c5382b]/30">
            <Coffee className="size-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a84b]">
              ForestOS · QR Experience
            </p>
            <p className="font-display text-xl font-semibold text-[#faf5ec]">
              Java House × Safaricom
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#140e0a] p-5 shadow-2xl">
          <h2 className="font-display text-2xl font-medium leading-tight text-[#faf5ec]">
            “Your cup has a bigger story.”
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed text-white/60">
            A shopper who scans the QR code on a Java Conservation Tea pack enters this mobile-first story.
            It blends <strong>Java House&apos;s</strong> Kenyan warmth and café heritage with{' '}
            <strong>Safaricom&apos;s</strong> Green Bonga digital reward energy, anchored in{' '}
            <strong>ForestOS</strong> verified buffer evidence.
          </p>

          <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/8 bg-black/40 p-3 text-[0.7rem]">
            <div className="flex items-center justify-between text-white/50">
              <span>Proposed Concept</span>
              <span className="font-mono text-[#d4a84b]">Gold Label Tea</span>
            </div>
            <div className="flex items-center justify-between text-white/50">
              <span>Loyalty Multiplier</span>
              <span className="font-mono font-bold text-[#8fe83a]">4× Green Bonga</span>
            </div>
            <div className="flex items-center justify-between text-white/50">
              <span>Buffer Belt Origin</span>
              <span className="font-mono text-[#2ec4b6]">S.W. Mau · Kiptunga</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-[0.68rem] leading-relaxed text-amber-200/70">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-300">
            <Info className="size-3.5 shrink-0" /> Prototype Disclosure
          </div>
          <p className="mt-1">
            This is an illustrative digital experience prototype demonstrating how Java House tea,
            Safaricom Green Bonga loyalty, and ForestOS verification could unite. Product images cite public
            Java House Gold Label materials.
          </p>
        </div>
      </aside>

      {/* Mobile Shell Frame */}
      <div className="relative mx-auto h-svh w-full max-w-[430px] overflow-hidden lg:h-[860px] lg:w-[395px] lg:max-w-none lg:rounded-[52px] lg:border-[10px] lg:border-[#1e150f] lg:shadow-[0_45px_110px_-25px_rgba(0,0,0,0.9)]">
        {/* Phone Notch & Speaker (Desktop Preview Only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[10px] z-[60] hidden h-[22px] w-[114px] -translate-x-1/2 rounded-full bg-[#080605] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6px] left-1/2 z-[60] hidden h-1 w-[124px] -translate-x-1/2 rounded-full bg-white/20 lg:block"
        />

        {/* Scroll Progress Rail */}
        <ProgressRail progress={smoothProgress} />

        {/* Scrollable Document */}
        <main
          ref={pageRef}
          className="relative h-full overflow-y-auto overflow-x-hidden bg-[#0c0907] pb-28 text-[#faf5ec] selection:bg-[#d4a84b]/40 selection:text-white"
        >
          {/* Ambient Lighting Background */}
          <div className="gb-aurora pointer-events-none fixed inset-0 z-0 opacity-70" />

          {/* Sticky Progress Line */}
          <motion.div
            className="sticky left-0 top-0 z-[60] h-[2.5px] w-full origin-left bg-gradient-to-r from-[#d4a84b] via-[#c5382b] to-[#8fe83a]"
            style={{ scaleX: smoothProgress }}
          />

          {/* Top Floating App Bar */}
          <header className="sticky top-0 z-50 px-3.5 pt-3">
            <nav className="flex items-center justify-between rounded-full border border-[#d4a84b]/20 bg-[#160f0a]/90 px-3.5 py-2 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-8 items-center justify-center rounded-full bg-[#c5382b] text-white shadow-md shadow-[#c5382b]/30">
                  <Coffee className="size-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-[#160f0a] bg-[#8fe83a]" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold tracking-tight text-[#faf5ec]">
                    Java House × Safaricom
                  </div>
                  <div className="font-mono text-[0.52rem] font-bold uppercase tracking-[0.16em] text-[#d4a84b]">
                    Conservation Tea QR
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#8fe83a]/30 bg-[#8fe83a]/10 px-2.5 py-0.5 font-mono text-[0.58rem] font-medium text-[#c8f99a]">
                  <span className="size-1.5 rounded-full bg-[#8fe83a] shadow-[0_0_6px_rgba(143,232,58,0.9)]" />
                  #{BATCH_ID}
                </span>

                <button
                  type="button"
                  aria-label="Toggle navigation drawer"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 active:scale-95"
                >
                  {menuOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
                </button>
              </div>
            </nav>

            {/* Navigation Drawer */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mt-2 rounded-3xl border border-[#d4a84b]/20 bg-[#1a120b]/96 p-4 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#d4a84b]">
                      Experience Index
                    </span>
                    <VerificationPill status="verified" />
                  </div>

                  <div className="flex flex-col gap-1 text-xs font-semibold">
                    {[
                      { label: '01 The Opening Hook', id: 'section-hook' },
                      { label: '02 The Brand Connection (Java × Safaricom)', id: 'section-brands' },
                      { label: '03 The Conservation Story (Mau Belt)', id: 'section-conservation' },
                      { label: '04 Green Bonga Earn & Redeem', id: 'section-bonga' },
                      { label: '05 ForestOS Evidence & Record', id: 'section-evidence' },
                      { label: '06 Closing Invitation', id: 'section-closing' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-white/80 transition hover:bg-white/8 hover:text-[#d4a84b]"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-3 text-[#d4a84b]" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-2 text-[0.65rem] text-white/50">
                    Proposed concept · Batch #{BATCH_ID} · Verified via ForestOS
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* SECTION A — THE OPENING HOOK */}
          <section id="section-hook" className="relative flex min-h-[600px] flex-col justify-end pt-8">
            {/* Background looping video of tea / forest canopy */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                className="size-full object-cover object-center opacity-45"
                src={teaPourVideo}
                poster={teaPourPoster}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
              {/* Warm gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0907]/60 via-[#0c0907]/25 to-[#0c0907]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,168,75,0.2)_0%,_transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(143,232,58,0.14)_0%,_transparent_45%)]" />
            </div>

            {/* Subtle African Chevron Linework Overlay */}
            <div className="african-chevron-pattern pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative z-10 px-5 pb-8 pt-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                {/* Pack Scanned Tag */}
                <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#d4a84b]/40 bg-[#1e130c]/80 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#f5deaa] shadow-lg backdrop-blur-md">
                  <Sparkles className="size-3 text-[#d4a84b]" />
                  <span>Pack Scanned · Story Unlocked</span>
                  <span className="size-1 rounded-full bg-[#8fe83a]" />
                  <span className="font-mono text-[#8fe83a]">+{GREEN_BONGA_EARNED} GB</span>
                </div>

                <h1 className="font-display text-[3.25rem] font-normal leading-[0.92] tracking-[-0.03em] text-[#faf5ec]">
                  Your cup has a
                  <br />
                  <span className="font-serif italic text-[#d4a84b]">bigger story.</span>
                </h1>

                <p className="mt-3.5 max-w-[94%] text-xs leading-relaxed text-white/75">
                  Discover the connection between your everyday tea ritual, Green Bonga, and the story of conservation.
                </p>
              </motion.div>

              {/* Hook Card — Quick Value Teaser */}
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.7, ease }}
                className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-[#d4a84b]/30 bg-gradient-to-br from-[#1e140d]/95 via-[#160f0a]/90 to-[#0e1810]/95 p-4 shadow-[0_20px_60px_-15px_rgba(212,168,75,0.25)] backdrop-blur-xl"
              >
                <div className="african-diamond-mesh absolute inset-0 opacity-60" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[#d4a84b]">
                        Scan Reward Ready
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-5xl font-medium tracking-tight text-[#8fe83a]">
                          +{counterValue}
                        </span>
                        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#c8f99a]">
                          Green Bonga
                        </span>
                      </div>
                    </div>

                    <div className="relative grid size-12 place-items-center rounded-2xl bg-[#8fe83a] text-[#0c0907] shadow-md shadow-[#8fe83a]/30">
                      <span className="gb-pulse-ring absolute inset-0 rounded-2xl border border-[#8fe83a]" />
                      <span className="font-mono text-sm font-black">{MULTIPLIER}×</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[0.72rem] leading-5 text-white/70">
                    This pack pays out premium loyalty worth <strong className="text-[#8fe83a]">4× normal Bonga</strong>,
                    rooted in the high-altitude forest buffer where the leaves are grown.
                  </p>

                  <div className="mt-3.5 flex items-center justify-between rounded-xl border border-white/8 bg-black/40 px-3 py-2 text-[0.68rem]">
                    <span className="text-white/50">Normal tea purchase: ~100 Bonga</span>
                    <span className="font-mono font-bold text-[#8fe83a]">Conservation Tea: 400 GB</span>
                  </div>
                </div>
              </motion.div>

              {/* Scroll Invitation Cue */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-6 flex items-center justify-center gap-2 text-[0.65rem] font-medium tracking-wider text-white/50"
              >
                <span>Scroll to trace your cup&apos;s journey</span>
                <ChevronDown className="size-3.5 text-[#d4a84b]" />
              </motion.div>
            </div>
          </section>

          <AfricanPatternDivider />

          {/* SECTION B — THE BRAND CONNECTION */}
          <section id="section-brands" className="relative z-10 px-5 py-10">
            <Reveal>
              <SectionBadge icon={Sparkles} variant="java">
                The Trinity
              </SectionBadge>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-[#faf5ec]">
                A little Java.
                <br />
                <span className="font-serif italic text-[#d4a84b]">A little more impact.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-white/65">
                Every great cup connects a community of hands. We weave together Java House&apos;s tea ritual,
                Safaricom&apos;s everyday rewards, and ForestOS&apos;s real-time conservation telemetry.
              </p>
            </Reveal>

            {/* The Connected Ecosystem Visual (Not separate logo boxes) */}
            <Reveal className="mt-6">
              <div className="overflow-hidden rounded-[2rem] border border-[#d4a84b]/25 bg-gradient-to-b from-[#1b120c] to-[#101410] p-5 shadow-xl">
                <div className="african-diamond-mesh absolute inset-0 opacity-40" />

                <div className="relative z-10 space-y-4">
                  {/* Pillar 1: Java House */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-[#d4a84b]/20 bg-[#23170f]/70 p-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#c5382b] text-white">
                      <Coffee className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-semibold text-[#faf5ec]">Java House</span>
                        <span className="rounded-full bg-[#c5382b]/20 px-2 py-0.5 font-mono text-[0.55rem] font-bold text-[#e69085]">
                          The Soul & Cup
                        </span>
                      </div>
                      <p className="mt-1 text-[0.7rem] leading-4 text-white/60">
                        Crafting Kenya&apos;s everyday tea ritual from the indigenous buffer gardens of the Aberdares and Mau.
                      </p>
                    </div>
                  </div>

                  {/* Connecting Line / Flow Motif */}
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-px bg-gradient-to-b from-[#d4a84b] to-[#8fe83a]" />
                  </div>

                  {/* Pillar 2: Safaricom Green Bonga */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-[#8fe83a]/25 bg-[#0f1a12]/70 p-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#8fe83a] text-[#0c0907] shadow-md shadow-[#8fe83a]/20">
                      <Zap className="size-5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-semibold text-[#faf5ec]">Green Bonga</span>
                        <span className="rounded-full bg-[#8fe83a]/20 px-2 py-0.5 font-mono text-[0.55rem] font-bold text-[#c8f99a]">
                          The Energy & Reward
                        </span>
                      </div>
                      <p className="mt-1 text-[0.7rem] leading-4 text-white/60">
                        Dial *126# loyalty with 4× multiplier on conservation packs, redeemable for airtime or more tea.
                      </p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-px bg-gradient-to-b from-[#8fe83a] to-[#2ec4b6]" />
                  </div>

                  {/* Pillar 3: ForestOS */}
                  <div className="flex items-start gap-3.5 rounded-2xl border border-[#2ec4b6]/25 bg-[#0e191a]/70 p-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2ec4b6] text-[#0c0907] shadow-md shadow-[#2ec4b6]/20">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-semibold text-[#faf5ec]">ForestOS</span>
                        <span className="rounded-full bg-[#2ec4b6]/20 px-2 py-0.5 font-mono text-[0.55rem] font-bold text-[#a5f3ec]">
                          The Ground Truth
                        </span>
                      </div>
                      <p className="mt-1 text-[0.7rem] leading-4 text-white/60">
                        Verifies harvest polygons, tree nursery telemetry, and fair-wage attestation before points unlock.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Product Reference Card — Natural Integration of Purpink Gold Label Image */}
            <Reveal className="mt-6" delay={0.06}>
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#160f0a] shadow-lg">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f150e]">
                  <img
                    src={javaGoldLabelImg}
                    alt="Java House Gold Label Loose Leaf Tea reference product pack"
                    className="size-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      // Graceful fallback to local tea pack image if avif fails
                      e.target.src = javaTeaPackImg
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160f0a] via-transparent to-black/30" />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[0.55rem] font-bold uppercase tracking-wider text-[#d4a84b] backdrop-blur-md">
                      Product Reference
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#faf5ec]">
                        Java House Gold Label Black Tea
                      </h3>
                      <p className="font-mono text-[0.58rem] text-white/45">
                        Highland Loose Leaf · 350g · Batch #{BATCH_ID}
                      </p>
                    </div>
                    <VerificationPill status="illustrative" />
                  </div>

                  <p className="mt-2.5 text-[0.7rem] leading-relaxed text-white/65">
                    Temporary product photograph from public Java House Gold Label retail listings.
                    Illustrates how packaging will feature the on-pack Green Bonga QR code and origin passport.
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5 font-mono text-[0.55rem] text-white/40">
                    <span>Source: purpink.co.ke</span>
                    <span>100% Export-Grade BP1</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          <AfricanPatternDivider />

          {/* SECTION C — THE CONSERVATION STORY */}
          <section id="section-conservation" className="relative z-10 px-5 py-10">
            <Reveal>
              <SectionBadge icon={TreePine} variant="saf">
                03 The Landscape
              </SectionBadge>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-[#faf5ec]">
                Beyond the cup,
                <br />
                <span className="font-serif italic text-[#8fe83a]">there&apos;s a landscape.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-white/65">
                Tea is grown along the perimeter of Kenya&apos;s greatest water towers. This 30,000-hectare Nyayo buffer
                acts as a living shield, preventing agricultural encroachment into old-growth indigenous forest.
              </p>
            </Reveal>

            {/* Video / High-Resolution Forest Section */}
            <Reveal className="mt-6">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e1610] p-5 shadow-2xl">
                <video
                  className="absolute inset-0 size-full object-cover opacity-40"
                  src={teaFarmVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c0907]/60 via-[#0c0907]/80 to-[#0c0907]" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-[#8fe83a]">
                      Nyayo Tea Zone Buffer Belt
                    </span>
                    <VerificationPill status="reported" />
                  </div>

                  <h3 className="font-display text-2xl font-medium text-[#faf5ec]">
                    Safaricom&apos;s Green Ambition: 5 Million Trees by 2030
                  </h3>

                  <p className="text-xs leading-relaxed text-white/70">
                    As documented in Safaricom&apos;s FY25 Sustainability Report, over <strong>2.3 million trees</strong> have
                    already been planted alongside the Kenya Forest Service (KFS). Green Bonga harnesses that exact commitment
                    to reward consumers who choose tea grown along this defensive boundary.
                  </p>

                  {/* Public Statistics HUD */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                      <div className="font-mono text-[0.55rem] font-bold uppercase tracking-wider text-white/45">
                        Target by 2030
                      </div>
                      <div className="mt-1 font-display text-3xl font-medium text-[#8fe83a]">5,000,000</div>
                      <div className="text-[0.62rem] text-white/50">Indigenous saplings</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                      <div className="font-mono text-[0.55rem] font-bold uppercase tracking-wider text-white/45">
                        FY25 Reported
                      </div>
                      <div className="mt-1 font-display text-3xl font-medium text-[#2ec4b6]">2.3M+</div>
                      <div className="text-[0.62rem] text-white/50">Planted with KFS</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Gallery of Ground Proof Images */}
            <Reveal className="mt-4" delay={0.05}>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#160f0a]">
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={mauForestImg}
                      alt="Mau Forest canopy buffer"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 font-mono text-[0.55rem] font-bold text-white/80">
                      Mau Water Tower
                    </span>
                  </div>
                  <div className="p-2 text-[0.62rem] text-white/55">
                    Shielding rivers feeding the Rift Valley and Lake Victoria.
                  </div>
                </div>

                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#160f0a]">
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={seedlingImg}
                      alt="Indigenous nursery seedling"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 font-mono text-[0.55rem] font-bold text-white/80">
                      Indigenous Nurseries
                    </span>
                  </div>
                  <div className="p-2 text-[0.62rem] text-white/55">
                    Podocarpus and African olive saplings nurtured by local wardens.
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-3" delay={0.08}>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-[0.65rem] leading-relaxed text-white/50">
                <span className="font-semibold text-white/70">Traceability note:</span> Buying this pack supports the
                conservation buffer programme. We do not claim that one individual tea pack planted a specific individual
                tree unless verified in the batch record.
              </div>
            </Reveal>
          </section>

          <AfricanPatternDivider />

          {/* SECTION D — GREEN BONGA INTERACTION */}
          <section id="section-bonga" className="relative z-10 px-5 py-10">
            <Reveal>
              <SectionBadge icon={Zap} variant="saf">
                04 Digital Energy
              </SectionBadge>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-[#faf5ec]">
                Your everyday choice.
                <br />
                <span className="font-serif italic text-[#8fe83a]">A new way to participate.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-white/65">
                Kenyans already dial <strong>*126#</strong> to spend Bonga Points on airtime, data, and Lipa na M-PESA.
                Green Bonga gives that familiar routine a conservation upgrade.
              </p>
            </Reveal>

            {/* Interactive Tab Toggle: Earn vs Spend vs Rewards */}
            <Reveal className="mt-6">
              <div className="flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
                {[
                  { id: 'earn', label: '1. Earn on Scan', badge: '+400 GB' },
                  { id: 'redeem', label: '2. Buy More Tea', badge: '1,200 GB' },
                  { id: 'rewards', label: '3. Perks', badge: 'Data & Café' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEarnTab(tab.id)}
                    className={`flex flex-1 flex-col items-center justify-center rounded-full py-2 transition-all ${
                      earnTab === tab.id
                        ? 'bg-[#8fe83a] text-[#0c0907] shadow-lg shadow-[#8fe83a]/25'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="text-[0.65rem] font-bold">{tab.label}</span>
                    <span className="font-mono text-[0.52rem] opacity-75">{tab.badge}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            {/* Interactive Tab Panels */}
            <Reveal className="mt-4">
              <AnimatePresence mode="wait">
                {earnTab === 'earn' && (
                  <motion.div
                    key="tab-earn"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="rounded-[2rem] border border-[#8fe83a]/30 bg-gradient-to-br from-[#102014] to-[#120f0a] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#8fe83a]">
                        <ShoppingBag className="size-4" />
                        <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider">
                          How Earning Works
                        </span>
                      </div>
                      <VerificationPill status="illustrative" />
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-medium text-[#faf5ec]">
                      Scan the Pack. Bank the Bonus.
                    </h3>

                    <ol className="mt-4 space-y-3">
                      {[
                        {
                          step: '1',
                          title: 'Purchase at Supermarket or Java Café',
                          desc: 'Pick up Java Conservation Tea at Carrefour, Naivas, or any Java House branch.',
                        },
                        {
                          step: '2',
                          title: 'Scan On-Pack QR Code',
                          desc: 'Open your phone camera — no extra app required. Instant verification handshake.',
                        },
                        {
                          step: '3',
                          title: `Receive +${GREEN_BONGA_EARNED} Green Bonga`,
                          desc: `Enjoy ${MULTIPLIER}× the standard points value credited to your Safaricom number.`,
                        },
                      ].map((item) => (
                        <li key={item.step} className="flex gap-3 text-xs">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#8fe83a]/15 font-mono text-[0.68rem] font-bold text-[#8fe83a]">
                            {item.step}
                          </span>
                          <div>
                            <div className="font-semibold text-white/90">{item.title}</div>
                            <div className="text-[0.68rem] text-white/60">{item.desc}</div>
                          </div>
                        </li>
                      ))}
                    </ol>

                    <button
                      type="button"
                      onClick={() => showToast(`Simulated scan: +${GREEN_BONGA_EARNED} Green Bonga credited!`)}
                      className="gb-shine mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8fe83a] text-xs font-black uppercase tracking-wider text-[#0c0907] shadow-lg shadow-[#8fe83a]/30 active:scale-95"
                    >
                      <Sparkles className="size-4" /> Simulate Earning +400 GB
                    </button>
                  </motion.div>
                )}

                {earnTab === 'redeem' && (
                  <motion.div
                    key="tab-redeem"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="rounded-[2rem] border border-[#2ec4b6]/30 bg-gradient-to-br from-[#0e1d1f] to-[#14100c] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#2ec4b6]">
                        <RefreshCw className="size-4" />
                        <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider">
                          Closed Loop Loyalty
                        </span>
                      </div>
                      <VerificationPill status="illustrative" />
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-medium text-[#faf5ec]">
                      Turn Points Into Fresh Tea
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-white/65">
                      Spend your accumulated Green Bonga directly for your next pack of Java Conservation Tea,
                      creating a sustainable cycle where tea purchases fund tea purchases.
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Pack Retail Price</span>
                        <span className="font-mono font-semibold text-white">KES {PACK_PRICE_KES}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                        <span className="text-white/60">Redemption Cost</span>
                        <span className="font-mono font-bold text-[#2ec4b6]">{GREEN_BONGA_TO_BUY} Green Bonga</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Redemption started: 1,200 GB demo voucher generated')}
                      className="gb-shine mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2ec4b6] text-xs font-black uppercase tracking-wider text-[#0c0907] shadow-lg shadow-[#2ec4b6]/30 active:scale-95"
                    >
                      <RefreshCw className="size-4" /> Redeem for Conservation Pack
                    </button>
                  </motion.div>
                )}

                {earnTab === 'rewards' && (
                  <motion.div
                    key="tab-rewards"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="rounded-[2rem] border border-[#d4a84b]/30 bg-gradient-to-br from-[#20150d] to-[#120f0c] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#d4a84b]">
                        <Gift className="size-4" />
                        <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider">
                          Redemption Catalogue
                        </span>
                      </div>
                      <VerificationPill status="illustrative" />
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-medium text-[#faf5ec]">
                      Familiar Safaricom Utilities
                    </h3>

                    <div className="mt-4 space-y-2.5">
                      {[
                        { title: '1.5 GB 24hr Safaricom Data Bundle', cost: '300 GB', icon: Zap },
                        { title: 'KES 200 Airtime Voucher (any network)', cost: '400 GB', icon: Phone },
                        { title: 'KES 500 Java House Café Voucher', cost: '750 GB', icon: Coffee },
                      ].map((reward) => (
                        <div
                          key={reward.title}
                          className="flex items-center justify-between rounded-xl border border-white/8 bg-black/40 p-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <reward.icon className="size-4 text-[#d4a84b]" />
                            <span className="font-medium text-white/90">{reward.title}</span>
                          </div>
                          <span className="font-mono font-bold text-[#8fe83a]">{reward.cost}</span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-3 text-[0.65rem] text-white/45">
                      Rewards mirror existing Safaricom Bonga redemption categories. Rates are illustrative.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          </section>

          <AfricanPatternDivider />

          {/* SECTION E — FORETOS EVIDENCE & WHAT THIS PACK PROVES */}
          <section id="section-evidence" className="relative z-10 px-5 py-10">
            <Reveal>
              <SectionBadge icon={ShieldCheck} variant="forest">
                05 Verification Layer
              </SectionBadge>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-[#faf5ec]">
                A good story
                <br />
                <span className="font-serif italic text-[#2ec4b6]">deserves evidence.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-white/65">
                ForestOS transforms marketing narratives into verifiable cryptographic ground truth.
                Every batch connects GPS boundary logs, harvest dates, and independent telemetry.
              </p>
            </Reveal>

            {/* Proof Card Container */}
            <Reveal className="mt-6">
              <div className="overflow-hidden rounded-[2rem] border border-[#2ec4b6]/30 bg-gradient-to-b from-[#101e1f] to-[#14100c] p-5 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#2ec4b6]">
                      <ShieldCheck className="size-3.5" />
                      ForestOS · NTZDC Registry
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold text-[#faf5ec]">
                      Batch Certificate #{BATCH_ID}
                    </div>
                  </div>
                  <VerificationPill status="verified" />
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-white/70">
                  Green Bonga is the reward; ForestOS is the proof. This pack represents orthodox black tea
                  plucked along the South West Mau conservation perimeter.
                </p>

                {/* Status Badges Taxonomy Legend */}
                <div className="mt-4 rounded-2xl border border-white/8 bg-black/40 p-3.5">
                  <div className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/40">
                    Evidence Status Legend
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[0.65rem]">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span><strong>Verified:</strong> Live GPS Polygon</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-cyan-400" />
                      <span><strong>Reported:</strong> FY25 ESG Data</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-400" />
                      <span><strong>Illustrative:</strong> 4× Reward Demo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-400" />
                      <span><strong>Pending:</strong> Q4 Canopy Audit</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Accordion: What this pack proves */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setProofOpen(!proofOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left font-mono text-xs font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="size-3.5 text-[#2ec4b6]" />
                      What this pack proves
                    </span>
                    <ChevronDown className={`size-4 text-white/60 transition-transform ${proofOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {proofOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2.5 rounded-xl border border-[#2ec4b6]/20 bg-[#2ec4b6]/5 p-3.5 text-xs">
                          {[
                            ['Origin Block', 'South West Mau Buffer · Kiptunga Block'],
                            ['GPS Polygon', '0.5841° S, 35.7924° E (Elev: 2,340m)'],
                            ['Custody Chain', 'Nyayo Tea Zones Development Corp (NTZDC)'],
                            ['Processing', 'Orthodox Withered & Wood-Fired · No Additives'],
                            ['Attestation Hash', 'sha256:7f8a9e2d...014c'],
                            ['Partner Roles', 'Java House (Product) · Safaricom (Reward) · ForestOS (Telemetry)'],
                          ].map(([label, value]) => (
                            <div key={label} className="flex flex-col justify-between gap-0.5 border-b border-white/5 pb-1.5">
                              <span className="font-mono text-[0.6rem] text-white/40">{label}</span>
                              <span className="font-mono text-[0.7rem] font-medium text-white/85">{value}</span>
                            </div>
                          ))}

                          <div className="pt-2">
                            <Link
                              to="/batch/921"
                              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#8fe83a]/40 bg-[#8fe83a]/15 py-2.5 font-mono text-[0.68rem] font-bold text-[#8fe83a] transition hover:bg-[#8fe83a]/25"
                            >
                              <span>Open Full Public Proof Record (#921)</span>
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>

            {/* Landscape Buffer Photography */}
            <Reveal className="mt-4" delay={0.06}>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={teaLandscapeImg}
                  alt="Highland tea landscape on the Nyayo buffer belt"
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </section>

          <AfricanPatternDivider />

          {/* SECTION F — CLOSING CALL TO ACTION */}
          <section id="section-closing" className="relative z-10 px-5 pb-10 pt-6">
            <Reveal>
              <div className="rounded-[2.25rem] border border-[#d4a84b]/30 bg-gradient-to-b from-[#21160e] via-[#160f0a] to-[#0c0907] p-6 text-center shadow-2xl">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#d4a84b]/15 text-[#d4a84b]">
                  <Coffee className="size-6" />
                </div>

                <h2 className="mt-4 font-display text-3xl font-medium text-[#faf5ec]">
                  Every morning begins
                  <br />
                  <span className="font-serif italic text-[#d4a84b]">with a choice.</span>
                </h2>

                <p className="mx-auto mt-3 max-w-[90%] text-xs leading-relaxed text-white/65">
                  From dawn pickers in the Mau highlands to the familiar warmth of a Java House mug,
                  your ritual strengthens Kenya&apos;s living green buffer.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={shareExperience}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#d4a84b]/40 bg-[#d4a84b]/15 text-xs font-bold text-[#faf5ec] transition hover:bg-[#d4a84b]/25 active:scale-95"
                  >
                    <Share2 className="size-4 text-[#d4a84b]" />
                    <span>Share This Story on WhatsApp</span>
                  </button>

                  <Link
                    to="/batch/921"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white/10 text-xs font-bold text-white transition hover:bg-white/15"
                  >
                    <span>View ForestOS Telemetry Dossier</span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Footer Disclosures */}
            <footer className="mt-8 border-t border-white/10 pt-6 text-center">
              <div className="flex items-center justify-center gap-3 text-white/50">
                <span className="font-display text-sm font-semibold text-white/80">Java House</span>
                <span className="size-1 rounded-full bg-white/30" />
                <span className="font-mono text-xs text-[#8fe83a]">Safaricom Green Bonga</span>
                <span className="size-1 rounded-full bg-white/30" />
                <span className="font-mono text-xs text-[#2ec4b6]">ForestOS</span>
              </div>

              <p className="mt-3 font-mono text-[0.52rem] uppercase leading-relaxed tracking-wider text-white/35">
                Illustrative concept experience. Not a signed commercial endorsement or live loyalty rollout.
                Safaricom tree figures cite audited FY25 sustainability disclosures.
                Java House product references cite public Gold Label materials.
              </p>
            </footer>
          </section>
        </main>

        {/* STICKY BOTTOM ACTION BAR (Within Mobile Shell) */}
        <div className="absolute inset-x-0 bottom-0 z-40 border-t border-[#d4a84b]/20 bg-[#120c08]/92 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setEarnTab('earn')
                scrollToSection('section-bonga')
                showToast(`+${GREEN_BONGA_EARNED} Green Bonga simulated for this scan!`)
              }}
              className="gb-shine flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d4a84b] via-[#8fe83a] to-[#2ec4b6] px-4 text-xs font-black uppercase tracking-wider text-[#0c0907] shadow-lg shadow-[#8fe83a]/20 active:scale-95"
            >
              <Zap className="size-4 fill-current" />
              <span>Simulate +400 GB Earn</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              type="button"
              aria-label="Share Green Bonga experience"
              onClick={shareExperience}
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 active:scale-95"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 10, x: '-50%' }}
              className="absolute bottom-20 left-1/2 z-[70] flex max-w-[90%] items-center gap-2 rounded-full border border-[#8fe83a]/40 bg-[#141b12] px-4 py-2.5 text-xs font-semibold text-[#faf5ec] shadow-2xl backdrop-blur-xl"
            >
              <CircleCheck className="size-4 shrink-0 text-[#8fe83a]" />
              <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
