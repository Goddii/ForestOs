import { RISK_REGISTER } from '../../data/investor/risks'
import { currentState } from '../programme/verificationState'

/**
 * "Requires attention" is derived from records the workspace already shows —
 * the funder's own activities that were rejected or sent back for
 * correction, survival checks on its plantings that are overdue, and open
 * programme risks — never a second, invented list. Every item links to the
 * page that is its home.
 *
 * @param {import('../../data/funder/workspace').FunderWorkspace} workspace
 * @returns {Array<{ id: string, label: string, detail: string, to: string }>}
 */
export function getAttentionItems(workspace) {
  const issues = `${workspace.basePath}/issues`

  const corrections = workspace.fundedActivities
    .filter((activity) => currentState(activity.verification) === 'correction_required')
    .map((activity) => ({
      id: `fix-${activity.id}`,
      label: `Returned for correction: ${activity.summary}`,
      detail: 'Verification · awaiting resubmission',
      to: issues,
    }))

  const overdue = workspace.survivalChecks
    .filter((check) => check.isFunded && check.status === 'overdue')
    .map((check) => ({
      id: `overdue-${check.id}`,
      label: `${check.monthsAfter}-month survival check overdue: ${check.activitySummary}`,
      detail: `Due ${check.dueDate}`,
      to: issues,
    }))

  const risks = RISK_REGISTER.filter((risk) => risk.status === 'open')
    .slice(0, 2)
    .map((risk) => ({
      id: risk.id,
      label: risk.description,
      detail: `${risk.severity.toUpperCase()} risk · ${risk.owner}`,
      to: issues,
    }))

  return [...corrections, ...overdue, ...risks]
}
