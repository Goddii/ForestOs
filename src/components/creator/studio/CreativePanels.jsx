import { ArrowDown, ArrowUp, Eye, EyeOff, Lock, Plus, Trash2 } from 'lucide-react'
import Field, { ChoiceCard, inputClass } from '../../brand/Field'
import { HERO_OPTIONS } from '../../../data/creator/assets'
import { findFigureClaims, isSafeHttpUrl, moveSection, toggleSection } from '../../../lib/creator/experience'

// The creative controls of the Studio editor. Each panel edits one part of
// the creative layer and hands the change to `onChange`, which goes through
// the creative-only filter; none of them can reach verified data.

const MAX_CTAS = 4
const CTA_KINDS = { spotify: 'Spotify', social: 'Social', community: 'Community', website: 'Website' }

export function Panel({ title, children, aside }) {
  return (
    <section className="border-t border-line pt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

const linkError = (value) => (value && !isSafeHttpUrl(value) ? 'Use a full web address starting with https://' : null)

export function WordsPanel({ creative, onChange }) {
  const figures = findFigureClaims(`${creative.headline} ${creative.subline} ${creative.narrative}`)
  const figureError = figures.length ? `Impact figures (${figures.join(', ')}) come from ForestOS records. Remove them from your copy.` : null
  return (
    <Panel title="Your words">
      <div className="grid gap-5">
        <Field label="Headline" error={creative.headline.trim() ? null : 'Add a headline.'}>
          {(props) => <input {...props} className={inputClass} value={creative.headline} maxLength={80} onChange={(event) => onChange({ headline: event.target.value })} />}
        </Field>
        <Field label="Subline" optional>
          {(props) => <input {...props} className={inputClass} value={creative.subline} maxLength={140} onChange={(event) => onChange({ subline: event.target.value })} />}
        </Field>
        <Field label="Your story" helper="Tell it your way. Numbers about hectares, trees or patrols are added from the verified record." error={figureError} optional>
          {(props) => <textarea {...props} rows={4} className={inputClass} value={creative.narrative} maxLength={600} onChange={(event) => onChange({ narrative: event.target.value })} />}
        </Field>
      </div>
    </Panel>
  )
}

export function SectionsPanel({ creative, template, onChange }) {
  const labelFor = (key) => template.sections.find((section) => section.key === key)
  return (
    <Panel title="Narrative structure">
      <ol className="grid gap-2">
        {creative.sectionOrder.map((key, index) => {
          const section = labelFor(key)
          if (!section) return null
          const isVerified = section.layer === 'verified'
          const isHidden = creative.hiddenSections.includes(key)
          return (
            <li key={key} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${isHidden ? 'border-dashed border-line text-ink-faint' : 'border-line'}`}>
              <span className="w-5 text-xs tabular-nums text-ink-faint">{index + 1}</span>
              <span className="flex-1 text-compact font-medium text-ink">{section.label}</span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 text-xs text-forest-accent-dark">
                  <Lock className="h-3 w-3" aria-hidden="true" /> Verified
                </span>
              )}
              <IconButton label={`Move ${section.label} up`} disabled={index === 0} onClick={() => onChange({ sectionOrder: moveSection(creative.sectionOrder, key, -1) })} icon={ArrowUp} />
              <IconButton
                label={`Move ${section.label} down`}
                disabled={index === creative.sectionOrder.length - 1}
                onClick={() => onChange({ sectionOrder: moveSection(creative.sectionOrder, key, 1) })}
                icon={ArrowDown}
              />
              <IconButton
                label={isVerified ? `${section.label} always shows` : isHidden ? `Show ${section.label}` : `Hide ${section.label}`}
                disabled={isVerified}
                onClick={() => onChange({ hiddenSections: toggleSection(creative.hiddenSections, key, template) })}
                icon={isHidden ? EyeOff : Eye}
              />
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}

function IconButton({ label, onClick, icon: Icon, disabled = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-canvas hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

export function MediaPanel({ creative, onChange }) {
  return (
    <Panel title="Imagery and music">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Hero image</legend>
        <p className="mt-0.5 text-xs text-ink-muted">Your campaign art, or photography ForestOS has approved for use.</p>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {HERO_OPTIONS.map((asset) => {
            const isChosen = creative.heroAssetId === asset.id
            return (
              <label
                key={asset.id}
                className={`relative cursor-pointer overflow-hidden rounded-lg ring-offset-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500/50 ${isChosen ? 'ring-2 ring-forest-accent' : ''}`}
              >
                <input type="radio" name="hero" value={asset.id} checked={isChosen} onChange={() => onChange({ heroAssetId: asset.id })} className="sr-only" />
                <img src={asset.src} alt={asset.alt} className="aspect-square w-full object-cover" loading="lazy" />
                <span className="sr-only">{asset.title}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <Field className="mt-6" label="Music link" helper="A Spotify artist, album or track link plays in the music section." error={linkError(creative.musicLink)} optional>
        {(props) => (
          <input
            {...props}
            type="url"
            className={inputClass}
            placeholder="https://open.spotify.com/…"
            value={creative.musicLink ?? ''}
            onChange={(event) => onChange({ musicLink: event.target.value || null })}
          />
        )}
      </Field>
    </Panel>
  )
}

export function LinksPanel({ creative, onChange }) {
  const update = (id, change) => onChange({ ctas: creative.ctas.map((cta) => (cta.id === id ? { ...cta, ...change } : cta)) })
  const remove = (id) => onChange({ ctas: creative.ctas.filter((cta) => cta.id !== id) })
  const add = () => {
    const serial = creative.ctas.reduce((max, cta) => Math.max(max, Number(cta.id.replace(/\D/g, '')) || 0), 0) + 1
    onChange({ ctas: [...creative.ctas, { id: `cta-${serial}`, label: '', href: '', kind: 'website' }] })
  }
  return (
    <Panel title="Calls to action" aside={<span className="text-xs text-ink-faint">{creative.ctas.length} of {MAX_CTAS}</span>}>
      {creative.ctas.length === 0 && <p className="rounded-xl bg-canvas px-4 py-3 text-compact text-ink-muted">No links yet. Add where scanners should go next: your music, socials, an event or the community.</p>}
      <ul className="grid gap-4">
        {creative.ctas.map((cta) => (
          <li key={cta.id} className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Field label="Button label" error={cta.label.trim() ? null : 'Add a label.'}>
              {(props) => <input {...props} className={inputClass} value={cta.label} maxLength={32} onChange={(event) => update(cta.id, { label: event.target.value })} />}
            </Field>
            <Field label="Link" error={cta.href ? linkError(cta.href) : 'Add a link.'}>
              {(props) => <input {...props} type="url" className={inputClass} placeholder="https://" value={cta.href} onChange={(event) => update(cta.id, { href: event.target.value })} />}
            </Field>
            <div className="flex items-end gap-2">
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Kind
                <select className={inputClass} value={cta.kind} onChange={(event) => update(cta.id, { kind: event.target.value })}>
                  {Object.entries(CTA_KINDS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <IconButton label={`Remove ${cta.label || 'link'}`} onClick={() => remove(cta.id)} icon={Trash2} />
            </div>
          </li>
        ))}
      </ul>
      {creative.ctas.length < MAX_CTAS && (
        <button type="button" onClick={add} className="mt-4 inline-flex items-center gap-1.5 text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add a link
        </button>
      )}
    </Panel>
  )
}

export function StatementsPanel({ creative, statements, onChange }) {
  const toggle = (id) =>
    onChange({ statementIds: creative.statementIds.includes(id) ? creative.statementIds.filter((entry) => entry !== id) : [...creative.statementIds, id] })
  return (
    <Panel title="Approved statements to quote">
      <p className="-mt-2 mb-3 text-xs text-ink-muted">ForestOS has approved these word for word. They appear in the verified impact section.</p>
      <div className="grid gap-2">
        {statements.map((statement) => (
          <ChoiceCard key={statement.id} type="checkbox" checked={creative.statementIds.includes(statement.id)} onChange={() => toggle(statement.id)} value={statement.id}>
            <span className="text-compact text-ink">{statement.text}</span>
          </ChoiceCard>
        ))}
      </div>
    </Panel>
  )
}
