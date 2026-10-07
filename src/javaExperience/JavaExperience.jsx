import { useState, useRef, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, ChevronDown, Phone, Clock,
  Leaf, TreePine, Award, X, Zap, Star, Compass,
} from "lucide-react";

import "./java.css";

// ─── Media Assets ─────────────────────────────────────────────────────────────
const cupImg = "/media/java/cup.jpg";
const ppletreesImg = "/media/java/ppletrees.jpg";
const jungleImg = "/media/java/jungle.jpg";
const javaTeaImg = "/media/java/java_tea.jpeg";
const teaFillVid = "/media/java/teafillvid.mp4";
const watertreeVid = "/media/java/watertree.mp4";

// ─── Constants ───────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  {
    emoji: "🌿",
    title: "Nyayo Tea Zone Forest",
    body: "30,000 hectares of protected indigenous forest buffers the gardens at the foothills of Mt. Kenya and the Aberdares — home to leopard, colobus, and over 300 bird species.",
    stat: "30,000 ha protected",
    color: "#4A9050",
  },
  {
    emoji: "☀️",
    title: "Selective Harvesting",
    body: "Skilled Kenyan pickers select only the finest two leaves and a bud at peak flavour — hand-plucked at dawn before the equatorial sun intensifies the tannins.",
    stat: "100% hand-picked",
    color: "#D4A84B",
  },
  {
    emoji: "🏭",
    title: "Orthodox Processing",
    body: "Natural withering in open airy sheds, gentle rolling, and traditional wood-fired orthodox firing lock in the tea's rich, earthy complexity. Zero synthetic additives.",
    stat: "Zero chemical inputs",
    color: "#C5382B",
  },
  {
    emoji: "☕",
    title: "Your Conservation Cup",
    body: "Every Gold Label pack you purchase channels KES 5 directly to forest rangers, community bursaries, and wildlife corridor restoration in the Nyayo Zone.",
    stat: "KES 5 per pack → forest",
    color: "#D4A84B",
  },
];

const JAVA_LOCATIONS = [
  { id: 1, name: "Village Market", area: "Gigiri, Nairobi", hours: "7:00 am – 10:00 pm", phone: "+254 700 123 456", distance: "0.3 km", mx: 286, my: 68 },
  { id: 2, name: "Westgate Mall", area: "Westlands, Nairobi", hours: "8:00 am – 9:00 pm", phone: "+254 700 234 567", distance: "1.2 km", mx: 108, my: 142 },
  { id: 3, name: "The Junction Mall", area: "Ngong Road, Nairobi", hours: "7:30 am – 9:30 pm", phone: "+254 700 345 678", distance: "3.4 km", mx: 162, my: 218 },
  { id: 4, name: "Sarit Centre", area: "Parklands, Nairobi", hours: "8:00 am – 10:00 pm", phone: "+254 700 456 789", distance: "4.1 km", mx: 156, my: 100 },
  { id: 5, name: "Two Rivers Mall", area: "Ruaka, Nairobi", hours: "8:00 am – 9:00 pm", phone: "+254 700 567 890", distance: "6.7 km", mx: 178, my: 38 },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: ((i * 41 + 7) % 88) + 6,
  y: ((i * 67 + 11) % 85) + 5,
  size: (i % 3) * 0.9 + 1.1,
  dur: (i % 5) * 1.6 + 4.5,
  del: (i % 7) * 0.55,
  leaf: i % 5 === 0,
}));

// ─── Shared Motion Components ─────────────────────────────────────────────────

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -(40 + i * 2), 0], opacity: [0, p.leaf ? 0.35 : 0.55, 0] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: "easeInOut" }}
        >
          {p.leaf ? (
            <svg width={p.size * 5} height={p.size * 8} viewBox="0 0 10 16" fill="none">
              <path d="M5,0 C5,0 9,4 9,9 C9,12 7.2,15 5,15.5 C2.8,15 1,12 1,9 C1,4 5,0 5,0 Z" fill="#3A7D44" opacity="0.6" />
              <line x1="5" y1="1" x2="5" y2="15" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            </svg>
          ) : (
            <div
              className="rounded-full bg-primary"
              style={{ width: p.size, height: p.size, opacity: 0.4 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function AmbientOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 280, height: 280, top: "5%", left: "-18%", background: "radial-gradient(circle, rgba(74,144,80,0.14) 0%, transparent 70%)" }}
        animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 220, height: 220, bottom: "15%", right: "-12%", background: "radial-gradient(circle, rgba(212,168,75,0.10) 0%, transparent 70%)" }}
        animate={{ x: [0, -28, 0], y: [0, -35, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 200, height: 200, top: "45%", left: "25%", background: "radial-gradient(circle, rgba(26,80,34,0.18) 0%, transparent 70%)" }}
        animate={{ x: [0, -18, 22, 0], y: [0, 28, -12, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 160, height: 160, top: "20%", right: "10%", background: "radial-gradient(circle, rgba(197,56,43,0.06) 0%, transparent 70%)" }}
        animate={{ x: [0, 20, 0], y: [0, 40, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
      />
    </div>
  );
}

function TribalPattern({ id, opacity = 1 }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M0,40 L40,0 L80,40 L40,80 Z" fill="none" stroke="rgba(212,168,75,0.18)" strokeWidth="1.5" />
          <path d="M10,40 L40,10 L70,40 L40,70 Z" fill="none" stroke="rgba(212,168,75,0.08)" strokeWidth="1" />
          <path d="M22,40 L40,22 L58,40 L40,58 Z" fill="rgba(197,56,43,0.06)" />
          <line x1="0" y1="0" x2="80" y2="80" stroke="rgba(212,168,75,0.05)" strokeWidth="0.8" />
          <line x1="80" y1="0" x2="0" y2="80" stroke="rgba(212,168,75,0.05)" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function SunLogo({ size = 44 }) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    return { x1: 22 + 13 * Math.cos(a), y1: 22 + 13 * Math.sin(a), x2: 22 + 19 * Math.cos(a), y2: 22 + 19 * Math.sin(a) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="11" fill="#D4A84B" />
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#D4A84B" strokeWidth="1.8" strokeLinecap="round" />
      ))}
      <circle cx="19" cy="21" r="1.2" fill="#08150A" />
      <circle cx="25" cy="21" r="1.2" fill="#08150A" />
      <path d="M18.5 25.5 Q22 28 25.5 25.5" stroke="#08150A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function TeaLeaf({ size, color = "#2D6A2A", opacity = 0.75 }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 22 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 1C11 1 20 10 20 19C20 25.5 15.8 32 11 33C6.2 32 2 25.5 2 19C2 10 11 1 11 1Z" fill={color} opacity={opacity} />
      <path d="M11 3 L11 33" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M11 12 Q15 16 18 19" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" fill="none" />
      <path d="M11 12 Q7 16 4 19" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

// ─── Main Experience ─────────────────────────────────────────────────────────

export default function JavaExperience() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  useEffect(() => {
    document.title = "Java House Gold Label — Traceability";
  }, []);

  return (
    <div className="isolate min-h-svh bg-[#040d07] lg:flex lg:items-center lg:justify-center lg:gap-16 lg:p-16">
      
      {/* Desktop Helper Sidebar */}
      <div className="hidden lg:flex lg:w-[340px] lg:shrink-0 lg:flex-col lg:gap-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          ForestOS · QR scan experience
        </p>
        <p className="font-display text-[44px] font-semibold leading-[1.05] text-white">Scan it on your phone.</p>
        <p className="font-sans text-[14px] leading-relaxed text-[rgba(255,255,255,0.6)]">
          "Java House Gold Label Black Tea" opens when a customer scans the QR code on the packaging. This is a live
          preview of that mobile build — every interaction works exactly as it does on a phone.
        </p>
      </div>

      {/* Phone Wrapper */}
      <div className="relative mx-auto h-svh w-full max-w-[430px] overflow-hidden lg:h-[844px] lg:w-[390px] lg:max-w-none lg:rounded-[52px] lg:border-[10px] lg:border-[#161616] lg:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)] transform-gpu java-experience font-sans">
        
        {/* Dynamic Island and Home Bar */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[10px] z-[60] hidden h-[22px] w-[110px] -translate-x-1/2 rounded-full bg-[#0a0a0a] lg:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-[6px] left-1/2 z-[60] hidden h-[4px] w-[120px] -translate-x-1/2 rounded-full bg-white/30 lg:block" />

        <main ref={scrollRef} className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-[#08150A] text-foreground pb-20">
          
          <HeroSection scrollYProgress={scrollYProgress} />
          <StorySection />
          <TimelineSection />
          <BongaSection />
          <StoreLocator />
          <Footer />

        </main>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

const HERO_LEAVES = [
  { left: "8%", top: "12%", size: 32, color: "#3A7D44", rotateInit: -25, yRange: -180, rotateRange: -55 },
  { left: "78%", top: "18%", size: 22, color: "#2E6B3A", rotateInit: 20, yRange: -110, rotateRange: 40 },
  { left: "55%", top: "8%", size: 18, color: "#4A9050", rotateInit: 35, yRange: -140, rotateRange: -30 },
  { left: "88%", top: "40%", size: 26, color: "#2E6B3A", rotateInit: -12, yRange: -90, rotateRange: 50 },
  { left: "22%", top: "55%", size: 20, color: "#3A7D44", rotateInit: 48, yRange: -130, rotateRange: -40 },
  { left: "70%", top: "62%", size: 15, color: "#4A9050", rotateInit: -38, yRange: -80, rotateRange: 60 },
  { left: "38%", top: "30%", size: 14, color: "#2E6B3A", rotateInit: 15, yRange: -160, rotateRange: -25 },
];

function HeroSection({ scrollYProgress }) {
  const leafMotions = HERO_LEAVES.map((leaf) => ({
    y: useTransform(scrollYProgress, [0, 1], [0, leaf.yRange]),
    rotate: useTransform(scrollYProgress, [0, 1], [leaf.rotateInit, leaf.rotateInit + leaf.rotateRange])
  }));

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative h-svh w-full overflow-hidden bg-[#08150A]">
      <video autoPlay loop muted playsInline poster={cupImg} className="absolute inset-0 w-full h-full object-cover">
        <source src={teaFillVid} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-[#08150A]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08150A] via-transparent to-transparent" />
      <TribalPattern id="hero-tribal" opacity={0.22} />

      {HERO_LEAVES.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: leaf.left, top: leaf.top, y: leafMotions[i].y, rotate: leafMotions[i].rotate }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          <TeaLeaf size={leaf.size} color={leaf.color} opacity={0.65 + (i % 3) * 0.1} />
        </motion.div>
      ))}

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pb-16"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-5 w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <SunLogo size={40} />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
          className="text-primary tracking-[0.25em] text-xs uppercase font-medium mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Java House Kenya
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl font-bold leading-[1.1] text-[#EDE8DC] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Gold Label<br /><em className="text-primary not-italic">Black Tea</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}
          className="text-[#EDE8DC]/65 text-base max-w-[280px] mx-auto mt-4 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Grown at the edge of the Nyayo Tea Zone forest. Every sip protects what grows wild.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="mt-10 flex flex-col items-center gap-2 text-[#EDE8DC]/45">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Discover the story</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="relative py-6 bg-[#08150A] overflow-hidden z-10">
      <div className="px-6 mx-auto">
        <div className="rounded-2xl overflow-hidden relative h-52 mb-6 border border-border">
          <img src={cupImg} alt="Glass cup of Java House Gold Label Black Tea" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-primary text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Conservation in every cup</p>
            <h2 className="text-[#EDE8DC] text-2xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Rich. Earthy. <em className="text-primary">Traceable.</em></h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ value: "30K", label: "Hectares Protected" }, { value: "1200+", label: "Farming Families" }, { value: "62yrs", label: "Conservation Legacy" }].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#0F2012] border border-border rounded-xl p-3 text-center">
              <p className="text-primary text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Jungle background image */}
      <div className="absolute inset-0">
        <img src={jungleImg} alt="Lush Nyayo Tea Zone forest canopy" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <AmbientOrbs />
      <FloatingParticles />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(74,144,80,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 px-6 mx-auto">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-primary tracking-[0.2em] text-xs uppercase font-medium mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Provenance
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl font-semibold text-[#EDE8DC] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            From Forest<br /><em className="text-primary">to Cup</em>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm mt-3 mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            A fully traceable journey through Kenya's most protected highland ecosystem.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated glowing vertical rail */}
          <motion.div
            className="absolute left-[23px] top-6 w-px origin-top"
            style={{
              bottom: "24px",
              background: "linear-gradient(to bottom, rgba(212,168,75,0.7), rgba(212,168,75,0.3), transparent)",
              boxShadow: "0 0 8px rgba(212,168,75,0.4)",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />

          {TIMELINE_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="relative pl-[64px] pb-10 last:pb-0"
            >
              {/* Animated glow ring node */}
              <div className="absolute left-0 w-12 h-12 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1.5px solid ${step.color}`, opacity: 0.4 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
                />
                <motion.div
                  className="absolute inset-1 rounded-full"
                  style={{ border: `1px solid ${step.color}`, opacity: 0.25 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0, 0.25] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 + 0.4 }}
                />
                <div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg"
                  style={{ background: `rgba(8,21,10,0.9)`, border: `1.5px solid ${step.color}40`, boxShadow: `0 0 16px ${step.color}30` }}
                >
                  {step.emoji}
                </div>
              </div>

              {/* Card */}
              <motion.div
                className="bg-[#0F2012]/60 backdrop-blur-xl border border-border rounded-2xl p-4 relative overflow-hidden"
                whileInView={{ boxShadow: [`0 0 0px rgba(0,0,0,0)`, `0 4px 30px rgba(0,0,0,0.3)`] }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 opacity-20" style={{ background: `radial-gradient(circle at top right, ${step.color}, transparent 70%)` }} />
                <h3 className="text-[#EDE8DC] font-semibold text-base mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.body}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: step.color, fontFamily: "'DM Mono', monospace" }}>
                  <Leaf size={10} />{step.stat}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Product card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mt-10 flex items-center gap-4 bg-[#0F2012] border border-border rounded-2xl p-4"
        >
          <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-[#172B1A]">
            <img src={javaTeaImg} alt="Java House Gold Label Black Tea 500g pack" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-primary text-[10px] tracking-widest uppercase font-bold mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Now Available</p>
            <p className="text-[#EDE8DC] font-semibold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Gold Label Black Tea</p>
            <p className="text-muted-foreground text-[13px] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>500g Loose Leaf · KES 850</p>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={11} className="fill-primary text-primary" />)}
              <span className="text-muted-foreground text-[10px] ml-1.5 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>4.9 (238)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BongaSection() {
  const [points, setPoints] = useState(500);
  const trees = Math.max(0, Math.floor(points / 500));
  const discount = points >= 500 ? 10 : points >= 250 ? 5 : 0;

  return (
    <section className="relative py-16 overflow-hidden bg-[#08150A]">
      <div className="absolute inset-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
          <source src={watertreeVid} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/75 to-background" />
      </div>

      <TribalPattern id="bonga-tribal" opacity={0.18} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: 300, height: 300, top: "0%", right: "-20%", background: "radial-gradient(circle, rgba(212,168,75,0.10) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: 240, height: 240, bottom: "5%", left: "-15%", background: "radial-gradient(circle, rgba(74,144,80,0.12) 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
      </div>

      <FloatingParticles />

      <div className="relative z-10 px-6 mx-auto">
        <div className="text-center mb-8">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-primary tracking-[0.2em] text-xs uppercase font-medium mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Safaricom Partnership
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl font-semibold text-[#EDE8DC] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Power Conservation<br /><em className="text-primary">with Bonga.</em>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          animate={{ boxShadow: ["0 0 20px rgba(212,168,75,0.08)", "0 0 40px rgba(212,168,75,0.28), 0 0 80px rgba(212,168,75,0.10)", "0 0 20px rgba(212,168,75,0.08)"] }}
          className="bg-[#08150a]/60 backdrop-blur-xl border border-primary/25 rounded-3xl p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,75,0.6), transparent)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />

          <div className="absolute -right-8 -bottom-8 w-36 h-36 opacity-15 pointer-events-none">
            <img src={ppletreesImg} alt="" className="w-full h-full object-cover rounded-full" />
          </div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <motion.div
              className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0px rgba(212,168,75,0)", "0 0 18px rgba(212,168,75,0.35)", "0 0 0px rgba(212,168,75,0)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Zap size={20} className="text-primary" />
            </motion.div>
            <div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Redeem your points</p>
              <p className="text-[#EDE8DC] font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Bonga for Trees</p>
            </div>
          </div>

          <div className="mb-6 relative z-10">
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>Points to Redeem</label>
              <motion.span key={points} initial={{ scale: 1.2, color: "#fff" }} animate={{ scale: 1, color: "#D4A84B" }} transition={{ duration: 0.25 }}
                className="font-bold text-xl text-primary" style={{ fontFamily: "'DM Mono', monospace" }}>
                {points.toLocaleString()}
              </motion.span>
            </div>
            <input
              type="range" min={0} max={5000} step={250} value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #D4A84B ${(points / 5000) * 100}%, rgba(212,168,75,0.15) ${(points / 5000) * 100}%)`, accentColor: "#D4A84B" }}
            />
            <div className="flex justify-between text-muted-foreground/60 font-bold text-[10px] mt-2" style={{ fontFamily: "'DM Mono', monospace" }}>
              <span>0</span><span>5,000</span>
            </div>
          </div>

          <div className="bg-[#08150a]/80 backdrop-blur-md rounded-2xl p-4 mb-6 space-y-3 border border-border relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] text-[#EDE8DC]/80 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <TreePine size={16} className="text-emerald-400" />Trees planted in Nyayo Zone
              </div>
              <motion.span key={trees} initial={{ scale: 1.4, color: "#D4A84B" }} animate={{ scale: 1, color: "#34d399" }} transition={{ duration: 0.35 }}
                className="font-bold text-2xl text-emerald-400" style={{ fontFamily: "'DM Mono', monospace" }}>{trees}</motion.span>
            </div>
            <div className="w-full h-px bg-border" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] text-[#EDE8DC]/80 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Award size={16} className="text-primary" />Off your next purchase
              </div>
              <motion.span key={discount} initial={{ scale: 1.4 }} animate={{ scale: 1 }} transition={{ duration: 0.35 }}
                className="text-primary font-bold text-2xl" style={{ fontFamily: "'DM Mono', monospace" }}>{discount}%</motion.span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
            className="w-full bg-primary text-[#08150A] py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%", skewX: "-20deg" }}
              whileHover={{ x: "200%", skewX: "-20deg" }}
              transition={{ duration: 0.5 }}
            />
            <Zap size={16} fill="currentColor" />Redeem {points.toLocaleString()} Points
          </motion.button>
          <p className="text-center text-muted-foreground/60 text-[10px] mt-4 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Valid at all Java House Kenya locations<br/>Bonga Points linked to your M-Pesa
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function NairobiMap({ selectedId, onSelect }) {
  const loc = useMemo(() => JAVA_LOCATIONS, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border mt-6" style={{ background: "#061209" }}>
      <svg viewBox="0 0 390 268" className="w-full" style={{ display: "block" }}>
        <defs>
          <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32,0 L0,0 0,32" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          </pattern>
          <filter id="pin-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="390" height="268" fill="url(#map-grid)" />

        <ellipse cx="108" cy="142" rx="58" ry="38" fill="rgba(46,100,50,0.10)" />
        <ellipse cx="156" cy="100" rx="46" ry="30" fill="rgba(46,100,50,0.08)" />
        <ellipse cx="286" cy="68" rx="52" ry="36" fill="rgba(46,100,50,0.07)" />
        <ellipse cx="162" cy="220" rx="44" ry="28" fill="rgba(46,100,50,0.09)" />
        <ellipse cx="178" cy="38" rx="36" ry="22" fill="rgba(46,100,50,0.07)" />
        <circle cx="200" cy="185" r="30" fill="rgba(197,56,43,0.05)" />
        <circle cx="200" cy="185" r="18" fill="rgba(197,56,43,0.06)" />

        <path d="M 0,155 Q 52,150 108,142 Q 152,136 200,185" stroke="rgba(255,255,255,0.14)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 156,100 Q 215,84 286,68" stroke="rgba(255,255,255,0.11)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 108,142 Q 132,122 156,100" stroke="rgba(255,255,255,0.09)" strokeWidth="2" fill="none" />
        <path d="M 108,142 Q 138,108 156,100 Q 167,70 178,38" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" strokeDasharray="8,5" />
        <path d="M 200,185 Q 182,202 162,220 Q 144,238 118,268" stroke="rgba(255,255,255,0.11)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 200,268 L 200,185 Q 198,120 200,0" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none" strokeDasharray="7,5" />
        <path d="M 200,185 Q 268,182 390,178" stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none" />
        <path d="M 286,68 Q 310,100 390,128" stroke="rgba(255,255,255,0.05)" strokeWidth="1.2" fill="none" strokeDasharray="5,4" />
        <path d="M 178,38 Q 230,52 286,68" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" strokeDasharray="6,4" />

        <text x="68" y="160" fill="rgba(255,255,255,0.22)" fontSize="8.5" fontFamily="DM Mono, monospace" letterSpacing="1.5">WESTLANDS</text>
        <text x="120" y="88" fill="rgba(255,255,255,0.18)" fontSize="7.5" fontFamily="DM Mono, monospace" letterSpacing="1.2">PARKLANDS</text>
        <text x="248" y="82" fill="rgba(255,255,255,0.16)" fontSize="7.5" fontFamily="DM Mono, monospace" letterSpacing="1.2">GIGIRI</text>
        <text x="135" y="245" fill="rgba(255,255,255,0.18)" fontSize="7.5" fontFamily="DM Mono, monospace" letterSpacing="1.2">NGONG RD</text>
        <text x="150" y="24" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="DM Mono, monospace" letterSpacing="1.2">RUAKA</text>
        <text x="182" y="182" fill="rgba(197,56,43,0.55)" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700" letterSpacing="1">CBD</text>

        <g transform="translate(358,20)">
          <circle cx="0" cy="0" r="12" fill="rgba(8,21,10,0.8)" stroke="rgba(212,168,75,0.25)" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="rgba(212,168,75,0.7)" fontSize="9" fontFamily="DM Sans, sans-serif" fontWeight="600">N</text>
          <line x1="0" y1="-8" x2="0" y2="-12" stroke="rgba(212,168,75,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <g transform="translate(18,250)">
          <line x1="0" y1="0" x2="48" y2="0" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <line x1="48" y1="-3" x2="48" y2="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <text x="24" y="-5" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="DM Mono, monospace">2 km</text>
        </g>

        {loc.map((l) => {
          const isSelected = selectedId === l.id;
          return (
            <g key={l.id} onClick={() => onSelect(l.id)} style={{ cursor: "pointer" }}>
              <motion.circle cx={l.mx} cy={l.my} r={10} fill="none" stroke={isSelected ? "rgba(212,168,75,0.7)" : "rgba(212,168,75,0.35)"} strokeWidth="1.5" animate={{ r: [10, 26, 10], opacity: [0.7, 0, 0.7] }} transition={{ duration: 2.6, repeat: Infinity, delay: l.id * 0.4, ease: "easeOut" }} />
              <motion.circle cx={l.mx} cy={l.my} r={7} fill="none" stroke={isSelected ? "rgba(212,168,75,0.45)" : "rgba(212,168,75,0.20)"} strokeWidth="1" animate={{ r: [7, 18, 7], opacity: [0.45, 0, 0.45] }} transition={{ duration: 2.6, repeat: Infinity, delay: l.id * 0.4 + 0.5, ease: "easeOut" }} />
              {isSelected && <circle cx={l.mx} cy={l.my} r={10} fill="rgba(212,168,75,0.12)" />}
              <motion.circle cx={l.mx} cy={l.my} r={6} fill={isSelected ? "#D4A84B" : "#1E5C2A"} stroke={isSelected ? "#EDE8DC" : "rgba(212,168,75,0.6)"} strokeWidth="1.5" filter={isSelected ? "url(#pin-glow)" : undefined} animate={isSelected ? { r: [6, 7, 6] } : {}} transition={{ duration: 1.2, repeat: Infinity }} whileHover={{ scale: 1.35 }} />
              <circle cx={l.mx} cy={l.my} r={1.8} fill={isSelected ? "#08150A" : "rgba(212,168,75,0.8)"} style={{ pointerEvents: "none" }} />
              {isSelected && (
                <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <rect x={l.mx - 52} y={l.my - 32} width="104" height="18" rx="9" fill="rgba(212,168,75,0.92)" />
                  <text x={l.mx} y={l.my - 20} textAnchor="middle" fill="#08150A" fontSize="8.5" fontWeight="700" fontFamily="DM Sans, sans-serif">{l.name}</text>
                  <polygon points={`${l.mx - 4},${l.my - 14} ${l.mx + 4},${l.my - 14} ${l.mx},${l.my - 9}`} fill="rgba(212,168,75,0.92)" />
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-border">
        <div className="w-3 h-3 rounded-full bg-[#1E5C2A] border border-primary/50" />
        <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>Java House</span>
      </div>
    </div>
  );
}

function StoreLocator() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedLocation = JAVA_LOCATIONS.find((l) => l.id === selectedId) ?? null;

  return (
    <section className="relative py-16 bg-[#172B1A] overflow-hidden">
      <TribalPattern id="store-tribal" opacity={0.12} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute rounded-full blur-3xl"
          style={{ width: 260, height: 260, top: "20%", left: "-15%", background: "radial-gradient(circle, rgba(46,100,50,0.10) 0%, transparent 70%)" }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <div className="relative z-10 px-6 mx-auto">
        <div className="text-center mb-8">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-primary tracking-[0.2em] text-xs uppercase font-medium mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Retail
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl font-semibold text-[#EDE8DC] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sip Conservation<br /><em className="text-primary">Near You</em>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm mt-3 mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tap a pin to explore. Every Java House serves the Gold Label Conservation Tea.
          </motion.p>
        </div>

        <NairobiMap selectedId={selectedId} onSelect={setSelectedId} />

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {selectedLocation ? (
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-[#0F2012] border border-border rounded-2xl p-4 shadow-lg shadow-black/40"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-[#EDE8DC] font-bold text-lg font-sans mb-0.5">{selectedLocation.name}</h3>
                    <p className="text-muted-foreground text-xs flex items-center gap-1"><MapPin size={12} /> {selectedLocation.area} · {selectedLocation.distance}</p>
                  </div>
                  <div className="bg-primary/15 text-primary p-2 rounded-xl border border-primary/25 cursor-pointer hover:bg-primary hover:text-black transition-colors">
                    <Navigation size={18} />
                  </div>
                </div>
                <div className="w-full h-px bg-border mb-3" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">Hours</p>
                    <p className="text-sm text-[#EDE8DC] flex items-center gap-1.5 font-sans"><Clock size={14} className="text-primary" /> {selectedLocation.hours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">Contact</p>
                    <p className="text-sm text-[#EDE8DC] flex items-center gap-1.5 font-sans"><Phone size={14} className="text-primary" /> {selectedLocation.phone}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#0F2012] border border-border border-dashed rounded-2xl p-6 text-center shadow-lg shadow-black/40 flex flex-col items-center justify-center"
              >
                <Compass className="text-muted-foreground/40 mb-3" size={32} />
                <p className="text-muted-foreground text-sm font-sans">Select a location on the map to view details and opening hours.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-[#08150A] border-t border-border py-12 overflow-hidden">
      <TribalPattern id="footer-tribal" opacity={0.1} />
      <div className="relative z-10 px-6 max-w-md mx-auto text-center">
        <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-4 bg-[#0F2012]">
          <SunLogo size={36} />
        </div>
        <p className="text-primary font-medium tracking-widest text-xs uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Java House Kenya</p>
        <h3 className="text-[#EDE8DC] text-xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Gold Label Black Tea</h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Proudly partnering with the Nyayo Tea Zone Development Corporation to protect Kenya's highland forest heritage — one cup at a time.
        </p>
        <div className="flex items-center justify-center gap-6 mb-8">
          {["About", "Stores", "Sustainability", "Contact"].map((link) => (
            <a key={link} href="#" className="text-muted-foreground text-xs hover:text-primary transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{link}</a>
          ))}
        </div>
        <div className="border-t border-border pt-6">
          <p className="text-muted-foreground/50 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 Java House Kenya Ltd. All rights reserved.<br />Conservation Tea · Nyayo Tea Zone, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
