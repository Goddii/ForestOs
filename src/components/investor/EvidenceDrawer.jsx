import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { getEvidenceById, LANDSCAPE_LAYERS } from '../../data/investor'
import { useEvidenceDrawer } from './EvidenceDrawerContext'
import ConfidenceIndicator from './ConfidenceIndicator'
import EvidenceChain from './EvidenceChain'
import DemoBadge from './DemoBadge'
import ActionButton from './ui/ActionButton'

const EASE = [0.16, 1, 0.3, 1]

function getZoneById(id) {
  return LANDSCAPE_LAYERS.find((feature) => feature.id === id) ?? null
}

function Section({ eyebrow, children }) {
  return (
    <div className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">{eyebrow}</p>
      <div className="mt-2 text-[13px] leading-relaxed text-ink-muted">{children}</div>
    </div>
  )
}

function EvidenceRecordBody({ record }) {
  return (
    <>
      <div className="pr-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest-accent">
          Evidence record
        </p>
        <h3 className="mt-1 font-sans text-xl font-bold leading-tight text-ink">{record.title}</h3>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceIndicator status={record.status} />
        <DemoBadge />
      </div>
      <div className="mt-6 space-y-4">
        <Section eyebrow="Related metric">
          <p className="text-ink">{record.relatedMetric}</p>
          <p className="mt-0.5 text-ink-muted">{record.relatedActivity}</p>
        </Section>
        <Section eyebrow="Location">
          <p>{record.location}</p>
          <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
            {record.date} · {record.programme}
          </p>
        </Section>
        <Section eyebrow="Observation">
          <p>{record.detail.observation}</p>
        </Section>
        <Section eyebrow="Field evidence">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px]">
            <dt className="text-ink-faint">Source</dt>
            <dd className="text-ink-muted">{record.detail.source}</dd>
            <dt className="text-ink-faint">Field records</dt>
            <dd className="text-ink-muted tnum">{record.detail.fieldVerificationCount}</dd>
            <dt className="text-ink-faint">Responsible team</dt>
            <dd className="text-ink-muted">{record.responsibleTeam}</dd>
          </dl>
        </Section>
        <Section eyebrow="Verification">
          <p className="font-mono text-[11px] text-ink-muted">
            Last verified {record.detail.lastVerification}
          </p>
        </Section>
        <Section eyebrow="Audit trail">
          <ol className="space-y-2 border-l border-line pl-4">
            {record.detail.auditTrail.map((entry, index) => (
              <li key={index} className="relative text-[12px] leading-snug text-ink-muted">
                <span className="absolute -left-[1.09rem] top-1.5 h-1.5 w-1.5 rounded-full bg-forest-accent" />
                {entry}
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </>
  )
}

function ZoneBody({ zone, onOpenEvidence }) {
  const { areaHa, status, lastObservation, fieldActivities, verificationRecords } = zone.zone

  return (
    <>
      <div className="pr-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest-accent">
          Conservation zone
        </p>
        <h3 className="mt-1 font-sans text-xl font-bold leading-tight text-ink">{zone.label}</h3>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ConfidenceIndicator status={zone.confidence} />
        <DemoBadge />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">Area</dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums text-ink">
            {areaHa.toLocaleString('en-US')} ha
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">Status</dt>
          <dd className="mt-0.5 text-xl font-bold text-ink">{status}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Field activities
          </dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums text-ink">{fieldActivities}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Verification records
          </dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums text-ink">{verificationRecords}</dd>
        </div>
      </dl>

      <p className="mt-4 font-mono text-[11px] text-ink-muted">
        Last observation {lastObservation}
      </p>

      <EvidenceChain
        status={zone.confidence}
        lastVerified={lastObservation}
        className="mt-6 border-t border-line pt-4"
      />

      {zone.evidenceId && (
        <ActionButton variant="primary" onClick={() => onOpenEvidence(zone.evidenceId)} className="mt-5">
          View full evidence
        </ActionButton>
      )}
    </>
  )
}

/**
 * The evidence-first drill-down (design-review brief §9/§14): either a full
 * evidence record (Metric → Location → Observation → Field Evidence →
 * Verification → Audit trail) or, when a map conservation zone is clicked, a
 * zone summary with its own "How do we know?" evidence chain. Mounted once
 * in InvestorShell; any component calls `useEvidenceDrawer().openEvidence(id)`
 * or `.openZone(id)` to open it.
 */
export default function EvidenceDrawer() {
  const { openEvidenceId, openZoneId, openEvidence, closeEvidence } = useEvidenceDrawer()
  const record = openEvidenceId ? getEvidenceById(openEvidenceId) : null
  const zone = openZoneId ? getZoneById(openZoneId) : null
  const isOpen = Boolean(record || zone)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event) => event.key === 'Escape' && closeEvidence()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeEvidence])

  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: '100%' },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: '100%' },
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeEvidence}
            className="fixed inset-0 z-40 bg-forest-deep/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.aside
            key={record?.id ?? zone?.id}
            role="dialog"
            aria-modal="true"
            aria-label={record ? `Evidence — ${record.title}` : `Conservation zone — ${zone.label}`}
            {...motionProps}
            transition={{ duration: 0.42, ease: EASE }}
            className="fixed inset-y-0 right-0 z-50 w-[min(28rem,100%)] overflow-y-auto border-l border-line bg-card p-6 shadow-[0_18px_60px_-12px_rgba(20,32,25,0.25)] sm:p-8"
          >
            <button
              type="button"
              onClick={closeEvidence}
              aria-label="Close"
              className="absolute right-6 top-6 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-ink-muted transition-all duration-200 ease-in-out hover:border-line-strong hover:bg-canvas-sunk hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:right-8 sm:top-8"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>

            {record && <EvidenceRecordBody record={record} />}
            {zone && <ZoneBody zone={zone} onOpenEvidence={openEvidence} />}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
