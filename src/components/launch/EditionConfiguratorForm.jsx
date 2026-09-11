import { useState } from 'react'
import { Upload } from 'lucide-react'
import { BRANDS } from '../../lib/brands'

const TEA_TYPES = ['Black CTC', 'Black Orthodox', 'Green', 'White', 'Purple', 'Herbal Infusion']
const FLAVORS = ['Plain', 'Lemongrass', 'Mint', 'Ginger', 'Chai Spice', 'Earl Grey', 'Hibiscus']

// The real per-pack conservation rate an existing sponsoring brand reports
// (see `ImpactLeague`/the ESG portal) — used as the League's standard rate
// rather than a number invented for this form.
const PER_PACK_KES = BRANDS.nyashinski.conservationKesPerPack

const pillClass = (active) =>
  'rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ' +
  (active
    ? 'border-amber-400 bg-amber-400 text-forest-950'
    : 'border-bone/15 bg-forest-950/70 text-sage-300 hover:text-bone')

/**
 * "Launch your edition" — a lead-gen configurator, not a checkout. Picking a
 * tea and flavour is aesthetic; the only computed number (estimated
 * conservation contribution) is a real published per-pack rate multiplied by
 * a planned run size, not an invented formula.
 */
export default function EditionConfiguratorForm() {
  const [teaType, setTeaType] = useState(TEA_TYPES[0])
  const [flavor, setFlavor] = useState(FLAVORS[0])
  const [brandMarkName, setBrandMarkName] = useState('')
  const [plannedPacks, setPlannedPacks] = useState(10_000)
  const [submitted, setSubmitted] = useState(false)

  const estimatedKes = plannedPacks * PER_PACK_KES

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-forest-950/40 p-8 text-center backdrop-blur-sm">
        <p className="font-display text-2xl text-bone">Request received.</p>
        <p className="mx-auto mt-2 max-w-[42ch] text-[14px] leading-relaxed text-bone-300">
          The League team will follow up to confirm a sector and open your
          launch pack. No ForestOS backend exists yet — this is a prototype
          request form.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8"
    >
      <fieldset>
        <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
          Tea type
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEA_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setTeaType(type)}
              aria-pressed={teaType === type}
              className={pillClass(teaType === type)}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500">
          Flavour
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAVORS.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFlavor(f)}
              aria-pressed={flavor === f}
              className={pillClass(flavor === f)}
            >
              {f}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-2">
        <label
          htmlFor="brandMark"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500"
        >
          Brand mark
        </label>
        <label
          htmlFor="brandMark"
          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-bone/20 bg-forest-950/60 px-4 py-3 text-[13px] text-bone-300 transition-colors hover:border-amber-400/40"
        >
          <span className="truncate">{brandMarkName || 'Upload a logo (PNG, SVG or PDF)'}</span>
          <Upload className="h-4 w-4 shrink-0 text-sage-500" strokeWidth={2} aria-hidden="true" />
        </label>
        <input
          id="brandMark"
          type="file"
          accept="image/png,image/svg+xml,application/pdf"
          className="sr-only"
          onChange={(event) => setBrandMarkName(event.target.files?.[0]?.name ?? '')}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage-500">
          Preview only, no file is uploaded in this prototype
        </p>
      </div>

      <div className="mt-6 grid gap-2">
        <label
          htmlFor="plannedPacks"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500"
        >
          Planned first run (packs)
        </label>
        <input
          id="plannedPacks"
          type="number"
          min={0}
          step={500}
          value={plannedPacks}
          onChange={(event) => setPlannedPacks(Math.max(0, Number(event.target.value)))}
          className="rounded-xl border border-bone/15 bg-forest-950/60 px-4 py-3 font-mono text-sm text-bone focus:border-amber-400 focus:outline-none"
        />
      </div>

      <div className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
          Estimated conservation contribution
        </p>
        <p className="tnum mt-1 font-display text-3xl text-bone">
          KES {estimatedKes.toLocaleString()}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-sage-500">
          KES {PER_PACK_KES} / pack, the same rate every Forest Edition reports to
          the League
        </p>
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500 sm:w-auto"
      >
        Request a Forest Edition
      </button>
    </form>
  )
}
