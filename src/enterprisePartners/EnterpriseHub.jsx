import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Package, Presentation, QrCode, Store } from 'lucide-react'
import { ConceptTag, DisplayHeadline, Kicker } from './components/ui'
import { DEMO_FOREST_REF, PENDING_FOREST_REF } from './data/verification'
import './enterprisePartners.css'

const LINKS = [
  {
    href: '/enterprise-partners/experience/safaricom',
    title: 'Safaricom × ForestOS QR journey',
    icon: QrCode,
    note: 'Scan → verify → impact → canopy → Bonga concept → share → passport',
  },
  {
    href: '/enterprise-partners/experience/java-house',
    title: 'Java House × ForestOS tea journey',
    icon: QrCode,
    note: 'Discover → trace → conservation → canopy → shared passport',
  },
  {
    href: '/enterprise-partners/packaging',
    title: 'Java House tea packaging suite',
    icon: Package,
    note: 'Box, pouch, cup, retail & limited conservation edition',
  },
  {
    href: '/enterprise-partners/touchpoints',
    title: 'Safaricom physical & digital touchpoints',
    icon: Store,
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
                className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-bone/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400 sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-sage-500" strokeWidth={1.75} aria-hidden="true" />
                    <p className="font-sans text-[15px] font-semibold">{item.title}</p>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-bone-500">{item.note}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-sage-500">{item.href}</p>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-bone-500 group-hover:text-bone" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <AssumptionsFooter className="mt-16" />
      </div>
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
