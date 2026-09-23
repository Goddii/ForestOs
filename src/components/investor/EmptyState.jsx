import { Inbox } from 'lucide-react'

/**
 * Reusable empty state for data-heavy investor pages. Never populated with
 * invented figures just to look full (build brief §39).
 *
 * @param {{ message: string, icon?: import('lucide-react').LucideIcon }} props
 */
export default function EmptyState({ message, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center">
      <Icon className="h-6 w-6 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
      <p className="max-w-[38ch] text-[13px] leading-relaxed text-ink-muted">{message}</p>
    </div>
  )
}
