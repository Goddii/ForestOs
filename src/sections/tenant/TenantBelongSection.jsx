import { useState } from 'react'
import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { downloadConservationPassport } from '../../lib/passportPdf'
import { useBatch } from '../../lib/batchContext'
import { useTenant } from '../../lib/tenantContext'
import { resolveBrand } from '../../lib/brands'
import { regionOnly } from '../../lib/batchDisplay'

/** Same deterministic, illustrative-only "which stamp did this batch earn"
 * used across the passport. Not a real hash or persisted anywhere. */
function stampIndexFor(batchId, totalStamps) {
  const sum = String(batchId)
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return sum % totalStamps
}

/** The filled-stamp glyph — a dashed ring plus a drawn compass-rosette
 * badge, exactly as the approved Figma design specifies (not a generic
 * star icon). `dim` renders the muted "already collected" variant. */
function StampBadge({ dim }) {
  const stroke = dim ? 'color-mix(in srgb, var(--color-amber-400) 55%, transparent)' : 'var(--color-amber-400)'
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="4" strokeDasharray="8 5" />
      <path
        d="M50 22 L58 44 H78 L62 57 L68 80 L50 67 L32 80 L38 57 L22 44 H42 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StampSlot({ index, state }) {
  const base = 'flex aspect-square items-center justify-center'
  const style = { animation: state === 'locked' ? 'none' : `stamp-fill 0.55s cubic-bezier(0.16,1,0.3,1) ${0.3 + index * 0.05}s both` }
  if (state === 'earned-now') {
    return (
      <div className={base} style={{ ...style, border: '1px solid color-mix(in srgb, var(--color-amber-400) 60%, transparent)', background: 'color-mix(in srgb, var(--color-amber-400) 6%, transparent)' }}>
        <StampBadge />
      </div>
    )
  }
  if (state === 'collected') {
    return (
      <div className={base} style={{ ...style, border: '1px solid color-mix(in srgb, var(--color-amber-400) 30%, transparent)', background: 'var(--color-forest-850)' }}>
        <StampBadge dim />
      </div>
    )
  }
  return (
    <div className={base} style={{ border: '1px solid var(--color-forest-700)' }}>
      <span className="font-mono text-[9px] text-sage-500/60">{String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}

/** One row in the tenant's "world" — the whole card brightens on hover as
 * the design specifies. Only `href` cards are real navigation (the Spotify
 * link); the other two are decorative, exactly as delivered in the design
 * (neither has a real destination there either). */
function BrandCard({ icon, label, desc, cta, href }) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <>
      <span className="mt-0.5 flex-shrink-0 text-lg text-forest-600" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-400">{label}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-forest-600">{cta} →</span>
        </div>
        <p className="text-xs text-sage-300">{desc}</p>
      </div>
    </>
  )
  const sharedProps = {
    className: 'flex cursor-pointer gap-4 p-4 transition-colors',
    style: { border: `1px solid ${hovered ? 'var(--color-forest-600)' : 'var(--color-forest-700)'}`, background: 'var(--color-forest-850)' },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
      {content}
    </a>
  ) : (
    <div {...sharedProps}>{content}</div>
  )
}

/**
 * "Belong" — a one-to-one port of the approved Figma design's `BelongStage`:
 * the passport recap (left) and the tenant's "world" (right), followed by
 * the design's own footer credit line. `musicCta` (a verified Spotify link)
 * is the one real destination among the three world cards, added per an
 * explicit follow-up request; the other two are decorative in the design
 * itself, not just in this port.
 *
 * The download/community-status line below the design's own footer is an
 * addition, not part of the Figma source — kept because it's real,
 * functioning behavior (`downloadConservationPassport`) and an earlier,
 * separate decision (the community link is genuinely unresolved, not a
 * design omission).
 */
export default function TenantBelongSection({ visible }) {
  const batch = useBatch()
  const tenant = useTenant()
  const brand = resolveBrand(tenant.ownerBrandId)
  const { collection } = tenant
  const [downloaded, setDownloaded] = useState(false)

  const earnedIndex = stampIndexFor(batch.id, collection.totalStamps)
  const activeTierIndex = Math.max(collection.tiers.indexOf(collection.tierLabel), 0)
  const nextTier = collection.tiers[activeTierIndex + 1]
  const remaining = collection.totalStamps - (earnedIndex + 1)

  const handleDownload = () => {
    downloadConservationPassport(batch)
    setDownloaded(true)
  }

  const worldCards = [
    {
      icon: '♪',
      label: 'Exclusive Track',
      desc: `${batch.block.name} Sessions — unreleased field recording. 4:21.`,
      cta: 'Listen',
      href: tenant.musicCta.href,
    },
    {
      icon: '◎',
      label: 'Tour Priority',
      desc: 'First-access to Nairobi dates, Oct–Dec 2026.',
      cta: 'Notify Me',
      href: null,
    },
    {
      icon: '↗',
      label: 'Next Drop',
      desc: `Next Majani batch ships November. ${collection.tierLabel}s get early word.`,
      cta: 'Follow',
      href: null,
    },
  ]

  return (
    <footer id="belong" className="relative bg-forest-900 px-8 py-24 md:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        {visible && (
        <div className="animate-reveal-up mb-12 flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">07</span>
          <div className="h-px w-8 bg-forest-700" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sage-500">Belong</span>
        </div>
        )}

        {visible && (
        <div className="grid flex-1 gap-12 md:grid-cols-2">
          <div className="animate-reveal-up delay-200">
            <h2 className="mb-1 font-display text-3xl font-light text-bone">Your {tenant.name}</h2>
            <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.15em] text-sage-300">
              {collection.tierLabel} · {earnedIndex + 1} of {collection.totalStamps} stamps
            </p>

            <div className="mb-6 grid grid-cols-5 gap-3">
              {Array.from({ length: collection.totalStamps }, (_, i) => (
                <StampSlot
                  key={i}
                  index={i}
                  state={i === earnedIndex ? 'earned-now' : i < earnedIndex ? 'collected' : 'locked'}
                />
              ))}
            </div>

            <p className="text-xs leading-relaxed text-sage-500">
              Each stamp is a verified scan. {nextTier ? `${remaining} more to reach ${nextTier} tier. ` : ''}
              Stamps are illustrative, persistence ships with the backend.
            </p>
          </div>

          <div className="animate-reveal-up delay-400 flex flex-col gap-6">
            <div>
              <h3 className="mb-1 font-display text-2xl font-light text-bone">
                {brand?.attribution ?? tenant.name}&rsquo;s world
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-sage-300">
                {collection.tierLabel} access · Unlocked
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {worldCards.map((card) => (
                <BrandCard key={card.label} {...card} />
              ))}
            </div>
          </div>
        </div>
        )}

        {visible && (
        <div className="animate-reveal-fade delay-800 mt-16 flex flex-col items-start gap-4 border-t border-forest-700 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-forest-600" />
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-sage-500">
              Conservation data verified by ForestOS
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-sage-500">
            {batch.block.name} · Batch #{batch.id} · {regionOnly(batch)}
          </p>
          <Link
            to={`/batch/${batch.id}`}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-forest-600 transition-colors hover:text-amber-400"
          >
            forestos.earth →
          </Link>
        </div>
        )}

        {visible && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500 transition-colors hover:text-bone"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Download the verification record (PDF)
          </button>
          {downloaded && (
            <span className="font-mono text-[10px] text-sage-500" aria-live="polite">
              Saved — prototype document, illustrative data.
            </span>
          )}
          {!tenant.communityCta && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-sage-500">
              Community link coming soon
            </span>
          )}
        </div>
        )}
      </div>
    </footer>
  )
}
