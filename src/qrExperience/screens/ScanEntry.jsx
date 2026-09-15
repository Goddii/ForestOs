import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import HowItWorksModal from '../HowItWorksModal'

// A fixed, deterministic 9x9 module pattern standing in for a real product QR
// code — this is a simulated scan (see `QrExperienceView`'s doc comment), not
// a decodable code, so it only needs to read as "a real activation surface"
// rather than placeholder dev art. Corners get the three finder squares a
// real QR always carries; the rest is a fixed pseudo-random fill.
const FINDER = new Set(['0,0', '0,1', '1,0', '1,1', '0,7', '0,8', '1,7', '1,8', '7,0', '8,0', '7,1', '8,1'])
const FILL_SEED = [
  1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1,
]

function ScanMark() {
  let cursor = 0
  const cells = []
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const key = `${row},${col}`
      const isFinder = FINDER.has(key)
      const on = isFinder || FILL_SEED[cursor % FILL_SEED.length] === 1
      if (!isFinder) cursor += 1
      cells.push(
        <span
          key={key}
          className="rounded-[1px]"
          style={{ backgroundColor: on ? 'var(--color-bone)' : 'transparent' }}
        />,
      )
    }
  }
  return (
    <div className="relative mx-auto grid h-44 w-44 grid-cols-9 grid-rows-9 gap-[2px] rounded-2xl border border-bone/20 bg-forest-950/60 p-4 sm:h-52 sm:w-52">
      {cells}
    </div>
  )
}

export default function ScanEntry({ copy, media, onEnter }) {
  const reduced = usePrefersReducedMotion()
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  return (
    <div className="relative flex min-h-dvh flex-col">
      <video
        className="fixed inset-0 -z-10 h-full w-full object-cover"
        src={media.scanLoop}
        poster={media.scanPoster}
        autoPlay={!reduced}
        loop
        muted
        playsInline
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 15%, transparent 30%, rgba(8,20,14,0.55) 100%),' +
            'linear-gradient(to bottom, rgba(8,20,14,0.45) 0%, transparent 20%, transparent 55%, rgba(8,20,14,0.92) 100%)',
        }}
      />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-sage-300">{copy.scanKicker}</p>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScanMark />
        </motion.div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl text-bone sm:text-4xl">{copy.scanHeadline}</h1>
          <p className="text-[15px] leading-relaxed text-bone-300">{copy.scanBody}</p>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-forest-950 transition-transform active:scale-[0.98]"
        >
          Enter experience
          <ArrowRight className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => setHowItWorksOpen(true)}
          className="text-[13px] font-medium text-sage-300 underline decoration-sage-300/40 underline-offset-4 transition-colors hover:text-bone"
        >
          How it works
        </button>
      </div>

      <HowItWorksModal open={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
    </div>
  )
}
