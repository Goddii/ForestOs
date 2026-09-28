import { useState } from 'react'
import { useCreator } from '../CreatorContext'
import { PageHeader, SectionTitle } from '../ui'
import { ChoiceCard } from '../../brand/Field'

const NOTIFICATIONS = [
  { id: 'weekly', label: 'Weekly scan summary' },
  { id: 'review', label: 'When ForestOS finishes reviewing an experience' },
  { id: 'story', label: 'When the verified story for your tea is updated' },
]

/**
 * Account and preferences. Notification choices are kept for this session
 * only; nothing is sent, because no messaging backend exists yet.
 */
export default function SettingsPage() {
  const { creator } = useCreator()
  const [enabled, setEnabled] = useState(['weekly', 'review'])
  const toggle = (id) => setEnabled((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]))

  return (
    <div className="max-w-3xl space-y-14">
      <PageHeader title="Settings" />

      <section aria-labelledby="settings-account">
        <SectionTitle>
          <span id="settings-account">Account</span>
        </SectionTitle>
        <dl className="mt-5 divide-y divide-line border-y border-line text-compact">
          {[
            ['Partner', creator.name],
            ['Workspace address', `/creator/${creator.slug}`],
            ['Programme', creator.programme],
            ['Sign-in', 'Not available in the demo'],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
              <dt className="text-ink-faint">{label}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="settings-notify">
        <SectionTitle>
          <span id="settings-notify">Notifications</span>
        </SectionTitle>
        <p className="mt-2 text-compact text-ink-muted">Saved for this session. Nothing is sent from the demo.</p>
        <div className="mt-5 grid gap-2">
          {NOTIFICATIONS.map((item) => (
            <ChoiceCard key={item.id} type="checkbox" checked={enabled.includes(item.id)} onChange={() => toggle(item.id)} value={item.id}>
              <span className="text-compact text-ink">{item.label}</span>
            </ChoiceCard>
          ))}
        </div>
      </section>

      <section aria-labelledby="settings-data">
        <SectionTitle>
          <span id="settings-data">Your data and your fans’ data</span>
        </SectionTitle>
        <ul className="mt-4 grid list-disc gap-2 pl-5 text-compact text-ink-muted">
          <li>Scans are counted without cookies. Visitor numbers are estimates.</li>
          <li>No names, phone numbers or emails of scanners are collected or shown to you.</li>
          <li>Verified ForestOS data can be quoted, never edited, in anything you publish.</li>
        </ul>
      </section>
    </div>
  )
}
