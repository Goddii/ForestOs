import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'

/**
 * `/prototypes` — a single linkable page for quickly demoing every
 * prototype/comparison build in this repo, so they don't have to be found
 * by remembering individual URLs. Deliberately minimal (a plain list, no
 * animation) — this is a working tool for the person driving a demo, not a
 * polished public surface, and it changes nothing about the routes it
 * links to.
 */
const GROUPS = [
  {
    label: 'Nyashinski × Majani campaign prototypes',
    items: [
      {
        href: '/majani/nyashinski',
        title: 'Nyashinski × Majani — The Guardian Edition',
        tag: 'Prototype',
        note: 'Editorial scroll narrative: hook → music → tea origin → ForestOS proof → COP32 → Guardian → community.',
      },
      {
        href: '/qr-experience',
        title: 'QR Experience (state-machine flow)',
        tag: 'Prototype',
        note: 'Scan → Verify → Discover → Participate → Earn → Passport, as discrete stages rather than one long scroll.',
      },
      {
        href: '/sound-of-the-shield',
        title: 'The Sound of the Shield',
        tag: 'Prototype',
        note: 'Figma-sourced QR landing: splash hero, live batch HUD, conservation leaderboard, shield story, community CTA, event teaser, sticky Spotify player.',
      },
      {
        href: '/living-anthem',
        title: 'The Living Anthem',
        tag: 'Prototype',
        note: 'Figma-sourced seven-chapter QR story: scan → manifesto → Mau landscape → live telemetry → pledge → music reward → member passport, with Magic UI / React Bits micro-animations.',
      },
      {
        href: '/passport/majani/921',
        title: 'Majani Passport (tenant passport)',
        tag: 'Approved design',
        note: 'The real, Figma-approved implementation — not a prototype. Shown here for side-by-side comparison only.',
      },
      {
        href: '/batch/921',
        title: 'Batch #921 — full public proof record',
        tag: 'Live route',
        note: 'The real ForestOS trace page every prototype above links out to for its "full proof" CTA.',
      },
    ],
  },
  {
    label: 'Other ForestOS demo builds',
    items: [
      {
        href: '/funder',
        title: 'Conservation Capital (ESG investor console)',
        tag: 'Demo',
        note: 'Institutional investor dashboard — capital, evidence, risk, governance. No real backend yet.',
      },
      {
        href: '/offtaker',
        title: 'Offtaker Portal (tea buyers)',
        tag: 'Demo',
        note: 'Buyer workspace — supply, available lots, batch traceability journeys, quality, compliance, verified origin and exports. Switch buyer and role in the header.',
      },
      {
        href: '/launch',
        title: 'Forest Edition launch/request page',
        tag: 'Live route',
        note: 'The real lead-gen page every "Request a Forest Edition" CTA on the public site points to.',
      },
    ],
  },
]

const TAG_STYLES = {
  Prototype: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  'Demo-only': 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  Demo: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  'Approved design': 'border-sage-500/40 bg-sage-500/10 text-sage-300',
  'Live route': 'border-bone/25 bg-bone/5 text-bone-300',
  Comparison: 'border-river-500/40 bg-river-500/10 text-river-300',
}

export default function PrototypeIndex() {
  useEffect(() => {
    document.title = 'Prototype index — ForestOS'
  }, [])

  return (
    <div className="min-h-svh bg-forest-950 px-6 py-16 text-bone sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sage-500">
          ForestOS · internal
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Prototype index</h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-bone-300">
          Every prototype, comparison build, and demo surface in this repo,
          one link each, for quickly switching between them. This page
          changes nothing about the routes below — it only links to them.
        </p>

        {GROUPS.map((group) => (
          <div key={group.label} className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">
              {group.label}
            </p>
            <ul className="mt-4 divide-y divide-bone/10 rounded-2xl border border-bone/12 bg-forest-900/60">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors duration-200 hover:bg-bone/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:px-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-sans text-[15px] font-semibold text-bone">{item.title}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${TAG_STYLES[item.tag] ?? TAG_STYLES['Live route']}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-bone-500">{item.note}</p>
                      <p className="mt-1.5 font-mono text-[11px] text-sage-500">{item.href}</p>
                    </div>
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 text-bone-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bone"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
