import { createContext, useContext } from 'react'
import { BATCH } from './mock'

/**
 * Carries the batch a `/batch/:batchId` route resolved, so the Hero, Globe,
 * Impact and Passport sections render for the scanned batch instead of a
 * hardcoded one. The default value is the reference batch, so any section used
 * outside a provider keeps working exactly as before.
 */
export const BatchContext = createContext(BATCH)

export function useBatch() {
  return useContext(BatchContext)
}
