import Reveal from '../Reveal'

/**
 * The shared section header — an optional mono metadata line, a serif H2 and a
 * lede, revealed together on scroll. Used across the globe sections, partner
 * showcase and impact strip so headline styling stays identical everywhere.
 *
 * The `eyebrow` is a sage metadata readout, not a decorative kicker: pass a
 * real, specific value (a count, a span, a status) or omit it.
 */
export default function SectionIntro({ eyebrow, title, body, className = '', titleClassName = '' }) {
  return (
    <Reveal className={className}>
      {eyebrow && (
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-sage-500">{eyebrow}</p>
      )}
      <h2
        className={
          'font-display text-3xl leading-[1.08] text-bone sm:text-5xl ' +
          (eyebrow ? 'mt-3 ' : '') +
          titleClassName
        }
      >
        {title}
      </h2>
      {body && (
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-sage-300">{body}</p>
      )}
    </Reveal>
  )
}
