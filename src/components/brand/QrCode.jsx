import { useMemo } from 'react'
import QRCode from 'qrcode'

/**
 * A real, scannable QR code for a URL, drawn as SVG from the `qrcode`
 * library's module matrix (no innerHTML). Error correction M survives the
 * scuffs a printed pack gets. `toSvgString` gives the same drawing as a file
 * for download.
 */

const QUIET_ZONE = 4

function modulesFor(value) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: 'M' })
  return { size: modules.size, isDark: (x, y) => modules.get(y, x) === 1 }
}

function pathFor({ size, isDark }) {
  let d = ''
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (isDark(x, y)) d += `M${x + QUIET_ZONE} ${y + QUIET_ZONE}h1v1h-1z`
    }
  }
  return d
}

/** The code as a standalone SVG document, for "Download SVG". */
export function toSvgString(value, colour = '#08140e') {
  const matrix = modulesFor(value)
  const extent = matrix.size + QUIET_ZONE * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${extent} ${extent}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path fill="${colour}" d="${pathFor(matrix)}"/></svg>`
}

/** Triggers a browser download of the code as an SVG file. */
export function downloadQrSvg(value, filename) {
  const blob = new Blob([toSvgString(value)], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * @param {{ value: string, label: string, size?: number, className?: string }} props
 */
export default function QrCode({ value, label, size = 160, className = '' }) {
  const { d, extent } = useMemo(() => {
    const matrix = modulesFor(value)
    return { d: pathFor(matrix), extent: matrix.size + QUIET_ZONE * 2 }
  }, [value])
  return (
    <svg
      viewBox={`0 0 ${extent} ${extent}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      className={`rounded-lg bg-white ${className}`}
    >
      <path d={d} fill="#08140e" />
    </svg>
  )
}
