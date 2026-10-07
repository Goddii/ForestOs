import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ConceptTag, DisplayHeadline, Kicker } from './components/ui'
import { AssumptionsFooter } from './EnterpriseHub'
import './enterprisePartners.css'

const FRAMES = [
  {
    n: '01',
    title: 'Ecosystem',
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
    body: 'Physical touchpoint → QR → ForestOS verify → discover. Connectivity layer, not forest ownership.',
  },
  {
    n: '04',
    title: 'Safaricom impact',
    body: 'Verified tea and conservation dashboard with illustrative counters until production data connects.',
  },
  {
    n: '05',
    title: 'Safaricom + Bonga',
    body: 'Proposed reward participation — clearly labelled, no implied live integration.',
  },
  {
    n: '06',
    title: 'Java House packaging',
    body: 'Premium tea packaging suite communicating traceability + conservation, not coffee origin claims.',
  },
  {
    n: '07',
    title: 'Java House QR',
    body: 'Package scan → tea story → progressive evidence.',
  },
  {
    n: '08',
    title: 'Java House conservation',
    body: 'Tea batch → plot → verified conservation record → 2015 vs today reveal.',
  },
  {
    n: '09',
    title: 'Shared passport',
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
  ['Explorer', '75 XP', 'Origin chapters and the stamp book'],
  ['Guardian', '250 XP', 'A named plot adoption and field-officer notes'],
  ['Custodian', '500 XP', 'A downloadable Conservation Passport'],
]

const BUSINESS = [
  'Implementation · [PROJECT FEE]',
  'Platform · [ANNUAL / MONTHLY FEE]',
  'Verification · [PER BATCH / QR / RECORD]',
  'Enterprise integration · [API + DATA FEE]',
  'Support · [ANNUAL SUPPORT FEE]',
]

export default function InvestorDeck() {
  useEffect(() => {
    document.title = 'Investor deck — ForestOS enterprise prototype'
  }, [])

  return (
    <div className="min-h-svh bg-forest-950 text-bone">
      <div className="sticky top-0 z-30 border-b border-bone/10 bg-forest-950/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link to="/enterprise-partners" className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
            ← Hub
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">Presentation · 1024px+</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {FRAMES.map((frame) => (
          <section
            key={frame.n}
            className="mb-16 min-h-[min(72svh,720px)] scroll-mt-24 rounded-3xl border border-bone/12 bg-gradient-to-br from-forest-900/80 to-forest-950 p-8 sm:p-12"
            id={`frame-${frame.n}`}
          >
            <Kicker>Frame {frame.n}</Kicker>
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
