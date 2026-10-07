import { Link } from 'react-router-dom'
import { ConceptTag, DisplayHeadline, FadeIn, Kicker, PartnerCta } from './ui'
import { BRANDS } from '../data/brands'

function hasStamp(stamps, slug) {
  return stamps.some((s) => s.tenantSlug === slug)
}

export default function PassportPanel({
  passport,
  stats,
  brand,
  forestRef,
  xp,
  tier,
  nextTier,
  toNextTier,
  durable,
  onSwitchBrand,
  otherBrandId,
}) {
  const stamps = passport.stamps ?? []
  const saf = hasStamp(stamps, BRANDS.safaricom.slug)
  const jh = hasStamp(stamps, BRANDS['java-house'].slug)
  // The tier is now driven by Canopy XP (brief 5.5), not by stamp count, so
  // fall back to the passport stat only if a caller omits the XP props.
  const heldTier = tier ?? stats.tier
  const climbTier = nextTier ?? stats.nextTier
  const toClimb = toNextTier ?? stats.toNextTier

  return (
    <FadeIn className="flex min-h-dvh flex-col px-6 pb-10 pt-44">
      <Kicker>Bonga × Forest Passport</Kicker>
      <DisplayHeadline className="mt-3">One passport. Multiple brand stamps.</DisplayHeadline>
      <p className="mt-3 text-[14px] leading-relaxed text-bone-300">
        Your ForestOS reference token persists across the proposed Safaricom and Java House
        experiences, so you are currently in the {brand.name} layer. No personal phone numbers are
        stored — the prototype uses a local visitor token only.
      </p>

      <div className="mt-6 rounded-2xl border border-bone/15 bg-gradient-to-br from-forest-900/90 to-forest-950 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">ForestOS token</p>
        <p className="mt-1 font-mono text-sm text-bone">{passport.passportId}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
          Tier · Canopy XP {typeof xp === 'number' ? xp : ''}
        </p>
        <p className="mt-1 font-display text-2xl text-bone">{heldTier.label}</p>
        {climbTier ? (
          <p className="mt-1 text-[13px] text-bone-500">
            {toClimb} more XP to {climbTier.label}
          </p>
        ) : (
          <p className="mt-1 text-[13px] text-river-400">Top tier reached</p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StampSlot label="Safaricom stamp" active={saf} accent={BRANDS.safaricom.accentHex} />
        <StampSlot label="Java House stamp" active={jh} accent={BRANDS['java-house'].accentHex} />
      </div>

      <ul className="mt-6 space-y-2 text-[13px] text-bone-300">
        <li>Verified tea interactions · {stats.experiences}</li>
        <li>QR verification history · {stats.scans} scan{stats.scans === 1 ? '' : 's'}</li>
        <li>Last reference · {forestRef || '—'}</li>
      </ul>

      <div className="mt-6 flex flex-wrap gap-2">
        <ConceptTag variant="proposed">Reward concept · not live Bonga integration</ConceptTag>
        <ConceptTag>{durable ? 'DEMO ONLY · state is local' : 'DEMO ONLY · state is session-only'}</ConceptTag>
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <PartnerCta onClick={() => onSwitchBrand(otherBrandId)}>
          Collect the other brand stamp
        </PartnerCta>
        <Link
          to="/enterprise-partners/investor"
          className="block text-center font-mono text-[11px] uppercase tracking-[0.16em] text-sage-500 underline-offset-4 hover:text-bone hover:underline"
        >
          View investor frames
        </Link>
      </div>
    </FadeIn>
  )
}

function StampSlot({ label, active, accent }) {
  return (
    <div
      className={
        'rounded-xl border p-4 text-center ' +
        (active ? 'border-river-400/35 bg-river-400/8' : 'border-bone/12 bg-forest-900/40')
      }
    >
      <div
        className="mx-auto grid h-12 w-12 place-items-center rounded-full border-2"
        style={{ borderColor: active ? accent : 'color-mix(in srgb, var(--color-bone) 20%, transparent)' }}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] uppercase">{active ? '✓' : '—'}</span>
      </div>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-sage-500">{label}</p>
    </div>
  )
}
