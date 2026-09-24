/**
 * Planted is not survived (audit §12). Survival checks are scheduled per
 * planting activity; a rate exists only once counts have been taken, and it
 * pools counts (surviving ÷ planted) rather than averaging per-site
 * percentages, so a small plot can't swing the headline.
 */

/**
 * @typedef {Object} SurvivalObservation
 * @property {string} dueDate
 * @property {?string} observedDate
 * @property {?number} planted
 * @property {?number} surviving
 */

/**
 * @param {SurvivalObservation} observation
 * @param {string} today - ISO date
 * @returns {'observed' | 'overdue' | 'scheduled'}
 */
export function observationStatus(observation, today) {
  if (observation.observedDate) return 'observed'
  return observation.dueDate < today ? 'overdue' : 'scheduled'
}

/**
 * @param {SurvivalObservation[]} observations
 * @returns {{ planted: number, surviving: number, pct: number } | null}
 */
export function survivalRate(observations) {
  const observed = observations.filter((row) => row.observedDate && row.planted)
  if (observed.length === 0) return null
  const planted = observed.reduce((total, row) => total + row.planted, 0)
  const surviving = observed.reduce((total, row) => total + row.surviving, 0)
  return { planted, surviving, pct: Math.round((surviving / planted) * 100) }
}
