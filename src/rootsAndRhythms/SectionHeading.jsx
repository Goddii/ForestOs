import { TYPE } from './tokens'

/** The section title used across the page: a short green rule, then an italic serif heading. */
export default function SectionHeading({ id, children, size = 26 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div aria-hidden="true" style={{ width: 16, height: 1, flexShrink: 0, background: 'rgba(29,185,84,0.6)', animation: 'rr-border-trace 0.8s ease 0.3s both' }} />
      <h2 id={id} style={{ ...TYPE.title, fontSize: `${size}px`, fontStyle: 'italic', fontWeight: 500, textWrap: 'balance' }}>
        {children}
      </h2>
    </div>
  )
}
