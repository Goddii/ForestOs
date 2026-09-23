// DEMO DATA — illustrative only. See src/data/investor/types.js
// (`InvestorProject`) for the shape this file implements.

/** @type {import('./types').InvestorProject} */
export const INVESTOR_PROJECT = {
  name: 'Nyayo Tea Zone',
  location: 'Nyayo Tea Zone, Rift Region',
  region: 'Kenya',
  centroid: [35.56, -0.62],
  status: 'active',
  reportingPeriod: 'Q3 2026',
  problem:
    'The tea-zone buffer belt bordering the forest reserve has historically been the point of highest encroachment pressure — farm expansion, fuelwood collection and grazing steadily reduce the buffer between smallholder plots and the reserve. The buffer, once lost, is the hardest zone to restore.',
  implementer: 'ForestOS field programme, delivered with the Nyayo Tea Zone Development Corporation',
  beneficiaries:
    '1,842 smallholder tea farmers within the buffer belt, whose participation is incentive-linked to verified conservation compliance on their own plots.',
  sustainabilityModel:
    'Capital funds the initial monitoring, verification and incentive infrastructure. The target operating model shifts an increasing share of ongoing cost onto verified supply-chain value — buyer and brand participation funding the incentive layer directly — so capital becomes a bridge to a self-sustaining system, not a recurring subsidy. That transition has not yet been reached; the pathway below tracks its current status.',
}
