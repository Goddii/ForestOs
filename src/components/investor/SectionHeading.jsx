/**
 * @param {{ eyebrow?: string, title: string, description?: string, action?: import('react').ReactNode }} props
 */
export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">{eyebrow}</p>
        )}
        <h2 className="mt-1.5 font-sans text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">{title}</h2>
        {description && (
          <p className="mt-2.5 max-w-[62ch] text-[14px] leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </div>
  )
}
