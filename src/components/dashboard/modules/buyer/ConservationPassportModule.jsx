import { ModuleHeader, Panel, StatTile, BarMeter, Sparkline } from '../../DashboardKit'
import BatchProvenanceChain from '../../../batch/BatchProvenanceChain'
import { BUYER, buyerPassport } from '../../../../lib/dashboard/buyer'
import { brandedBatches, redactBatchRecord } from '../../../../lib/batchChain'

function Field({ label, value }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
      <dd className="mt-1 text-[13px] text-ink">{value}</dd>
    </div>
  )
}

export default function ConservationPassportModule() {
  const p = buyerPassport()
  const headline = brandedBatches().filter((b) => b.brand === BUYER.name)[0]
  const maxBlockVolume = Math.max(...p.blocks.map((b) => b.volumeKg))
  const ndviDelta = (p.environment.ndviCurrent - p.environment.ndviBaseline).toFixed(2)

  return (
    <div className="space-y-5">
      <ModuleHeader
        title="Conservation Passport"
        sub={`${BUYER.name} · ${BUYER.period} · direct-sold volume only · ${p.batchCount} active passports`}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Volume verified"
          value={`${p.volumeKg.toLocaleString()} kg`}
          unit="made tea, this period"
          tone="positive"
        />
        <StatTile label="Active passports" value={p.batchCount} unit="direct-sold batches" />
        <StatTile label="Farmers represented" value={p.farmersRepresented} unit="aggregate count — no names" />
        <StatTile
          label="Buffer hectares attributed"
          value={`${p.bufferHa} ha`}
          unit="to your sourced volume"
          tone="positive"
        />
      </div>

      <Panel title="Your sourcing" lede="Where this period’s direct-sold tea came from, and the buffer it holds.">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <Field label="Buffer zones" value={p.bufferZones.join(' · ')} />
          <Field label="Water towers" value={p.waterTowers.join(' · ')} />
          <Field label="Source blocks" value={p.blocks.map((b) => b.name).join(' · ')} />
          <Field label="Volume sourced" value={`${p.volumeKg.toLocaleString()} kg made tea`} />
          <Field label="Direct premium paid" value={`+${p.premiumKesPerKg} KES/kg above auction`} />
          <Field label="Buffer attributed" value={`${p.bufferHa} ha under covenant`} />
        </dl>
        <div className="mt-5 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">Volume by source block</p>
          {p.blocks.map((b) => (
            <BarMeter
              key={b.id}
              label={`${b.name} · ${b.bufferZone}`}
              value={b.volumeKg}
              max={maxBlockVolume}
              display={`${b.volumeKg.toLocaleString()} kg`}
            />
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Conservation activity" lede="Fieldwork on the blocks your volume draws from, this month.">
          <dl className="space-y-3 text-[13px]">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-ink-muted">Covenant area held across your blocks</span>
              <span className="font-mono tabular-nums text-ink">{p.conservation.covenantHa.toLocaleString()} ha</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-ink-muted">Boundary patrols this month</span>
              <span className="font-mono tabular-nums text-ink">{p.conservation.patrolsThisMonth}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-ink-muted">Seedlings planted</span>
              <span className="font-mono tabular-nums text-ink">{p.conservation.seedlingsPlanted.toLocaleString()}</span>
            </div>
          </dl>
        </Panel>

        <Panel title="Community impact" lede="Aggregate figures only — no farmer names, phone numbers, or IDs.">
          <dl className="space-y-3 text-[13px]">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-ink-muted">Farmers represented</span>
              <span className="font-mono tabular-nums text-ink">{p.community.farmersRepresented}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-ink-muted">Pluckers in the harvest window</span>
              <span className="font-mono tabular-nums text-ink">{p.community.pluckers.toLocaleString()}</span>
            </div>
            <BarMeter label="Women pluckers" value={p.community.womenPluckersPct} max={100} display={`${p.community.womenPluckersPct}%`} />
            <BarMeter label="Paid via mobile money" value={p.community.paidMobileMoneyPct} max={100} display={`${p.community.paidMobileMoneyPct}%`} />
            <BarMeter label="Settled within the week" value={p.community.settledSameWeekPct} max={100} display={`${p.community.settledSameWeekPct}%`} />
          </dl>
        </Panel>
      </div>

      <Panel title="Environmental data" lede="Canopy, carbon and water across the covenant area your sourcing supports.">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <Field label="NDVI health index" value={`${p.environment.ndviCurrent} (+${ndviDelta} vs baseline)`} />
          <Field label="Carbon stored" value={`${p.environment.carbonTonnesCo2.toLocaleString()} tCO₂e attributed`} />
          <Field label="Catchment yield" value={`+${p.environment.waterChangePct}% vs 2018`} />
        </div>
        <div className="mt-5">
          <Sparkline values={p.environment.ndviSeries} />
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
            {p.environment.ndviQuarters.map((q) => (
              <span key={q}>{q}</span>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Verification records" lede="Field and satellite checks behind each active passport.">
        <ul className="divide-y divide-line">
          {p.verifications.map((v) => (
            <li key={v.id} className="flex flex-wrap items-start gap-x-3 gap-y-1.5 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 inline-flex shrink-0 rounded-full border border-emerald-600/30 bg-emerald-600/[0.10] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-700">
                {v.status}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-ink">
                  Batch #{v.id} · {v.plotId} · {v.standard}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                  Field {v.field.date} · Satellite {v.satellite.date} ({v.satellite.source}) · {v.reference}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title={`Supporting evidence · Batch #${headline.id}`}
        lede="The full Land → Processing chain behind your largest active passport. Batch Lookup opens the same chain for every batch, with downloadable GeoJSON, an EUDR audit certificate, and a passport PDF."
      >
        <BatchProvenanceChain view={redactBatchRecord(headline, 'buyer')} />
      </Panel>
    </div>
  )
}
