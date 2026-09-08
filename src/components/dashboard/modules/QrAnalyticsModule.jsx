import { Panel, StatTile, BarMeter } from '../DashboardKit'
import { QR_ANALYTICS } from '../../../lib/dashboardData'

export default function QrAnalyticsModule() {
  const { totalScans, scanRangeLabel, scanCities, dwell, attribution } = QR_ANALYTICS
  const maxCityScans = Math.max(...scanCities.map((city) => city.scans))
  const maxDwell = Math.max(...dwell.map((step) => step.seconds))
  const maxCampaignScans = Math.max(...attribution.map((row) => row.scans))

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl text-emerald-950 sm:text-3xl">Consumer Engagement &amp; QR Analytics</h2>
        <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
          Where the pack gets scanned, how long the story holds, and which campaigns drive it.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Total scans"
          value={totalScans.toLocaleString()}
          unit={scanRangeLabel}
          trend={QR_ANALYTICS.scanTrendK}
        />
        <StatTile label="Top market" value="London" unit={`${scanCities[0].scans.toLocaleString()} scans`} />
        <StatTile label="Median dwell" value="47s" unit="on the 3D proof map" />
        <StatTile
          label="Scan → passport"
          value={`${Math.round((attribution.reduce((s, r) => s + r.conversions, 0) / attribution.reduce((s, r) => s + r.scans, 0)) * 100)}%`}
          unit="download conversion"
          tone="positive"
        />
      </div>

      <Panel title="Scan distribution" lede="Marker size is scan volume over the last 90 days.">
        <div
          className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-line bg-paper-sunk"
          role="img"
          aria-label={
            'Scans by city: ' +
            scanCities.map((c) => `${c.city} ${(c.scans / 1000).toFixed(1)} thousand`).join(', ')
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
          {scanCities.map((city) => {
            const size = 8 + (city.scans / maxCityScans) * 20
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
          {[...scanCities]
            .sort((a, b) => b.scans - a.scans)
            .map((c) => (
              <li key={c.city}>
                {c.city} · {c.scans.toLocaleString()}
              </li>
            ))}
        </ul>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Storytelling dwell time" lede="Median seconds spent per stage of the scan experience.">
          <div className="space-y-3">
            {dwell.map((step) => (
              <BarMeter
                key={step.stage}
                label={step.stage}
                value={step.seconds}
                max={maxDwell}
                display={`${step.seconds}s`}
                tone="emerald"
              />
            ))}
          </div>
        </Panel>

        <Panel title="Campaign &amp; creator attribution" lede="Scans and passport downloads by source.">
          <ul className="divide-y divide-line">
            {attribution.map((row) => (
              <li key={row.campaign} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[13px] text-ink">{row.campaign}</p>
                  <p className="font-mono text-[11px] tabular-nums text-ink-muted">
                    {row.scans.toLocaleString()} · {row.conversions} conv.
                  </p>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{row.creator}</p>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-line-strong">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${(row.scans / maxCampaignScans) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
