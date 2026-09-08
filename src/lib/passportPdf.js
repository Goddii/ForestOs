// Generates a small but valid single-page PDF entirely on the client.
// This stands in for a real "Conservation Passport" export until the
// ForestOS backend exists — the document says so on its face.

function escapeText(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function buildContentStream(batch) {
  const v = batch.verification
  const lines = [
    ['F1', 22, 'FORESTOS'],
    ['F2', 10, 'Conservation Passport  —  prototype export'],
    ['GAP', 18, ''],
    ['F1', 13, `Batch #${batch.id}`],
    ['F2', 11, `Buffer zone        ${batch.bufferZone}`],
    ['F2', 11, `Source block       ${batch.region}`],
    ['F2', 11, `Sourced volume     ${batch.sourcedVolumeLabel}`],
    ['F2', 11, `Protection / cup   ${batch.protectedPerCup}`],
    ['F2', 11, `Hectares preserved ${batch.hectaresPreserved} ha`],
    ['GAP', 16, ''],
    ['F1', 13, 'Verification'],
    ['F2', 11, `Standard           ${v.standard}`],
    ['F2', 11, `Status             ${v.status}`],
    ['F2', 11, `Plot ID            ${v.plotId}`],
    ['F2', 11, `Timestamp          ${v.timestamp}`],
    ['F2', 11, `Reference          ${v.reference}`],
    ['GAP', 20, ''],
    ['F1', 13, 'Farmer terms'],
    ['F2', 11, `Direct plucker premium of KES ${batch.pluckerPremiumKesPerKg}/kg above the`],
    ['F2', 11, 'Mombasa auction clearing price, paid at the collection centre.'],
  ]

  let stream = 'BT\n60 782 Td\n'
  for (const [font, size, text] of lines) {
    if (font === 'GAP') {
      stream += `0 -${size} Td\n`
      continue
    }
    stream += `/${font} ${size} Tf\n(${escapeText(text)}) Tj\n0 -${Math.round(size * 1.7)} Td\n`
  }
  const stamp = `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`
  stream += `/F2 8 Tf\n0 -30 Td\n(Generated ${stamp}  -  illustrative data, not an official certificate.) Tj\nET`
  return stream
}

export function downloadConservationPassport(batch) {
  const content = buildContentStream(batch)
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

  const blob = new Blob([pdf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ForestOS-Conservation-Passport-Batch-${batch.id}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
