import { useEffect } from 'react'
import BrandHeader from './BrandHeader'
import BrandNav from './BrandNav'
import EvidenceDrawer from '../investor/EvidenceDrawer'
import { EvidenceDrawerProvider } from '../investor/EvidenceDrawerContext'

/**
 * App shell for `/brand/*`: the same construction as the Offtaker Portal
 * (dark rail, white canvas, slim header) and the same evidence drawer, so a
 * verified record opens identically for a brand, a buyer or a funder.
 */
export default function BrandShell({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('brand-root')
    return () => document.documentElement.classList.remove('brand-root')
  }, [])

  return (
    <EvidenceDrawerProvider>
      <div className="brand-portal min-h-svh bg-card text-ink lg:flex">
        <BrandNav />
        <div className="min-w-0 flex-1">
          <BrandHeader />
          <main className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 sm:py-12">{children}</main>
        </div>
        <EvidenceDrawer />
      </div>
    </EvidenceDrawerProvider>
  )
}
