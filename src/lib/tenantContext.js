import { createContext, useContext } from 'react'

/**
 * Carries the tenant a `/passport/:tenantSlug/:batchId` route resolved, so
 * every tenant section renders that community's voice/palette instead of a
 * hardcoded one. Mirrors `batchContext.js`. No default tenant — a section
 * rendered outside a `TenantContext.Provider` is a bug, not a fallback case.
 */
export const TenantContext = createContext(null)

export function useTenant() {
  const tenant = useContext(TenantContext)
  if (!tenant) throw new Error('useTenant() must be used within a TenantContext.Provider')
  return tenant
}
