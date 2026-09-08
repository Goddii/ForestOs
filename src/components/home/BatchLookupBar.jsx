import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, QrCode } from 'lucide-react'

/**
 * "Enter Batch ID or Scan Code" field. On submit it routes straight to
 * `/batch/<input>` — the same view a scanned QR code opens.
 *
 * `variant="compact"` is the demoted macro-home treatment: a ghost field with a
 * text submit, sitting under the primary "Explore the belt" call to action.
 */
export default function BatchLookupBar({ variant = 'default' }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const compact = variant === 'compact'

  const handleSubmit = (event) => {
    event.preventDefault()
    const id = value.trim()
    if (!id) return
    navigate(`/batch/${encodeURIComponent(id)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        'flex w-full items-center gap-2 rounded-full border border-bone/20 bg-forest-950/60 backdrop-blur-md transition-colors focus-within:border-amber-400/60 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-amber-400/70 ' +
        (compact ? 'mt-2 p-1 pl-4' : 'mx-auto max-w-xl p-1.5 pl-5')
      }
    >
      <QrCode
        className={
          'shrink-0 text-sage-500 ' + (compact ? 'h-3.5 w-3.5' : 'h-4 w-4')
        }
        strokeWidth={2}
        aria-hidden="true"
      />
      <input
        id={inputId}
        name="batchId"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={compact ? 'Batch ID' : 'Enter Batch ID or Scan Code'}
        aria-label="Batch ID or scan code"
        aria-describedby={hintId}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        className={
          'min-w-0 flex-1 bg-transparent font-mono text-bone placeholder:text-sage-500 focus:outline-none ' +
          (compact ? 'py-2 text-[13px]' : 'py-2.5 text-sm')
        }
      />
      <span id={hintId} className="sr-only">
        For example 802 or KND-2291
      </span>
      {compact ? (
        <button
          type="submit"
          className="shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-sage-300 transition-colors hover:text-bone"
        >
          Trace
        </button>
      ) : (
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-forest-950 transition-colors duration-200 hover:bg-amber-500"
        >
          Trace
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
    </form>
  )
}
