import { ModuleHeader, Panel, StatTile, BarMeter, Sparkline } from '../../DashboardKit'
import { CREATOR } from '../../../../lib/dashboard/creator'
import CreatorMessageBoard from './CreatorMessageBoard'

const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export default function AudienceScansModule() {
  const { audience } = CREATOR
  const maxCity = Math.max(...audience.cities.map((c) => c.scans))
  const maxDwell = Math.max(...audience.dwell.map((d) => d.seconds))
  const top = [...audience.cities].sort((a, b) => b.scans - a.scans)[0]

  return (
    <div className="space-y-5">
      <ModuleHeader title="Audience QR Scans" sub={`${audience.totalScans.toLocaleString()} scans · ${audience.rangeLabel}`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total scans" value={audience.totalScans.toLocaleString()} unit={audience.rangeLabel} />
        <StatTile label="Top market" value={top.city} unit={`${top.scans.toLocaleString()} scans`} />
        <StatTile label="Median dwell" value="44s" unit="on the 3D proof map" tone="positive" />
        <StatTile label="Markets reached" value={audience.cities.length} unit="cities" />
      </div>

      <Panel title="Scan distribution" lede="Marker size is scan volume over the last 90 days.">
        <div
          className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-line bg-paper-sunk"
          role="img"
          aria-label={
            'Scans by city: ' +
            audience.cities.map((c) => `${c.city} ${(c.scans / 1000).toFixed(1)} thousand`).join(', ')
          }
        >
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[10, 20, 30, 40].map((gy) => (
              <line key={gy} x1="0" y1={gy} x2="100" y2={gy} stroke="rgba(23,37,28,0.07)" strokeWidth="0.25" />
            ))}
            {[20, 40, 60, 80].map((gx) => (
              <line key={gx} x1={gx} y1="0" x2={gx} y2="50" stroke="rgba(23,37,28,0.07)" strokeWidth="0.25" />
            ))}
          </svg>
          {audience.cities.map((city) => {
            const size = 8 + (city.scans / maxCity) * 20
            return (
              <div
                key={city.city}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                <span
                  className="block rounded-full bg-emerald-600/25 ring-1 ring-emerald-600/60"
                  style={{ width: size, height: size }}
                />
                <span className="mt-1 block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                  {city.city} · {(city.scans / 1000).toFixed(1)}k
                </span>
              </div>
            )
          })}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-muted">
          {[...audience.cities]
            .sort((a, b) => b.scans - a.scans)
            .map((c) => (
              <li key={c.city}>
                {c.city} · {c.scans.toLocaleString()}
              </li>
            ))}
        </ul>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Scan growth" lede="Monthly scans across all live drops, in thousands.">
          <Sparkline values={audience.trendK} />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Panel>
        <Panel title="Storytelling dwell time" lede="Median seconds per stage of the scan experience.">
          <div className="space-y-3">
            {audience.dwell.map((d) => (
              <BarMeter key={d.stage} label={d.stage} value={d.seconds} max={maxDwell} display={`${d.seconds}s`} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Community message board"
        lede="Publish a note to everyone who scans a tag from your editions — newest first."
      >
        <CreatorMessageBoard messages={CREATOR.messages} />
      </Panel>
    </div>
  )
}
