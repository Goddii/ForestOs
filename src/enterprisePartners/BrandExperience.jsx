import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, QrCode, Share2, Signal, Wifi } from 'lucide-react'
import { resolveBatch } from '../lib/mock'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { resolveBrand, nextBrandId } from './data/brands'
import { DEMO_FOREST_REF, resolveForestRef } from './data/verification'
import { ILLUSTRATIVE_IMPACT } from './data/traceChain'
import { useEnterpriseFlow } from './hooks/useEnterpriseFlow'
import ExperienceChrome from './components/ExperienceChrome'
import TraceTimeline from './components/TraceTimeline'
import CanopyReveal from './components/CanopyReveal'
import PassportPanel from './components/PassportPanel'
import ClaimVsFact from './components/game/ClaimVsFact'
import QuestDrawer from './components/game/QuestDrawer'
import StampBook from './components/game/StampBook'
import SeasonMeter from './components/game/SeasonMeter'
import TierUpToast from './components/game/TierUpToast'
import XpRing from './components/game/XpRing'
import {
  ConceptTag,
  DisplayHeadline,
  FadeIn,
  ImpactCounter,
  Kicker,
  PartnerCta,
  VerificationBadge,
} from './components/ui'
import './enterprisePartners.css'

const TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
}

export default function BrandExperience() {
  const { brandId = 'safaricom' } = useParams()
  const brand = resolveBrand(brandId)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const reduced = usePrefersReducedMotion()

  const refParam = params.get('ref') ?? DEMO_FOREST_REF
  const verification = useMemo(() => resolveForestRef(refParam), [refParam])
  const batch = useMemo(
    () => (verification.batchId ? resolveBatch(verification.batchId) : null),
    [verification.batchId],
  )

  const startAt = params.has('scanned') ? 'verify' : 'scan'

  const {
    stages,
    stage,
    stageIndex,
    passport,
    stats,
    durable,
    xp,
    quests,
    nextAction,
    tier,
    nextTier,
    toNextTier,
    tierUp,
    dismissTierUp,
    missionProgress,
    recordQuestEvent,
    advance,
  } = useEnterpriseFlow({
    brandId: brand.id,
    brandSlug: brand.slug,
    batch: batch ?? resolveBatch('921'),
    startAt,
    forestRef: verification.forestRef,
    verificationStatus: verification.status,
  })

  useEffect(() => {
    document.title = `${brand.experienceTitle} — ForestOS`
    document.documentElement.classList.add(brand.themeClass)
    return () => document.documentElement.classList.remove(brand.themeClass)
  }, [brand])

  const switchBrand = useCallback(
    (id) => {
      navigate(
        `/enterprise-partners/experience/${id}?ref=${encodeURIComponent(refParam)}&scanned=1`,
      )
    },
    [navigate, refParam],
  )

  const simulateScan = useCallback(() => {
    navigate(
      `/enterprise-partners/experience/${brand.id}?ref=${encodeURIComponent(DEMO_FOREST_REF)}&scanned=1`,
    )
  }, [brand.id, navigate])

  const screen = renderScreen({
    brand,
    batch,
    verification,
    stage,
    advance,
    simulateScan,
    durable,
    passport,
    stats,
    xp,
    tier,
    nextTier,
    toNextTier,
    quests,
    nextAction,
    recordQuestEvent,
    switchBrand,
    otherBrandId: nextBrandId(brand.id),
  })

  return (
    <div className={`${brand.themeClass} min-h-dvh bg-forest-950 text-bone`}>
      <ExperienceChrome
        brand={brand}
        stageIndex={stageIndex}
        stageTotal={stages.length}
        xp={xp}
        forestRef={verification.forestRef}
        onSwitchBrand={switchBrand}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={`${brand.id}-${stage}-${verification.status}`}
          initial={reduced ? false : TRANSITION.initial}
          animate={TRANSITION.animate}
          exit={reduced ? undefined : TRANSITION.exit}
          transition={TRANSITION.transition}
          className="mx-auto max-w-lg"
        >
          {screen}
        </motion.main>
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        Stage {stageIndex + 1} of {stages.length}: {stage}. Mission progress{' '}
        {missionProgress.pct} percent.
      </p>
      <TierUpToast tier={tierUp} onDismiss={dismissTierUp} />
    </div>
  )
}

function renderScreen(ctx) {
  const { brand, verification, stage } = ctx

  if (stage === 'scan') {
    if (brand.id === 'safaricom') return <SafaricomScan {...ctx} />
    return <JavaHouseScan {...ctx} />
  }

  if (stage === 'verify') {
    return <VerifyStage {...ctx} />
  }

  if (verification.status !== 'verified') {
    return <BlockedStage {...ctx} />
  }

  const map = {
    impact: () => <SafaricomImpact {...ctx} />,
    trace: () => <JavaTrace {...ctx} />,
    conservation: () => <JavaConservation {...ctx} />,
    canopy: () => <CanopyStage {...ctx} />,
    play: () => <PlayStage {...ctx} />,
    bonga: () => <BongaStage {...ctx} />,
    share: () => <ShareStage {...ctx} />,
    passport: () => <PassportStage {...ctx} />,
  }

  return map[stage]?.() ?? null
}

function Shell({ children, footer }) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-44">
      <div className="flex-1">{children}</div>
      {footer ? <div className="mt-8 space-y-3">{footer}</div> : null}
    </div>
  )
}

function SafaricomScan({ simulateScan }) {
  return (
    <Shell
      footer={
        <>
          <PartnerCta onClick={simulateScan}>
            Scan to see the impact
            <QrCode className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </PartnerCta>
          <ConceptTag variant="proposed">Proposed integration — Safaricom approval</ConceptTag>
        </>
      }
    >
      <FadeIn>
        <Kicker>Safaricom × ForestOS · CONCEPT</Kicker>
        <DisplayHeadline className="mt-3">Connect. Transform. Conserve.</DisplayHeadline>
        <p className="mt-3 text-[15px] leading-relaxed text-bone-300">
          Discover the conservation story behind verified Kenyan tea.
        </p>
      </FadeIn>
      <FadeIn delay={0.12} className="mt-10">
        <div className="relative mx-auto grid max-w-xs place-items-center rounded-2xl border border-bone/15 bg-forest-900/60 p-8">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, var(--ep-brand-soft), transparent 55%)' }} />
          <QrCode className="h-24 w-24 text-bone" strokeWidth={1} aria-hidden="true" />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
            ForestOS · Safaricom
          </p>
          <p className="mt-2 flex items-center gap-2 font-mono text-[11px] text-river-400">
            <Signal className="h-3.5 w-3.5" aria-hidden="true" /> Verification ready
          </p>
        </div>
      </FadeIn>
    </Shell>
  )
}

function JavaHouseScan({ simulateScan }) {
  return (
    <Shell
      footer={
        <>
          <PartnerCta onClick={simulateScan}>
            Scan to discover the story
            <QrCode className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </PartnerCta>
          <ConceptTag variant="proposed">Proposed integration — Java House approval</ConceptTag>
        </>
      }
    >
      <FadeIn>
        <Kicker>Java House × ForestOS · CONCEPT</Kicker>
        <DisplayHeadline className="mt-3">Your cup can carry a bigger story.</DisplayHeadline>
        <p className="mt-3 text-[15px] leading-relaxed text-bone-300">
          Everyday café choices connected to verified tea landscapes and forest-buffer conservation
          — not coffee origin claims unless officially verified.
        </p>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-8 rounded-2xl border border-bone/12 bg-forest-900/50 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">Product focus</p>
        <p className="mt-2 font-display text-xl text-bone">JAVA HOUSE × FORESTOS TEA EXPERIENCE</p>
        <p className="mt-2 text-[13px] text-bone-400">Tea · traceability · conservation</p>
      </FadeIn>
    </Shell>
  )
}

function VerifyStage({ brand, batch, verification, advance }) {
  const showSweep = verification.status === 'verified'
  return (
    <Shell
      footer={
        verification.status === 'verified' ? (
          <PartnerCta onClick={advance}>
            Continue
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          </PartnerCta>
        ) : (
          <PartnerCta variant="secondary" onClick={() => window.location.assign('/enterprise-partners')}>
            Return to hub
          </PartnerCta>
        )
      }
    >
      <FadeIn>
        <Kicker>Verify</Kicker>
        <DisplayHeadline className="mt-3">Verifying tea batch</DisplayHeadline>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-6">
        <div
          className={
            'relative overflow-hidden rounded-xl border border-bone/15 bg-forest-900/70 p-4 ' +
            (showSweep ? 'ep-verify-sweep' : '')
          }
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">ForestOS ref</p>
          <p className="mt-1 font-mono text-sm text-bone">{verification.forestRef || '—'}</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.14} className="mt-4">
        <VerificationBadge status={verification.status} />
      </FadeIn>

      {verification.status === 'verified' && batch ? (
        <FadeIn delay={0.2} className="mt-4 rounded-xl border border-bone/12 bg-forest-900/55 p-4">
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">Tea batch</dt>
              <dd className="mt-1 font-mono text-bone">{batch.id}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">Factory</dt>
              <dd className="mt-1 text-bone">{batch.collectionCentre?.name ?? 'Illustrative record'}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">Conservation area</dt>
              <dd className="mt-1 text-bone">{batch.block?.name}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">Verification date</dt>
              <dd className="mt-1 font-mono text-bone">{batch.verification?.timestamp?.slice(0, 10) ?? '—'}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-sage-500">Status</dt>
              <dd className="mt-1 text-river-400">{batch.verification?.status}</dd>
            </div>
          </dl>
          <p className="mt-3 border-t border-bone/10 pt-3 text-[12px] text-bone-400">
            Powered by ForestOS verification engine · {brand.name} experience layer
          </p>
        </FadeIn>
      ) : null}
    </Shell>
  )
}

function BlockedStage({ verification }) {
  return (
    <Shell
      footer={
        <PartnerCta variant="secondary" onClick={() => window.location.assign('/enterprise-partners')}>
          Try demo reference {DEMO_FOREST_REF}
        </PartnerCta>
      }
    >
      <VerificationBadge status={verification.status} />
      <p className="mt-6 text-[14px] leading-relaxed text-bone-300">
        Unknown QR or batch codes never display a verified record. Use the illustrative demo token on
        the hub to experience the full journey.
      </p>
    </Shell>
  )
}

function SafaricomImpact({ advance }) {
  return (
    <Shell footer={<PartnerCta onClick={advance}>See the forest</PartnerCta>}>
      <FadeIn>
        <Kicker>Impact</Kicker>
        <DisplayHeadline className="mt-3">Your connection reaches further.</DisplayHeadline>
        <p className="mt-3 text-[14px] text-bone-300">
          Safaricom enables digital participation — ForestOS holds the verified tea and conservation
          evidence.
        </p>
      </FadeIn>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <ImpactCounter {...ILLUSTRATIVE_IMPACT.hectaresProtected} note="ILLUSTRATIVE" />
        <ImpactCounter {...ILLUSTRATIVE_IMPACT.batchesVerified} note="ILLUSTRATIVE" />
        <ImpactCounter {...ILLUSTRATIVE_IMPACT.restorationActions} note="ILLUSTRATIVE" />
        <ImpactCounter {...ILLUSTRATIVE_IMPACT.communityImpact} note="ILLUSTRATIVE" />
      </div>
      <FadeIn delay={0.15} className="mt-6 flex items-center gap-3 rounded-xl border ep-brand-border ep-brand-bg-soft p-4">
        <Wifi className="h-5 w-5 ep-brand-accent" aria-hidden="true" />
        <p className="text-[13px] text-bone-300">
          Network topology overlay · geospatial proof layer ·{' '}
          <ConceptTag variant="illustrative">Illustrative</ConceptTag>
        </p>
      </FadeIn>
      {/* The season meta-loop (brief 5.2) — a reason to return that is not a
          countdown or a purchase prompt. */}
      <SeasonMeter className="mt-6" />
    </Shell>
  )
}

const ORIGIN_BEATS = [
  {
    id: 'region',
    label: 'Tea region',
    body: 'Highland tea-growning belt on the forest boundary. The buffer strip keeps the forest edge legible.',
  },
  {
    id: 'community',
    label: 'Plucker community',
    body: 'Smallholder pluckers work the buffer plots. Aggregate counts only — no names or ids leave ForestOS.',
  },
  {
    id: 'factory',
    label: 'Processing factory',
    body: 'Leaf is weighed and processed locally; the batch record links factory intake back to the plot.',
  },
  {
    id: 'environment',
    label: 'Environmental context',
    body: 'The plot sits inside a monitored conservation block, checked in the field and from orbit.',
  },
]

/**
 * Origin Explorer (brief 7·3 / 5.4): four story beats the visitor opens. The
 * count is what satisfies the quest, so it is reported live rather than
 * assumed from having reached the stage.
 */
function JavaTrace({ batch, advance, recordQuestEvent }) {
  const [open, setOpen] = useState({})

  const toggle = (id) => {
    // Compute the next state first, then report it — a state updater has to
    // stay pure, so it must not fire another state change of its own.
    const next = { ...open, [id]: !open[id] }
    setOpen(next)
    recordQuestEvent({ beatsOpened: Object.values(next).filter(Boolean).length })
  }

  return (
    <Shell footer={<PartnerCta onClick={advance}>Conservation record</PartnerCta>}>
      <FadeIn>
        <Kicker>Origin</Kicker>
        <DisplayHeadline className="mt-3">Discover the tea story</DisplayHeadline>
      </FadeIn>
      <div className="mt-6 space-y-3 rounded-xl border border-bone/12 bg-forest-900/50 p-4 text-[13px]">
        <Row label="Tea batch" value={batch.id} mono />
        <Row label="Conservation area" value={batch.block?.name ?? 'Illustrative'} />
        <Row label="Verification" value={batch.verification?.status ?? 'verified'} />
      </div>

      <ul className="mt-6 space-y-2">
        {ORIGIN_BEATS.map((beat) => {
          const isOpen = Boolean(open[beat.id])
          return (
            <li key={beat.id}>
              <button
                type="button"
                onClick={() => toggle(beat.id)}
                aria-expanded={isOpen}
                className="w-full rounded-xl border border-bone/12 bg-forest-900/50 p-4 text-left transition-colors ep-motion hover:border-bone/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-river-400"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">
                    Story beat
                  </span>
                  <span className="text-[13px] font-semibold text-bone">{beat.label}</span>
                </span>
                {isOpen ? (
                  <span className="mt-2 block text-[13px] leading-relaxed text-bone-400">
                    {beat.body}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-6">
        <TraceTimeline activeIndex={6} compact />
      </div>
    </Shell>
  )
}

function JavaConservation({ batch, advance }) {
  return (
    <Shell footer={<PartnerCta onClick={advance}>2015 → Today</PartnerCta>}>
      <FadeIn>
        <Kicker>Conservation</Kicker>
        <DisplayHeadline className="mt-3">From Kenyan tea to a healthier landscape.</DisplayHeadline>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-6 overflow-hidden rounded-2xl border border-bone/12">
        <img
          src="/media/forests/mau.webp"
          alt="Tea-growing highlands adjacent to forest buffer — illustrative"
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      </FadeIn>
      <FadeIn delay={0.15} className="mt-4 rounded-xl border border-river-400/30 bg-river-400/8 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-river-400">
          Verified conservation record
        </p>
        <p className="mt-2 text-[14px] text-bone-300">
          Plot-linked evidence for batch {batch.id} — not a generic environmental claim.
        </p>
      </FadeIn>
    </Shell>
  )
}

function CanopyStage({ advance, recordQuestEvent }) {
  return (
    <Shell footer={<PartnerCta onClick={advance}>Continue trail</PartnerCta>}>
      <CanopyReveal onExplore={() => recordQuestEvent({ canopyExplored: true })} />
    </Shell>
  )
}

/**
 * The play stage: the Claim vs Fact mini-game (brief 5.3), the session's
 * quests with the single next-best-action nudge (5.4), and the XP ring. The
 * game rewards understanding — a claim that cannot be corroborated pays
 * nothing, which is the lesson rather than a failure.
 */
function PlayStage({ advance, quests, nextAction, xp, recordQuestEvent, brand }) {
  return (
    <Shell footer={<PartnerCta onClick={advance}>Turn impact into participation</PartnerCta>}>
      <ClaimVsFact
        onComplete={({ facts }) => recordQuestEvent({ plotsVerified: facts })}
      />

      <QuestDrawer className="mt-10" quests={quests} nextAction={nextAction} />

      <div className="mt-6 rounded-2xl border border-bone/12 bg-forest-900/45 p-4">
        <XpRing xp={xp} />
        <p className="mt-3 text-[12px] leading-relaxed text-bone-500">
          Canopy XP is ForestOS-native progress with no cash value. It is kept separate from the
          {' '}{brand.name} reward concept and cannot be transferred.
        </p>
      </div>

      {nextAction ? (
        <p className="mt-6 inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400">
          Next best action · {nextAction.quest.title}
        </p>
      ) : (
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-river-400">
          Session quests complete
        </p>
      )}
    </Shell>
  )
}

/** The shared passport plus the stamp book (brief 5.6) and the season loop. */
function PassportStage(ctx) {
  const { passport, verification, switchBrand, otherBrandId } = ctx
  return (
    <>
      <PassportPanel
        {...ctx}
        forestRef={verification.forestRef}
        onSwitchBrand={switchBrand}
        otherBrandId={otherBrandId}
      />
      <div className="mx-auto max-w-lg px-6 pb-12">
        <StampBook stamps={passport.stamps} />
        <SeasonMeter className="mt-6" />
      </div>
    </>
  )
}

function BongaStage({ advance }) {
  const [bonga, setBonga] = useState(100)
  return (
    <Shell footer={<PartnerCta onClick={advance}>Share impact</PartnerCta>}>
      <FadeIn>
        <Kicker>Participate</Kicker>
        <DisplayHeadline className="mt-3">Turn impact into participation.</DisplayHeadline>
        <ConceptTag variant="proposed">Proposed integration</ConceptTag>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-6 rounded-2xl border border-bone/15 bg-forest-900/60 p-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage-500">Illustrative reward</p>
        <p className="mt-2 font-display text-4xl ep-brand-accent">+250 Bonga Points</p>
        <p className="mt-2 text-[12px] text-bone-400">ForestOS does not currently award Bonga Points.</p>
      </FadeIn>
      <FadeIn delay={0.15} className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sage-500">Plant with Bonga · concept</p>
        <input
          type="range"
          min={50}
          max={300}
          step={50}
          value={bonga}
          onChange={(e) => setBonga(Number(e.target.value))}
          className="mt-3 w-full"
          aria-valuetext={`${bonga} Bonga toward conservation action`}
        />
        <p className="mt-2 text-center font-mono text-sm text-bone">
          {bonga} BONGA → <span className="text-river-400">conservation action</span>
        </p>
        <p className="mt-2 text-center text-[11px] text-bone-500">No defined conversion rate · illustrative only</p>
      </FadeIn>
    </Shell>
  )
}

function ShareStage({ brand, batch, verification, advance }) {
  return (
    <Shell footer={<PartnerCta onClick={advance}>Open Forest Passport</PartnerCta>}>
      <FadeIn>
        <Kicker>Share</Kicker>
        <DisplayHeadline className="mt-3">Verified social card</DisplayHeadline>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-6 overflow-hidden rounded-2xl border border-bone/15 bg-gradient-to-br from-forest-800 to-forest-950 p-5">
        <p className="font-display text-lg leading-snug text-bone">
          “I contributed to conservation through ForestOS.”
        </p>
        <dl className="mt-4 space-y-2 font-mono text-[11px] text-sage-300">
          <div>Ref · {verification.forestRef}</div>
          <div>Batch · {batch.id}</div>
          <div>Location · {batch.block?.name}</div>
          <div>Impact · Illustrative hectares protected</div>
        </dl>
        <div className="mt-4 flex items-center justify-between border-t border-bone/10 pt-4 text-[10px] uppercase tracking-[0.14em] text-sage-500">
          <span>ForestOS</span>
          <span>{brand.name}</span>
          <Share2 className="h-4 w-4 text-bone" aria-hidden="true" />
        </div>
      </FadeIn>
    </Shell>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-4 border-b border-bone/8 pb-2 last:border-0">
      <span className="text-sage-500">{label}</span>
      <span className={mono ? 'font-mono text-bone' : 'text-bone text-right'}>{value}</span>
    </div>
  )
}
