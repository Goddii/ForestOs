import { ArrowRight, ShieldCheck } from 'lucide-react'
import Reveal from '../components/Reveal'
import LoopingVideo from '../components/LoopingVideo'
import { ERAS, IMPACT } from '../lib/mock'
import { useBatch } from '../lib/batchContext'

/**
 * The quick, tangible read — what one cup from this batch did — before the
 * detailed records below. Figures come from the scanned batch; no gamification.
 */
function CupReceipt() {
  const BATCH = useBatch()
  const items = [
    { v: BATCH.protectedPerCup, k: 'forest protected, per cup' },
    { v: `${BATCH.hectaresPreserved} ha`, k: 'held under covenant for this batch' },
    { v: `+KES ${BATCH.pluckerPremiumKesPerKg}`, k: 'per kg, paid direct to the picker' },
    BATCH.settlementDays
      ? { v: `${BATCH.settlementDays} days`, k: `to settle ${BATCH.collectionCentre.pluckers.toLocaleString()} pluckers` }
      : { v: BATCH.collectionCentre.pluckers.toLocaleString(), k: 'pluckers on this batch' },
  ]
  return (
    <div className="rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8">
      <p className="max-w-[34ch] font-display text-2xl leading-tight text-bone sm:text-3xl">
        One cup from Batch&nbsp;#{BATCH.id}.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.k}>
            <dt className="tnum font-display text-3xl leading-none text-bone sm:text-4xl">{it.v}</dt>
            <dd className="mt-1.5 text-[12px] leading-snug text-sage-300">{it.k}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-bone/10 pt-4 font-mono text-[11px] tracking-[0.06em] text-sage-500">
        Canopy on the retired plots this buffer covers:{' '}
        <span className="text-bone-300">{ERAS['2015'].canopyCoverPct}% in {ERAS['2015'].label}</span>{' '}
        <ArrowRight className="inline h-3 w-3" strokeWidth={2.5} aria-hidden="true" />{' '}
        <span className="text-bone-300">{ERAS.today.canopyCoverPct}% {ERAS.today.label.toLowerCase()}</span>
        {' — '}scroll up to switch the map between the two.
      </p>
    </div>
  )
}

function PreservedRecord() {
  const BATCH = useBatch()
  const { preserved } = IMPACT
  const value = BATCH.hectaresPreserved ?? preserved.value
  const pct = Math.round((Number(value) / preserved.ofFarmHectares) * 100)
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-7">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="tnum font-display text-6xl leading-none text-bone">
            {value}
          </span>
          <span className="font-mono text-sm text-sage-300">ha</span>
        </div>
        <p className="mt-3 max-w-[24ch] text-[15px] leading-relaxed text-bone-300">
          {preserved.body}
        </p>
      </div>
      <div className="mt-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest-950/40">
          <div className="h-full rounded-full bg-sage-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
          {value} of {preserved.ofFarmHectares.toFixed(1)} ha under the farm
        </p>
      </div>
    </div>
  )
}

function FarmerRecord() {
  const BATCH = useBatch()
  const { farmer } = IMPACT
  return (
    <div className="flex h-full flex-col rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8">
      <div>
        <h3 className="font-display text-2xl text-bone sm:text-3xl">{farmer.headline}</h3>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-bone-300">
          {farmer.body}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-5 sm:mt-10">
        <div>
          <span className="tnum font-display text-5xl leading-none text-amber-400">
            +{BATCH.pluckerPremiumKesPerKg}
          </span>
          <span className="ml-2 font-mono text-xs text-sage-300">KES / kg</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-sage-200">
          {farmer.flow.map((node, i) => (
            <span key={node} className="flex items-center gap-2">
              <span className={i === farmer.flow.length - 1 ? 'text-amber-400' : ''}>
                {node}
              </span>
              {i < farmer.flow.length - 1 && (
                <ArrowRight className="h-3 w-3 text-sage-500" strokeWidth={2.5} />
              )}
            </span>
          ))}
          <span className="ml-2 text-bone-500 line-through decoration-bone/40">
            {farmer.bypass}
          </span>
        </div>
      </div>
    </div>
  )
}

function TransparencyRecord() {
  const { transparency } = IMPACT
  return (
    <div className="rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-400/40 bg-amber-400/10">
            <ShieldCheck className="h-5 w-5 text-amber-400" strokeWidth={2} />
          </span>
          <div>
            <h3 className="font-display text-2xl text-bone">{transparency.badge}</h3>
            <p className="mt-1 max-w-[44ch] text-[14px] leading-relaxed text-bone-300">
              {transparency.body}
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] sm:text-right">
          <dt className="text-sage-500">Plot</dt>
          <dd className="text-bone-300">{transparency.plotId}</dd>
          <dt className="text-sage-500">Verified</dt>
          <dd className="text-bone-300">{transparency.timestamp}</dd>
          <dt className="text-sage-500">Ref</dt>
          <dd className="text-bone-300">{transparency.reference}</dd>
        </dl>
      </div>
    </div>
  )
}

export default function ImpactSection() {
  const BATCH = useBatch()
  return (
    <section className="relative z-10 overflow-hidden bg-forest-950">
      <LoopingVideo
        src="/media/field1.mp4"
        playbackRate={0.7}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-xs" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <CupReceipt />
        </Reveal>

        <Reveal className="mt-16 block sm:mt-20">
          <h2 className="max-w-[16ch] font-display text-3xl leading-[1.08] text-bone sm:text-5xl">
            What Batch&nbsp;#{BATCH.id} actually bought.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4" delay={0}>
            <PreservedRecord />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.08}>
            <FarmerRecord />
          </Reveal>
          <Reveal className="lg:col-span-12" delay={0.12}>
            <TransparencyRecord />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
