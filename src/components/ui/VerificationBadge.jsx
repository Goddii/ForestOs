import { Fragment } from 'react'
import { ShieldCheck } from 'lucide-react'

/**
 * A verified-record badge: an icon, a headline, a one-line body, and a small
 * mono key/value readout. Originally the batch page's `TransparencyRecord`;
 * generalized so any real, sourced record (a plot verification, a belt-block
 * rollup) can use the same glass-card treatment instead of a bespoke one-off.
 *
 * @param {{ title: string, body: string, fields: Array<{ label: string, value: string }> }} props
 */
export default function VerificationBadge({ title, body, fields }) {
  return (
    <div className="rounded-2xl border border-bone/15 bg-forest-950/40 p-6 backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-400/40 bg-amber-400/10">
            <ShieldCheck className="h-5 w-5 text-amber-400" strokeWidth={2} />
          </span>
          <div>
            <h3 className="font-display text-2xl text-bone">{title}</h3>
            <p className="mt-1 max-w-[44ch] text-[14px] leading-relaxed text-bone-300">{body}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] sm:text-right">
          {fields.map(({ label, value }) => (
            <Fragment key={label}>
              <dt className="text-sage-500">{label}</dt>
              <dd className="text-bone-300">{value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
  )
}
