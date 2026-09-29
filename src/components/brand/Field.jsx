import { useId } from 'react'

// Form controls for the portal's create and edit flows: label above, helper
// text under the label, error under the control and tied to it with
// aria-describedby. One input style everywhere.

export const inputClass =
  'w-full rounded-lg border border-line-strong bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 hover:border-ink-faint focus-visible:border-forest-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-faint aria-[invalid=true]:border-danger'

/**
 * @param {{
 *   label: string,
 *   helper?: string,
 *   error?: string | null,
 *   optional?: boolean,
 *   children: (props: { id: string, 'aria-describedby'?: string, 'aria-invalid'?: boolean }) => import('react').ReactNode,
 *   className?: string,
 * }} props
 */
export default function Field({ label, helper, error, optional = false, children, className = '' }) {
  const id = useId()
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const describedBy = [helper && helperId, error && errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={`grid content-start gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-faint">Optional</span>}
      </label>
      {helper && (
        <p id={helperId} className="-mt-0.5 text-compact leading-relaxed text-ink-muted">
          {helper}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p id={errorId} className="text-compact font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * A group of mutually exclusive choices laid out as selectable cards.
 *
 * @param {{ legend: string, helper?: string, error?: string | null, children: import('react').ReactNode, className?: string }} props
 */
export function ChoiceGroup({ legend, helper, error, children, className = '' }) {
  const id = useId()
  const describedBy = [helper && `${id}-helper`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <fieldset className={`grid gap-2 ${className}`} aria-describedby={describedBy}>
      <legend className="text-sm font-semibold text-ink">{legend}</legend>
      {helper && (
        <p id={`${id}-helper`} className="-mt-1 text-compact leading-relaxed text-ink-muted">
          {helper}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-compact font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

/** Card-style radio or checkbox. The whole card is the hit target. */
export function ChoiceCard({ type = 'radio', name, checked, onChange, disabled = false, children, value }) {
  return (
    <label
      className={`relative flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500/40 ${
        checked ? 'border-forest-accent bg-forest-accent-soft/60' : 'border-line hover:border-ink-faint'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-forest-accent)]" />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  )
}
