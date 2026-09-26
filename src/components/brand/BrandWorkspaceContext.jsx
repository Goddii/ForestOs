import { createContext, useContext } from 'react'

// The signed-in brand's workspace (src/data/brand/workspace.js), already
// scoped to the brand and the viewer's role, plus the session actions
// BrandView provides. Pages read it instead of importing seed data directly.
const BrandWorkspaceContext = createContext(null)

export const BrandWorkspaceProvider = BrandWorkspaceContext.Provider

/**
 * @returns {import('../../data/brand/workspace').BrandWorkspace & {
 *   setRole: (role: string) => void,
 *   addProduct: (draft: { product: object, sourcing: object | null, createExperience: boolean }) => string,
 *   addExperience: (productId: string) => string | null,
 *   addCampaign: (campaign: object) => string,
 *   saveExperience: (id: string, changes: object) => void,
 *   requestDesign: (request: object) => string,
 *   inviteMember: (member: { name: string, title: string, role: string }) => void,
 * }}
 */
export function useBrand() {
  const workspace = useContext(BrandWorkspaceContext)
  if (!workspace) throw new Error('useBrand must be used within a BrandWorkspaceProvider')
  return workspace
}

/**
 * In-workspace links: `path('products')` → `/brand/kilele-coffee-house/products`.
 *
 * @returns {(sub?: string) => string}
 */
export function useBrandPath() {
  const { basePath } = useBrand()
  return (sub) => (sub ? `${basePath}/${sub}` : basePath)
}
