import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { ConceptTag, DisplayHeadline, Kicker } from './components/ui'
import EnterpriseNav from './components/EnterpriseNav'
import BrandLogo from './components/BrandLogo'
import { DEMO_FOREST_REF } from './data/verification'
import { TRACE_STEPS } from './data/traceChain'
import { AssumptionsFooter } from './EnterpriseHub'
import './enterprisePartners.css'

const PACKS = [
  { id: 'box', title: 'Tea box', sub: 'Retail shelf · primary QR 22×22 mm min' },
  { id: 'pouch', title: 'Tea pouch', sub: 'Pantry format · batch reference panel' },
  { id: 'cup', title: 'Takeaway cup', sub: 'Sleeve QR · 18 mm minimum' },
  { id: 'retail', title: 'Retail pack', sub: 'Multi-serving · traceability strip' },
  { id: 'limited', title: 'Limited conservation edition', sub: 'Premium gift narrative' },
]

export default function PackagingSuite() {
  useEffect(() => {
    document.title = 'Java House × ForestOS tea packaging — concept'
  }, [])

  return (
    <div className="min-h-svh bg-bone text-forest-950">
      <EnterpriseNav current="/enterprise-partners/packaging" variant="light" />
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <Kicker>Java House × ForestOS · CONCEPT</Kicker>
        <DisplayHeadline as="h1" className="mt-3 text-forest-950">
          Tea with a trace.
        </DisplayHeadline>
        <p className="mt-3 max-w-2xl text-[15px] text-forest-800/80">
          Limited-edition tea experience packaging — not coffee-led. Official brand assets require
          permission before commercial publication.
        </p>
        <ConceptTag variant="proposed">Proposed product · TBC</ConceptTag>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PackFront />
          <PackBack />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKS.map((p) => (
            <PackTile key={p.id} {...p} />
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-forest-800/15 bg-white p-5 text-[13px] text-forest-800/85">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-forest-800/60">QR spec · conceptual</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Minimum QR 22×22 mm · cup sleeve 18 mm · quiet zone 4 modules</li>
            <li>Error correction Q or H · dark QR on light ground only</li>
            <li>Unguessable short token — not sequential public IDs</li>
          </ul>
        </div>

        <Link
          to={`/enterprise-partners/experience/java-house?ref=${DEMO_FOREST_REF}&scanned=1`}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-bone"
        >
          Scan packaging QR prototype
          <QrCode className="h-4 w-4" aria-hidden="true" />
        </Link>

        <AssumptionsFooter className="mt-16 !border-forest-800/15 !bg-forest-950/5 !text-forest-900" />
      </div>
    </div>
  )
}

function PackFront() {
  return (
    <div className="rounded-2xl border border-forest-800/20 bg-[#f8f4eb] p-8 shadow-lg">
      <BrandLogo brand="java-house" size={40} label="Java House logo" />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-forest-800/70">
        × ForestOS conservation edition
      </p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-forest-800/75">
        Official Java House logo · partnership proposed, not confirmed
      </p>
      <h2 className="mt-6 font-display text-4xl text-forest-950">Tea with a trace.</h2>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-forest-800/75">
        Scan to discover the impact
      </p>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div className="grid h-24 w-24 place-items-center rounded-lg border-2 border-forest-950 bg-white">
          <QrCode className="h-16 w-16 text-forest-950" strokeWidth={1.25} aria-hidden="true" />
        </div>
        <div className="text-right font-mono text-[10px] leading-relaxed text-forest-800/80">
          <p>BATCH · 921</p>
          <p>{DEMO_FOREST_REF}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-river-700">● Verified</p>
        </div>
      </div>
    </div>
  )
}

function PackBack() {
  return (
    <div className="rounded-2xl border border-forest-800/20 bg-white p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest-800/60">Panel back</p>
      <h3 className="mt-2 font-display text-2xl text-forest-950">Your tea has a journey.</h3>
      <ol className="mt-6 space-y-2 border-l border-forest-800/15 pl-4">
        {TRACE_STEPS.slice(0, 7).map((s) => (
          <li key={s.id} className="font-mono text-[11px] uppercase tracking-[0.08em] text-forest-800/85">
            {s.label}
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[13px] leading-relaxed text-forest-800/80">
        ForestOS connects each batch to verified conservation evidence — scan for the full interactive
        story.
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-700">
        Scan to see the full story
      </p>
    </div>
  )
}

function PackTile({ title, sub }) {
  return (
    <div className="rounded-xl border border-forest-800/15 bg-[#f8f4eb] p-5">
      {/* A mini pack front instead of an empty placeholder: the mark, the
          format name and the scan cue a real tile would carry. */}
      <div className="grid aspect-[3/4] place-items-center rounded-lg border border-forest-800/20 bg-gradient-to-b from-white to-[#ebe3d4] p-4">
        <div className="flex flex-col items-center text-center">
          <BrandLogo brand="java-house" size={26} label={null} />
          <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-forest-800/70">
            Tea with a trace
          </p>
          <span className="mt-4 grid h-9 w-9 place-items-center rounded-md border border-forest-950 bg-white">
            <QrCode className="h-6 w-6 text-forest-950" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </div>
      </div>
      <p className="mt-3 font-semibold text-forest-950">{title}</p>
      <p className="mt-1 text-[12px] text-forest-800/75">{sub}</p>
    </div>
  )
}
