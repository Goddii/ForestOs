import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Gift,
  Leaf,
  Menu,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TreePine,
  X,
  Zap,
} from 'lucide-react'

import './greenBonga.css'

const ease = [0.22, 1, 0.36, 1]

const canopyVideo = '/media/forest1-720.webm'
const canopyPoster = '/media/forest1-poster.jpg'
const teaFarmVideo = '/media/tea-farm.mp4'
const teaImg = '/media/java/java_tea_2.jpg'
const cupImg = '/media/java/cup.jpg'
const mauImg = '/media/investor/mau-forest.webp'
const seedlingImg = '/media/investor/seedling-planted.webp'
const teaLandscape = '/media/investor/tea-landscape.webp'

/** Illustrative Green Bonga payout for one Conservation Tea pack scan. */
const GREEN_BONGA_EARNED = 400
const NORMAL_EQUIVALENT = 100
const MULTIPLIER = 4
const BATCH_ID = 'JH-MAU-0842'
const PACK_PRICE_KES = 850
const GREEN_BONGA_TO_BUY = 1200

function Button({ children, className = '', onClick, ariaLabel, ariaExpanded, type = 'button' }) {
  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`gb-press relative inline-flex items-center justify-center overflow-hidden transition-colors ${className}`}
    >
      {children}
    </motion.button>
  )
}

function Badge({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full ${className}`}>{children}</span>
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-36px' }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ number, children }) {
  return (
    <div className="mb-3.5 flex items-center gap-2.5">
      <span className="font-mono text-[0.62rem] font-bold tracking-widest text-[#8fe83a]">{number}</span>
      <span className="h-px w-6 bg-[#8fe83a]/45" />
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/40">{children}</span>
    </div>
  )
}

function BlurWords({ text, className = '' }) {
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.22em] ${className}`}>
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.12 + index * 0.07, duration: 0.6, ease }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

function SafMark() {
  return (
    <div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[#8fe83a] text-[#070d12] shadow-[0_0_22px_rgba(143,232,58,.4)]">
      <Zap className="size-4 fill-current" strokeWidth={2} />
      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-[#070d12] bg-[#2ec4b6]" />
    </div>
  )
}

function ProgressRail({ progress }) {
  const scaleY = useTransform(progress, [0, 1], [0.02, 1])
  const top = useTransform(progress, [0, 1], ['0%', '98%'])
  return (
    <div className="pointer-events-none absolute right-1.5 top-20 bottom-24 z-40 w-1" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
      <motion.div
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#8fe83a] via-[#2ec4b6] to-[#1a4a7a]"
      />
      <motion.div
        style={{ top }}
        animate={{ scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-[#8fe83a] shadow-[0_0_12px_rgba(143,232,58,.85)]"
      />
    </div>
  )
}

function StoryMarquee() {
  const messages = [
    'GREEN BONGA UNLOCKED',
    '4× NORMAL VALUE',
    'SAFARICOM × JAVA HOUSE',
    'CONSERVATION TEA',
    'FORESTOS VERIFIED',
  ]
  const repeated = [...messages, ...messages]
  return (
    <div className="relative z-10 overflow-hidden border-y border-[#8fe83a]/20 bg-[#8fe83a] py-2.5 text-[#070d12]">
      <motion.div
        className="flex w-max items-center gap-6 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {repeated.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="flex items-center gap-6 text-[0.6rem] font-extrabold uppercase tracking-[0.18em]"
          >
            {message} <Sparkles className="size-3" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function NeonRibbonOrb() {
  return (
    <div className="pointer-events-none absolute -right-10 top-8 size-44 opacity-80" aria-hidden="true">
      <motion.div
        animate={{ rotate: [0, 8, -6, 0], y: [0, -6, 4, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="gb-neon-ribbon relative size-full rounded-[42%_58%_48%_52%/48%_42%_58%_52%] blur-[0.5px]"
      />
      <div className="absolute inset-6 rounded-full bg-[#070d12]/55 blur-xl" />
    </div>
  )
}

export default function GreenBongaExperience() {
  const pageRef = useRef(null)
  const toastTimer = useRef(null)
  const teaVideoRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [howOpen, setHowOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [redeemMode, setRedeemMode] = useState('earn')
  const [count, setCount] = useState(0)
  const [teaVideoVisible, setTeaVideoVisible] = useState(false)
  const { scrollYProgress } = useScroll({ container: pageRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  useEffect(() => {
    document.title = 'Green Bonga — Safaricom × Java House · ForestOS'
  }, [])

  useEffect(() => {
    let frame
    const start = performance.now()
    const run = (now) => {
      const t = Math.min(1, (now - start) / 1400)
      const eased = 1 - (1 - t) ** 3
      setCount(Math.round(GREEN_BONGA_EARNED * eased))
      if (t < 1) frame = requestAnimationFrame(run)
    }
    frame = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame)
  }, [])

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(''), 2600)
  }

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    const el = teaVideoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTeaVideoVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const shareStory = async () => {
    const shareData = {
      title: 'Green Bonga — Safaricom × Java Conservation Tea',
      text: `I just unlocked ${GREEN_BONGA_EARNED} Green Bonga — 4× normal Bonga value — on Java Conservation Tea.`,
      url: window.location.href,
    }
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined)
    } else {
      await navigator.clipboard?.writeText(window.location.href)
      showToast('Link copied')
    }
  }

  return (
    <div className="isolate min-h-svh bg-[#05080c] lg:flex lg:items-center lg:justify-center lg:gap-16 lg:p-16">
      <div className="hidden lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#8fe83a]">
          ForestOS · QR scan experience
        </p>
        <p className="font-display text-[44px] font-semibold leading-[1.05] text-[#f3eee3]">
          Scan it on your phone.
        </p>
        <p className="font-sans text-[14px] leading-relaxed text-white/55">
          Safaricom × Java House Green Bonga opens when a shopper scans the QR on a Conservation
          Tea pack. Hook first — reward, then story, then ForestOS proof.
        </p>
        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-white/30">
          Prototype · illustrative figures · proposed partnership
        </p>
      </div>

      <div className="relative mx-auto h-svh w-full max-w-[430px] overflow-hidden lg:h-[844px] lg:w-[390px] lg:max-w-none lg:rounded-[52px] lg:border-[10px] lg:border-[#121820] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[10px] z-[60] hidden h-[22px] w-[110px] -translate-x-1/2 rounded-full bg-[#05080c] lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[6px] left-1/2 z-[60] hidden h-1 w-[120px] -translate-x-1/2 rounded-full bg-white/25 lg:block"
        />

        <ProgressRail progress={smoothProgress} />

        <main
          ref={pageRef}
          className="relative h-full overflow-y-auto overflow-x-hidden bg-[#070d12] pb-28 text-[#f3eee3] selection:bg-[#8fe83a]/70 selection:text-[#070d12]"
        >
          <div className="gb-aurora pointer-events-none fixed inset-0 z-0 opacity-70" />

          <motion.div
            className="sticky left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-[#8fe83a] via-[#2ec4b6] to-[#1a4a7a]"
            style={{ scaleX: smoothProgress }}
          />

          {/* Header */}
          <header className="sticky top-0 z-50 px-3 pt-3">
            <nav className="flex items-center justify-between rounded-full border border-white/12 bg-[#0c1824]/88 px-3 py-2 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <SafMark />
                <div>
                  <div className="font-display text-base font-semibold leading-none tracking-tight">
                    Green Bonga
                  </div>
                  <div className="mt-0.5 font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-[#8fe83a]/85">
                    Safaricom × Java
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="gap-1.5 border border-[#8fe83a]/25 bg-[#8fe83a]/10 px-2.5 py-1 font-mono text-[0.58rem] font-medium text-[#c8f99a]">
                  <span className="size-1.5 rounded-full bg-[#8fe83a] shadow-[0_0_8px_rgba(143,232,58,.9)]" />
                  #{BATCH_ID}
                </Badge>
                <Button
                  ariaLabel="Toggle navigation menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="size-8 rounded-full border border-white/10 bg-white/5 text-white"
                >
                  {menuOpen ? <X className="size-3.5" /> : <Menu className="size-3.5" />}
                </Button>
              </div>
            </nav>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mt-2 rounded-2xl border border-white/10 bg-[#0c1824]/96 p-4 shadow-2xl backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
                    <Badge className="gap-1.5 bg-[#8fe83a]/10 px-2.5 py-1 font-mono text-[0.62rem] text-[#c8f99a]">
                      <CircleCheck className="size-3 text-[#8fe83a]" /> Scan accepted · pack verified
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-xs font-semibold">
                    {[
                      { label: '01 Your Green Bonga', id: 'section-reward' },
                      { label: '02 Earn & redeem', id: 'section-loop' },
                      { label: '03 The partnership', id: 'section-partners' },
                      { label: '04 Trees & proof', id: 'section-trees' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-white/75 transition hover:bg-white/8 hover:text-white"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="size-3 text-[#8fe83a]" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* HERO — value hook first */}
          <section className="relative flex min-h-[580px] flex-col justify-end">
            <div className="absolute inset-0">
              <video
                className="size-full object-cover object-center opacity-55"
                src={canopyVideo}
                poster={canopyPoster}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,13,18,.45)_0%,rgba(7,13,18,.15)_35%,rgba(7,13,18,.97)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(143,232,58,.22),transparent_34%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(46,196,182,.14),transparent_40%)]" />
            </div>
            <NeonRibbonOrb />

            <div className="relative z-10 px-4 pb-6 pt-16">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }}>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
                  <Badge className="mb-3 gap-1.5 border border-[#8fe83a]/35 bg-[#8fe83a]/12 px-2.5 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#c8f99a] backdrop-blur-md">
                    <Gift className="size-3" /> Pack scanned · reward ready
                  </Badge>
                </motion.div>

                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#2ec4b6]">
                  Safaricom Green Bonga
                </p>

                <h1 className="mt-2 font-display text-[3.1rem] font-medium leading-[0.9] tracking-[-0.03em]">
                  <BlurWords text="You just" />
                  <br />
                  <BlurWords text="unlocked" />{' '}
                  <span className="font-serif italic text-[#8fe83a]">more.</span>
                </h1>

                <p className="mt-3 max-w-[92%] text-xs leading-5 text-white/65">
                  This Java Conservation Tea pack pays out Green Bonga — premium loyalty worth{' '}
                  <span className="font-semibold text-[#8fe83a]">4× normal Bonga</span>. Same points
                  Kenyans already redeem. Bigger value, planted in the forest story.
                </p>
              </motion.div>

              {/* Big value card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 160, damping: 18 }}
                className="relative mt-5 overflow-hidden rounded-[1.6rem] border border-[#8fe83a]/25 bg-[#0c1824]/85 p-4 shadow-[0_20px_60px_-20px_rgba(143,232,58,.35)] backdrop-blur-xl"
              >
                <div className="gb-wave-pattern absolute inset-0 opacity-80" />
                <div className="absolute -right-6 -top-6 size-28 rounded-full bg-[#8fe83a]/15 blur-2xl" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/45">
                        Credited to this scan
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-5xl font-medium leading-none tracking-tight text-[#8fe83a]">
                          +{count}
                        </span>
                        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#c8f99a]/80">
                          Green Bonga
                        </span>
                      </div>
                    </div>
                    <div className="relative grid size-12 place-items-center rounded-2xl bg-[#8fe83a] text-[#070d12]">
                      <span className="gb-pulse-ring absolute inset-0 rounded-2xl border border-[#8fe83a]" />
                      <span className="font-mono text-sm font-extrabold">{MULTIPLIER}×</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#c44a3a] px-3 py-2.5 text-white shadow-lg shadow-[#c44a3a]/25">
                    <Zap className="size-3.5 shrink-0" />
                    <p className="text-[0.72rem] font-bold leading-tight tracking-wide">
                      1 GREEN BONGA ≈ {MULTIPLIER}× normal Bonga value
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                      <div className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-white/40">
                        If normal Bonga
                      </div>
                      <div className="mt-1 font-mono text-sm font-semibold text-white/55">
                        ~{NORMAL_EQUIVALENT} pts
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#8fe83a]/25 bg-[#8fe83a]/10 px-3 py-2.5">
                      <div className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-[#8fe83a]/70">
                        What you got
                      </div>
                      <div className="mt-1 font-mono text-sm font-semibold text-[#8fe83a]">
                        {GREEN_BONGA_EARNED} Green
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[0.62rem] text-white/40">
                <span className="size-1 rounded-full bg-[#8fe83a]" />
                Scroll for how it works
                <ChevronDown className="size-3 animate-bounce" />
              </div>
            </div>
          </section>

          <StoryMarquee />

          {/* 01 Reward detail */}
          <section id="section-reward" className="relative z-10 px-4 py-12">
            <Reveal>
              <SectionLabel number="01">Your Green Bonga</SectionLabel>
              <h2 className="font-display text-3xl font-medium leading-[1.05] tracking-tight">
                Points Kenyans already
                <br />
                <span className="font-serif italic text-[#2ec4b6]">know how to spend.</span>
              </h2>
              <p className="mt-3 text-xs leading-5 text-white/55">
                Bonga is everyday value — airtime, data, merchandise, Lipa na M-PESA. Green Bonga
                rides that same habit, with a conservation premium on Java Conservation Tea.
              </p>
            </Reveal>

            <Reveal className="mt-6" delay={0.05}>
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c1824]">
                <div className="relative h-40">
                  <img src={cupImg} alt="Java House tea cup" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1824] via-[#0c1824]/40 to-transparent" />
                  <Badge className="absolute left-3 top-3 border border-white/15 bg-[#070d12]/7 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#8fe83a] backdrop-blur">
                    Supermarket scan
                  </Badge>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-xl font-semibold leading-tight">
                        Java Conservation Tea
                      </div>
                      <div className="mt-1 font-mono text-[0.6rem] text-white/40">
                        KES {PACK_PRICE_KES} · Batch #{BATCH_ID}
                      </div>
                    </div>
                    <Badge className="shrink-0 bg-[#8fe83a] px-2.5 py-1 font-mono text-[0.58rem] font-bold text-[#070d12]">
                      +{GREEN_BONGA_EARNED} GB
                    </Badge>
                  </div>
                  <p className="text-[0.7rem] leading-4 text-white/50">
                    Buy the pack → Green Bonga lands on your Safaricom line. Dial *126# energy,
                    forest-grade value.
                  </p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* 02 Earn & redeem loop */}
          <section id="section-loop" className="relative z-10 px-4 pb-12">
            <Reveal>
              <SectionLabel number="02">Earn & redeem</SectionLabel>
              <h2 className="font-display text-3xl font-medium leading-[1.05]">
                A loop you can
                <br />
                <span className="font-serif italic text-[#8fe83a]">feel in your pocket.</span>
              </h2>
            </Reveal>

            <Reveal className="mt-5">
              <div role="tablist" className="flex rounded-full border border-white/10 bg-white/[0.04] p-1">
                {[
                  { id: 'earn', label: 'Earn on purchase' },
                  { id: 'spend', label: 'Buy with Green Bonga' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    id={`tab-${tab.id}`}
                    type="button"
                    aria-selected={redeemMode === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setRedeemMode(tab.id)}
                    className={`flex-1 rounded-full px-3 py-2.5 text-[0.68rem] font-bold transition ${
                      redeemMode === tab.id
                        ? 'bg-[#8fe83a] text-[#070d12] shadow-md shadow-[#8fe83a]/20'
                        : 'text-white/45'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-4" delay={0.04}>
              <AnimatePresence mode="wait">
                {redeemMode === 'earn' ? (
                  <motion.div
                    key="earn"
                    role="tabpanel"
                    id="panel-earn"
                    aria-labelledby="tab-earn"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="rounded-[1.6rem] border border-[#8fe83a]/20 bg-gradient-to-br from-[#143038] to-[#0c1824] p-4"
                  >
                    <div className="flex items-center gap-2 text-[#8fe83a]">
                      <ShoppingBag className="size-4" />
                      <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em]">
                        At the till
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-medium leading-tight">
                      Buy the tea. Bank the bonus.
                    </h3>
                    <ol className="mt-4 space-y-3">
                      {[
                        'Pick up Java Conservation Tea at a supermarket or Java House.',
                        'Pay as usual — M-PESA, card, or cash.',
                        `Scan the pack QR — ${GREEN_BONGA_EARNED} Green Bonga credit to your line.`,
                      ].map((step, i) => (
                        <li key={step} className="flex gap-3 text-xs leading-5 text-white/65">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#8fe83a]/15 font-mono text-[0.65rem] font-bold text-[#8fe83a]">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <Button
                      onClick={() => showToast(`${GREEN_BONGA_EARNED} Green Bonga simulated`)}
                      className="gb-shine mt-5 h-11 w-full rounded-full bg-[#8fe83a] text-xs font-extrabold text-[#070d12]"
                    >
                      Simulate earn on this pack
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="spend"
                    role="tabpanel"
                    id="panel-spend"
                    aria-labelledby="tab-spend"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="rounded-[1.6rem] border border-[#2ec4b6]/25 bg-gradient-to-br from-[#0f2830] to-[#0c1824] p-4"
                  >
                    <div className="flex items-center gap-2 text-[#2ec4b6]">
                      <RefreshCw className="size-4" />
                      <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em]">
                        Spend back into the belt
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-medium leading-tight">
                      Buy Conservation Tea with Green Bonga.
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-white/55">
                      Redeem Green Bonga for another pack — loyalty that buys forest-linked tea, not
                      just minutes.
                    </p>
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.7rem] text-white/50">Pack price</span>
                        <span className="font-mono text-sm font-semibold">KES {PACK_PRICE_KES}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-2">
                        <span className="text-[0.7rem] text-white/50">Pay with Green Bonga</span>
                        <span className="font-mono text-sm font-semibold text-[#2ec4b6]">
                          {GREEN_BONGA_TO_BUY} GB
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => showToast('Green Bonga redemption started (demo)')}
                      className="gb-shine mt-5 h-11 w-full rounded-full bg-[#2ec4b6] text-xs font-extrabold text-[#070d12]"
                    >
                      Redeem for this pack
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          </section>

          {/* 03 Partnership — Safaricom lead */}
          <section id="section-partners" className="relative z-10 px-4 pb-12">
            <Reveal>
              <SectionLabel number="03">The partnership</SectionLabel>
              <h2 className="font-display text-3xl font-medium leading-[1.05]">
                Safaricom brings the
                <br />
                network. <span className="font-serif italic text-[#c44a3a]">Java brings the cup.</span>
              </h2>
              <p className="mt-3 text-xs leading-5 text-white/55">
                Safaricom is the face of this scan — connectivity, Bonga, and a national green
                ambition. Java House is the partner on the shelf: Conservation Tea grown on the
                Nyayo buffer, with culture that already lives in Kenyan cafés.
              </p>
            </Reveal>

            <div className="mt-6 space-y-3">
              <Reveal>
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[#8fe83a]/20 bg-[#0c1824] p-4">
                  <div className="absolute right-0 top-0 h-24 w-24 bg-[#8fe83a]/10 blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[#8fe83a] text-[#070d12]">
                      <Zap className="size-5 fill-current" />
                    </div>
                    <div>
                      <div className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-[#8fe83a]">
                        Lead · Safaricom
                      </div>
                      <div className="font-display text-lg font-semibold leading-tight">
                        Green Bonga + 5 Million Trees
                      </div>
                    </div>
                  </div>
                  <p className="relative mt-3 text-xs leading-5 text-white/55">
                    Loyalty that rewards conservation purchases. A proposed layer on the Bonga
                    programme Kenyans already use — not a new app, a greener credit.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[#c44a3a]/25 bg-[#140c0c] p-4">
                  <div className="absolute inset-0 opacity-[0.07]" style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg,#c44a3a 0 2px,transparent 2px 10px),repeating-linear-gradient(-45deg,#c44a3a 0 2px,transparent 2px 10px)',
                  }} />
                  <div className="relative flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-[#c44a3a] text-white">
                      <Leaf className="size-5" />
                    </div>
                    <div>
                      <div className="font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-[#e8a090]">
                        Partner · Java House
                      </div>
                      <div className="font-display text-lg font-semibold leading-tight">
                        Conservation Tea on the shelf
                      </div>
                    </div>
                  </div>
                  <p className="relative mt-3 text-xs leading-5 text-white/55">
                    From Mau buffer gardens to café culture — the pack that makes the Green Bonga
                    earn possible.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-4" delay={0.08}>
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                <div className="relative h-44">
                  <img src={teaImg} alt="Java Conservation Tea pack" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070d12] via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="font-display text-xl font-medium">One pack. Two brands. One belt.</div>
                    <div className="mt-1 font-mono text-[0.58rem] text-white/45">
                      Proposed concept · not a signed partnership
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          {/* 04 Trees + ForestOS */}
          <section id="section-trees" className="relative z-10 px-4 pb-10">
            <Reveal>
              <div ref={teaVideoRef} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c1824] p-5 text-white shadow-2xl">
                {teaVideoVisible && (
                  <video
                    className="absolute inset-0 size-full object-cover opacity-45"
                    src={teaFarmVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[#070d12]/50 via-[#070d12]/85 to-[#070d12]" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <SectionLabel number="04">Trees & proof</SectionLabel>
                    <Badge className="border border-white/15 bg-[#070d12]/65 px-2 py-1 text-[0.52rem] font-bold uppercase tracking-wider text-[#2ec4b6] backdrop-blur">
                      FY25 reported
                    </Badge>
                  </div>

                  <h2 className="font-display text-3xl font-medium leading-[1.05]">
                    Safaricom&apos;s green
                    <br />
                    <span className="font-serif italic text-[#8fe83a]">ambition, on record.</span>
                  </h2>
                  <p className="mt-2.5 text-xs leading-5 text-white/60">
                    The 5 Million Trees Initiative aims to grow 5 million indigenous trees by 2030.
                    As of FY25 reporting, over 2.3 million trees planted with Kenya Forest Service —
                    the backdrop for why Green Bonga exists.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur">
                      <TreePine className="size-4 text-[#8fe83a]" />
                      <div className="mt-2 font-display text-3xl font-medium leading-none text-[#8fe83a]">
                        5M
                      </div>
                      <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/45">
                        Trees by 2030
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur">
                      <CircleCheck className="size-4 text-[#2ec4b6]" />
                      <div className="mt-2 font-display text-3xl font-medium leading-none text-[#2ec4b6]">
                        2.3M+
                      </div>
                      <div className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/45">
                        Planted · FY25
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-4" delay={0.05}>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img src={mauImg} alt="Mau Forest canopy" className="h-28 w-full object-cover" />
                  <div className="bg-[#0c1824] px-2.5 py-2 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-white/45">
                    Mau water tower
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img src={seedlingImg} alt="Seedling planted" className="h-28 w-full object-cover" />
                  <div className="bg-[#0c1824] px-2.5 py-2 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-white/45">
                    Indigenous stock
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-4" delay={0.08}>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#2ec4b6]">
                      ForestOS · NTZDC
                    </span>
                    <div className="mt-1 font-display text-xl font-semibold leading-tight">
                      The ground truth under the reward
                    </div>
                  </div>
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2ec4b6]/12 text-[#2ec4b6]">
                    <ShieldCheck className="size-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/50">
                  Green Bonga is the hook. ForestOS holds the buffer record — plot, batch, and
                  conservation evidence — so the points are tied to a place that can be checked.
                </p>

                <Button
                  onClick={() => setHowOpen(!howOpen)}
                  ariaExpanded={howOpen}
                  className="mt-4 w-full justify-between rounded-xl border border-white/10 bg-[#070d12] px-3.5 py-3 font-mono text-[0.65rem] text-white/80"
                >
                  <span>What this pack proves</span>
                  <ChevronDown className={`size-3.5 transition-transform ${howOpen ? 'rotate-180' : ''}`} />
                </Button>

                <AnimatePresence initial={false}>
                  {howOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2 rounded-xl border border-[#2ec4b6]/15 bg-[#2ec4b6]/[0.06] p-3">
                        {[
                          ['Origin', 'S.W. Mau buffer · Kiptunga block'],
                          ['Batch', `#${BATCH_ID}`],
                          ['Partner stack', 'Safaricom Green Bonga · Java House'],
                          ['Full record', 'ForestOS public proof'],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between gap-3 text-[0.68rem]">
                            <span className="text-white/40">{label}</span>
                            <span className="font-mono font-medium text-white/80">{value}</span>
                          </div>
                        ))}
                        <Link
                          to="/batch/921"
                          className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-[#8fe83a]/30 bg-[#8fe83a]/10 py-2.5 text-[0.7rem] font-bold text-[#8fe83a]"
                        >
                          Open full ForestOS proof <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal className="mt-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                <img src={teaLandscape} alt="Tea landscape on the buffer belt" className="h-36 w-full object-cover" />
              </div>
            </Reveal>
          </section>

          <footer className="relative z-10 px-4 pb-8 pt-4">
            <div className="border-t border-white/10 pt-8">
              <SafMark />
              <div className="mt-3 font-display text-2xl font-semibold">Green Bonga</div>
              <p className="mt-1 text-xs leading-5 text-white/45">
                Safaricom-led loyalty for Java Conservation Tea — powered by ForestOS verification.
              </p>
              <p className="mt-4 font-mono text-[0.5rem] uppercase leading-relaxed tracking-[0.1em] text-white/25">
                Illustrative prototype. Green Bonga rates, pack pricing, and partnership framing are
                conceptual. Safaricom tree figures reference publicly reported ESG progress and are
                not a claim that this QR product is live.
              </p>
            </div>
          </footer>

        </main>

        {/* CTA bar — contained within the phone frame */}
        <div className="absolute inset-x-0 bottom-0 z-40 border-t border-[#8fe83a]/12 bg-[#070d12]/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setRedeemMode('spend')
                scrollToSection('section-loop')
                showToast('Scroll to redeem with Green Bonga')
              }}
              className="gb-shine h-12 flex-1 gap-2 rounded-full bg-[#8fe83a] px-4 text-xs font-extrabold text-[#070d12] shadow-lg shadow-[#8fe83a]/25"
            >
              Use Green Bonga <ArrowUpRight className="size-3.5" />
            </Button>
            <Button
              ariaLabel="Share Green Bonga story"
              onClick={shareStory}
              className="size-12 shrink-0 rounded-full border border-white/10 bg-white/8 text-white"
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 18, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 10, x: '-50%' }}
              className="absolute bottom-20 left-1/2 z-[60] flex items-center gap-2 rounded-full border border-white/10 bg-[#0c1824] px-4 py-2.5 text-xs font-semibold text-white shadow-2xl"
            >
              <Check className="size-3.5 text-[#8fe83a]" /> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
