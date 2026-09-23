import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { imgArrowDown, imgScanQrCode } from '../assets'
import { Shimmer, SplitText } from '../fx'
import { BottomAction, ChapterIndicator, FOCUS_RING, Reveal, Screen, STAGGER, StatusBar, useLoopsEnabled } from '../chrome'

const SYNC_MS = 1400
const ADVANCE_AFTER_SYNC_MS = 700
const RIPPLE_COUNT = 3
const RIPPLE_SECONDS = 2.8
const PORTAL_LABELS = { idle: 'SCAN TO SYNC', syncing: 'SYNCING…', synced: 'SYNCED ✓' }

/** Radar ripples radiating from the portal while it waits for a tap. */
function PortalRipples() {
  const isEnabled = useLoopsEnabled()
  if (!isEnabled) return null
  return Array.from({ length: RIPPLE_COUNT }, (_, index) => (
    <motion.span
      key={index}
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full border border-[rgba(0,255,135,0.35)]"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: 1.45, opacity: [0, 0.6, 0] }}
      transition={{ duration: RIPPLE_SECONDS, delay: (index * RIPPLE_SECONDS) / RIPPLE_COUNT, ease: 'easeOut', repeat: Infinity }}
    />
  ))
}

/** Laser line sweeping the QR glyph; faster while syncing. */
function ScanLine({ isFast }) {
  const isEnabled = useLoopsEnabled()
  if (!isEnabled) return null
  return (
    <motion.span
      aria-hidden
      className="absolute inset-x-[6px] h-[2px] rounded-full bg-[#00ff87] shadow-[0_0_10px_#00ff87]"
      initial={{ top: '12%', opacity: 0 }}
      animate={{ top: ['12%', '86%', '12%'], opacity: [0, 1, 0] }}
      transition={{ duration: isFast ? 0.8 : 2.4, ease: 'easeInOut', repeat: Infinity }}
    />
  )
}

function BobbingArrow() {
  const isEnabled = useLoopsEnabled()
  return (
    <motion.img
      alt=""
      className="block size-[20px]"
      src={imgArrowDown}
      animate={isEnabled ? { y: [0, 4, 0] } : { y: 0 }}
      transition={isEnabled ? { duration: 1.6, ease: 'easeInOut', repeat: Infinity } : { duration: 0.2 }}
    />
  )
}

/** CH. 01 — Figma "scan-entry" (node 3:10). Tapping the portal runs a sync, then enters the forest. */
export default function ScanEntry({ onNext }) {
  const [syncState, setSyncState] = useState('idle')
  // The parent recreates onNext on every render (it re-renders on scroll);
  // read it through a ref so the sync timer isn't restarted by those renders.
  const onNextRef = useRef(onNext)
  useEffect(() => {
    onNextRef.current = onNext
  }, [onNext])

  useEffect(() => {
    if (syncState === 'idle') return undefined
    const [delay, next] = syncState === 'syncing' ? [SYNC_MS, () => setSyncState('synced')] : [ADVANCE_AFTER_SYNC_MS, () => onNextRef.current?.()]
    const id = setTimeout(next, delay)
    return () => clearTimeout(id)
  }, [syncState])

  const isSyncing = syncState === 'syncing'

  return (
    <Screen name="scan-entry">
      <Reveal delay={STAGGER.top} className="flex flex-col items-start relative shrink-0 w-full" data-name="top-content">
        <StatusBar />
        <ChapterIndicator chapter={1} />
        <div className="[word-break:break-word] flex flex-col gap-[8px] items-start pt-[40px] px-[24px] relative shrink-0 w-full" data-name="hero-title">
          <p className="font-['Geist'] font-bold leading-[normal] text-[#00ff87] text-[12px] uppercase whitespace-nowrap">ForestOS × Nyashinski</p>
          <h1 className="font-['Syne'] font-extrabold leading-[1.05] text-[48px] text-white w-full">
            <SplitText text="THE" delay={0.25} /> <Shimmer>LIVING</Shimmer>
            <br />
            <SplitText text="ANTHEM" delay={0.45} />
          </h1>
          <p className="font-['Geist'] font-normal leading-[1.5] text-[#8a9f96] text-[14px] w-full">
            Scan. Tap. Listen. Walk into Kenya’s highlands with the beat of reforestation.
          </p>
        </div>
      </Reveal>

      <Reveal delay={STAGGER.middle} className="flex flex-col items-center p-[24px] relative shrink-0 w-full" data-name="scan-portal">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          onClick={() => syncState === 'idle' && setSyncState('syncing')}
          aria-label="Scan to sync and enter the experience"
          aria-busy={isSyncing}
          className={`relative flex items-center justify-center rounded-[110px] size-[220px] ${FOCUS_RING}`}
        >
          {syncState === 'idle' && <PortalRipples />}
          <motion.span
            aria-hidden
            className="absolute inset-0 border-2 border-[#00ff87] border-dashed rounded-[110px]"
            animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
            transition={isSyncing ? { duration: 2.4, ease: 'linear', repeat: Infinity } : { duration: 0.4 }}
          />
          <span className="bg-[#0a1812] border border-[rgba(255,255,255,0.08)] border-solid drop-shadow-[0px_4px_12px_rgba(0,255,135,0.2)] flex flex-col items-center justify-center relative rounded-[90px] size-[180px]">
            <span className="flex flex-col gap-[6px] items-center justify-center">
              <span className="relative block size-[64px] overflow-hidden">
                <img alt="" className="block size-[64px]" src={imgScanQrCode} />
                <ScanLine isFast={isSyncing} />
              </span>
              <span className="font-['Geist'] font-semibold leading-[normal] text-[#00ff87] text-[11px] uppercase whitespace-nowrap" aria-live="polite">
                {PORTAL_LABELS[syncState]}
              </span>
            </span>
          </span>
        </motion.button>
      </Reveal>

      <BottomAction label="SCROLL TO ENTER THE FOREST" onNext={onNext}>
        <button type="button" onClick={onNext} aria-label="Enter the forest" className={`flex items-center justify-center size-[20px] rounded-full ${FOCUS_RING}`}>
          <BobbingArrow />
        </button>
      </BottomAction>
    </Screen>
  )
}
