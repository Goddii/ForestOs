import { useEffect } from 'react'

// Google Fonts stylesheets for the tenant themes that swap out the shared
// Instrument Serif / Archivo / JetBrains Mono stack (see the `.tenant-*`
// scopes in index.css). Loaded only while such a theme is on screen, so the
// public home page never pays for families it doesn't use.
const THEME_FONT_HREFS = {
  'tenant-majani':
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap',
}

/**
 * Injects the font stylesheet for `theme` (if it has one) and removes it
 * when the theme goes away.
 *
 * @param {string | undefined} theme  a `.tenant-*` class name
 */
export function useThemeFonts(theme) {
  const href = theme ? THEME_FONT_HREFS[theme] : undefined

  useEffect(() => {
    if (!href) return undefined
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
    return () => link.remove()
  }, [href])
}
