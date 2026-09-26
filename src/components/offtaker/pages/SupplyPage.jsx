import { useState } from 'react'
import ContentCard from '../../investor/ui/ContentCard'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import { FORECAST_BASIS, FORECAST_PERIODS } from '../../../data/supply/forecast'
import { formatKg, formatMonth } from '../../../lib/offtaker/format'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'
import SupplyMap from '../SupplyMap'
import DataTable from '../DataTable'

const selectClass =
  'cursor-pointer rounded-full border border-line bg-card px-3.5 py-2 font-mono text-label uppercase tracking-label text-ink-muted shadow-sm outline-none hover:border-line-strong focus:border-forest-accent/50 focus:ring-2 focus:ring-emerald-500/30'

export default function SupplyPage() {
  const ws = useOfftaker()
  const [zone, setZone] = useState('')
  const [period, setPeriod] = useState('')
  const zones = [...new Set(ws.centres.map((centre) => centre.zone))]
  const latestMonth = formatMonth(ws.centres[0].history.at(-1).month)

  const centres = ws.centres
    .filter((centre) => !zone || centre.zone === zone)
    .map((centre) => {
      const forecast = centre.forecast.filter((f) => !period || f.period === period)
      return {
        ...centre,
        forecastKg: forecast.reduce((sum, f) => sum + f.expectedKg, 0),
        forecastLow: forecast.reduce((sum, f) => sum + f.lowKg, 0),
        forecastHigh: forecast.reduce((sum, f) => sum + f.highKg, 0),
      }
    })

  const totalAvailable = centres.reduce((sum, centre) => sum + centre.availableKg, 0)
  const totalExpected = centres.reduce((sum, centre) => sum + centre.forecastKg, 0)
  const periodLabel = period ? formatMonth(period) : `${formatMonth(FORECAST_PERIODS[0])} to ${formatMonth(FORECAST_PERIODS.at(-1))}`

  return (
    <div className="space-y-10">
      <PageHeader
        title="Supply"
        description="Where Nyayo Tea Zone tea comes from, what is on offer now and what each collection centre expects to produce. Expected volumes are estimates, never commitments."
        actions={
          <>
            <select aria-label="Zone" value={zone} onChange={(event) => setZone(event.target.value)} className={selectClass}>
              <option value="">All zones</option>
              {zones.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select aria-label="Production period" value={period} onChange={(event) => setPeriod(event.target.value)} className={selectClass}>
              <option value="">Next quarter</option>
              {FORECAST_PERIODS.map((value) => (
                <option key={value} value={value}>
                  {formatMonth(value)}
                </option>
              ))}
            </select>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <ContentCard className="p-5">
          <p className="text-3xl font-bold tabular-nums text-ink">{formatKg(totalAvailable)}</p>
          <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">Available now</p>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-3xl font-bold tabular-nums text-ink">~{formatKg(totalExpected)}</p>
          <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">Expected, {periodLabel}</p>
          <Badge tone="neutral" className="mt-3">
            Estimated
          </Badge>
        </ContentCard>
        <ContentCard className="p-5">
          <p className="text-3xl font-bold tabular-nums text-ink">{centres.length}</p>
          <p className="mt-1.5 font-mono text-label uppercase tracking-label-wide text-ink-faint">Collection centres</p>
          <p className="mt-3 text-xs text-ink-muted">{centres.filter((c) => c.conservationLinked).length} linked to verified conservation work</p>
        </ContentCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <SupplyMap key={`${zone}-${period}`} centres={centres} className="h-[26rem] xl:col-span-2 xl:h-auto" />
        <div className="xl:col-span-3">
          <DataTable
            caption="Collection centres"
            rows={centres}
            rowKey={(centre) => centre.id}
            minWidth="44rem"
            columns={[
              {
                key: 'centre',
                header: 'Centre',
                cell: (centre) => (
                  <>
                    <p className="font-medium text-ink">{centre.name}</p>
                    <p className="text-xs text-ink-faint">
                      {centre.zone}, delivers to {centre.factory}
                    </p>
                  </>
                ),
              },
              { key: 'available', header: 'Available now', align: 'right', cell: (c) => (c.availableKg ? formatKg(c.availableKg) : <span className="text-ink-faint">None</span>) },
              {
                key: 'expected',
                header: `Expected, ${period ? formatMonth(period) : 'quarter'}`,
                align: 'right',
                cell: (c) => (
                  <>
                    <span className="font-semibold text-ink">~{formatKg(c.forecastKg)}</span>
                    <span className="block text-xs text-ink-faint">
                      {c.forecastLow.toLocaleString('en-US')}–{c.forecastHigh.toLocaleString('en-US')}
                    </span>
                  </>
                ),
              },
              { key: 'fine', header: `Fine leaf, ${latestMonth}`, align: 'right', cell: (c) => `${c.latestFineLeafPct}%` },
              { key: 'accept', header: `Accepted, ${latestMonth}`, align: 'right', cell: (c) => `${c.latestAcceptancePct}%` },
              {
                key: 'conservation',
                header: 'Conservation link',
                cell: (c) =>
                  c.conservationLinked ? <Badge tone="verified">Verified work</Badge> : <Badge tone="neutral">Not linked yet</Badge>,
              },
            ]}
          />
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">{FORECAST_BASIS}</p>
        </div>
      </section>

      <section>
        <SectionHeading title="Production periods" description="Expected made tea by centre and month, with the estimate’s range." />
        <DataTable
          caption="Expected production by month"
          rows={centres}
          rowKey={(centre) => centre.id}
          minWidth="40rem"
          columns={[
            { key: 'centre', header: 'Centre', cell: (c) => <span className="font-medium text-ink">{c.name}</span> },
            ...FORECAST_PERIODS.map((p) => ({
              key: p,
              header: formatMonth(p),
              align: 'right',
              cell: (c) => {
                const f = c.forecast.find((entry) => entry.period === p)
                return f ? (
                  <>
                    <span className="text-ink">~{formatKg(f.expectedKg)}</span>
                    <span className="block text-xs text-ink-faint">
                      {f.lowKg.toLocaleString('en-US')}–{f.highKg.toLocaleString('en-US')}
                    </span>
                  </>
                ) : (
                  '—'
                )
              },
            })),
          ]}
        />
      </section>
    </div>
  )
}
