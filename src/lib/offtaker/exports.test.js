import { describe, expect, test } from 'vitest'
import { buildPdf, layoutReport, toCsv } from './exports'

describe('toCsv', () => {
  test('quotes cells containing commas, quotes or newlines', () => {
    const csv = toCsv([{ a: 'plain', b: 'x, y' }, { a: 'say "hi"', b: null }], [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }])
    expect(csv).toBe('A,B\nplain,"x, y"\n"say ""hi""",')
  })
})

describe('buildPdf', () => {
  test('paginates long reports and writes a consistent xref table', () => {
    const lines = layoutReport({
      title: 'Report',
      subtitle: 'Sub',
      sections: [{ heading: 'Rows', lines: Array.from({ length: 120 }, (_, i) => `Row ${i} — with an em dash`) }],
      footer: 'Footer',
    })
    const pdf = buildPdf(lines)
    expect(pdf.startsWith('%PDF-1.4')).toBe(true)
    expect(pdf).toMatch(/\/Count 3 >>/)
    expect(pdf).not.toMatch(/—/)
    const xrefAt = Number(pdf.match(/startxref\n(\d+)/)[1])
    expect(pdf.slice(xrefAt, xrefAt + 4)).toBe('xref')
  })
})
