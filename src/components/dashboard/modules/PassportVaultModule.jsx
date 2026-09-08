import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, ExternalLink } from 'lucide-react'
import { Panel, BarMeter } from '../DashboardKit'
import { PASSPORTS } from '../../../lib/dashboardData'
import { BATCH } from '../../../lib/mock'
import { downloadConservationPassport } from '../../../lib/passportPdf'

function toBatchRecord(passport) {
  return {
    ...BATCH,
    id: passport.id,
    bufferZone: passport.block,
    region: `${passport.centre}`,
    sourcedVolumeLabel: `${passport.volumeKg.toLocaleString()} kg made tea`,
    hectaresPreserved: (passport.volumeKg / 575).toFixed(1),
    pluckerPremiumKesPerKg: Number(passport.premiumKesPerKg.toFixed(1)),
    verification: {
      ...BATCH.verification,
      plotId: `PASS-${passport.id}`,
      timestamp: `${passport.issued} 09:00 EAT`,
    },
  }
}

export default function PassportVaultModule() {
  const [activeId, setActiveId] = useState(PASSPORTS[0].id)
  const [issued, setIssued] = useState(false)
  const passport = PASSPORTS.find((entry) => entry.id === activeId) ?? PASSPORTS[0]
  const canopyGain = passport.canopyNow - passport.canopy2015

  const handleDownload = () => {
    downloadConservationPassport(toBatchRecord(passport))
    setIssued(true)
  }

  return (
    <div className="space-y-5">
      <header>
        <h2 className="font-display text-2xl text-emerald-950 sm:text-3xl">Digital Conservation Passport Vault</h2>
        <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
          Issue and re-issue the signed batch passport your buyers and auditors receive.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <ul className="space-y-1.5">
          {PASSPORTS.map((entry) => {
            const active = entry.id === activeId
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(entry.id)
                    setIssued(false)
                  }}
                  className={
                    'w-full rounded-lg border px-3 py-2.5 text-left transition-colors ' +
                    (active
                      ? 'border-emerald-600/40 bg-emerald-600/[0.12]'
                      : 'border-line bg-card hover:border-line-strong hover:bg-paper-sunk')
                  }
                >
                  <p className="font-mono text-[12px] text-ink">Batch #{entry.id}</p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">{entry.block}</p>
                </button>
              </li>
            )
          })}
        </ul>

        <Panel
          title={`Batch #${passport.id} passport`}
          lede={`${passport.centre} · issued ${passport.issued}`}
          actions={
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              Download Executive PDF
            </button>
          }
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[12px] sm:grid-cols-3">
            <div>
              <dt className="text-ink-faint">Latitude / Longitude</dt>
              <dd className="mt-1 tabular-nums text-ink">
                {Math.abs(passport.lat).toFixed(3)}° {passport.lat < 0 ? 'S' : 'N'},{' '}
                {passport.lon.toFixed(3)}° E
              </dd>
            </div>
            <div>
              <dt className="text-ink-faint">Collection centre</dt>
              <dd className="mt-1 text-ink">{passport.centre}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Volume</dt>
              <dd className="mt-1 tabular-nums text-ink">{passport.volumeKg.toLocaleString()} kg</dd>
            </div>
          </dl>

          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Canopy density change · 2015 → present
            </p>
            <div className="mt-2 space-y-3">
              <BarMeter label="2015" value={passport.canopy2015} max={100} display={`${passport.canopy2015}%`} tone="muted" />
              <BarMeter label="Present" value={passport.canopyNow} max={100} display={`${passport.canopyNow}%`} tone="emerald" />
            </div>
            <p className="mt-2 text-[12px] text-emerald-700">+{canopyGain} pp canopy recovered on retired plots</p>
          </div>

          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              M-Pesa payment audit IDs
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {passport.mpesaAudit.map((code) => (
                <li
                  key={code}
                  className="rounded-md border border-line bg-paper-sunk px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-ink-muted"
                >
                  {code}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
            <span aria-live="polite">
              {issued ? 'Executive PDF generated in your browser.' : 'Signed prototype export.'}
            </span>
            <Link
              to={`/batch/${passport.id}`}
              className="inline-flex items-center gap-1 text-ink-muted transition-colors hover:text-ink"
            >
              Open consumer view
              <ExternalLink className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </Panel>
      </div>
    </div>
  )
}
