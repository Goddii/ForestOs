import { Link } from 'react-router-dom'
import { findBatchRecord } from '../lib/batchChain'
import { useInView } from './hooks'
import { Reveal } from './Reveal'
import SectionHeading from './SectionHeading'
import { FONT_SERIF, GREEN, TEXT_2, TYPE } from './tokens'

// The same record the public QR scan page reads (`/batch/921`), so this chain and
// the full proof page can never disagree. Demo data — disclosed under the chain.
const BATCH_ID = '921'
const batch = findBatchRecord(BATCH_ID)

const DAY = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

/** "2026-08-27" → "27 Aug 2026". Falls back to the raw string if it isn't a date. */
function formatDay(iso) {
  const date = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? iso : DAY.format(date)
}

/** "2026-08-19 – 2026-08-25" → "19 Aug 2026 – 25 Aug 2026". */
function formatWindow(window) {
  return window.split(/\s*[–-]\s*(?=\d{4}-)/).map(formatDay).join(' – ')
}

// The record belongs to a sample pack, not to this page's brand, so the last
// step says so rather than claiming it is "your" pack.
const STEPS = batch
  ? [
      { title: batch.land.name, detail: batch.block.name },
      { title: batch.plot.centre, detail: `${batch.plot.farmers} farmers on the plot` },
      { title: 'Harvest', detail: batch.harvest.window ? formatWindow(batch.harvest.window) : batch.harvest.month },
      { title: batch.processing.facility, detail: `Sealed ${formatDay(batch.batch.sealedAt)}` },
      { title: 'Sample pack', detail: `Trace ID ${batch.traceId}` },
    ]
  : []

const NODE = 11
const ROW_GAP = 26
const STEP_STAGGER = 0.28

function ChainStep({ step, index, isVisible, isLast }) {
  const delay = 0.2 + index * STEP_STAGGER
  return (
    <li style={{ position: 'relative', display: 'flex', gap: '16px', paddingBottom: isLast ? 0 : ROW_GAP }}>
      {!isLast && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: (NODE - 1) / 2,
            top: NODE + 4,
            bottom: -4,
            width: 1,
            background: `linear-gradient(to bottom, ${GREEN}, rgba(29,185,84,0.25))`,
            transformOrigin: 'top',
            transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
            transition: `transform ${STEP_STAGGER + 0.1}s cubic-bezier(0.16,1,0.3,1) ${delay + 0.1}s`,
          }}
        />
      )}
      <span
        aria-hidden="true"
        style={{
          width: NODE,
          height: NODE,
          marginTop: 6,
          flexShrink: 0,
          borderRadius: '50%',
          background: isLast ? GREEN : '#0B1910',
          border: `1.5px solid ${GREEN}`,
          boxShadow: isLast ? '0 0 14px rgba(29,185,84,0.6)' : 'none',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.4)',
          transition: `opacity 0.4s ease ${delay}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
        }}
      />
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(8px)', transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
        <div style={{ ...TYPE.title, fontSize: '19px' }}>{step.title}</div>
        <div style={{ ...TYPE.small, marginTop: 2 }}>{step.detail}</div>
      </div>
    </li>
  )
}

/** "Powered by ForestOS": the pack's chain from forest to shelf, and the proof behind it. */
export default function ForestOsTrace() {
  const { ref, visible } = useInView(0.25)
  if (!batch) return null
  const { verification } = batch

  return (
    <section aria-labelledby="rr-trace-title" style={{ padding: '28px 20px 0' }}>
      <div style={{ padding: '22px 20px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px' }}>
        <Reveal animation="slide-in-left">
          <SectionHeading id="rr-trace-title" size={28}>Every pack can prove where it grew.</SectionHeading>
        </Reveal>
        <Reveal animation="fade-up" delay={0.1}>
          <p style={{ ...TYPE.body, margin: '14px 0 22px' }}>
            ForestOS ties each pack to the plot, the harvest and the forest edge it protects, so a
            scan shows the record, not a promise.
          </p>
        </Reveal>

        <ol ref={ref} role="list" aria-label={`Journey of sample batch ${batch.id}, from forest to pack`} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {STEPS.map((step, i) => (
            <ChainStep key={step.title} step={step} index={i} isVisible={visible} isLast={i === STEPS.length - 1} />
          ))}
        </ol>

        <Reveal animation="fade-up" delay={0.1}>
          <p style={{ ...TYPE.body, fontSize: '13px', margin: '24px 0 4px' }}>
            <span style={{ color: GREEN, fontWeight: 600 }}>{verification.standard}.</span>{' '}
            Checked on the ground by an {verification.field.by}, and from space by {verification.satellite.source} against
            a {verification.satellite.baseline} forest baseline.
          </p>
          <p style={TYPE.small}>Demo record for a sample pack. Not a live verification.</p>

          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to={`/batch/${batch.id}`}
              style={{ ...TYPE.action, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 18px', borderRadius: 100, background: GREEN, color: '#0B1910', textDecoration: 'none' }}
            >
              See the full proof record
            </Link>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '7px' }}>
              <span style={{ ...TYPE.small, color: TEXT_2 }}>Powered by</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>
                Forest<span style={{ color: GREEN }}>OS</span>
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
