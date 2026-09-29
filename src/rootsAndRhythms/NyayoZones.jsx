import { PLATFORM } from '../lib/platformData'
import { Reveal } from './Reveal'
import SectionHeading from './SectionHeading'
import { TYPE } from './tokens'

const FOREST_IMAGE = '/media/forests/mau.jpg'

// Source: `PLATFORM.tagline` — "940 Kilometres of Protected Forest Edge. 16 Counties.
// Five Water Towers." Illustrative demo figures, disclosed under the copy.
const BELT_FACT = PLATFORM.tagline

/** Who Nyayo Tea Zones is and the conservation work the tea belt does. */
export default function NyayoZones() {
  return (
    <section aria-labelledby="rr-nyayo-title" style={{ padding: '28px 20px 0' }}>
      <Reveal animation="scale-in" delay={0.05}>
        <figure style={{ position: 'relative', margin: 0, height: '250px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <img
            src={FOREST_IMAGE}
            alt="A shaded stream under ferns in the Mau Forest Complex, sunlight breaking across the water"
            width={1000}
            height={563}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '38% center' }}
          />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,25,16,0.95) 0%, rgba(11,25,16,0.55) 42%, transparent 75%)' }} />
          <figcaption style={{ position: 'absolute', left: 20, right: 20, bottom: 18 }}>
            <SectionHeading id="rr-nyayo-title" size={34}>Nyayo Tea Zones</SectionHeading>
            <p style={{ ...TYPE.lede, marginTop: '6px', paddingLeft: '26px' }}>Tea that guards the forest edge.</p>
          </figcaption>
        </figure>
      </Reveal>

      <div style={{ padding: '22px 4px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Reveal animation="fade-up" delay={0.05}>
          <p style={TYPE.body}>
            The Nyayo Tea Zones Development Corporation grows tea as a buffer around Kenya&apos;s
            forests. Smallholder farms line the boundary, so the families who pick the leaf are
            the ones who hold the line between field and forest.
          </p>
        </Reveal>
        <Reveal animation="fade-up" delay={0.12}>
          <p style={TYPE.body}>
            The belt wraps five great forest blocks, the water towers that feed Kenya&apos;s
            major rivers. Conservation is the daily work: covenants on the forest, patrols on
            the edge, and seedlings back in the ground.
          </p>
        </Reveal>
        <Reveal animation="fade-up" delay={0.18}>
          <p style={{ ...TYPE.caption, fontSize: '19px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.35 }}>
            {BELT_FACT}
          </p>
          <p style={{ ...TYPE.small, marginTop: '6px' }}>Illustrative demo figures.</p>
        </Reveal>
      </div>
    </section>
  )
}
