/** How far past `maxChars` a single long word may run before it is cut with an ellipsis. */
const WORD_OVERFLOW = 3

export const truncate = (text, length) => (text.length > length ? `${text.slice(0, length - 1)}…` : text)

/**
 * Break a name into at most `maxLines` lines of about `maxChars` characters on
 * word boundaries. A single over-long word is cut, and an ellipsis marks the
 * last line when words were dropped, so text never spills off a pack.
 */
export function wrapWords(text, maxChars, maxLines = 3) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const lines = words.reduce((acc, word) => {
    const last = acc[acc.length - 1]
    if (last === undefined) return [word]
    return `${last} ${word}`.length > maxChars ? [...acc, word] : [...acc.slice(0, -1), `${last} ${word}`]
  }, [])
  const kept = lines.slice(0, maxLines).map((line) => truncate(line, maxChars + WORD_OVERFLOW))
  if (lines.length <= maxLines) return kept
  return [...kept.slice(0, -1), truncate(`${kept[kept.length - 1]}…`, maxChars + WORD_OVERFLOW)]
}
