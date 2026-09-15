import { RotateCcw, ArrowUpRight } from 'lucide-react'

const COLLECTION_LABELS = ['Verified product', 'Conservation story', 'Landscape Explorer']

export default function PassportScreen({ copy, passport, belongCta, collection, onScanAnother }) {
  const earnedCount = Math.min(passport.experiences, collection.totalStamps)

  return (
    <div className="flex min-h-dvh flex-col bg-forest-950 px-6 pb-6 pt-16">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6">
        <div className="space-y-1 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sage-500">{copy.belongHeadline}</p>
          <h1 className="font-display text-2xl text-bone">{collection.tierLabel} · Landscape Explorer</h1>
        </div>

        <div className="rounded-2xl border border-bone/15 bg-forest-900/50 p-5">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              [String(passport.stamps.length).padStart(2, '0'), 'Verified product'],
              [String(passport.experiences).padStart(2, '0'), 'Experience'],
              [String(passport.conservationActions).padStart(2, '0'), 'Conservation action'],
              ['01', 'Badge'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-mono text-xl text-amber-400">{value}</p>
                <p className="mt-1 text-[10px] leading-tight text-sage-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-bone/10" />

          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">Your collection</p>
          <div className="flex flex-wrap gap-2">
            {COLLECTION_LABELS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[12px] text-amber-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            Your journey continues
          </p>
          <p className="text-[14px] leading-relaxed text-bone-300">
            Every verified experience adds to your passport. Scan another product to discover what comes next.
          </p>
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: collection.totalStamps }, (_, i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  backgroundColor:
                    i < earnedCount
                      ? 'var(--color-amber-400)'
                      : 'color-mix(in srgb, var(--color-bone) 14%, transparent)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2.5 pt-2">
          <a
            href={belongCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-forest-950 transition-transform active:scale-[0.98]"
          >
            {belongCta.label}
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onScanAnother}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bone/20 px-8 py-3.5 text-sm font-medium text-bone-300 transition-colors active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Scan another
          </button>
          <p className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            Powered by ForestOS
          </p>
        </div>
      </div>
    </div>
  )
}
