import { Check, Minus } from 'lucide-react'
import ContentCard from '../../investor/ui/ContentCard'
import Badge from '../../investor/ui/Badge'
import SectionHeading from '../../investor/SectionHeading'
import { BUYER_TYPE_LABELS } from '../../../data/offtaker/accounts'
import { OFFTAKER_ROLE_CONFIG, PERMISSION_LABELS } from '../../../data/offtaker/roles'
import { useOfftaker } from '../OfftakerWorkspaceContext'
import PageHeader from '../PageHeader'

export default function SettingsPage() {
  const ws = useOfftaker()
  const teamRoles = new Set(ws.account.team.map((seat) => seat.role))

  return (
    <div className="space-y-12">
      <PageHeader title="Organisation settings" description="Your organisation’s account, its team’s roles, and exactly what the portal shares with buyers and what it withholds." />

      <section className="grid gap-4 lg:grid-cols-3">
        <ContentCard className="p-6 lg:col-span-2">
          <SectionHeading title="Organisation" />
          <dl className="grid gap-4 text-compact sm:grid-cols-2">
            {[
              ['Name', ws.org.name],
              ['Buyer type', BUYER_TYPE_LABELS[ws.account.buyerType]],
              ['Market', ws.account.market],
              ['Onboarded', ws.account.onboardedDate],
              ['Supplier', 'Nyayo Tea Zones Development Corporation'],
              ['Organisation id', ws.org.id],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-faint">{label}</dt>
                <dd className="mt-0.5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          {ws.org.isPlaceholder && (
            <p className="mt-5 text-xs text-ink-faint">Demo organisation: a placeholder, not a real customer of NTZDC.</p>
          )}
        </ContentCard>
        <ContentCard className="p-6">
          <SectionHeading title="Team" />
          <ul className="divide-y divide-line">
            {ws.account.team.map((seat) => (
              <li key={seat.role} className="flex items-center justify-between py-2.5 text-compact">
                <span className="text-ink">{OFFTAKER_ROLE_CONFIG[seat.role].label}</span>
                <span className="tabular-nums text-ink-muted">
                  {seat.seats} seat{seat.seats === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ul>
        </ContentCard>
      </section>

      <section>
        <SectionHeading title="Roles and what each can see" description={`You are viewing as ${ws.roleConfig.label}. Roles your organisation has not assigned are shown for reference.`} />
        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-card">
          <table className="w-full min-w-[48rem] border-collapse text-left text-compact">
            <caption className="sr-only">Permissions by role</caption>
            <thead>
              <tr className="border-b border-line bg-canvas font-mono text-label uppercase tracking-label text-ink-faint">
                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                {Object.values(PERMISSION_LABELS).map((label) => (
                  <th key={label} scope="col" className="px-4 py-3 text-center font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(OFFTAKER_ROLE_CONFIG).map(([role, config]) => (
                <tr key={role} className={`border-b border-line last:border-b-0 ${role === ws.role ? 'bg-forest-accent-soft' : ''}`}>
                  <th scope="row" className="px-4 py-3 text-left font-normal">
                    <span className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                      {config.label}
                      {role === ws.role && <Badge tone="verified">You</Badge>}
                      {!teamRoles.has(role) && <Badge tone="neutral">Not assigned</Badge>}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{config.description}</span>
                  </th>
                  {Object.keys(PERMISSION_LABELS).map((permission) => (
                    <td key={permission} className="px-4 py-3 text-center">
                      {config.permissions[permission] ? (
                        <Check className="mx-auto h-4 w-4 text-forest-accent" strokeWidth={2.5} aria-label="Yes" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-ink-faint" strokeWidth={2} aria-label="No" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ContentCard className="p-6">
          <SectionHeading title="Shared with buyers" />
          <ul className="space-y-2.5 text-compact text-ink-muted">
            {ws.policy.visible.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" strokeWidth={2.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </ContentCard>
        <ContentCard className="p-6">
          <SectionHeading title="Never shared with buyers" />
          <ul className="space-y-2.5 text-compact text-ink-muted">
            {ws.policy.withheld.map((item) => (
              <li key={item} className="flex gap-2">
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={2.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </ContentCard>
      </section>
    </div>
  )
}
