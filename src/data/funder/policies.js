// DEMO DATA — see src/lib/contracts/programme.js (`DisclosurePolicy`).
// What a funder may see (audit §14). Applied by lib/programme/disclosure.js;
// the lists below are rendered on the Organisation page so the terms are
// visible, not implicit.

/** @type {import('../../lib/contracts/programme').DisclosurePolicy[]} */
export const DISCLOSURE_POLICIES = [
  {
    id: 'dp-funder',
    audience: 'Funder',
    householdFloor: 10,
    geoPrecision: 'segment',
    visible: [
      'Funded activities, their quantities and verification history',
      'Who verified each activity (role and organisation) and how independently',
      'Evidence records for funded activities, located to the buffer segment',
      'Spend by allocation and each ledger payment',
      'Household counts of 10 or more, with the women-headed share',
    ],
    withheld: [
      'Farmer names, ID numbers and phone numbers',
      'Farm-level coordinates',
      'Individual farmer payments and staff salaries',
      'Field staff identities and free-text reviewer notes',
      'Household counts below 10 (shown as "fewer than 10")',
    ],
  },
]

export function getPolicy(id) {
  return DISCLOSURE_POLICIES.find((policy) => policy.id === id) ?? null
}
