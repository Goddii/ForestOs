import { imgCommunity } from './assets'
import { useCountUp, useInView } from './hooks'
import { Reveal } from './Reveal'
import SectionHeading from './SectionHeading'
import SpotifyIcon from './SpotifyIcon'
import { GREEN, MINT, TEXT_2, TYPE } from './tokens'

const TREES_PLANTED = 78400
const TREES_GOAL = 100000
const PLANTED_PERCENT = (TREES_PLANTED / TREES_GOAL) * 100

function TreeProgress() {
  const { ref, visible } = useInView(0.4)
  const count = useCountUp(TREES_PLANTED, 2200, visible)

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <span style={{ ...TYPE.numeral, textShadow: visible ? '0 0 18px rgba(29,185,84,0.45)' : 'none', transition: 'text-shadow 0.3s' }}>
          {count.toLocaleString()}
          <span style={{ ...TYPE.caption, fontSize: '20px', color: GREEN, marginLeft: '6px' }}>Trees</span>
        </span>
        <span style={{ ...TYPE.small, alignSelf: 'flex-end' }}>
          Goal: {TREES_GOAL.toLocaleString()}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Trees planted toward goal"
        aria-valuemin={0}
        aria-valuemax={TREES_GOAL}
        aria-valuenow={TREES_PLANTED}
        style={{ height: '6px', borderRadius: '100px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative' }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: visible ? `${PLANTED_PERCENT}%` : '0%',
            borderRadius: '100px',
            background: `linear-gradient(90deg, ${GREEN} 0%, ${MINT} 50%, ${GREEN} 100%)`,
            backgroundSize: '200% 100%',
            animation: visible ? 'rr-shimmer-bar 2.5s linear infinite' : 'none',
            boxShadow: '0 0 10px rgba(29,185,84,0.5)',
            transition: 'width 2.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
      <div style={{ ...TYPE.label, marginTop: '8px', letterSpacing: '0.08em' }}>
        Kenya&apos;s Tea Belt · Demo figures
      </div>
    </div>
  )
}

const PHOTO = { borderRadius: '16px', overflow: 'hidden', height: '210px', position: 'relative', border: '1px solid rgba(255,255,255,0.06)' }

export default function CommunityRoots() {
  return (
    <section aria-labelledby="rr-community-title" style={{ padding: '24px 20px 0' }}>
      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px' }}>
        <Reveal animation="slide-in-left" delay={0}>
          <div style={{ marginBottom: '16px' }}>
            <SectionHeading id="rr-community-title">Community Roots</SectionHeading>
          </div>
        </Reveal>

        <div style={{ marginBottom: '20px' }}>
          <Reveal animation="scale-in" delay={0.1}>
            <div style={PHOTO}>
              <img src={imgCommunity} alt="Community members tending a young tea plant" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 64%' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,25,16,0.85) 0%, transparent 55%)' }} />
              <div style={{ ...TYPE.caption, position: 'absolute', bottom: 12, left: 14 }}>Nyayo Belt · Kenya</div>
            </div>
          </Reveal>
        </div>

        <TreeProgress />

        <Reveal animation="fade-up" delay={0.3}>
          <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(29,185,84,0.05)', border: '1px solid rgba(29,185,84,0.14)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SpotifyIcon size={12} />
            <div style={{ ...TYPE.small, color: TEXT_2 }}>
              Co-funded by <span style={{ color: GREEN }}>Terra Tea</span> × Local Smallholder Farmers
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
