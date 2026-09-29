import { useEffect, useRef, useState } from 'react'
import { COP32 } from '../lib/brands'
import { useCountUp, useInView } from './hooks'
import { Reveal } from './Reveal'
import SectionHeading from './SectionHeading'
import { FONT_SERIF, GREEN, MINT, TEXT_3, TYPE } from './tokens'

// Source: `COP32` in `lib/brands.js` — host, month/year and the pack milestone.
// No exact conference day is confirmed, so only the month is ever shown. The
// pack figures are illustrative demo data, disclosed under the road.
const PROGRESS = COP32.packsNow / COP32.packsGoal
const DISCLAIMER = 'Inspired by the road to COP32. Not an official COP32 partnership.'

const ROAD = 'M 16 122 C 72 122, 58 58, 118 66 S 196 116, 232 72 S 268 26, 294 24'
const ROAD_TRAVEL_S = 2.6

function RoadMap({ isVisible, marker, pathRef }) {
  return (
    <svg viewBox="0 0 310 150" role="img" aria-label={`A road from Kenya's tea belt to Addis Ababa, ${Math.round(PROGRESS * 100)}% travelled (illustrative)`} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
      <path d={ROAD} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
      <path
        ref={pathRef}
        d={ROAD}
        pathLength={1}
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset={isVisible ? 1 - PROGRESS : 1}
        style={{ transition: `stroke-dashoffset ${ROAD_TRAVEL_S}s cubic-bezier(0.16,1,0.3,1) 0.3s`, filter: 'drop-shadow(0 0 5px rgba(29,185,84,0.55))' }}
      />
      <circle cx="16" cy="122" r="4" fill="#0B1910" stroke={GREEN} strokeWidth="1.5" />
      <circle cx="294" cy="24" r="5" fill="#0B1910" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      {marker && (
        <g style={{ opacity: isVisible ? 1 : 0, transition: `opacity 0.4s ease ${ROAD_TRAVEL_S * 0.6}s` }}>
          <circle className="rr-decor" cx={marker.x} cy={marker.y} r="6" fill="none" stroke={MINT} strokeWidth="1" style={{ transformOrigin: `${marker.x}px ${marker.y}px`, animation: 'rr-ripple-out 2.4s ease-out infinite' }} />
          <circle cx={marker.x} cy={marker.y} r="5.5" fill={MINT} stroke="#0B1910" strokeWidth="2" />
        </g>
      )}
      <text x="16" y="146" fill="rgba(255,255,255,0.85)" fontFamily={FONT_SERIF} fontStyle="italic" fontWeight="500" fontSize="15">Kenya&apos;s tea belt</text>
      <text x="294" y="8" textAnchor="end" fill="#fff" fontFamily={FONT_SERIF} fontStyle="italic" fontWeight="600" fontSize="17">Addis Ababa</text>
    </svg>
  )
}

/** Where the pack sits on the road to COP32 in Addis Ababa, drawn as a road. */
export default function RoadToCop32() {
  const { ref, visible } = useInView(0.35)
  const pathRef = useRef(null)
  const [marker, setMarker] = useState(null)
  const packs = useCountUp(COP32.packsNow, 2200, visible)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const point = path.getPointAtLength(path.getTotalLength() * PROGRESS)
    setMarker({ x: point.x, y: point.y })
  }, [])

  return (
    <section ref={ref} aria-labelledby="rr-cop-title" style={{ padding: '32px 20px 0' }}>
      <Reveal animation="slide-in-left">
        <SectionHeading id="rr-cop-title" size={30}>The road to COP32, Addis Ababa.</SectionHeading>
      </Reveal>

      <div style={{ padding: '26px 10px 24px' }}>
        <RoadMap isVisible={visible} marker={marker} pathRef={pathRef} />
      </div>

      <Reveal animation="fade-up" delay={0.1}>
        <p style={TYPE.body}>
          COP32 comes to {COP32.label} in {COP32.dateLabel}. Every pack sold moves the tea belt
          further along the road.
        </p>
        <p style={{ ...TYPE.lede, marginTop: '14px', color: 'rgba(255,255,255,0.9)' }}>
          <span style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontStyle: 'normal', fontVariantNumeric: 'lining-nums tabular-nums', color: GREEN }}>{packs.toLocaleString()}</span>
          {' '}packs so far, on the way to{' '}
          <span style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}>{COP32.packsGoal.toLocaleString()}</span>.
        </p>
        <p style={{ ...TYPE.small, marginTop: '10px', color: TEXT_3 }}>{DISCLAIMER} Illustrative demo figures.</p>
      </Reveal>
    </section>
  )
}
