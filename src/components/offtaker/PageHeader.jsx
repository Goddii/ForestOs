/**
 * Every portal page opens with one visible <h1> and a sentence saying what
 * the page answers. Sans-serif: the serif is kept for the Overview's
 * organisation name only (DESIGN.md, investor console rule).
 *
 * @param {{ title: string, description?: string, meta?: import('react').ReactNode, actions?: import('react').ReactNode }} props
 */
export default function PageHeader({ title, description, meta, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {meta && <div className="mb-2 flex flex-wrap items-center gap-2">{meta}</div>}
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[2.1rem]">{title}</h1>
        {description && <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
