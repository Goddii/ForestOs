// The tea factories NTZDC owns and runs. Nyayo Tea Zones has exactly two:
// Kipchabo (Nandi County, North Rift) and Gatitu (Kirinyaga County, East of
// Rift). Facts below are from teazones.co.ke (Our Operations, Kipchabo and
// Gatitu factory pages), checked against public reporting of the 2022 Gatitu
// commissioning.
//
// Demo caveat: the collection centres and batches in this prototype are
// illustrative, so which factory a demo centre delivers to is a modelling
// choice. NTZDC runs no South Rift (Mau) factory; demo Mau leaf is routed to
// Kipchabo, the only Rift Valley factory. Confirm real routing with NTZDC.

export const KIPCHABO_FACTORY = 'Kipchabo Tea Factory'
export const GATITU_FACTORY = 'Gatitu Tea Factory'

/**
 * @typedef {object} FactoryProfile
 * @property {string}   name
 * @property {string}   county
 * @property {string}   region             NTZDC operating region
 * @property {number}   commissioned       Year
 * @property {string[]} zonesServed        NTZDC buffer zones whose leaf it takes
 * @property {string}   capacity           One-line capacity, as the site states it
 * @property {string}   line               Processing lines and what they make
 */

/** @type {FactoryProfile[]} */
export const FACTORIES = [
  {
    name: KIPCHABO_FACTORY,
    county: 'Nandi County',
    region: 'North Rift',
    commissioned: 2010,
    zonesServed: ['Nandi South', 'Nandi North', 'Nandi Central', 'Kakamega'],
    capacity: '21M kg green leaf a year, about 5M kg made tea',
    line: 'Three lines, CTC; Orthodox expansion under way. Home of the Eco and Chabo value-addition unit.',
  },
  {
    name: GATITU_FACTORY,
    county: 'Kirinyaga County',
    region: 'East of Rift',
    commissioned: 2022,
    zonesServed: ['Kirinyaga', 'Embu', 'Mathira', 'Meru South'],
    capacity: 'Two-line design; the CTC line processes 7M kg green leaf a year',
    line: 'CTC line running; Orthodox line planned for the 2026/27 financial year.',
  },
]

/** The profile for a factory name, or null when it is not one of NTZDC's two. */
export function getFactoryProfile(name) {
  return FACTORIES.find((factory) => factory.name === name) ?? null
}
