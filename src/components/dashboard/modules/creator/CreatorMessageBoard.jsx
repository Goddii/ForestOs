import { useMemo, useState } from 'react'
import { Send } from 'lucide-react'

const TODAY = '2026-09-07'
const MAX_LEN = 280

// Community message board: the artist drafts a note and publishes it to every
// buyer who scans a tag. Publishing is prototype-only — the new note is prepended
// to the local list with today's date and zero accrued reach.
export default function CreatorMessageBoard({ messages }) {
  const [draft, setDraft] = useState('')
  const [published, setPublished] = useState(messages)
  const [justSent, setJustSent] = useState(false)

  const remaining = MAX_LEN - draft.length
  const canPublish = draft.trim().length >= 12 && remaining >= 0

  const totalReach = useMemo(
    () => published.reduce((s, m) => s + m.scanReach, 0),
    [published],
  )

  const publish = () => {
    if (!canPublish) return
    setPublished((prev) => [
      {
        id: `MSG-${String(prev.length + 1).padStart(2, '0')}`,
        body: draft.trim(),
        publishedDate: TODAY,
        scanReach: 0,
      },
      ...prev,
    ])
    setDraft('')
    setJustSent(true)
  }

  return (
    <div>
      <label htmlFor="creator-message" className="font-medium text-[13px] text-ink">
        New message to scan holders
      </label>
      <textarea
        id="creator-message"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
          setJustSent(false)
        }}
        rows={3}
        maxLength={MAX_LEN}
        placeholder="Share a field note, a drop announcement, or where the conservation money went this month…"
        className="mt-2 w-full resize-y rounded-lg border border-line bg-card px-3 py-2 text-[13px] leading-relaxed text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          {remaining} characters left · reaches {totalReach.toLocaleString()} scans lifetime
        </span>
        <button
          type="button"
          onClick={publish}
          disabled={!canPublish}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Publish to audience
        </button>
      </div>

      {justSent && (
        <p
          className="mt-3 rounded-lg border border-emerald-700/30 bg-emerald-600/[0.08] px-3 py-2 text-[13px] text-ink"
          aria-live="polite"
        >
          Published (prototype) — the note is now served to buyers when they scan a tag.
        </p>
      )}

      <ol className="mt-5 divide-y divide-line border-t border-line">
        {published.map((m) => (
          <li key={m.id} className="py-4 first:pt-5">
            <p className="text-[13px] leading-relaxed text-ink">{m.body}</p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
              {m.publishedDate} · {m.id} ·{' '}
              {m.scanReach > 0 ? `${m.scanReach.toLocaleString()} scans reached` : 'reach accruing'}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
