// DEMO DATA — statements each brand wants to make about its tea, as the
// brand wrote them. The brand only supplies the words and what kind of fact
// the statement asserts; whether it can be made, and in what wording, is
// decided by lib/brand/claims.js against the verified records for the lots
// the product is packed from. Nothing here carries a verdict.

/**
 * @typedef {Object} ClaimAssertion
 * @property {'origin' | 'landscape_support' | 'intervention' | 'metric' | 'per_unit' | 'carbon'} type
 * @property {string[]} [interventionTypeIds]   for `intervention`
 * @property {string} [indicatorId]             for `metric`
 * @property {number} [value]                   for `metric`: the figure the brand states
 * @property {boolean} [byBrand]                the statement says the brand itself did the work
 *
 * @typedef {Object} BrandClaim
 * @property {string} id
 * @property {string} brandOrgId
 * @property {string} productId
 * @property {string} statement
 * @property {ClaimAssertion} asserts
 * @property {string} submittedAt
 */

/** @type {BrandClaim[]} */
export const BRAND_CLAIMS = [
  // ── Kilele Coffee House ───────────────────────────────────────────────────
  {
    id: 'clm-kil-01',
    brandOrgId: 'org-brand-kilele',
    productId: 'prd-kil-mau-black',
    statement: 'Our tea supports landscape conservation.',
    asserts: { type: 'landscape_support' },
    submittedAt: '2026-08-30',
  },
  {
    id: 'clm-kil-02',
    brandOrgId: 'org-brand-kilele',
    productId: 'prd-kil-mau-black',
    statement: 'Grown on the edge of the Mau Forest, deforestation-free.',
    asserts: { type: 'origin' },
    submittedAt: '2026-08-30',
  },
  {
    id: 'clm-kil-03',
    brandOrgId: 'org-brand-kilele',
    productId: 'prd-kil-mau-black',
    statement: '5,000 indigenous trees planted beside our tea gardens.',
    asserts: { type: 'metric', indicatorId: 'ind-seedlings', value: 5000 },
    submittedAt: '2026-09-04',
  },
  {
    id: 'clm-kil-04',
    brandOrgId: 'org-brand-kilele',
    productId: 'prd-kil-mau-black',
    statement: 'Every tin plants a tree.',
    asserts: { type: 'per_unit' },
    submittedAt: '2026-09-04',
  },
  {
    id: 'clm-kil-05',
    brandOrgId: 'org-brand-kilele',
    productId: 'prd-kil-chai',
    statement: 'Our chai helps Nessuit families grow their own fuelwood instead of cutting the forest.',
    asserts: { type: 'intervention', interventionTypeIds: ['it-fuelwood'] },
    submittedAt: '2026-09-12',
  },
  // ── Mara Crest Hotels & Lodges ────────────────────────────────────────────
  {
    id: 'clm-mc-01',
    brandOrgId: 'org-brand-maracrest',
    productId: 'prd-mc-guest',
    statement: 'Our guest tea supports landscape conservation in the Mau.',
    asserts: { type: 'landscape_support' },
    submittedAt: '2026-08-20',
  },
  {
    id: 'clm-mc-02',
    brandOrgId: 'org-brand-maracrest',
    productId: 'prd-mc-guest',
    statement: 'We restored 14.5 hectares of the forest tea buffer.',
    asserts: { type: 'metric', indicatorId: 'ind-tea-ha', value: 14.5, byBrand: true },
    submittedAt: '2026-08-20',
  },
  {
    id: 'clm-mc-03',
    brandOrgId: 'org-brand-maracrest',
    productId: 'prd-mc-guest',
    statement: 'Every room’s tea is protected by forest patrols.',
    asserts: { type: 'intervention', interventionTypeIds: ['it-patrol'] },
    submittedAt: '2026-09-15',
  },
  // ── The Halden Grand ──────────────────────────────────────────────────────
  {
    id: 'clm-hg-01',
    brandOrgId: 'org-brand-halden',
    productId: 'prd-hg-afternoon',
    statement: 'Single-origin tea from the Kangaita block on Mount Kenya.',
    asserts: { type: 'origin' },
    submittedAt: '2026-08-08',
  },
  {
    id: 'clm-hg-02',
    brandOrgId: 'org-brand-halden',
    productId: 'prd-hg-afternoon',
    statement: 'An afternoon tea that protects Mount Kenya’s forests.',
    asserts: { type: 'landscape_support' },
    submittedAt: '2026-08-08',
  },
  {
    id: 'clm-hg-03',
    brandOrgId: 'org-brand-halden',
    productId: 'prd-hg-afternoon',
    statement: 'A carbon-neutral afternoon tea.',
    asserts: { type: 'carbon' },
    submittedAt: '2026-09-10',
  },
]
