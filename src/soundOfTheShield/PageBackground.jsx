import { motion } from 'framer-motion'
import { imgBgGlowMid, imgBgGlowTop } from './assets'

/** Ambient page-level glow ellipses, sitting behind every section. */
export default function PageBackground() {
  return (
    <>
      <motion.div
        className="absolute left-1/2 size-[300px] top-[-100px]"
        data-node-id="2:5"
        data-name="bg-glow-top"
        initial={{ opacity: 0.15, scaleX: 1, scaleY: 1 }}
        animate={{ opacity: [0.15, 0.35, 0.15], scaleX: [1, 1.15, 1], scaleY: [1, 1.15, 1] }}
        transition={{
          opacity: { duration: 4, times: [0, 0.5, 1], ease: 'easeInOut', repeat: Infinity },
          scaleX: { duration: 4, times: [0, 0.5, 1], ease: [0.4, 0, 0.2, 1], repeat: Infinity },
          scaleY: { duration: 4, times: [0, 0.5, 1], ease: [0.4, 0, 0.2, 1], repeat: Infinity },
        }}
      >
        <div className="absolute inset-[-33.33%]">
          <img alt="" className="block max-w-none size-full" src={imgBgGlowTop} />
        </div>
      </motion.div>
      <div
        className="absolute left-[180px] size-[250px] top-[420px]"
        data-node-id="2:6"
        data-name="bg-glow-mid"
      >
        <div className="absolute inset-[-32%]">
          <img alt="" className="block max-w-none size-full" src={imgBgGlowMid} />
        </div>
      </div>
    </>
  )
}
