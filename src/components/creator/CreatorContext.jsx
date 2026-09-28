import { createContext, useContext } from 'react'

// One creator's workspace (data/creator/workspace.js) plus the session
// actions CreatorView provides. Pages read this instead of importing seed
// data directly.
const CreatorContext = createContext(null)

export const CreatorProvider = CreatorContext.Provider

/**
 * @returns {ReturnType<typeof import('../../data/creator/workspace').buildCreatorWorkspace> & {
 *   saveCreative: (experienceId: string, changes: object) => void,
 *   publish: (experienceId: string) => void,
 *   bookBatch: (booking: { productId: string, batchId: string, packs: number, date: string }) => string,
 *   requestDesign: (request: object) => string,
 *   createExperience: (templateId: string, campaignId: string) => string | null,
 * }}
 */
export function useCreator() {
  const workspace = useContext(CreatorContext)
  if (!workspace) throw new Error('useCreator must be used within a CreatorProvider')
  return workspace
}

/** In-workspace links: `path('studio')` → `/creator/nyashinski/studio`. */
export function useCreatorPath() {
  const { basePath } = useCreator()
  return (sub) => (sub ? `${basePath}/${sub}` : basePath)
}
