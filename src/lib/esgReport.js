// Client-side ESG report export for the Buyer / Brand view. Produces a small
// valid single-page PDF and a CSV, entirely in the browser — a stand-in for a
// real reporting backend. Both documents say so on their face.
//
// `report` shape:
//   { brand, period, hectaresProtected, carbonTonnesCo2, bufferZones,
//     volumeKg, batchCount, verification: { standard, status, field, satellite },
//     lines: [{ block, hectares, carbonTonnesCo2, verification }] }

import { sanitizeForPdf } from './pdfText'

function escapePdfText(value) {
  return sanitizeForPdf(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function buildContentStream(report) {
  const v = report.verification
  const rows = [
    ['F1', 22, 'FORESTOS'],
    ['F2', 10, 'ESG Conservation Report  —  prototype export'],
    ['GAP', 16, ''],
    ['F1', 13, report.brand],
    ['F2', 11, `Reporting period    ${report.period}`],
    ['F2', 11, `Direct-sold batches ${report.batchCount}  (auction volume excluded)`],
    ['F2', 11, `Made tea sourced    ${report.volumeKg.toLocaleString()} kg`],
    ['GAP', 14, ''],
    ['F1', 13, 'Conservation outcomes'],
    ['F2', 11, `Hectares protected  ${report.hectaresProtected} ha`],
    ['F2', 11, `Carbon stored       ${report.carbonTonnesCo2.toLocaleString()} tCO2e`],
    ['F2', 11, `Buffer zones        ${report.bufferZones.join(', ')}`],
    ['GAP', 14, ''],
    ['F1', 13, 'Verification'],
    ['F2', 11, `Standard            ${v.standard}`],
    ['F2', 11, `Status              ${v.status}`],
    ['F2', 11, `Field check         ${v.field}`],
    ['F2', 11, `Satellite check     ${v.satellite}`],
    ['GAP', 14, ''],
    ['F1', 13, 'By source block'],
    ...report.lines.map((l) => [
      'F2',
      10,
      `${l.block.padEnd(18)} ${String(l.hectares).padStart(5)} ha   ${String(l.carbonTonnesCo2).padStart(5)} tCO2e   ${l.verification}`,
    ]),
  ]

  let stream = 'BT\n56 786 Td\n'
  for (const [font, size, text] of rows) {
    if (font === 'GAP') {
      stream += `0 -${size} Td\n`
      continue
    }
    stream += `/${font} ${size} Tf\n(${escapePdfText(text)}) Tj\n0 -${Math.round(size * 1.7)} Td\n`
  }
  const stamp = `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`
  stream += `/F2 8 Tf\n0 -26 Td\n(Generated ${stamp}  -  illustrative mock data, not an audited disclosure.) Tj\nET`
  return stream
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadEsgReportPdf(report) {
  const content = buildContentStream(report)
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
      '/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  triggerDownload(new Blob([pdf], { type: 'application/pdf' }), `ForestOS-ESG-Report-${report.period.replace(/\s+/g, '-')}.pdf`)
}

export function downloadEsgReportCsv(report) {
  const head = ['Source block', 'Hectares protected', 'Carbon stored (tCO2e)', 'Verification']
  const body = report.lines.map((l) => [l.block, l.hectares, l.carbonTonnesCo2, l.verification])
  const totals = ['All blocks', report.hectaresProtected, report.carbonTonnesCo2, report.verification.status]
  const csv = [head, ...body, totals]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  triggerDownload(new Blob([csv], { type: 'text/csv' }), `ForestOS-ESG-Report-${report.period.replace(/\s+/g, '-')}.csv`)
}
