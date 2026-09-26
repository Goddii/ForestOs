import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import { BRAND_SEGMENT_LABELS } from '../../../data/brand/accounts'
import { BRAND_DATA_POLICY } from '../../../data/brand/roles'
import { PLACEHOLDER_BATCH_ID } from '../../../data/brand/experiences'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import ContentCard from '../../investor/ui/ContentCard'
import BrandMark from '../BrandMark'

const NOTIFICATIONS = [
  ['claimVerdicts', 'A claim is approved, needs rewording or cannot be made', true],
  ['lotVerified', 'A lot your products use is verified or flagged', true],
  ['weeklyScans', 'Weekly scan summary', false],
  ['publishes', 'Someone publishes or unpublishes an experience', true],
]

const PUBLISH_RULES = [
  'Every experience is connected to a product and a verified lot.',
  'Only statements approved for that lot’s records can be shown.',
  'A story that repeats an unapproved claim cannot be published.',
  'Only brand leads and workspace admins can publish.',
]

function Swatch({ colour, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-lg border border-line" style={{ backgroundColor: colour }} aria-hidden="true" />
      <span>
        <span className="block text-compact text-ink">{label}</span>
        <span className="font-mono text-xs uppercase text-ink-faint">{colour}</span>
      </span>
    </div>
  )
}

export default function SettingsPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const [notify, setNotify] = useState(() => Object.fromEntries(NOTIFICATIONS.map(([key, , on]) => [key, on])))

  return (
    <div className="space-y-12">
      <PageHeader title="Settings" description="Your brand profile and kit, how QR codes resolve, publishing rules, privacy and notifications." />

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Brand profile and kit">
        <ContentCard className="p-6 lg:col-span-2">
          <SectionHeading title="Brand profile" />
          <dl className="grid gap-4 text-compact sm:grid-cols-2">
            {[
              ['Name', ws.org.name],
              ['Type', BRAND_SEGMENT_LABELS[ws.account.segment]],
              ['Where you sell or serve', ws.account.footprint],
              ['Packer', ws.packer.name],
              ['Onboarded', ws.account.onboardedDate],
              ['Workspace id', ws.org.id],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-faint">{label}</dt>
                <dd className="mt-0.5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {ws.org.isPlaceholder && <p className="mt-5 text-xs text-ink-faint">Demo brand: a fictional placeholder, not a real company.</p>}
        </ContentCard>
        <ContentCard className="p-6">
          <SectionHeading title="Brand kit" />
          <div className="flex items-center gap-3">
            <BrandMark kit={ws.kit} size={48} />
            <span className="text-sm font-bold tracking-[0.2em] text-ink">{ws.kit.wordmark}</span>
          </div>
          <div className="mt-5 space-y-3">
            <Swatch colour={ws.kit.primary} label="Primary" />
            <Swatch colour={ws.kit.accent} label="Accent" />
            <Swatch colour={ws.kit.ink} label="Text on primary" />
          </div>
          <p className="mt-4 text-xs text-ink-faint">Used on pack renders and as the default on new QR experiences.</p>
        </ContentCard>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <ContentCard className="p-6">
          <SectionHeading title="QR codes" />
          <p className="text-compact leading-relaxed text-ink">
            Each experience has its own code. Until brand-specific consumer templates ship, every code opens the public ForestOS record for batch #{PLACEHOLDER_BATCH_ID},
            tagged with the experience so scans are counted against it.
          </p>
        </ContentCard>
        <ContentCard className="p-6">
          <SectionHeading title="Publishing rules" />
          <ul className="space-y-2 text-compact text-ink">
            {PUBLISH_RULES.map((rule) => (
              <li key={rule} className="flex gap-2">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                {rule}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-faint">Set by ForestOS for every brand.</p>
        </ContentCard>
        <ContentCard className="p-6">
          <SectionHeading title="Privacy of scan data" />
          <ul className="space-y-2 text-compact text-ink">
            {BRAND_DATA_POLICY.analyticsNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-accent" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </ContentCard>
        <ContentCard className="p-6">
          <SectionHeading title="Notifications" />
          <ul className="space-y-3">
            {NOTIFICATIONS.map(([key, label]) => (
              <li key={key}>
                <label className="flex items-start gap-3 text-compact text-ink">
                  <input
                    type="checkbox"
                    checked={notify[key]}
                    onChange={(event) => setNotify((prev) => ({ ...prev, [key]: event.target.checked }))}
                    className="mt-0.5 h-4 w-4 accent-[var(--color-forest-accent)]"
                  />
                  {label}
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-faint">Kept for this session only; nothing is emailed in the demo.</p>
        </ContentCard>
      </div>

      <Link to={path('content')} className="inline-flex items-center gap-1 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
        What your brand controls and what ForestOS controls <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
