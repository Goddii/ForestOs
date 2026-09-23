import { RotateCcw, ArrowUpRight, ScanLine } from 'lucide-react'

const DATE_FMT = { day: 'numeric', month: 'short' }
const stampDate = (iso) => new Date(iso).toLocaleDateString('en-GB', DATE_FMT)

/**
 * Belong — the passport itself. This is the screen that has to earn the phrase
 * "every scan progressively builds something around that person", so it shows
 * the real collection rather than a fixed row of labels: one row per verified
 * product, with the community it came from, when it was earned, and how many
 * times it has been scanned.
 */
export default function PassportScreen({
  copy,
  experience,
  passport,
  stats,
  durable,
  belongCta,
  collection,
  onScanAnother,
  onStartOver,
}) {
  const earnedCount = Math.min(stats.experiences, collection.totalStamps)
  const external = !belongCta.href.startsWith('/')

  return (
    <div className="flex min-h-dvh flex-col bg-forest-950 px-6 pb-6 pt-16">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6">
        <div className="space-y-1 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-sage-500">
            {copy.belongHeadline}
          </p>
          <h1 className="font-display text-2xl text-bone">{stats.tier.label}</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            {passport.passportId}
          </p>
        </div>

        <div className="rounded-2xl border border-bone/15 bg-forest-900/50 p-5">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              [String(stats.experiences).padStart(2, '0'), 'Verified products'],
              [String(stats.communities).padStart(2, '0'), stats.communities === 1 ? 'Community' : 'Communities'],
              [String(stats.scans).padStart(2, '0'), 'Scans'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-mono text-xl text-amber-400">{value}</p>
                <p className="mt-1 text-[10px] leading-tight text-sage-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-bone/10" />

          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            Your collection
          </p>

          {stats.experiences === 0 ? (
            <p className="text-[13px] text-bone-500">
              Nothing collected yet — take part in an experience to earn your first entry.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {passport.stamps.map((stamp) => (
                <li
                  key={`${stamp.tenantSlug}-${stamp.batchId}`}
                  className="flex items-baseline justify-between gap-3 border-b border-bone/10 pb-2.5 last:border-0 last:pb-0"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] text-bone">
                      {stamp.product ?? `Batch ${stamp.batchId}`}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
                      {stamp.brand ?? stamp.tenantSlug} · #{stamp.batchId}
                      {stamp.scans > 1 && ` · ${stamp.scans} scans`}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400">
                    {stampDate(stamp.earnedAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            {stats.nextTier ? `${stats.toNextTier} more to ${stats.nextTier.label}` : 'Top status reached'}
          </p>
          <p className="text-[14px] leading-relaxed text-bone-300">{copy.belongBody}</p>
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
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
            <ScanLine className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Scan another product
          </button>

          {/* Prototype honesty: say what this passport actually is. A real
              deployment keys it to a phone number (see the VisitorPassport
              contract) because USSD and SMS scanners have no browser. */}
          <p className="pt-1 text-center text-[11px] leading-relaxed text-sage-500">
            {durable
              ? 'Prototype: your passport is kept on this device only, not in an account.'
              : 'Prototype: this browser is blocking storage, so your passport lasts for this visit only.'}
          </p>

          <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            <span>Powered by {experience.poweredBy}</span>
            <button
              type="button"
              onClick={onStartOver}
              className="inline-flex items-center gap-1 underline decoration-sage-500/40 underline-offset-4 transition-colors hover:text-bone-300"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              Reset demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
