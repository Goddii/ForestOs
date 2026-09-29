import { useState } from 'react'
import { useCreator } from '../CreatorContext'
import { Figure, PageHeader, SectionTitle, StatusBadge, formatDate } from '../ui'
import ScansChart from '../../brand/ScansChart'
import { dailyTotals, periodChange, rangeFrom } from '../../../lib/brand/analytics'

const RANGES = [
  { days: 14, label: '14 days' },
  { days: 30, label: '30 days' },
]

const LINK_ROWS = [
  { key: 'spotify', label: 'Spotify' },
  { key: 'social', label: 'Social' },
  { key: 'community', label: 'Community sign-up' },
  { key: 'website', label: 'Website and events' },
]

/**
 * Creator-friendly analytics: scans over time, how many visitors reached
 * the conservation story, and which links they tapped. Deliberately short:
 * no geography tables or funnels, and no reach figure, because no social
 * platform is connected to count it.
 */
export default function AnalyticsPage() {
  const { experiences, totals, scanDays, asOf } = useCreator()
  const [days, setDays] = useState(30)
  const from = rangeFrom(asOf, days)
  const rows = dailyTotals(scanDays, from, asOf)
  const change = periodChange(scanDays, from, asOf)
  const linkMax = Math.max(1, ...LINK_ROWS.map((row) => totals[row.key]))
  const storyShare = totals.scans ? `${Math.round((totals.reachedStory / totals.scans) * 100)}%` : '0%'

  return (
    <div className="space-y-14">
      <PageHeader title="Analytics" lede="How your QR experiences are landing with your community. Counts are since each experience went live." />

      <section aria-label="Totals" className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <Figure value={totals.scans} label="QR scans" />
        <Figure value={totals.visitors} label="Visitors" note="Estimate, no cookies" />
        <Figure value={storyShare} label="Reached the conservation story" />
        <Figure value={totals.ctaClicks} label="Link taps" />
      </section>

      <section aria-labelledby="scans-over-time">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionTitle>
              <span id="scans-over-time">Scans over time</span>
            </SectionTitle>
            <p className="mt-1 text-compact text-ink-muted">
              {change.current.toLocaleString('en-GB')} in the last {days} days
              {change.pct !== null && `, ${change.pct >= 0 ? 'up' : 'down'} ${Math.abs(change.pct)}% on the ${days} days before`}.
            </p>
          </div>
          <div role="group" aria-label="Time range" className="inline-flex rounded-full border border-line p-0.5">
            {RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                aria-pressed={days === range.days}
                onClick={() => setDays(range.days)}
                className={`rounded-full px-3.5 py-1 text-compact transition-colors ${days === range.days ? 'bg-forest-accent text-white' : 'text-ink-muted hover:text-ink'}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <ScansChart rows={rows} label={`Daily QR scans, last ${days} days`} />
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="link-taps">
          <SectionTitle>
            <span id="link-taps">Where scanners went next</span>
          </SectionTitle>
          <ul className="mt-6 grid gap-4">
            {LINK_ROWS.map((row) => {
              const value = totals[row.key]
              return (
                <li key={row.key} className="grid grid-cols-[9rem_1fr] items-center gap-3 text-compact sm:grid-cols-[11rem_1fr]">
                  <span className="text-ink">{row.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 rounded-r-[4px] bg-forest-accent" style={{ width: `${(value / linkMax) * 80}%` }} aria-hidden="true" />
                    <span className="tabular-nums text-ink-muted">{value.toLocaleString('en-GB')}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 rounded-xl bg-canvas px-4 py-3 text-compact text-ink-muted">
            Campaign reach on Instagram, YouTube or Spotify is not shown: those accounts are not connected to ForestOS, so there is nothing verified to count.
          </p>
        </section>

        <section aria-labelledby="by-experience">
          <SectionTitle>
            <span id="by-experience">By experience</span>
          </SectionTitle>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-compact">
              <thead className="text-compact text-ink-faint">
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 pr-3 font-medium">Experience</th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Scans</th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Story reached</th>
                  <th scope="col" className="py-2 text-right font-medium">Last scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {experiences.map((experience) => (
                  <tr key={experience.id}>
                    <th scope="row" className="py-3 pr-3 font-medium text-ink">
                      <span className="block">{experience.name}</span>
                      <span className="mt-1 inline-block">
                        <StatusBadge status={experience.status} />
                      </span>
                    </th>
                    <td className="py-3 pr-3 text-right tabular-nums">{experience.stats.scans.toLocaleString('en-GB')}</td>
                    <td className="py-3 pr-3 text-right tabular-nums">{experience.stats.reachedStory.toLocaleString('en-GB')}</td>
                    <td className="py-3 text-right text-ink-muted">{formatDate(experience.stats.lastScan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
