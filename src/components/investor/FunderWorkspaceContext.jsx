import { createContext, useContext } from 'react'

// The signed-in funder's workspace (src/data/funder/workspace.js) — which
// organisation is looking, its agreement, and every figure scoped to it.
// Provided once by FunderView; components read it instead of importing
// programme-wide singletons, so a second funder is data, not code.
const FunderWorkspaceContext = createContext(null)

export const FunderWorkspaceProvider = FunderWorkspaceContext.Provider

/** @returns {import('../../data/funder/workspace').FunderWorkspace} */
export function useWorkspace() {
  const workspace = useContext(FunderWorkspaceContext)
  if (!workspace) {
    throw new Error('useWorkspace must be used within a FunderWorkspaceProvider')
  }
  return workspace
}

/**
 * Builds in-workspace links: `path('funding')` → `/funder/funder-a/funding`,
 * `path()` → the workspace overview.
 *
 * @returns {(sub?: string) => string}
 */
export function useWorkspacePath() {
  const { basePath } = useWorkspace()
  return (sub) => (sub ? `${basePath}/${sub}` : basePath)
}
