import { Check, ArrowRight, ArrowUpRight } from 'lucide-react'

const CHECKS = [
  { key: 'origin', label: 'Origin verified' },
  { key: 'conservation', label: 'Conservation activity' },
  { key: 'field', label: 'Field evidence' },
]

/**
 * The bridge from cinematic story into evidence. Deliberately a preview, not
 * the full ForestOS GIS/proof build — "Explore full proof" hands off to the
 * real `/batch/:batchId` Cesium proof map (`src/sections/GlobeSection.jsx`)
 * instead of rebuilding it here, in a new tab so a visitor doesn't lose their
 * place (and passport progress) in this flow.
 */
export default function ProofPreviewScreen({ copy, batch, onContinue }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-forest-950">
      <div className="relative h-[30vh] min-h-[190px] w-full overflow-hidden">
        <picture>
          <source srcSet="/media/forests/mau.webp" type="image/webp" />
          <img
            src="/media/forests/mau.jpg"
            alt="South West Mau forest canopy above the Mariashoni buffer zone."
            className="h-full w-full object-cover"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,20,14,0.1) 0%, transparent 50%, rgba(8,20,14,1) 100%)',
          }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between gap-6 px-6 pb-8 pt-4">
        <div className="space-y-4">
          <h1 className="text-center font-display text-2xl text-bone">{copy.proofHeadline}</h1>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-sage-500">
            {batch.block.name}
          </p>

          <ul className="space-y-3">
            {CHECKS.map(({ key, label }) => (
              <li
                key={key}
                className="flex items-center justify-between rounded-xl border border-bone/10 bg-forest-900/50 px-4 py-3"
              >
                <span className="text-[14px] text-bone-300">{label}</span>
                <Check className="h-4 w-4 text-amber-400" strokeWidth={2.5} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-forest-950 transition-transform active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
          <a
            href={`/batch/${batch.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-8 py-3 text-[13px] font-medium text-sage-300 transition-colors hover:text-bone"
          >
            Explore full proof
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
