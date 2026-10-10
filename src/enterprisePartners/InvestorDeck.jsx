import { useEffect, useState } from 'react'
import { ConceptTag, DisplayHeadline, Kicker } from './components/ui'
import EnterpriseNav from './components/EnterpriseNav'
import BrandLogo from './components/BrandLogo'
import { AssumptionsFooter } from './EnterpriseHub'
import './enterprisePartners.css'

const FRAMES = [
  {
    n: '01',
    title: 'Ecosystem',
    brands: ['safaricom', 'java-house'],
    body: 'ForestOS at the centre. Safaricom and Java House as sibling brand layers feeding shared conservation infrastructure.',
  },
  {
    n: '02',
    title: 'The trust gap',
    body: 'Consumers see products — rarely WHERE → HOW → IMPACT → VERIFIED. ForestOS closes that gap for tea.',
  },
  {
    n: '03',
    title: 'Safaricom scan',
    brands: ['safaricom'],
    body: 'Physical touchpoint → QR → ForestOS verify → discover. Connectivity layer, not forest ownership.',
  },
  {
    n: '04',
    title: 'Safaricom impact',
    brands: ['safaricom'],
    body: 'Verified tea and conservation dashboard with illustrative counters until production data connects.',
  },
  {
    n: '05',
    title: 'Safaricom + Bonga',
    brands: ['safaricom'],
    body: 'Proposed reward participation — clearly labelled, no implied live integration.',
  },
  {
    n: '06',
    title: 'Java House packaging',
    brands: ['java-house'],
    body: 'Premium tea packaging suite communicating traceability + conservation, not coffee origin claims.',
  },
  {
    n: '07',
    title: 'Java House QR',
    brands: ['java-house'],
    body: 'Package scan → tea story → progressive evidence.',
  },
  {
    n: '08',
    title: 'Java House conservation',
    brands: ['java-house'],
    body: 'Tea batch → plot → verified conservation record → 2015 vs today reveal.',
  },
  {
    n: '09',
    title: 'Shared passport',
    brands: ['safaricom', 'java-house'],
    body: 'Safaricom stamp + Java House stamp in one Bonga × Forest Passport with tier progression.',
  },
  {
    n: '10',
    title: 'Game loop and economy',
    body: 'A game that teaches the trust model, not a purchase funnel. Two currencies, strictly separate: Canopy XP is ForestOS-native progress with no cash value; Bonga stays a labelled concept. Quests are capped at three a session and every action is deterministic — no loot boxes, no random drops, no paid boosts.',
  },
  {
    n: '11',
    title: 'Consumer flywheel',
    body: 'Scan → discover → participate → reward concept → return. Illustrative KPIs only.',
  },
  {
    n: '12',
    title: 'Enterprise architecture',
    body: 'Brands → product → QR → ForestOS API → verification → tea + conservation data → GIS → experience → reward layer.',
  },
  {
    n: '13',
    title: '90-day pilot',
    body: '[N] tea packs · [N] touchpoints · [N] locations · 1 plot · [N] scans — all illustrative, no invented commitments.',
  },
  {
    n: '14',
    title: 'Scalability',
    body: 'One platform → more brands → more factories → more blocks → national scale.',
  },
  {
    n: '15',
    title: 'Final hero',
    body: 'One conservation platform. Multiple brands. One measurable impact.',
  },
]

/** The illustrative Canopy XP economy shown on the game-loop frame (brief 5.8). */
const XP_TABLE = [
  ['Verified scan', '+25'],
  ['Quest complete', '+20'],
  ['Claim vs Fact (per plot)', '+30'],
  ['Pledge', '+15'],
  ['Stamp series complete', '+50'],
]

/** The tiers XP unlocks (brief 5.5). Tiers unlock content, never discounts. */
const TIER_TABLE = [
  ['Visitor', '0 XP', 'The QR journey and your first stamp'],
  ['Explorer', '75 XP', 'The origin beats and the stamp book'],
  ['Guardian', '250 XP', 'Field-officer notes on your adopted plot'],
  ['Custodian', '500 XP', 'Your full conservation record, held in the passport'],
]

const BUSINESS = [
  'Implementation · [PROJECT FEE]',
  'Platform · [ANNUAL / MONTHLY FEE]',
  'Verification · [PER BATCH / QR / RECORD]',
  'Enterprise integration · [API + DATA FEE]',
  'Support · [ANNUAL SUPPORT FEE]',
]

export default function InvestorDeck() {
  const [activeFrame, setActiveFrame] = useState(FRAMES[0].n)

  useEffect(() => {
    document.title = 'Investor deck — ForestOS enterprise prototype'
  }, [])

  // Which frame is on screen — the sticky header doubles as a position
  // indicator so a reader always knows how deep into 15 frames they are.
  useEffect(() => {
    const frames = document.querySelectorAll('section[id^="frame-"]')
    if (!('IntersectionObserver' in window) || frames.length === 0) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveFrame(entry.target.id.replace('frame-', ''))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    frames.forEach((frame) => io.observe(frame))
    return () => io.disconnect()
  }, [])

  const progress =
    (FRAMES.findIndex((frame) => frame.n === activeFrame) + 1) / FRAMES.length

  return (
    <div className="min-h-svh bg-forest-950 text-bone">
      <div className="sticky top-0 z-30 border-b border-bone/10 bg-forest-950/95 backdrop-blur">
        <EnterpriseNav current="/enterprise-partners/investor" sticky={false} />
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">
            <span className="hidden sm:inline">Presentation · 1024px+</span>
          </p>
          <p className="tnum font-mono text-[10px] uppercase tracking-[0.18em] text-bone">
            Frame {activeFrame} / {FRAMES.length}
          </p>
        </div>
        <div className="mx-auto mb-3 mt-2 h-0.5 max-w-4xl overflow-hidden rounded-full bg-forest-800">
          <div
            className="h-full rounded-full bg-amber-400 transition-[width] duration-500 ep-motion"
            style={{ width: `${Math.round(progress * 100)}%` }}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={FRAMES.length}
            aria-valuenow={FRAMES.findIndex((frame) => frame.n === activeFrame) + 1}
            aria-label="Deck progress"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {FRAMES.map((frame) => (
          <section
            key={frame.n}
            className="mb-16 min-h-[min(72svh,720px)] scroll-mt-24 rounded-3xl border border-bone/12 bg-gradient-to-br from-forest-900/80 to-forest-950 p-8 sm:p-12"
            id={`frame-${frame.n}`}
          >
            <div className="flex items-start justify-between gap-4">
              <Kicker>Frame {frame.n}</Kicker>
              {frame.brands ? (
                <span className="flex items-center gap-2 pt-1">
                  {frame.brands.map((id) => (
                    <BrandLogo key={id} brand={id} size={18} />
                  ))}
                </span>
              ) : null}
            </div>
            <DisplayHeadline as="h2" className="mt-3">
              {frame.title}
            </DisplayHeadline>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone-300">{frame.body}</p>
            {frame.n === '10' ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
                    Canopy XP per action
                  </p>
                  <table className="mt-3 w-full border-collapse text-[13px]">
                    <tbody>
                      {XP_TABLE.map(([action, xp]) => (
                        <tr key={action} className="border-b border-bone/10 last:border-0">
                          <td className="py-2 text-bone-300">{action}</td>
                          <td className="py-2 text-right font-mono tabular-nums text-amber-400">{xp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
                    Tiers
                  </p>
                  <ul className="mt-3 space-y-2 text-[13px]">
                    {TIER_TABLE.map(([tier, at, unlocks]) => (
                      <li key={tier} className="border-b border-bone/10 pb-2 last:border-0">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="text-bone">{tier}</span>
                          <span className="font-mono text-[11px] tabular-nums text-river-400">{at}</span>
                        </span>
                        <span className="mt-0.5 block text-[12px] text-bone-500">{unlocks}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            {frame.n === '10' ? (
              <p className="mt-6 rounded-xl border border-bone/12 bg-forest-950/60 p-4 text-[13px] leading-relaxed text-bone-400">
                Integrity · XP and stamps are awarded server-side from a single-use verified pack token
                in production, with a per-device cooldown. The prototype keeps state locally and says so:
                DEMO ONLY.
              </p>
            ) : null}
            {frame.n === '12' ? (
              <pre className="mt-8 overflow-x-auto rounded-xl border border-bone/10 bg-forest-950/80 p-4 font-mono text-[11px] leading-relaxed text-river-400">
{`BRANDS
  ↓ PRODUCT / TRANSACTION
  ↓ QR
  ↓ FORESTOS API
  ↓ VERIFICATION ENGINE
  ↓ TEA + CONSERVATION DATA
  ↓ GIS / IMPACT ENGINE
  ↓ CONSUMER EXPERIENCE
  ↓ REWARD LAYER`}
              </pre>
            ) : null}
            {frame.n === '15' ? (
              <p className="mt-8 font-display text-3xl text-bone">
                Build the verified conservation economy.
              </p>
            ) : null}
            <ConceptTag variant="illustrative">Illustrative · concept</ConceptTag>
          </section>
        ))}

        <section className="mb-16 rounded-3xl border border-bone/12 bg-forest-900/60 p-8 sm:p-12">
          <Kicker>Business model</Kicker>
          <DisplayHeadline as="h2" className="mt-3">
            Commercial placeholders
          </DisplayHeadline>
          <ul className="mt-6 space-y-2 font-mono text-[13px] text-bone-300">
            {BUSINESS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] text-sage-500">
            ILLUSTRATIVE — SUBJECT TO COMMERCIAL DISCUSSION
          </p>
        </section>

        <AssumptionsFooter />
      </div>
    </div>
  )
}
