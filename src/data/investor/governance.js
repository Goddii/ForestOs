// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`GovernanceMember`).

/** @type {import('./types').GovernanceMember[]} */
export const GOVERNANCE_MEMBERS = [
  {
    name: 'ForestOS',
    role: 'Technology & data partner',
    function: 'technology_partner',
    responsibility: 'Monitoring infrastructure, evidence pipeline, this reporting interface.',
  },
  {
    name: 'Nyayo Tea Zone Development Corporation',
    role: 'Implementing organization',
    function: 'implementing_organization',
    responsibility: 'Programme delivery on the ground, land access, community relationships.',
  },
  {
    name: 'Programme management office',
    role: 'Conservation manager',
    function: 'conservation_manager',
    responsibility: 'Field programme direction, budget stewardship, risk register ownership.',
  },
  {
    name: 'Field teams A–D',
    role: 'Field operations',
    function: 'field_team',
    responsibility: 'Patrols, farmer onboarding, restoration activity, compliance audits.',
  },
  {
    name: 'Independent verification partner',
    role: 'Verification partner',
    function: 'verification_partner',
    responsibility: 'Sampled review of field audits and satellite evidence; sign-off on verification reports.',
  },
  {
    name: 'Conservation capital funder',
    role: 'Funder',
    function: 'funder',
    responsibility: 'Capital commitment against the programme budget; receives this reporting interface.',
  },
]

export const GOVERNANCE_PROCESS = {
  reportingFrequency: 'Quarterly, with a satellite monitoring pass at each interval and a full independent verification review twice yearly.',
  verificationProcess:
    'Field audits are logged with GPS and timestamp at the point of capture. A sample is independently reviewed by the verification partner each half-year; findings are logged against the relevant evidence records.',
  escalationProcess:
    'Field-level issues are logged to the risk register by the responsible field team, reviewed weekly by the programme manager, and escalated to the funder in the quarterly report if unresolved within 30 days.',
  dataOwnership:
    'Field and monitoring data is owned by the implementing organization; ForestOS operates the monitoring and reporting infrastructure under a data processing agreement. Funders receive reporting access, not raw data export, unless otherwise agreed.',
  accountability:
    'The programme manager is accountable for programme delivery and the risk register; ForestOS is accountable for the accuracy of the monitoring pipeline and this reporting interface; the verification partner is accountable for its independent sign-off.',
}
