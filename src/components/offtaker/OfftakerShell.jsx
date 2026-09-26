import { useEffect } from 'react'
import OfftakerHeader from './OfftakerHeader'
import OfftakerNav from './OfftakerNav'
import EvidenceDrawer from '../investor/EvidenceDrawer'
import { EvidenceDrawerProvider } from '../investor/EvidenceDrawerContext'

/**
 * App shell for `/offtaker/*`: dark rail, white canvas, slim header, and the
 * funder console's evidence drawer mounted once — the same evidence records
 * open the same way from either portal.
 */
export default function OfftakerShell({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('offtaker-root')
    return () => document.documentElement.classList.remove('offtaker-root')
  }, [])

  return (
    <EvidenceDrawerProvider>
      <div className="offtaker min-h-svh bg-card text-ink lg:flex">
        <OfftakerNav />
        <div className="min-w-0 flex-1">
          <OfftakerHeader />
          <main className="mx-auto max-w-[90rem] px-6 py-10 sm:px-8 sm:py-12">
            {children}
          </main>
        </div>
        <EvidenceDrawer />
      </div>
    </EvidenceDrawerProvider>
  )
}

