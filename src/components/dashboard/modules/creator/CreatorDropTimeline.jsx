import { useId } from 'react'

const TODAY = new Date('2026-09-07')
const day = (s) => new Date(s).getTime()

/**
 * Drop timeline — the Creator view's hero. Each edition drop is a node on a date
 * axis; the ring fills with sell-through, the stem colour carries status, and a
 * "today" marker sits in the field. Built for @leaf.and.ridge first.
 */
export default function CreatorDropTimeline({ drops }) {
  const clipId = useId()
  const W = 760
  const H = 196
  const padX = 74
  const axisY = 132
  const label = (cx) => Math.max(64, Math.min(W - 64, cx))

  const times = drops.map((d) => day(d.dropDate)).concat(TODAY.getTime())
  const min = Math.min(...times)
  const max = Math.max(...times)
  const span = max - min || 1
  const x = (t) => padX + ((t - min) / span) * (W - 2 * padX)
  const todayX = x(TODAY.getTime())

  const tone = (status) =>
    status === 'live' ? '#059669' : status === 'scheduled' ? '#8a948a' : '#065f46'

  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[190px] w-full min-w-[560px]"
        role="img"
        aria-label={`Timeline of ${drops.length} edition drops with sell-through`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* axis */}
        <line x1={padX} y1={axisY} x2={W - padX} y2={axisY} stroke="#d1cab8" strokeWidth="1.5" />

        {/* today marker */}
        <line x1={todayX} y1={28} x2={todayX} y2={axisY + 8} stroke="#4f5c52" strokeWidth="1" strokeDasharray="3 3" />
        <text x={todayX} y={20} textAnchor="middle" className="fill-[#5b6960] font-mono" fontSize="9" letterSpacing="1">
          TODAY
        </text>

        {drops.map((d) => {
          const cx = x(day(d.dropDate))
          const scheduled = d.status === 'scheduled'
          const sell = d.editions ? d.sold / d.editions : 0
          const r = 16 + (d.scans / 9000) * 10
          const c = tone(d.status)
          const circ = 2 * Math.PI * r
          return (
            <g key={d.id} clipPath={`url(#${clipId})`}>
              <line x1={cx} y1={axisY} x2={cx} y2={62} stroke={c} strokeWidth={scheduled ? 1 : 2} strokeDasharray={scheduled ? '3 3' : undefined} />
              <circle cx={cx} cy={62} r={r} fill={c} fillOpacity="0.10" stroke={c} strokeWidth="1.5" />
              {!scheduled && (
                <circle
                  cx={cx}
                  cy={62}
                  r={r}
                  fill="none"
                  stroke={c}
                  strokeWidth="3"
                  strokeLinecap={sell >= 1 ? 'butt' : 'round'}
                  strokeDasharray={sell >= 1 ? undefined : `${sell * circ} ${circ}`}
                  transform={`rotate(-90 ${cx} 62)`}
                />
              )}
              <text x={cx} y={59} textAnchor="middle" className="fill-[#17251c] font-mono" fontSize="11" fontWeight="600">
                {scheduled ? '—' : Math.round(sell * 100)}
              </text>
              {!scheduled && (
                <text x={cx} y={68} textAnchor="middle" className="fill-[#5b6960] font-mono" fontSize="6.5" letterSpacing="0.6">
                  %
                </text>
              )}
              <text x={label(cx)} y={axisY + 18} textAnchor="middle" className="fill-[#17251c]" fontSize="10.5" fontWeight="500">
                {d.name.length > 24 ? d.name.slice(0, 23) + '…' : d.name}
              </text>
              <text x={label(cx)} y={axisY + 32} textAnchor="middle" className="fill-[#5b6960] font-mono" fontSize="9" letterSpacing="0.5">
                {d.dropDate} · {d.sold}/{d.editions}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
