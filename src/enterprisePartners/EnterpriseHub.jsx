import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Package, Presentation, QrCode, Store } from 'lucide-react'
import { ConceptTag, DisplayHeadline, Kicker } from './components/ui'
import BrandLogo from './components/BrandLogo'
import { DEMO_FOREST_REF, PENDING_FOREST_REF } from './data/verification'
import './enterprisePartners.css'

const LINKS = [
  {
    href: '/enterprise-partners/experience/safaricom',
    title: 'Safaricom × ForestOS QR journey',
    icon: QrCode,
    brand: 'safaricom',
    note: 'Scan → verify → impact → canopy → Bonga concept → share → passport',
  },
  {
    href: '/enterprise-partners/experience/java-house',
    title: 'Java House × ForestOS tea journey',
    icon: QrCode,
    brand: 'java-house',
    note: 'Discover → trace → conservation → canopy → shared passport',
  },
  {
    href: '/enterprise-partners/packaging',
    title: 'Java House tea packaging suite',
    icon: Package,
    brand: 'java-house',
    note: 'Box, pouch, cup, retail & limited conservation edition',
  },
  {
    href: '/enterprise-partners/touchpoints',
    title: 'Safaricom physical & digital touchpoints',
    icon: Store,
    brand: 'safaricom',
    note: 'Standee, till sticker, Bundle Ya Wakulima poster, SMS landing',
  },
  {
    href: '/enterprise-partners/investor',
    title: 'Investor presentation · 15 frames',
    icon: Presentation,
    note: 'Ecosystem, trust gap, both brand journeys, game loop and economy, architecture, pilot, scalability, hero close',
  },
]

export default function EnterpriseHub() {
  useEffect(() => {
    document.title = 'ForestOS × Safaricom × Java House — Enterprise prototype'
  }, [])

  return (
    <div className="min-h-svh bg-forest-950 px-6 py-16 text-bone sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Kicker>Investor-grade prototype · CONCEPT</Kicker>
        <DisplayHeadline as="h1" className="mt-3 sm:text-5xl">
          One conservation platform. Multiple brands. One measurable impact.
        </DisplayHeadline>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-bone-300">
          Tea-linked traceability and conservation verification infrastructure with proposed Safaricom
          and Java House experience layers. Gamified QR trail, shared Forest Passport, and honest
          labeling throughout.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <ConceptTag variant="proposed">Proposed integrations</ConceptTag>
          <ConceptTag variant="illustrative">Illustrative metrics</ConceptTag>
          <ConceptTag variant="tbc">Partnerships TBC</ConceptTag>
        </div>

        {/* Real brand logo files, not redrawn approximations — what stays
            labelled as concept is the partnership, not the artwork. */}
        <div className="mt-8 rounded-2xl border border-bone/12 bg-forest-900/55 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Proposed partner layers
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <PartnerCard
              brand="safaricom"
              role="Connectivity layer"
              body="QR touchpoints, verification prompts and the proposed Bonga reward concept."
            />
            <PartnerCard
              brand="java-house"
              role="Café experience"
              body="Tea packaging, in-store scans and the shared conservation passport."
            />
          </div>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-bone-500">
            Real brand logos shown · proposed partnerships · not confirmed
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-bone/12 bg-forest-900/55 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
            Demo verification tokens
          </p>
          <ul className="mt-3 space-y-2 font-mono text-[12px]">
            <li>
              <Link className="text-river-400 underline-offset-2 hover:underline" to={`/enterprise-partners/experience/safaricom?ref=${DEMO_FOREST_REF}&scanned=1`}>
                {DEMO_FOREST_REF}
              </Link>{' '}
              · verified
            </li>
            <li>
              <Link className="text-amber-400 underline-offset-2 hover:underline" to={`/enterprise-partners/experience/safaricom?ref=${PENDING_FOREST_REF}&scanned=1`}>
                {PENDING_FOREST_REF}
              </Link>{' '}
              · pending
            </li>
            <li>Unknown token · always unverified</li>
          </ul>
        </div>

        <ul className="mt-10 divide-y divide-bone/10 rounded-2xl border border-bone/12 bg-forest-900/60">
          {LINKS.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bone/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 sm:px-6"
              >
                <span className="flex min-w-0 items-center gap-4">
                  {/* The tile carries the ACTION (scan, pack, standee, deck);
                      the partner's real logo rides on the right, so the row
                      never prints the brand name twice. */}
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-bone/12 bg-forest-950/70 text-sage-500 transition-colors group-hover:border-bone/25">
                    <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-sans text-[15px] font-semibold">{item.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-bone-500">{item.note}</span>
                    <span className="mt-1 block font-mono text-[11px] text-sage-500">{item.href}</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  {item.brand ? <BrandLogo brand={item.brand} size={16} label={null} /> : null}
                  <ArrowUpRight className="h-4 w-4 text-bone-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <AssumptionsFooter className="mt-16" />
      </div>
    </div>
  )
}

/** One proposed partner: its real logo, the layer it would carry, the scope. */
function PartnerCard({ brand, role, body }) {
  return (
    <div className="rounded-xl border border-bone/12 bg-forest-950/50 p-4">
      <BrandLogo brand={brand} size={24} />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
        {role}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-bone-400">{body}</p>
      <p className="mt-3 inline-flex">
        <ConceptTag variant="proposed">Proposed · TBC</ConceptTag>
      </p>
    </div>
  )
}

export function AssumptionsFooter({ className = '' }) {
  return (
    <section className={`rounded-2xl border border-bone/10 bg-forest-900/40 p-6 ${className}`}>
      <h2 className="font-display text-2xl text-bone">Assumptions & required approvals</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 text-[13px] leading-relaxed text-bone-400">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">Assumptions</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Tea-focused conservation-verification platform demonstration.</li>
            <li>Safaricom & Java House experiences are proposed concepts.</li>
            <li>Bonga & reward amounts are illustrative.</li>
            <li>Metrics illustrative unless connected to verified production data.</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">Required approvals</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Safaricom: brand, QR, Bonga, API, data flow.</li>
            <li>Java House: packaging, sourcing, QR, campaigns.</li>
            <li>ForestOS / NTZDC: conservation, GIS, API, passport.</li>
          </ul>
        </div>
      </div>
      <p className="mt-6 font-display text-xl text-bone">
        From a tea batch to a verified forest story.
      </p>
    </section>
  )
}
