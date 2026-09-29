import { AnimatedHeadline, Reveal } from './Reveal'
import { FONT_SERIF, TYPE } from './tokens'

export default function HeroHeadline() {
  return (
    <section style={{ padding: '28px 20px 0', position: 'relative' }}>
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <h1
          aria-label="Roots & Rhythms"
          style={{
            fontFamily: FONT_SERIF,
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            filter: 'brightness(1.5) saturate(1.3)',
          }}
        >
          <AnimatedHeadline text="ROOTS" delay={0.1} />
          <br />
          <AnimatedHeadline text="&" delay={0.5} line={1} />
          <br />
          <AnimatedHeadline text="RHYTHMS" delay={0.7} line={2} />
        </h1>
      </div>
      <Reveal animation="fade-up" delay={0.9}>
        <p style={TYPE.lede}>
          Sip your tea. Listen to the forest.<br />Leave a trace.
        </p>
      </Reveal>
    </section>
  )
}
