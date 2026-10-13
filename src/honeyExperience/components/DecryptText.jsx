/**
 * Adapted from reactbits.dev's DecryptedText
 * (https://reactbits.dev/text-animations/decrypted-text), reduced to the
 * shape this page needs: a record ID that scrambles its glyphs and resolves
 * left-to-right once, the first time it scrolls into view.
 *
 * Accessibility: the real string is always present for screen readers via a
 * visually-hidden node; the scrambling copy is aria-hidden. Under
 * prefers-reduced-motion the text renders resolved with no scramble at all.
 */
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const GLYPHS = '0123456789ABCDEF···×x'

export default function DecryptText({ text, speed = 45, steps = 12, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(text)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!inView || started) return
    setStarted(true)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(text)
      return
    }

    const chars = text.split('')
    let tick = 0
    setDisplay(chars.map((c) => (c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''))

    const id = window.setInterval(() => {
      tick += 1
      const revealed = Math.floor((tick / steps) * chars.length)
      setDisplay(
        chars
          .map((c, i) => {
            if (i < revealed || c === ' ') return c
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join(''),
      )
      if (tick >= steps) {
        window.clearInterval(id)
        setDisplay(text)
      }
    }, speed)

    return () => window.clearInterval(id)
  }, [inView, started, text, speed, steps])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
