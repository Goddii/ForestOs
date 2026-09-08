// The hand-rolled PDFs (`passportPdf.js`, `esgReport.js`) embed the base-14
// Helvetica / Courier fonts, whose encoding is WinAnsi. A JS string written into
// the content stream is UTF-8 encoded by `Blob`, so any character outside
// Latin-1 (em dash, arrows, subscripts, curly quotes) renders as mojibake
// (`EUDR â Deforestation-Free`). Transliterate to an ASCII-safe form before emit.

const MAP = {
  '—': '-', // em dash
  '–': '-', // en dash
  '−': '-', // minus sign
  '→': '->', // right arrow
  '←': '<-', // left arrow
  '↑': '^', // up arrow
  '↓': 'v', // down arrow
  '·': '-', // middle dot
  '•': '-', // bullet
  '…': '...', // ellipsis
  '‘': "'", // left single quote
  '’': "'", // right single quote
  '“': '"', // left double quote
  '”': '"', // right double quote
  '²': '2', // superscript two
  '₂': '2', // subscript two
  '°': ' deg', // degree sign
  ' ': ' ', // non-breaking space
  'é': 'e', // é (place names)
  '’s': "'s",
}

/** Make a string safe to embed in a WinAnsi PDF content stream. */
export function sanitizeForPdf(value) {
  let out = String(value)
  for (const [from, to] of Object.entries(MAP)) {
    out = out.split(from).join(to)
  }
  // Anything still non-ASCII → strip, so the stream never carries a stray
  // multi-byte sequence.
  return out.replace(/[^\x20-\x7E]/g, '')
}
