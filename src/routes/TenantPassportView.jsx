import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PassportSpineNav from '../sections/tenant/PassportSpineNav'
import { PASSPORT_STAGES } from '../lib/passportStages'
import TenantScanSection from '../sections/tenant/TenantScanSection'
import TenantVerifyMoment from '../sections/tenant/TenantVerifyMoment'
import TenantDiscoverSection from '../sections/tenant/TenantDiscoverSection'
import TenantProofSection from '../sections/tenant/TenantProofSection'
import TenantParticipateSection from '../sections/tenant/TenantParticipateSection'
import TenantEarnSection from '../sections/tenant/TenantEarnSection'
import TenantBelongSection from '../sections/tenant/TenantBelongSection'
import { BatchContext } from '../lib/batchContext'
import { TenantContext } from '../lib/tenantContext'
import { resolveBatch } from '../lib/mock'
import { resolveTenant } from '../lib/tenants'

/**
 * The tenant-owned consumer experience — "the community owns the experience,
 * ForestOS powers the trust/data/verification underneath it." A pilot for one
 * tenant (`/passport/majani/:batchId`, Nyashinski's Majani Passport); a second
 * tenant is a new `src/lib/tenants.js` entry, not a new route or page.
 *
 * The 7-stage order (Scan, Verify, Discover, Proof, Participate, Earn,
 * Belong) and the passport-spine navigation follow the client's approved
 * Figma Make design (`Consumer QR Experience Design`) exactly — see
 * `PassportSpineNav` and each `Tenant*Section` for how that design's motifs
 * were adapted to this project's real batch/tenant data and design tokens.
 *
 * Full per-tenant visual identity comes from the `.tenant-{slug}` class this
 * component adds to both the page root and `<html>` (the same scoping
 * mechanism the former `.dash`/`dash-root` B2B portal used, before it moved
 * to the separate `forestos-ops` app): every reused
 * ForestOS component underneath keeps its existing `bg-forest-950` /
 * `text-amber-400` / `text-bone` classes unmodified — Tailwind v4 compiles
 * those to `var(--color-*)`, so redefining the same variable names under the
 * `.tenant-{slug}` scope (see `src/index.css`) repaints all of it without
 * touching a single one of those components' source.
 */
export default function TenantPassportView() {
  const { tenantSlug, batchId } = useParams()
  const tenant = resolveTenant(tenantSlug)
  const batch = useMemo(() => resolveBatch(batchId), [batchId])

  const [reached, setReached] = useState(() => new Set(['scan']))
  const wrapperRefs = useRef([])
  const setWrapperRef = useCallback((el, i) => {
    wrapperRefs.current[i] = el
  }, [])

  useEffect(() => {
    if (!tenant) return undefined
    document.title = `${tenant.name} — Batch #${batch.id}`
    document.documentElement.classList.add(tenant.theme)
    return () => document.documentElement.classList.remove(tenant.theme)
  }, [tenant, batch.id])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const section = entry.target.querySelector('section[id], footer[id]')
          if (section?.id) setReached((prev) => new Set(prev).add(section.id))
        })
      },
      { threshold: 0.12 },
    )
    wrapperRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Unknown tenant slug — there is no backend to 404 against, so fall back to
  // the plain ForestOS record rather than rendering nothing.
  if (!tenant) return <Navigate to={`/batch/${batchId ?? ''}`} replace />

  // Each stage stays invisible until scrolled into view, then plays its own
  // `animate-reveal-*` entrance — matching the approved Figma design, whose
  // `App.tsx` gates every stage's content behind the same kind of `visible`
  // flag from one page-level `IntersectionObserver`.
  const sections = [
    <TenantScanSection key="scan" visible={reached.has('scan')} />,
    <TenantVerifyMoment key="verify" visible={reached.has('verify')} />,
    <TenantDiscoverSection key="discover" visible={reached.has('discover')} />,
    <TenantProofSection key="proof" visible={reached.has('proof')} />,
    <TenantParticipateSection key="participate" visible={reached.has('participate')} />,
    <TenantEarnSection key="earn" visible={reached.has('earn')} />,
    <TenantBelongSection key="belong" visible={reached.has('belong')} />,
  ]

  return (
    <TenantContext.Provider value={tenant}>
      <BatchContext.Provider value={batch}>
        <div className={`${tenant.theme} bg-forest-950`}>
          <PassportSpineNav reached={reached} tenantKicker={tenant.voice.kicker} />
          <main className="pt-12 md:pl-16 md:pt-0">
            {sections.map((section, i) => (
              <div key={PASSPORT_STAGES[i].id} ref={(el) => setWrapperRef(el, i)}>
                {section}
              </div>
            ))}
          </main>
        </div>
      </BatchContext.Provider>
    </TenantContext.Provider>
  )
}
