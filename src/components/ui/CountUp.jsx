import { useCallback, useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

/**
 * Ported from reactbits.dev's CountUp (text-animations/count-up), adapted
 * to import from `framer-motion` — already a project dependency — rather
 * than the newer `motion/react` package, so this costs zero new
 * dependencies. Logic is otherwise unchanged from the source.
 *
 * Animates the digits themselves via a spring (not a linear tween), so it
 * settles the way a real needle would rather than ticking at a constant
 * rate — counts up once, the first time it scrolls into view.
 */
export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
}) {
  const ref = useRef(null)
  const motionValue = useMotionValue(direction === 'down' ? to : from)

  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)

  const springValue = useSpring(motionValue, { damping, stiffness })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const getDecimalPlaces = (num) => {
    const str = num.toString()
    if (str.includes('.')) {
      const decimals = str.split('.')[1]
      if (parseInt(decimals) !== 0) return decimals.length
    }
    return 0
  }

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to))

  const formatValue = useCallback(
    (latest) => {
      const hasDecimals = maxDecimals > 0
      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      }
      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest)
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber
    },
    [maxDecimals, separator],
  )

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(direction === 'down' ? to : from)
  }, [from, to, direction, formatValue])

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') onStart()

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to)
      }, delay * 1000)

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') onEnd()
        },
        delay * 1000 + duration * 1000,
      )

      return () => {
        clearTimeout(timeoutId)
        clearTimeout(durationTimeoutId)
      }
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest)
    })
    return () => unsubscribe()
  }, [springValue, formatValue])

  return <span className={className} ref={ref} />
}
