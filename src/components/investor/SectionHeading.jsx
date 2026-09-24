/**
 * A section's title, optional one-paragraph description and optional action.
 * No eyebrow label above the title: the heading carries its own weight.
 *
 * @param {{ title: string, description?: string, action?: import('react').ReactNode }} props
 */
export default function SectionHeading({ title, description, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="font-sans text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2.5 max-w-[62ch] text-sm leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </div>
  )
}
