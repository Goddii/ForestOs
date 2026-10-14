import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Coffee,
  ExternalLink,
  Gift,
  Info,
  Layers,
  Leaf,
  Menu,
  Phone,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TreePine,
  X,
  Zap,
} from 'lucide-react'

import './greenBongaV3.css'

const ease = [0.25, 1, 0.5, 1]

// Media Assets
const teaPourVideo = '/media/teapour.webm'
const teaPourPoster = '/media/tea-pour-poster.webp'
const teaFarmVideo = '/media/tea-farm.mp4'
const javaGoldLabelImg = '/media/java/java-gold-label.avif'
const javaCupImg = '/media/java/cup.jpg'
const javaTeaPackImg = '/media/java/java_tea_2.jpg'
const mauForestImg = '/media/investor/mau-forest.webp'
const seedlingImg = '/media/investor/seedling-planted.webp'
const teaPickersImg = '/media/investor/tea-pickers.webp'
const riverPatrolImg = '/media/investor/river-patrol.webp'
const teaLandscapeImg = '/media/investor/tea-landscape.webp'

// Core Concept Constants
const GREEN_BONGA_EARNED = 400
const NORMAL_EQUIVALENT = 100
const MULTIPLIER = 4
const BATCH_ID = 'JH-MAU-0842'
const PACK_PRICE_KES = 850
const GREEN_BONGA_TO_BUY = 1200

// Refined, understated fine-line African border divider
function EditorialDivider({ className = '' }) {
  return (
    <div className={`my-8 flex items-center justify-center px-6 ${className}`} aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c89b3c]/25 to-transparent" />
      <div className="mx-3 flex items-center gap-1.5 opacity-60">
        <span className="size-1 rounded-full bg-[#c89b3c]" />
        <span className="size-1.5 rotate-45 border border-[#c89b3c]" />
        <span className="size-1 rounded-full bg-[#2e8b29]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c89b3c]/25 to-transparent" />
    </div>
  )
}

function StatusPill({ status = 'verified' }) {
  const configs = {
    verified: {
      dot: 'bg-emerald-400',
      label: 'Verified Record',
      text: 'text-emerald-300/90',
      bg: 'bg-emerald-950/40 border-emerald-800/40',
    },
    reported: {
      dot: 'bg-cyan-400',
      label: 'Reported ESG',
      text: 'text-cyan-300/90',
      bg: 'bg-cyan-950/40 border-cyan-800/40',
    },
    illustrative: {
      dot: 'bg-amber-400',
      label: 'Illustrative Demo',
      text: 'text-amber-300/90',
      bg: 'bg-amber-950/40 border-amber-800/40',
    },
    pending: {
      dot: 'bg-stone-400',
      label: 'Audit Pending',
      text: 'text-stone-300/80',
      bg: 'bg-stone-900/40 border-stone-800/40',
    },
  }

  const c = configs[status] || configs.illustrative

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] font-medium tracking-wide ${c.bg} ${c.text}`}>
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      <span>{c.label}</span>
    </span>
  )
}

function OrganicReveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CalmProgressRail({ progress }) {
  const scaleY = useTransform(progress, [0, 1], [0.04, 1])
  const top = useTransform(progress, [0, 1], ['2%', '96%'])

  return (
    <div className="pointer-events-none absolute right-2 top-20 bottom-24 z-40 w-1" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#c89b3c] via-[#2e8b29] to-[#248277]"
      />
      <motion.div
        style={{ top }}
        className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#c89b3c]"
      />
    </div>
  )
}

export default function GreenBongaExperienceV3() {
  const pageRef = useRef(null)
  const toastTimer = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('earn') // 'earn' | 'redeem' | 'rewards'
  const [counterValue, setCounterValue] = useState(0)
  const [proofExpanded, setProofExpanded] = useState(false)

  const { scrollYProgress } = useScroll({ container: pageRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 85, damping: 22, mass: 0.4 })

  useEffect(() => {
    document.title = 'Rooted in the Land — Java House × Green Bonga · ForestOS'
  }, [])

  // Restrained, smooth roll-up
  useEffect(() => {
    let frame
    const start = performance.now()
    const run = (now) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / 1400)
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
    toastTimer.current = setTimeout(() => setToast(''), 3200)
  }

  const scrollToSection = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const shareStory = async () => {
    const shareData = {
      title: 'Rooted in the Land — Java House × Green Bonga',
      text: 'My morning cup of Java Conservation Tea unlocks 400 Green Bonga and verified indigenous buffer protection in the Mau forest.',
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href)
      showToast('Story link copied to clipboard')
    }
  }

  return (
    <div className="isolate min-h-svh bg-[#090d0a] selection:bg-[#c89b3c]/30 selection:text-white lg:flex lg:items-center lg:justify-center lg:gap-14 lg:p-12">
      {/* Desktop Context Framing — Editorial Narrative */}
      <aside className="hidden lg:flex lg:w-[360px] lg:shrink-0 lg:flex-col lg:gap-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#2e8b29]/20 text-[#2e8b29] border border-[#2e8b29]/30">
            <Leaf className="size-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#c89b3c]">
              ForestOS · Kenya Provenance
            </p>
            <p className="font-display text-lg font-semibold text-[#faf6ee]">
              Java House × Safaricom
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-[#111713] p-6 shadow-2xl">
          <span className="font-serif italic text-[#c89b3c]">Version 3 Edition</span>
          <h2 className="mt-1 font-display text-2xl font-medium leading-snug text-[#faf6ee]">
            “Rooted in the land. Connected by technology.”
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-stone-300/75">
            Refined with an authentic Kenyan tea-growing editorial aesthetic. We removed neon glows and heavy
            futuristic overlays in favour of deep forest greens, tea-leaf gold, natural photography, and quiet digital craft.
          </p>

          <div className="mt-5 space-y-2 border-t border-white/8 pt-3 text-[0.7rem]">
            <div className="flex justify-between text-stone-400">
              <span>Aesthetic Style</span>
              <span className="font-medium text-[#c89b3c]">Kenyan Highlands Editorial</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Visual Tone</span>
              <span className="font-medium text-emerald-400">Restrained & Natural</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Evidence Model</span>
              <span className="font-mono text-[#248277]">ForestOS Cryptographic Trail</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 text-[0.68rem] leading-relaxed text-stone-400">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-300">
            <Info className="size-3.5 text-[#c89b3c]" /> Integrity Disclosure
          </div>
          <p className="mt-1">
            Simulated Green Bonga loyalty mechanics for prototype evaluation. Product packaging imagery cites public
            Java House Gold Label materials. Conservation metrics sourced from Safaricom FY25 ESG reporting.
          </p>
        </div>
      </aside>

      {/* Mobile Screen Shell Frame */}
      <div className="relative mx-auto h-svh w-full max-w-[430px] overflow-hidden lg:h-[860px] lg:w-[395px] lg:max-w-none lg:rounded-[52px] lg:border-[10px] lg:border-[#161f18] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
        {/* Hardware Bezel Notch (Desktop Preview Only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[10px] z-[60] hidden h-[22px] w-[114px] -translate-x-1/2 rounded-full bg-[#0a100b] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6px] left-1/2 z-[60] hidden h-1 w-[124px] -translate-x-1/2 rounded-full bg-white/20 lg:block"
        />

        {/* Calm Progress Rail */}
        <CalmProgressRail progress={smoothProgress} />

        {/* Scrollable Container */}
        <main
          ref={pageRef}
          className="v3-ambient-backdrop relative h-full overflow-y-auto overflow-x-hidden pb-32 text-[#faf6ee] selection:bg-[#c89b3c]/30 selection:text-white"
        >
          {/* Subtle Hairline Progress Indicator at Top */}
          <motion.div
            className="sticky left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-[#c89b3c] via-[#2e8b29] to-[#248277]"
            style={{ scaleX: smoothProgress }}
          />

          {/* Editorial App Header */}
          <header className="sticky top-0 z-50 px-4 pt-3">
            <nav className="flex items-center justify-between rounded-full border border-white/10 bg-[#0f1712]/92 px-4 py-2.5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-[#c89b3c]/20 text-[#c89b3c]">
                  <Coffee className="size-3.5" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold tracking-tight text-[#faf6ee]">
                    Java House × Safaricom
                  </div>
                  <div className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-stone-400">
                    Conservation Tea QR · #{BATCH_ID}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusPill status="verified" />

                <button
                  type="button"
                  aria-label="Navigation menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex size-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition hover:bg-white/10 active:scale-95"
                >
                  {menuOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
                </button>
              </div>
            </nav>

            {/* In-Experience Index Drawer */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  className="mt-2 rounded-3xl border border-white/10 bg-[#121b14]/98 p-5 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-[#c89b3c]">
                      Table of Contents
                    </span>
                    <span className="font-mono text-[0.55rem] text-stone-400">Batch #{BATCH_ID}</span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    {[
                      { label: '01 The Opening Hook', id: 'v3-hook' },
                      { label: '02 The Trinity: Land, Reward & Truth', id: 'v3-brands' },
                      { label: '03 The Mau Conservation Belt', id: 'v3-conservation' },
                      { label: '04 Green Bonga Participation', id: 'v3-bonga' },
                      { label: '05 ForestOS Provenance Record', id: 'v3-evidence' },
                      { label: '06 Closing Ritual & Sharing', id: 'v3-closing' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-stone-300 transition hover:bg-white/5 hover:text-[#c89b3c]"
                      >
                        <span className="font-medium">{item.label}</span>
                        <ArrowUpRight className="size-3 text-[#c89b3c]" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* SECTION A — THE OPENING HOOK */}
          <section id="v3-hook" className="relative flex min-h-[580px] flex-col justify-end pt-6">
            {/* Organic Video Background (Warm natural tea pour / steam) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                className="size-full object-cover object-center opacity-40 mix-blend-screen"
                src={teaPourVideo}
                poster={teaPourPoster}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
              {/* Natural dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#090d0a]/70 via-[#090d0a]/35 to-[#090d0a]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,155,60,0.12)_0%,_transparent_65%)]" />
            </div>

            <div className="relative z-10 px-6 pb-6 pt-16">
              <OrganicReveal>
                {/* Subtle Editorial Kicker */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-[#c89b3c]/60" />
                  <span className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#c89b3c]">
                    Pack Scanned · Provenance Unlocked
                  </span>
                </div>

                <h1 className="font-display text-[3.25rem] font-normal leading-[0.93] tracking-tight text-[#faf6ee]">
                  Your cup has a
                  <br />
                  <span className="font-serif italic text-[#c89b3c]">bigger story.</span>
                </h1>

                <p className="mt-4 max-w-[92%] text-xs leading-relaxed text-stone-300/80">
                  Discover the connection between your everyday tea ritual, Green Bonga, and the story of conservation.
                </p>
              </OrganicReveal>

              {/* Natural Editorial Value Card */}
              <OrganicReveal className="mt-6" delay={0.15}>
                <div className="rounded-3xl border border-white/10 bg-[#121c15]/90 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.18em] text-stone-400">
                        Scan Allocation
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-5xl font-medium tracking-tight text-white">
                          +{counterValue}
                        </span>
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2e8b29]">
                          Green Bonga
                        </span>
                      </div>
                    </div>

                    <div className="flex size-11 items-center justify-center rounded-2xl border border-[#2e8b29]/40 bg-[#2e8b29]/15 text-sm font-bold text-white">
                      <span>{MULTIPLIER}×</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[0.72rem] leading-relaxed text-stone-300/75">
                    This pack rewards you with <strong className="text-white">4× standard Bonga value</strong>,
                    bridging the daily cup of Kenyan tea to the conservation buffer of the South West Mau.
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[0.64rem]">
                    <span className="text-stone-400">Standard Pack: ~100 Bonga</span>
                    <span className="font-semibold text-emerald-400">Conservation Pack: 400 GB</span>
                  </div>
                </div>
              </OrganicReveal>

              {/* Gentle Scroll Invitation */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-6 flex items-center justify-center gap-1.5 text-[0.64rem] font-medium tracking-wider text-stone-400"
              >
                <span>Scroll to explore the origin</span>
                <ChevronDown className="size-3.5 text-[#c89b3c]" />
              </motion.div>
            </div>
          </section>

          <EditorialDivider />

          {/* SECTION B — THE BRAND CONNECTION */}
          <section id="v3-brands" className="relative z-10 px-6 py-6">
            <OrganicReveal>
              <div className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#c89b3c]">
                The Trinity
              </div>
              <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-[#faf6ee]">
                A little Java.
                <br />
                <span className="font-serif italic text-[#c89b3c]">A little more impact.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-stone-300/75">
                Great tea is never solitary. It is a relationship between the grower, the land, and the hands that brew it.
                Here, three Kenyan identities join to make every cup an act of stewardship.
              </p>
            </OrganicReveal>

            {/* Editorial Trinity Narrative Layout */}
            <OrganicReveal className="mt-6">
              <div className="space-y-3.5">
                {/* 1. Java House */}
                <div className="rounded-2xl border border-[#c89b3c]/20 bg-[#161410]/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#c89b3c]/15 text-[#c89b3c]">
                      <Coffee className="size-4" />
                    </div>
                    <div>
                      <div className="font-display text-base font-semibold text-[#faf6ee]">Java House</div>
                      <div className="text-[0.62rem] text-[#c89b3c]">The Tea, Ritual & Hospitality</div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[0.72rem] leading-relaxed text-stone-300/75">
                    Kenyan coffee and tea heritage rooted in warmth and community. Selective orthodox processing
                    delivers full-bodied highland character directly to your morning.
                  </p>
                </div>

                {/* 2. Safaricom Green Bonga */}
                <div className="rounded-2xl border border-[#2e8b29]/25 bg-[#0e1811]/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#2e8b29]/20 text-[#2e8b29]">
                      <Zap className="size-4 fill-current" />
                    </div>
                    <div>
                      <div className="font-display text-base font-semibold text-[#faf6ee]">Safaricom Green Bonga</div>
                      <div className="text-[0.62rem] text-emerald-400">Everyday Digital Participation</div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[0.72rem] leading-relaxed text-stone-300/75">
                    Connecting millions through the familiar *126# loyalty routine, enhanced with a 4× reward multiplier
                    that channels consumer pride into Kenya&apos;s living green canopy.
                  </p>
                </div>

                {/* 3. ForestOS */}
                <div className="rounded-2xl border border-[#248277]/25 bg-[#0e1717]/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-[#248277]/20 text-[#248277]">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <div className="font-display text-base font-semibold text-[#faf6ee]">ForestOS</div>
                      <div className="text-[0.62rem] text-cyan-300">The Ground-Truth Evidence Layer</div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[0.72rem] leading-relaxed text-stone-300/75">
                    Cryptographic batch attestation linking tea origins to actual Nyayo buffer boundaries, tree nursery
                    registries, and verifiable field telemetry.
                  </p>
                </div>
              </div>
            </OrganicReveal>

            {/* Documentary Product Photo Integration */}
            <OrganicReveal className="mt-6" delay={0.08}>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121613]">
                <div className="relative aspect-[4/3] w-full bg-[#181d19]">
                  <img
                    src={javaGoldLabelImg}
                    alt="Java House Gold Label Black Tea reference product"
                    className="size-full object-cover object-center"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = javaTeaPackImg
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121613] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono text-[0.55rem] uppercase tracking-wider text-stone-300/80">
                      Product Reference: Gold Label Loose Leaf (350g)
                    </span>
                    <StatusPill status="illustrative" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-xl font-medium text-[#faf6ee]">
                    Highland Orthodox Harvest
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-300/75">
                    Temporary photographic reference from public Java House Gold Label retail packaging. Demonstrates how
                    on-pack QR telemetry connects physical tea boxes directly into the conservation ledger.
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2.5 font-mono text-[0.58rem] text-stone-400">
                    <span>Source: purpink.co.ke</span>
                    <span>Broken Orange Pekoe (BP1)</span>
                  </div>
                </div>
              </div>
            </OrganicReveal>
          </section>

          <EditorialDivider />

          {/* SECTION C — THE CONSERVATION STORY */}
          <section id="v3-conservation" className="relative z-10 px-6 py-6">
            <OrganicReveal>
              <div className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-emerald-400">
                03 The Landscape
              </div>
              <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-[#faf6ee]">
                Beyond the cup,
                <br />
                <span className="font-serif italic text-emerald-400">there&apos;s a landscape.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-stone-300/75">
                The Nyayo Tea Zone is not just a garden; it is a 30,000-hectare living green belt established to
                physically protect Kenya&apos;s primary water towers—including the Mau and Aberdares—from deforestation.
              </p>
            </OrganicReveal>

            {/* Drone / Landscape Video Card */}
            <OrganicReveal className="mt-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f1812] p-6 shadow-xl">
                <video
                  className="absolute inset-0 size-full object-cover opacity-35"
                  src={teaFarmVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#090d0a]/60 via-[#090d0a]/80 to-[#090d0a]" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-emerald-300">
                      Kenya Forest Service Buffer Belt
                    </span>
                    <StatusPill status="reported" />
                  </div>

                  <h3 className="font-display text-2xl font-medium text-[#faf6ee]">
                    Safaricom&apos;s 5 Million Trees Commitment
                  </h3>

                  <p className="text-xs leading-relaxed text-stone-300/80">
                    As published in Safaricom&apos;s audited FY25 Sustainability Report, over <strong>2.3 million indigenous trees</strong> have
                    already been planted in partnership with KFS and community forest associations, targeting 5 million by 2030.
                  </p>

                  {/* Restrained Figures Display */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-2xl border border-white/8 bg-black/40 p-4">
                      <div className="font-mono text-[0.55rem] uppercase tracking-wider text-stone-400">
                        2030 National Target
                      </div>
                      <div className="mt-1 font-display text-3xl font-semibold text-white">5.0M</div>
                      <div className="text-[0.62rem] text-stone-400">Indigenous Trees</div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/40 p-4">
                      <div className="font-mono text-[0.55rem] uppercase tracking-wider text-stone-400">
                        Audited in FY25
                      </div>
                      <div className="mt-1 font-display text-3xl font-semibold text-emerald-400">2.3M+</div>
                      <div className="text-[0.62rem] text-stone-400">Planted with KFS</div>
                    </div>
                  </div>
                </div>
              </div>
            </OrganicReveal>

            {/* Documentary Photography Grid */}
            <OrganicReveal className="mt-4" delay={0.06}>
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#111712]">
                  <img
                    src={teaPickersImg}
                    alt="Smallholder pickers hand-selecting tea at dawn"
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-2.5">
                    <div className="font-mono text-[0.58rem] font-bold text-stone-300">Selective Plucking</div>
                    <div className="text-[0.62rem] text-stone-400">Two leaves and a bud harvested at sunrise.</div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#111712]">
                  <img
                    src={riverPatrolImg}
                    alt="Ranger patrol protecting indigenous water tower"
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-2.5">
                    <div className="font-mono text-[0.58rem] font-bold text-stone-300">Corridor Patrol</div>
                    <div className="text-[0.62rem] text-stone-400">Guarding elephant migration routes in the Mau.</div>
                  </div>
                </div>
              </div>
            </OrganicReveal>

            {/* Attribution Safeguard Note */}
            <OrganicReveal className="mt-3">
              <div className="rounded-2xl border border-white/8 bg-stone-900/40 p-3.5 text-[0.68rem] leading-relaxed text-stone-400">
                <span className="font-semibold text-stone-300">Stewardship Note:</span> Buying this pack supports the
                conservation buffer programme. We do not claim that an individual purchase directly planted a specific
                numbered tree unless corroborated by a dedicated batch planting event.
              </div>
            </OrganicReveal>
          </section>

          <EditorialDivider />

          {/* SECTION D — GREEN BONGA INTERACTION */}
          <section id="v3-bonga" className="relative z-10 px-6 py-6">
            <OrganicReveal>
              <div className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#c89b3c]">
                04 Everyday Choice
              </div>
              <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-[#faf6ee]">
                Your everyday choice.
                <br />
                <span className="font-serif italic text-[#c89b3c]">A new way to participate.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-stone-300/75">
                Bonga Points are woven into daily Kenyan life. Green Bonga harnesses that exact habit to reward
                sustainable consumer choices at supermarkets, retail shelves, and café counters.
              </p>
            </OrganicReveal>

            {/* Restrained Tab Navigation */}
            <OrganicReveal className="mt-6">
              <div className="flex rounded-full border border-white/10 bg-[#111712] p-1">
                {[
                  { id: 'earn', label: 'Earn on Purchase', tag: '+400 GB' },
                  { id: 'redeem', label: 'Redeem for Tea', tag: '1,200 GB' },
                  { id: 'rewards', label: 'Utility Perks', tag: 'Data & Café' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 flex-col items-center justify-center rounded-full py-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#2e8b29] text-white shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[0.65rem] font-bold">{tab.label}</span>
                    <span className="font-mono text-[0.52rem] opacity-80">{tab.tag}</span>
                  </button>
                ))}
              </div>
            </OrganicReveal>

            {/* Interactive Tab Panels */}
            <OrganicReveal className="mt-4">
              <AnimatePresence mode="wait">
                {activeTab === 'earn' && (
                  <motion.div
                    key="v3-earn"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-3xl border border-white/10 bg-[#131d16] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-emerald-400">
                        Three-Step Journey
                      </span>
                      <StatusPill status="illustrative" />
                    </div>

                    <h3 className="mt-2 font-display text-xl font-semibold text-[#faf6ee]">
                      From Checkout to Green Credit
                    </h3>

                    <div className="mt-4 space-y-3">
                      {[
                        { step: '1', title: 'Buy Java Conservation Tea', desc: 'Available at Java House outlets, Carrefour, and Naivas.' },
                        { step: '2', title: 'Scan the On-Pack QR', desc: 'Instant smartphone recognition without installing any application.' },
                        { step: '3', title: 'Receive +400 Green Bonga', desc: '4× multiplier credited to your registered Safaricom line.' },
                      ].map((s) => (
                        <div key={s.step} className="flex gap-3 text-xs">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2e8b29]/20 font-mono text-[0.65rem] font-bold text-emerald-400">
                            {s.step}
                          </span>
                          <div>
                            <div className="font-semibold text-stone-200">{s.title}</div>
                            <div className="text-[0.68rem] text-stone-400">{s.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Simulated scan: +400 Green Bonga unlocked!')}
                      className="v3-press-feedback v3-btn-subtle-shine mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2e8b29] text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Simulate Earning +400 GB</span>
                    </button>
                  </motion.div>
                )}

                {activeTab === 'redeem' && (
                  <motion.div
                    key="v3-redeem"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-3xl border border-white/10 bg-[#141b18] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#248277]">
                        Circular Economy Loop
                      </span>
                      <StatusPill status="illustrative" />
                    </div>

                    <h3 className="mt-2 font-display text-xl font-semibold text-[#faf6ee]">
                      Exchange Points for Fresh Harvest
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-stone-300/75">
                      Use points accumulated from your daily digital routine to purchase your next pack of tea,
                      completing a closed loop that reinvests loyalty directly into the conservation belt.
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/8 bg-black/40 p-3.5 text-xs">
                      <div className="flex justify-between text-stone-300">
                        <span>Tea Pack Value</span>
                        <span className="font-mono font-medium">KES {PACK_PRICE_KES}</span>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-white/8 pt-2 font-semibold text-emerald-400">
                        <span>Redemption Cost</span>
                        <span className="font-mono">{GREEN_BONGA_TO_BUY} Green Bonga</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Redemption voucher simulated for 1,200 GB')}
                      className="v3-press-feedback mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#248277]/40 bg-[#248277]/20 text-xs font-bold uppercase tracking-wider text-cyan-200 active:scale-95"
                    >
                      <RefreshCw className="size-3.5" />
                      <span>Simulate Pack Redemption</span>
                    </button>
                  </motion.div>
                )}

                {activeTab === 'rewards' && (
                  <motion.div
                    key="v3-rewards"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-3xl border border-white/10 bg-[#171410] p-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#c89b3c]">
                        Everyday Utilities
                      </span>
                      <StatusPill status="illustrative" />
                    </div>

                    <h3 className="mt-2 font-display text-xl font-semibold text-[#faf6ee]">
                      Redeem on Safaricom Network
                    </h3>

                    <div className="mt-3.5 space-y-2">
                      {[
                        { title: '1.5 GB Safaricom 24hr Data Pass', cost: '300 GB', icon: Zap },
                        { title: 'KES 200 Airtime Voucher', cost: '400 GB', icon: Phone },
                        { title: 'KES 500 Java House Café Credit', cost: '750 GB', icon: Coffee },
                      ].map((item) => (
                        <div key={item.title} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/40 p-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <item.icon className="size-3.5 text-[#c89b3c]" />
                            <span className="text-stone-300">{item.title}</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">{item.cost}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </OrganicReveal>
          </section>

          <EditorialDivider />

          {/* SECTION E — FORETOS EVIDENCE & WHAT THIS PACK PROVES */}
          <section id="v3-evidence" className="relative z-10 px-6 py-6">
            <OrganicReveal>
              <div className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#248277]">
                05 Provenance Layer
              </div>
              <h2 className="font-display text-3xl font-medium leading-snug tracking-tight text-[#faf6ee]">
                A good story
                <br />
                <span className="font-serif italic text-[#248277]">deserves evidence.</span>
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-stone-300/75">
                ForestOS ensures conservation claims are verified through verifiable satellite telemetry,
                GPS polygons, and immutable batch records.
              </p>
            </OrganicReveal>

            {/* Provenance Card */}
            <OrganicReveal className="mt-6">
              <div className="rounded-3xl border border-white/10 bg-[#111915] p-5 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-cyan-400">
                      <ShieldCheck className="size-3.5" />
                      NTZDC Registry
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold text-[#faf6ee]">
                      Batch Proof #{BATCH_ID}
                    </div>
                  </div>
                  <StatusPill status="verified" />
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-stone-300/75">
                  Tea leaves in this batch were hand-plucked from the South West Mau Kiptunga block under the
                  stewardship of the Nyayo Tea Zones Development Corporation.
                </p>

                {/* Status Taxonomy Explanation */}
                <div className="mt-4 rounded-2xl border border-white/8 bg-black/40 p-3.5">
                  <div className="font-mono text-[0.55rem] uppercase tracking-wider text-stone-400">
                    Evidence Classification
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[0.64rem]">
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      <span>Verified GPS Polygon</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <span className="size-1.5 rounded-full bg-cyan-400" />
                      <span>Reported FY25 Metrics</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <span className="size-1.5 rounded-full bg-amber-400" />
                      <span>Illustrative Reward Demo</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <span className="size-1.5 rounded-full bg-stone-400" />
                      <span>Audit Pending Q4</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Accordion */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setProofExpanded(!proofExpanded)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left font-mono text-xs font-semibold text-stone-300 transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="size-3.5 text-[#248277]" />
                      What this pack proves
                    </span>
                    <ChevronDown className={`size-3.5 text-stone-400 transition-transform ${proofExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {proofExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2 rounded-xl border border-white/8 bg-black/50 p-3.5 text-xs">
                          {[
                            ['Origin Block', 'South West Mau Buffer · Kiptunga Block'],
                            ['GPS Polygon', '0.5841° S, 35.7924° E (2,340m altitude)'],
                            ['Custody Chain', 'Nyayo Tea Zones Development Corp (NTZDC)'],
                            ['Attestation Hash', 'sha256:7f8a9e2d...014c'],
                            ['Roles', 'Java House (Product) · Safaricom (Loyalty) · ForestOS (Telemetry)'],
                          ].map(([label, val]) => (
                            <div key={label} className="flex flex-col border-b border-white/5 pb-1">
                              <span className="font-mono text-[0.58rem] text-stone-400">{label}</span>
                              <span className="font-mono text-[0.68rem] text-stone-200">{val}</span>
                            </div>
                          ))}

                          <div className="pt-2">
                            <Link
                              to="/batch/921"
                              className="flex w-full items-center justify-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 py-2.5 font-mono text-[0.66rem] font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                              <span>Inspect Full ForestOS Dossier (#921)</span>
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </OrganicReveal>

            {/* Documentary Buffer Belt Landscape */}
            <OrganicReveal className="mt-4">
              <div className="overflow-hidden rounded-2xl border border-white/8">
                <img
                  src={teaLandscapeImg}
                  alt="Highland tea landscape on the buffer zone"
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </OrganicReveal>
          </section>

          <EditorialDivider />

          {/* SECTION F — CLOSING CALL TO ACTION */}
          <section id="v3-closing" className="relative z-10 px-6 pb-12 pt-4">
            <OrganicReveal>
              <div className="rounded-3xl border border-white/10 bg-[#121813] p-6 text-center shadow-xl">
                <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#c89b3c]/15 text-[#c89b3c]">
                  <Coffee className="size-5" />
                </div>

                <h2 className="mt-3 font-display text-2xl font-medium text-[#faf6ee]">
                  Rooted in the land.
                  <br />
                  <span className="font-serif italic text-[#c89b3c]">Connected by technology.</span>
                </h2>

                <p className="mx-auto mt-2.5 max-w-[90%] text-xs leading-relaxed text-stone-300/75">
                  From dawn pluckers in the Mau highlands to the morning comfort of your Java House mug,
                  your everyday tea choice preserves Kenya&apos;s living green buffer.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={shareStory}
                    className="v3-press-feedback flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#c89b3c]/30 bg-[#c89b3c]/15 text-xs font-semibold text-[#faf6ee] transition hover:bg-[#c89b3c]/25 active:scale-95"
                  >
                    <Share2 className="size-3.5 text-[#c89b3c]" />
                    <span>Share This Story</span>
                  </button>

                  <Link
                    to="/batch/921"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white/5 text-xs font-semibold text-stone-300 transition hover:bg-white/10"
                  >
                    <span>View Public Batch Record</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </OrganicReveal>

            {/* Restrained Editorial Footer */}
            <footer className="mt-8 border-t border-white/8 pt-6 text-center">
              <div className="flex items-center justify-center gap-2 font-mono text-[0.62rem] text-stone-400">
                <span>Java House</span>
                <span>·</span>
                <span className="text-emerald-400">Safaricom Green Bonga</span>
                <span>·</span>
                <span className="text-cyan-400">ForestOS</span>
              </div>

              <p className="mt-3 font-mono text-[0.52rem] uppercase leading-relaxed tracking-wider text-stone-500">
                Illustrative concept experience. Not a signed commercial endorsement or live loyalty rollout.
                Safaricom tree figures cite audited FY25 sustainability disclosures.
                Java House product references cite public Gold Label materials.
              </p>
            </footer>
          </section>
        </main>

        {/* STICKY BOTTOM BAR (Calm, non-neon, tactile) */}
        <div className="absolute inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0e1410]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('earn')
                scrollToSection('v3-bonga')
                showToast('+400 Green Bonga simulated for this scan!')
              }}
              className="v3-press-feedback v3-btn-subtle-shine flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#2e8b29] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95"
            >
              <Zap className="size-3.5 fill-current" />
              <span>Simulate +400 GB Earn</span>
              <ArrowRight className="size-3.5" />
            </button>

            <button
              type="button"
              aria-label="Share experience"
              onClick={shareStory}
              className="v3-press-feedback flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-200 transition hover:bg-white/10 active:scale-95"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>

        {/* Quiet Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 15, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 8, x: '-50%' }}
              className="absolute bottom-20 left-1/2 z-[70] flex max-w-[90%] items-center gap-2 rounded-full border border-emerald-500/30 bg-[#0c1810] px-4 py-2 text-xs font-medium text-stone-100 shadow-xl backdrop-blur-xl"
            >
              <CircleCheck className="size-3.5 shrink-0 text-emerald-400" />
              <span>{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
