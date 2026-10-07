import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { ConceptTag, DisplayHeadline, Kicker, PartnerCta } from './components/ui'
import { DEMO_FOREST_REF } from './data/verification'
import { AssumptionsFooter } from './EnterpriseHub'
import './enterprisePartners.css'

const TOUCHPOINTS = [
  {
    id: 'standee',
    title: 'Retail counter standee',
    headline: 'Scan. Discover. Conserve.',
    body: 'ForestOS × Safaricom · QR entry to verified tea story',
  },
  {
    id: 'till',
    title: 'Till sticker',
    headline: 'Your purchase can tell a bigger story.',
    body: 'Minimal SCAN cue · Lipa na M-PESA touchpoint · PROPOSED',
  },
  {
    id: 'wakulima',
    title: 'Bundle Ya Wakulima poster',
    headline: 'Connect. Protect. Grow. Conserve.',
    body: 'Farmer ecosystem narrative + ForestOS proposed layer',
  },
  {
    id: 'sms',
    title: 'Digital / SMS landing',
    headline: 'Mobile-first deep link',
    body: 'No real M-PESA codes · deep link into ForestOS QR experience',
  },
]

export default function TouchpointsShowcase() {
  useEffect(() => {
    document.title = 'Safaricom touchpoints — ForestOS concept'
  }, [])

  return (
    <div className="enterprise-safaricom min-h-svh bg-forest-950 px-6 py-16 text-bone sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/enterprise-partners" className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
          ← Enterprise hub
        </Link>
        <Kicker>Safaricom physical & digital · CONCEPT</Kicker>
        <DisplayHeadline as="h1" className="mt-3">
          Connectivity touchpoints
        </DisplayHeadline>
        <ConceptTag variant="proposed">Proposed integration — Safaricom approval</ConceptTag>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TOUCHPOINTS.map((tp) => (
            <TouchpointCard key={tp.id} {...tp} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={`/enterprise-partners/experience/safaricom?ref=${DEMO_FOREST_REF}&scanned=1`}>
            <PartnerCta className="!w-auto">Open mobile QR experience</PartnerCta>
          </Link>
        </div>

        <AssumptionsFooter className="mt-16" />
      </div>
    </div>
  )
}

function TouchpointCard({ title, headline, body }) {
  return (
    <article className="flex flex-col rounded-2xl border border-bone/12 bg-forest-900/55 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">{title}</p>
      <h2 className="mt-3 font-display text-2xl leading-tight">{headline}</h2>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-bone-400">{body}</p>
      <div className="mt-6 flex items-center justify-between rounded-xl border ep-brand-border bg-forest-950/50 p-4">
        <QrCode className="h-10 w-10 text-bone" strokeWidth={1.25} aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage-500">ForestOS × Safaricom</span>
      </div>
    </article>
  )
}
