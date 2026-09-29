import { useState } from 'react'
import { Check, Minus, UserPlus } from 'lucide-react'
import { BRAND_PERMISSION_LABELS, BRAND_ROLE_CONFIG } from '../../../data/brand/roles'
import { useBrand } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import SectionHeading from '../../investor/SectionHeading'
import DataTable from '../../offtaker/DataTable'
import Badge from '../../investor/ui/Badge'
import ActionButton from '../../investor/ui/ActionButton'
import Field, { inputClass } from '../Field'
import PermissionNote from '../PermissionNote'

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

function InviteForm() {
  const ws = useBrand()
  const [form, setForm] = useState({ name: '', title: '', role: 'marketing' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) return setError('Enter the person’s name.')
    setError('')
    ws.inviteMember({ name: form.name.trim(), title: form.title.trim() || BRAND_ROLE_CONFIG[form.role].label, role: form.role })
    setSent(form.name.trim())
    return setForm({ name: '', title: '', role: form.role })
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 rounded-2xl border border-line bg-card p-5 shadow-card md:grid-cols-[1fr_1fr_12rem_auto] md:items-end">
      <Field label="Name" error={error || null}>
        {(props) => <input {...props} className={inputClass} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />}
      </Field>
      <Field label="Job title" optional>
        {(props) => <input {...props} className={inputClass} value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />}
      </Field>
      <Field label="Role">
        {(props) => (
          <select {...props} className={inputClass} value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
            {Object.entries(BRAND_ROLE_CONFIG).map(([key, role]) => (
              <option key={key} value={key}>
                {role.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <ActionButton type="submit" variant="primary" icon={UserPlus} iconPosition="left">
        Invite
      </ActionButton>
      {sent && (
        <p className="text-compact text-ink-muted md:col-span-4" role="status">
          Invitation recorded for {sent}. No email is sent in this demo.
        </p>
      )}
    </form>
  )
}

export default function TeamPage() {
  const ws = useBrand()
  const roleKeys = Object.keys(BRAND_ROLE_CONFIG)
  return (
    <div className="space-y-12">
      <PageHeader title="Team" description={`The people in ${ws.org.name}’s workspace and what each role can do. No role can edit ForestOS verified data.`} />

      <section aria-label="Members" className="space-y-4">
        <DataTable
          caption="Team members"
          rowKey={(row) => row.id}
          rows={ws.team}
          columns={[
            {
              key: 'name',
              header: 'Person',
              cell: (row) => (
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas-sunk text-compact font-semibold text-ink-muted" aria-hidden="true">
                    {initials(row.name)}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{row.name}</span>
                    <span className="text-compact text-ink-muted">{row.title}</span>
                  </span>
                </span>
              ),
            },
            { key: 'role', header: 'Role', cell: (row) => BRAND_ROLE_CONFIG[row.role].label },
            { key: 'status', header: 'Status', cell: (row) => <Badge tone={row.status === 'active' ? 'live' : 'neutral'}>{row.status === 'active' ? 'Active' : 'Invited'}</Badge> },
            { key: 'seen', header: 'Last active', cell: (row) => <span className="font-mono text-compact">{row.lastActive ?? 'Not yet'}</span> },
          ]}
        />
        {ws.permissions.manageTeam ? <InviteForm /> : <PermissionNote permission="manageTeam" />}
      </section>

      <section aria-label="Roles and permissions">
        <SectionHeading title="Roles and what each can do" description={`You are viewing as ${ws.roleConfig.label}.`} />
        <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-card">
          <table className="w-full min-w-[48rem] border-collapse text-left text-compact">
            <caption className="sr-only">Permissions by role</caption>
            <thead>
              <tr className="border-b border-line bg-canvas font-mono text-label uppercase tracking-label text-ink-faint">
                <th scope="col" className="px-4 py-3 font-medium">
                  Permission
                </th>
                {roleKeys.map((key) => (
                  <th key={key} scope="col" className={`px-4 py-3 text-center font-medium ${key === ws.role ? 'text-forest-accent-dark' : ''}`}>
                    {BRAND_ROLE_CONFIG[key].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(BRAND_PERMISSION_LABELS).map(([permission, label]) => (
                <tr key={permission} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 font-normal text-ink">
                    {label}
                  </th>
                  {roleKeys.map((key) => {
                    const allowed = BRAND_ROLE_CONFIG[key].permissions[permission]
                    return (
                      <td key={key} className={`px-4 py-3 text-center ${key === ws.role ? 'bg-forest-accent-soft/40' : ''}`}>
                        {allowed ? (
                          <Check className="mx-auto h-4 w-4 text-forest-accent" strokeWidth={2.5} aria-label="Allowed" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-ink-faint" aria-label="Not allowed" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
