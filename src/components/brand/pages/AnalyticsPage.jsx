import { useSearchParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import {
  dailyTotals,
  linkRows,
  mergedGeographyRows,
  periodChange,
  rangeFrom,
  stageFunnel,
  sumScans,
  weightedRates,
} from '../../../lib/brand/analytics'
import { useBrand } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import DataTable from '../../offtaker/DataTable'
import EmptyState from '../../investor/EmptyState'
import VolumeBars from '../../offtaker/VolumeBars'
import PermissionNote from '../PermissionNote'
import ScansChart from '../ScansChart'
import StageFunnel from '../StageFunnel'

const RANGES = [
  ['7', 'Last 7 days'],
  ['30', 'Last 30 days'],
  ['all', 'Since launch'],
]
const STORY_STAGE = 'story'

const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0)

function Tile({ label, value, detail }) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-compact text-ink-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-xs text-ink-faint">{detail}</p>
    </div>
  )
}

/** Everything the page shows for the chosen experiences and dates, from pure helpers. */
function summarise(ws, selectedIds, range) {
  const allDays = ws.scanDays.filter((day) => selectedIds.has(day.experienceId))
  const firstDay = allDays.reduce((min, day) => (day.date < min ? day.date : min), ws.asOf)
  const from = range === 'all' ? firstDay : rangeFrom(ws.asOf, Number(range))
  const days = allDays.filter((day) => day.date >= from && day.date <= ws.asOf)
  const experiences = ws.experiences.filter((experience) => selectedIds.has(experience.id))
  const perExperience = experiences.map((experience) => ({
    experience,
    totals: sumScans(days.filter((day) => day.experienceId === experience.id)),
    profile: ws.engagement[experience.id],
  }))
  const withProfile = perExperience.filter((entry) => entry.profile)
  const totals = sumScans(days)
  const funnel = stageFunnel(totals.scans, weightedRates(withProfile.map((entry) => ({ scans: entry.totals.scans, rates: entry.profile.stageRates }))), ws.stages)
  const links = withProfile.flatMap((entry) =>
    linkRows(entry.totals.scans, entry.profile.links, entry.experience.customisation).map((row) => ({ ...row, id: `${entry.experience.id}-${row.key}`, experience: entry.experience.customisation.title })),
  )
  return {
    from,
    totals,
    change: range === 'all' ? null : periodChange(allDays, from, ws.asOf),
    daily: dailyTotals(days, from, ws.asOf),
    funnel,
    storyReach: funnel.rows.find((row) => row.key === STORY_STAGE)?.count ?? 0,
    geography: mergedGeographyRows(withProfile.map((entry) => ({ totalScans: entry.totals.scans, geography: entry.profile.geography })), ws.analyticsFloor),
    links,
    perExperience: withProfile,
  }
}

export default function AnalyticsPage() {
  const ws = useBrand()
  const [params, setParams] = useSearchParams()
  const published = ws.experiences.filter((experience) => ws.engagement[experience.id])
  const range = RANGES.some(([key]) => key === params.get('range')) ? params.get('range') : '30'
  const exp = published.some((experience) => experience.id === params.get('exp')) ? params.get('exp') : 'all'
  const selectedIds = new Set(exp === 'all' ? published.map((experience) => experience.id) : [exp])
  const data = summarise(ws, selectedIds, range)
  const setParam = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set(key, value)
      return next
    })

  const header = (
    <PageHeader
      title="Analytics"
      description="How customers use your QR experiences: scans, estimated unique devices, how far they read, where they scan from and which links they tap. Demo data, generated per experience."
    />
  )
  if (!ws.permissions.viewAnalytics) return <div>{header}<PermissionNote permission="viewAnalytics" /></div>
  if (published.length === 0) return <div>{header}<EmptyState message="No published QR experience yet. Scans appear here from the day an experience is published." /></div>

  const storyIndex = ws.stages.findIndex((stage) => stage.key === STORY_STAGE)
  const linkTaps = data.links.reduce((sum, row) => sum + row.taps, 0)
  const campaignRows = ws.campaigns
    .filter((campaign) => selectedIds.has(campaign.experienceId))
    .map((campaign) => {
      const entry = data.perExperience.find((item) => item.experience.id === campaign.experienceId)
      const scans = sumScans(ws.scanDays.filter((day) => day.experienceId === campaign.experienceId && day.date >= (campaign.period.start > data.from ? campaign.period.start : data.from) && day.date <= ws.asOf))
      const cta = entry ? Math.round(scans.scans * entry.profile.links.cta) : 0
      return { ...campaign, scans, cta, reach: entry ? Math.round((entry.profile.stageRates[storyIndex] ?? 0) * 100) : 0 }
    })

  return (
    <div className="space-y-12">
      {header}

      <div className="flex flex-wrap items-end gap-4 border-b border-line pb-6" role="group" aria-label="Filters">
        <div className="flex rounded-full border border-line p-1" role="radiogroup" aria-label="Date range">
          {RANGES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={range === key}
              onClick={() => setParam('range', key)}
              className={`rounded-full px-3.5 py-1.5 text-compact transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                range === key ? 'bg-forest-accent font-semibold text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-compact text-ink-muted">
          Experience
          <select value={exp} onChange={(event) => setParam('exp', event.target.value)} className="rounded-lg border border-line-strong bg-card px-3 py-1.5 text-compact text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">
            <option value="all">All published ({published.length})</option>
            {published.map((experience) => (
              <option key={experience.id} value={experience.id}>
                {experience.customisation.title}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-ink-faint">
          {data.from} to {ws.asOf}
        </p>
      </div>

      <section aria-label="Totals" className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-card sm:grid-cols-2 xl:grid-cols-4">
        <Tile
          label="QR scans"
          value={data.totals.scans.toLocaleString('en-US')}
          detail={data.change?.pct != null ? `${data.change.pct >= 0 ? '+' : ''}${data.change.pct}% on the ${range} days before` : 'since each experience launched'}
        />
        <Tile label="Unique devices" value={`~${data.totals.uniqueDevices.toLocaleString('en-US')}`} detail="estimated without cookies" />
        <Tile label="Reached your story" value={`${pct(data.storyReach, data.totals.scans)}%`} detail={`${data.storyReach.toLocaleString('en-US')} scans read on to the brand story`} />
        <Tile label="Link taps" value={linkTaps.toLocaleString('en-US')} detail={`${pct(linkTaps, data.totals.scans)}% of scans tapped a call to action or link`} />
      </section>

      <section aria-label="Scans by day">
        <SectionHeading title="Scans by day" />
        <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
          <ScansChart rows={data.daily} label="Daily QR scans" />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-label="How far customers read">
          <SectionHeading title="How far customers read" />
          <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <StageFunnel funnel={data.funnel} />
          </div>
        </section>
        <section aria-label="Where scans come from">
          <SectionHeading title="Where scans come from" />
          <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <VolumeBars
              unit="scans"
              rows={data.geography.map((row) => ({
                key: row.label,
                label: row.label,
                sublabel: row.isOther ? `${row.places} places under ${ws.analyticsFloor} scans each` : row.kind === 'country' ? 'country' : 'county',
                value: row.count,
                format: (value) => value.toLocaleString('en-US'),
              }))}
            />
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              County or country only. Any place with fewer than {ws.analyticsFloor} scans is pooled into “Other locations”.
            </p>
          </div>
        </section>
      </div>

      <section aria-label="Campaign performance">
        <SectionHeading title="Campaign performance" description="Scans of each campaign’s experience since the campaign started, within the dates above." />
        <DataTable
          caption="Campaign performance"
          rowKey={(row) => row.id}
          rows={campaignRows}
          empty="No campaign uses the selected experiences."
          columns={[
            { key: 'name', header: 'Campaign', cell: (row) => <span className="font-semibold text-ink">{row.name}</span> },
            { key: 'scans', header: 'Scans', align: 'right', cell: (row) => row.scans.scans.toLocaleString('en-US') },
            { key: 'devices', header: 'Devices (est.)', align: 'right', cell: (row) => row.scans.uniqueDevices.toLocaleString('en-US') },
            { key: 'reach', header: 'Reached story', align: 'right', cell: (row) => `${row.reach}%` },
            { key: 'cta', header: 'CTA taps', align: 'right', cell: (row) => row.cta.toLocaleString('en-US') },
          ]}
        />
      </section>

      <section aria-label="Calls to action and links">
        <SectionHeading title="Calls to action and links" />
        <DataTable
          caption="Taps on each link"
          rowKey={(row) => row.id}
          rows={data.links}
          empty="The selected experiences have no links."
          columns={[
            { key: 'experience', header: 'Experience', cell: (row) => row.experience },
            { key: 'label', header: 'Link', cell: (row) => <span className="font-semibold text-ink">{row.label}</span> },
            { key: 'taps', header: 'Taps', align: 'right', cell: (row) => row.taps.toLocaleString('en-US') },
            { key: 'rate', header: 'Tap rate', align: 'right', cell: (row) => `${row.ratePct}%` },
          ]}
        />
      </section>
    </div>
  )
}
