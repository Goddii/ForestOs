import { ModuleHeader, Panel, StatTile, DataTable, StatusPill } from '../../DashboardKit'
import { CREATOR } from '../../../../lib/dashboard/creator'
import CreatorDropTimeline from './CreatorDropTimeline'
import CampaignSellThrough from './CampaignSellThrough'

const COLUMNS = [
  { key: 'name', label: 'Drop', sortAccessor: (r) => r.name },
  { key: 'channel', label: 'Channel', sortAccessor: (r) => r.channel },
  { key: 'sold', label: 'Sold', align: 'right', mono: true, sortAccessor: (r) => r.sold / r.editions },
  { key: 'scans', label: 'Scans', align: 'right', mono: true, sortAccessor: (r) => r.scans },
  { key: 'status', label: 'Status', align: 'right', sortAccessor: (r) => r.status },
]

export default function CampaignDropsModule() {
  const { campaigns, royaltyKes, unitsSold, aovKes, treesPlanted } = CREATOR
  const live = campaigns.filter((c) => c.status === 'live').length
  const totalScans = campaigns.reduce((s, c) => s + c.scans, 0)
  const totalSold = campaigns.reduce((s, c) => s + c.sold, 0)
  const totalEditions = campaigns.reduce((s, c) => s + c.editions, 0)
  const maxScans = Math.max(...campaigns.map((c) => c.scans), 1)

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Campaign Drops"
        sub={`${campaigns.length} drops · ${live} live · ${totalSold}/${totalEditions} editions sold · ${(totalScans / 1000).toFixed(1)}k scans`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Royalty earnings"
          value={`${(royaltyKes / 1_000_000).toFixed(2)}M`}
          unit={`KES · ${Math.round((CREATOR.earnings.paidYtdKes / royaltyKes) * 100)}% settled, rest pending`}
          tone="positive"
          share={CREATOR.earnings.paidYtdKes / royaltyKes}
        />
        <StatTile
          label="Units sold"
          value={unitsSold.toLocaleString()}
          unit={`of ${totalEditions.toLocaleString()} editions`}
          share={unitsSold / totalEditions}
        />
        <StatTile label="Avg order value" value={aovKes.toLocaleString()} unit="KES per edition, retail" />
        <StatTile label="Trees planted" value={treesPlanted.toLocaleString()} unit="attributed to these sales" tone="positive" />
      </div>

      <Panel
        title="Campaign sell-through"
        lede="Units sold against the total limited-edition run, per series."
      >
        <CampaignSellThrough drops={campaigns} />
      </Panel>

      <Panel title="Drop timeline" lede="Every edition series on the release calendar — the ring fills with sell-through.">
        <CreatorDropTimeline drops={campaigns} />
      </Panel>

      <Panel title="All drops" lede="Sell-through and scan volume per series.">
        <DataTable
          columns={COLUMNS}
          rows={campaigns}
          sortable
          csvName="ForestOS-creator-drops"
          renderCell={(key, row) => {
            if (key === 'name')
              return (
                <span>
                  <span className="block font-medium text-ink">{row.name}</span>
                  <span className="block font-mono text-[11px] text-ink-faint">
                    {row.id} · {row.dropDate}
                  </span>
                </span>
              )
            if (key === 'sold') return `${row.sold}/${row.editions}`
            if (key === 'scans')
              return (
                <span className="inline-flex items-center justify-end gap-2">
                  {row.scans.toLocaleString()}
                  <span className="h-1.5 w-14 overflow-hidden rounded-full bg-line-strong" aria-hidden="true">
                    <span
                      className="block h-full rounded-full bg-emerald-600"
                      style={{ width: `${(row.scans / maxScans) * 100}%` }}
                    />
                  </span>
                </span>
              )
            if (key === 'status') return <StatusPill status={row.status} />
            return row[key]
          }}
        />
      </Panel>
    </div>
  )
}
