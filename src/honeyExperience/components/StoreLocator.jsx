/**
 * StoreLocator — Section 05 "Where to buy".
 *
 * The chosen direction is an illustrated bee-line map: a stylized vector
 * map of Nairobi (roads, river, forest/tea patch as crisp linework — no
 * tiles, no map API, no backend) with two hive pins. Selecting a store —
 * from the chips or the pin itself — re-draws the amber bee-flight trail
 * from the forest origin to that counter, with a bee riding the path, and
 * swaps the detail card (address, hours, phone, email, Directions →
 * Google Maps).
 *
 * Facts (addresses, hours, phones, email) come verbatim from
 * breesbees.co.ke/store-list. The map is illustrative — labeled as such
 * in the panel — so no coordinates or distances are shown as measured
 * values. MotionConfig reducedMotion="user" plus the `reduced` prop
 * collapse the trail draw, bee, and pulse rings to static states.
 */
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Clock, ExternalLink, Mail, MapPin, Navigation, Phone, TreePine } from 'lucide-react'
import { Card } from './HoneyCard'

const ease = [0.22, 1, 0.36, 1]

const STORE_LIST_URL = 'https://breesbees.co.ke/store-list/'

const HOURS = [
  ['Monday – Friday', '8:00 am – 6:00 pm'],
  ['Saturday', '8:00 am – 4:00 pm'],
]

const STORES = [
  {
    id: 'cbd',
    chip: 'Nairobi CBD',
    name: 'Nairobi CBD Branch',
    tag: 'Moi Avenue · TrustForce Mall',
    address: 'Moi Avenue, TrustForce Mall / Hotel Topaz, 1R, Nairobi',
    phones: ['0114665019'],
    email: 'sales@breesbees.co.ke',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Moi%20Avenue%2C%20TrustForce%20Mall%2C%20Nairobi%2C%20Kenya',
    // % position inside the 360×400 map panel
    x: 64.4,
    y: 64.5,
    trail: 'M44,348 C 96,340 118,322 148,308 C 180,294 206,276 232,258',
  },
  {
    id: 'ruaka',
    chip: 'Ruaka',
    name: 'Ruaka Branch',
    tag: 'Big Five Lounge · GD 4',
    address: 'Next to Big Five Lounge, GD 4, Ruaka',
    phones: ['0725402674', '0716305203'],
    email: 'sales@breesbees.co.ke',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Big%20Five%20Lounge%2C%20Ruaka%2C%20Kenya',
    x: 26.7,
    y: 30,
    trail: 'M44,348 C 56,306 30,258 52,214 C 68,182 82,150 96,120',
  },
]

/* The stylized map — linework only, drawn once, aria-hidden: the pins are
   real buttons on top of it and the detail card carries the content. */
function MapArtwork() {
  const road = { fill: 'none', stroke: '#ffffff', strokeOpacity: 0.1, strokeWidth: 7, strokeLinecap: 'round' }
  const centerline = { fill: 'none', stroke: '#ffffff', strokeOpacity: 0.18, strokeWidth: 1 }
  const label = {
    fill: '#ffffff',
    fillOpacity: 0.55,
    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.12em',
  }

  return (
    <svg viewBox="0 0 360 400" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <pattern id="tea-rows" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(32)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#34d399" strokeOpacity="0.3" strokeWidth="1.5" />
        </pattern>
      </defs>

      {/* survey grid + edge ticks — this panel IS a map, so the grid earns its place */}
      <g stroke="#ffffff" strokeOpacity="0.05">
        {[45, 90, 135, 180, 225, 270, 315].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" />
        ))}
        {[50, 100, 150, 200, 250, 300, 350].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="360" y2={y} />
        ))}
      </g>
      <g stroke="#ffffff" strokeOpacity="0.16">
        {[45, 90, 135, 180, 225, 270, 315].map((x) => (
          <g key={`t${x}`}>
            <line x1={x} y1="0" x2={x} y2="5" />
            <line x1={x} y1="395" x2={x} y2="400" />
          </g>
        ))}
        {[50, 100, 150, 200, 250, 300, 350].map((y) => (
          <g key={`tl${y}`}>
            <line x1="0" y1={y} x2="5" y2={y} />
            <line x1="355" y1={y} x2="360" y2={y} />
          </g>
        ))}
      </g>

      {/* forest + tea patch around the origin */}
      <g>
        <path
          d="M8,368 C 4,336 26,312 58,314 C 86,316 102,334 98,356 C 94,382 66,397 40,395 C 20,393 12,384 8,368 Z"
          fill="#059669"
          fillOpacity="0.14"
        />
        <path
          d="M8,368 C 4,336 26,312 58,314 C 86,316 102,334 98,356 C 94,382 66,397 40,395 C 20,393 12,384 8,368 Z"
          fill="url(#tea-rows)"
        />
        <path
          d="M8,368 C 4,336 26,312 58,314 C 86,316 102,334 98,356 C 94,382 66,397 40,395 C 20,393 12,384 8,368 Z"
          fill="none"
          stroke="#34d399"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </g>

      {/* river */}
      <path
        d="M0,150 C 60,158 110,140 160,168 C 205,194 240,196 300,180 C 324,174 344,172 360,176"
        fill="none"
        stroke="#34d399"
        strokeOpacity="0.3"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* road network */}
      <g>
        <path d="M6,40 C 44,66 74,98 96,120 C 142,166 192,214 232,258" {...road} />
        <path d="M6,40 C 44,66 74,98 96,120 C 142,166 192,214 232,258" {...centerline} />
        <path d="M0,330 C 70,318 150,292 232,258" {...road} />
        <path d="M0,330 C 70,318 150,292 232,258" {...centerline} />
        <path d="M348,30 C 322,96 276,182 232,258" {...road} />
        <path d="M348,30 C 322,96 276,182 232,258" {...centerline} />
        <path d="M156,400 C 176,356 202,298 232,258" {...road} />
        <path d="M156,400 C 176,356 202,298 232,258" {...centerline} />
        {/* CBD street grid */}
        <path d="M196,264 L272,234" fill="none" stroke="#fbbf24" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
        <path d="M246,222 L214,296" fill="none" stroke="#fbbf24" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
        <path d="M228,284 L264,270" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* city blocks */}
      <g fill="#ffffff" fillOpacity="0.05">
        <rect x="200" y="240" width="26" height="13" rx="2" transform="rotate(-21 200 240)" />
        <rect x="240" y="252" width="26" height="13" rx="2" transform="rotate(-21 240 252)" />
        <rect x="214" y="270" width="22" height="11" rx="2" transform="rotate(-21 214 270)" />
      </g>

      {/* labels */}
      <text x="46" y="76" {...label} transform="rotate(40 46 76)">LIMURU RD</text>
      <text x="286" y="110" {...label} transform="rotate(-58 286 110)">THIKA RD</text>
      <text x="42" y="326" {...label} transform="rotate(-10 42 326)">WAIYAKI WAY</text>
      <text x="166" y="352" {...label} transform="rotate(-62 166 352)">NGONG RD</text>
      <text x="238" y="248" {...label} fill="#fbbf24" fillOpacity="0.72" transform="rotate(-21 238 248)">MOI AVE</text>
      <text x="152" y="158" {...label} fill="#6ee7b7" fillOpacity="0.62" transform="rotate(18 152 158)">NAIROBI RIVER</text>

      {/* compass */}
      <g>
        <path d="M326,30 L331,50 L326,45 L321,50 Z" fill="#fbbf24" fillOpacity="0.75" />
        <text x="326" y="63" textAnchor="middle" {...label} fillOpacity="0.6">N</text>
      </g>
    </svg>
  )
}

export default function StoreLocator({ reduced = false }) {
  const [selectedId, setSelectedId] = useState(STORES[0].id)
  const store = STORES.find((entry) => entry.id === selectedId) ?? STORES[0]

  return (
    <div className="mt-5">
      {/* store switcher */}
      <div className="flex gap-2" role="group" aria-label="Choose a store">
        {STORES.map((entry) => {
          const active = entry.id === selectedId
          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedId(entry.id)}
              className={`min-h-11 flex-1 rounded-full border px-3 text-xs font-semibold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950 ${
                active
                  ? 'border-amber-300/60 bg-amber-400 text-emerald-950 shadow-lg shadow-amber-500/20'
                  : 'border-white/10 bg-white/[0.06] text-white/60 hover:text-white'
              }`}
            >
              {entry.chip}
            </button>
          )
        })}
      </div>

      {/* the illustrated map */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
        className="relative mt-3 aspect-[9/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#03312a] via-[#02241c] to-[#01150e]"
      >
        <MapArtwork />

        {/* the bee-flight trail: hint dashes + drawn highlight + rider */}
        <svg viewBox="0 0 360 400" className="absolute inset-0 size-full" aria-hidden="true">
          <path
            d={store.trail}
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            strokeDasharray="3 7"
            strokeLinecap="round"
          />
          <motion.path
            key={store.id}
            d={store.trail}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease }}
            style={{ filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.6))' }}
          />
          {!reduced && (
            <g key={`bee-${store.id}`}>
              <circle r="7" fill="#fbbf24" fillOpacity="0.22" />
              <ellipse cx="-3" cy="-4" rx="2.6" ry="1.7" fill="#ffffff" fillOpacity="0.75" transform="rotate(-28 -3 -4)" />
              <ellipse cx="3" cy="-4" rx="2.6" ry="1.7" fill="#ffffff" fillOpacity="0.75" transform="rotate(28 3 -4)" />
              <circle r="3.4" fill="#fbbf24" />
              <circle cx="0" cy="0" r="3.4" fill="none" stroke="#78350f" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1.6 2.4" />
              <animateMotion dur="5.5s" repeatCount="indefinite" path={store.trail} />
            </g>
          )}
        </svg>

        {/* forest origin marker */}
        <div
          className="absolute flex -translate-x-1/2 flex-col items-center gap-1"
          style={{ left: '12.2%', top: '87%' }}
        >
          <span className="grid size-7 place-items-center rounded-full border-2 border-emerald-950 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.45)]">
            <TreePine className="size-3.5" />
          </span>
          <span className="rounded-full border border-emerald-400/25 bg-emerald-950/85 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">
            Nyayo Tea Zones
          </span>
        </div>

        {/* hive pins */}
        <div className="absolute inset-0" role="group" aria-label="Store locations on the illustrative map">
          {STORES.map((entry) => {
            const active = entry.id === selectedId
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={active}
                aria-label={`${entry.name} — ${entry.address}`}
                onClick={() => setSelectedId(entry.id)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:rounded-full"
                style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
              >
                <motion.span
                  animate={{ scale: active ? 1 : 0.86 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className={`relative grid place-items-center rounded-full border-[3px] border-emerald-950 shadow-lg ${
                    active
                      ? 'size-9 bg-amber-400 text-emerald-950 shadow-amber-500/40'
                      : 'size-8 bg-amber-400/80 text-emerald-950'
                  }`}
                >
                  {active && !reduced && (
                    <span className="absolute -inset-2 animate-ping rounded-full border border-amber-300/50" aria-hidden="true" />
                  )}
                  <MapPin className="size-4 fill-current" />
                </motion.span>
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap ${
                    active
                      ? 'border-amber-300/40 bg-emerald-950/90 text-amber-200'
                      : 'border-white/10 bg-emerald-950/75 text-white/65'
                  }`}
                >
                  {entry.chip}
                </span>
              </button>
            )
          })}
        </div>

        {/* honest label: illustrative, not measured */}
        <span className="absolute right-3 bottom-3 rounded-full border border-white/10 bg-emerald-950/70 px-2 py-0.5 font-mono text-[10px] font-medium text-white/60">
          Illustrative map · not to scale
        </span>
      </motion.div>

      {/* selected store detail */}
      <Card className="mt-3 border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={store.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-xl font-semibold leading-tight">{store.name}</div>
                <div className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber-300">{store.tag}</div>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-400/15 text-amber-300">
                <MapPin className="size-4" />
              </span>
            </div>

            <div className="mt-3 flex gap-2.5 border-t border-white/10 pt-3">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-emerald-300" aria-hidden="true" />
              <p className="text-xs leading-5 text-emerald-100/80">{store.address}</p>
            </div>

            <div className="mt-2.5 flex gap-2.5">
              <Clock className="mt-0.5 size-3.5 shrink-0 text-emerald-300" aria-hidden="true" />
              <div className="flex-1 space-y-1">
                {HOURS.map(([days, time]) => (
                  <div key={days} className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="text-emerald-100/70">{days}</span>
                    <span className="tnum font-mono text-white">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              {store.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="tnum -my-1.5 flex min-h-11 items-center gap-1.5 font-mono text-xs text-white underline-offset-4 transition outline-none hover:text-amber-300 hover:underline focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-amber-400/80"
                >
                  <Phone className="size-3.5 text-emerald-300" aria-hidden="true" /> {phone}
                </a>
              ))}
              <a
                href={`mailto:${store.email}`}
                className="-my-1.5 flex min-h-11 items-center gap-1.5 text-xs text-white/80 underline-offset-4 transition outline-none hover:text-amber-300 hover:underline focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-amber-400/80"
              >
                <Mail className="size-3.5 text-emerald-300" aria-hidden="true" /> {store.email}
              </a>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={store.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="dewdrop liquid-shine inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-amber-400 text-xs font-extrabold text-emerald-950 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-300"
              >
                <Navigation className="size-3.5" /> Directions
                <ArrowUpRight className="size-3.5" />
              </a>
              <a
                href={`tel:${store.phones[0]}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-xs font-bold text-white transition hover:bg-white/15"
              >
                <Phone className="size-3.5" /> Call
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>

      <a
        href={STORE_LIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex min-h-11 items-center gap-1.5 text-xs text-emerald-100/70 underline-offset-4 transition outline-none hover:text-white hover:underline focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-amber-400/80"
      >
        Full store list on breesbees.co.ke
        <ExternalLink className="size-3" aria-hidden="true" />
      </a>
    </div>
  )
}
