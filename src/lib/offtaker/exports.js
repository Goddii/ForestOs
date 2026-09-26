// Export-ready report files for the Offtaker Portal, built entirely on the
// client the way `lib/passportPdf.js` builds the consumer passport: a CSV for
// spreadsheets and a small multi-page PDF for sharing. Both say on their face
// that the data is illustrative until a ForestOS backend exists.
import { sanitizeForPdf } from '../pdfText'

/**
 * @param {Array<Record<string, unknown>>} rows
 * @param {Array<{ key: string, label: string }>} columns
 * @returns {string}
 */
export function toCsv(rows, columns) {
  const cell = (value) => {
    const text = value == null ? '' : String(value)
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const header = columns.map((column) => cell(column.label)).join(',')
  const body = rows.map((row) => columns.map((column) => cell(row[column.key])).join(','))
  return [header, ...body].join('\n')
}

const LINES_PER_PAGE = 52
const escapeText = (value) => sanitizeForPdf(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

/**
 * Lay a report out as PDF text lines: [font, size, text]. Long rows wrap at
 * ~92 characters so nothing runs off an A4 page.
 *
 * @param {{ title: string, subtitle: string, sections: Array<{ heading: string, lines: string[] }>, footer: string }} report
 */
export function layoutReport(report) {
  const wrap = (text, width = 92) => {
    const words = String(text).split(' ')
    const out = []
    let line = ''
    for (const word of words) {
      if ((line + ' ' + word).trim().length > width) {
        out.push(line)
        line = word
      } else {
        line = (line + ' ' + word).trim()
      }
    }
    if (line) out.push(line)
    return out.length ? out : ['']
  }
  const lines = [
    ['F1', 18, 'FORESTOS'],
    ['F1', 13, report.title],
    ['F2', 9, report.subtitle],
    ['GAP', 8, ''],
  ]
  for (const section of report.sections) {
    lines.push(['F1', 11, section.heading])
    for (const text of section.lines) for (const chunk of wrap(text)) lines.push(['F2', 8.5, chunk])
    lines.push(['GAP', 6, ''])
  }
  lines.push(['F2', 7.5, report.footer])
  return lines
}

/**
 * @param {ReturnType<typeof layoutReport>} lines
 * @returns {string} a complete PDF document
 */
export function buildPdf(lines) {
  const pages = []
  for (let i = 0; i < lines.length; i += LINES_PER_PAGE) pages.push(lines.slice(i, i + LINES_PER_PAGE))

  const streams = pages.map((pageLines, index) => {
    let stream = 'BT\n50 800 Td\n'
    for (const [font, size, text] of pageLines) {
      if (font === 'GAP') {
        stream += `0 -${size} Td\n`
        continue
      }
      stream += `/${font} ${size} Tf\n(${escapeText(text)}) Tj\n0 -${Math.round(size * 1.6)} Td\n`
    }
    stream += `ET\nBT\n/F2 7 Tf\n50 30 Td\n(Page ${index + 1} of ${pages.length}) Tj\nET`
    return stream
  })

  // Objects: 1 catalog, 2 pages, 3 bold font, 4 mono font, then page + content pairs.
  const pageObjectIds = pages.map((_, index) => 5 + index * 2)
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  ]
  streams.forEach((stream, index) => {
    const contentId = pageObjectIds[index] + 1
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`,
    )
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  })

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return pdf
}

/** Hand a generated file to the browser as a download. */
export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
