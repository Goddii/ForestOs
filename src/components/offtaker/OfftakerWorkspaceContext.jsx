import { createContext, useContext } from 'react'

// The signed-in buyer's workspace (src/data/offtaker/workspace.js), already
// scoped to the organisation and the viewer's role. Provided once by
// OfftakerView; pages read it instead of importing seed data directly, so
// nothing a role may not see can reach a component.
const OfftakerWorkspaceContext = createContext(null)

export const OfftakerWorkspaceProvider = OfftakerWorkspaceContext.Provider

/** @returns {import('../../data/offtaker/workspace').OfftakerWorkspace & { setRole: (role: string) => void }} */
export function useOfftaker() {
  const workspace = useContext(OfftakerWorkspaceContext)
  if (!workspace) throw new Error('useOfftaker must be used within an OfftakerWorkspaceProvider')
  return workspace
}

/**
 * In-workspace links: `path('batches')` → `/offtaker/rift-valley-tea/batches`.
 *
 * @returns {(sub?: string) => string}
 */
export function useOfftakerPath() {
  const { basePath } = useOfftaker()
  return (sub) => (sub ? `${basePath}/${sub}` : basePath)
}
