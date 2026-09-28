// DEMO DATA — the tea ForestOS packages for each creator campaign, and the
// QR codes printed on it. Codes are issued per batch: every batch a product
// is packed from gets its own code, so a scan opens the verified record of
// the exact batch in that pack. One code covers every pack type of the
// product filled from that batch.
//
// Batch #921 is the Nyashinski collaboration batch. #630 is a sealed lot no
// buyer holds, booked as the Anthem tin's next batch; it is still awaiting
// its satellite check, so its code stays blocked. Further free lots are
// offered on the Tea page (data/creator/batches.js).

/**
 * @typedef {'tin' | 'pouch' | 'box'} PackType
 *
 * @typedef {Object} PackFormat
 * @property {PackType} type
 * @property {string} size
 * @property {string} material
 * @property {string} qrPlacement     where the batch code goes on this pack
 *
 * @typedef {Object} CreatorProduct
 * @property {string} id
 * @property {string} campaignId
 * @property {string} experienceId    the experience every code on this product opens
 * @property {string} name
 * @property {string} teaType
 * @property {{ src: string, alt: string }} image
 * @property {PackFormat[]} packs
 * @property {number} packKg          made tea per pack, for booking against a batch
 *
 * @typedef {Object} PackCode
 * @property {string} id
 * @property {string} productId
 * @property {string} batchId         short batch code → lib/batchChain.js
 * @property {number} packs           packs filled, or planned when scheduled
 * @property {'packed' | 'scheduled'} status
 * @property {string} date            packed on, or scheduled for
 */

export const PACK_TYPE_LABELS = { tin: 'Tin', pouch: 'Pouch', box: 'Gift box' }

/** @type {CreatorProduct[]} */
export const CREATOR_PRODUCTS = [
  {
    id: 'prd-anthem-ginger',
    campaignId: 'cmp-anthem',
    experienceId: 'exp-anthem',
    name: 'Majani × Nyashinski Ginger',
    teaType: 'Kenyan black tea with ginger',
    image: { src: '/media/brand/nyashinski-tin.jpg', alt: 'Majani × Nyashinski ginger tea tin and refill pouch' },
    packKg: 0.1,
    packs: [
      { type: 'tin', size: '100 g', material: 'Printed steel tin', qrPlacement: 'Batch sticker on the base' },
      { type: 'pouch', size: '100 g refill', material: 'Kraft refill pouch', qrPlacement: 'Batch panel on the back' },
    ],
  },
  {
    id: 'prd-shield-taichi',
    campaignId: 'cmp-shield',
    experienceId: 'exp-shield',
    name: 'I.D TAICHI Tour Pouch',
    teaType: 'Premium Kenyan black tea',
    image: { src: '/media/brand/nyashinski-ritual.jpg', alt: 'I.D TAICHI packaging on a stone ledge above the Mau tea landscape' },
    packKg: 0.05,
    packs: [{ type: 'pouch', size: '50 g', material: 'Kraft pouch sold at shows', qrPlacement: 'Batch sticker on the back' }],
  },
  {
    id: 'prd-guardian-box',
    campaignId: 'cmp-guardian',
    experienceId: 'exp-guardian',
    name: 'I.D TAICHI, The Guardian Edition',
    teaType: 'Premium Kenyan black tea',
    image: { src: '/media/brand/nyashinski-ritual.jpg', alt: 'The Guardian Edition gift box on a stone ledge above the Mau tea landscape' },
    packKg: 0.1,
    packs: [{ type: 'box', size: 'Gift box, 100 g', material: 'Card gift box with beaded band', qrPlacement: 'Batch card inside the lid' }],
  },
]

/** @type {PackCode[]} */
export const PACK_CODES = [
  { id: 'qr-anthem-921', productId: 'prd-anthem-ginger', batchId: '921', packs: 6000, status: 'packed', date: '2026-08-30' },
  { id: 'qr-anthem-630', productId: 'prd-anthem-ginger', batchId: '630', packs: 5000, status: 'scheduled', date: '2026-10-05' },
  { id: 'qr-shield-921', productId: 'prd-shield-taichi', batchId: '921', packs: 8000, status: 'packed', date: '2026-09-03' },
  { id: 'qr-guardian-921', productId: 'prd-guardian-box', batchId: '921', packs: 2000, status: 'scheduled', date: '2026-11-02' },
]
