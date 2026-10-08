// DEMO DATA — the tea products each brand has built on ForestOS-verified
// origin. A product says nothing about where its tea came from: that is the
// sourcing record (data/brand/sourcing.js), which points at real lots in the
// batch chain. Campaigns and QR experiences point at products, not the other
// way round, so a product never carries a stale copy of either.

/**
 * @typedef {'tin' | 'pouch' | 'box' | 'sachet'} PackType
 *
 * @typedef {Object} BrandProduct
 * @property {string} id
 * @property {string} brandOrgId
 * @property {string} name
 * @property {string} line              the range the product sits in
 * @property {string} teaType
 * @property {string} description       brand copy (brand content, not verified data)
 * @property {{ type: PackType, size: string, material: string, qrPlacement: string }} packaging
 * @property {string} channel           where it is sold or served
 * @property {'on_sale' | 'in_development' | 'draft'} status
 * @property {string | null} launchDate
 */

/** @type {BrandProduct[]} */
export const BRAND_PRODUCTS = [
  // ── Kilele Coffee House ───────────────────────────────────────────────────
  {
    id: 'prd-kil-mau-black',
    brandOrgId: 'org-brand-kilele',
    name: 'Gold Label Black Tea',
    line: 'JAVA HOUSE Origin Teas',
    teaType: 'Black tea, CTC',
    description: 'A brisk, bright black tea from the South West Mau buffer belt, brewed in every Kilele café and sold in tins at the counter.',
    packaging: { type: 'tin', size: '100 g loose leaf', material: 'Recycled steel tin, paper label', qrPlacement: 'Printed on the back label', packImage: '/media/java/java_tea_product.jpg' },
    channel: 'Served in 14 cafés; retail tins at the counter',
    status: 'on_sale',
    launchDate: '2026-09-02',
  },
  {
    id: 'prd-kil-chai',
    brandOrgId: 'org-brand-kilele',
    name: 'House Chai',
    line: 'JAVA HOUSE Origin Teas',
    teaType: 'Black tea with ginger, cardamom and cinnamon',
    description: 'Kilele’s house chai, blended on a Nessuit black tea base for the café milk-tea menu.',
    packaging: { type: 'pouch', size: '250 g', material: 'Compostable kraft pouch', qrPlacement: 'Front panel, bottom right', packImage: '/media/java/java_tea_product.jpg' },
    channel: 'Café chai menu; retail pouches from October',
    status: 'on_sale',
    launchDate: '2026-09-09',
  },
  // ── Mara Crest Hotels & Lodges ────────────────────────────────────────────
  {
    id: 'prd-mc-guest',
    brandOrgId: 'org-brand-maracrest',
    name: 'Guest Room Morning Tea',
    line: 'Mara Crest In-Room',
    teaType: 'Black tea, CTC, in pyramid sachets',
    description: 'The tea waiting in every Mara Crest guest room, with a card that tells the story of the forest it came from.',
    packaging: { type: 'sachet', size: '2.5 g pyramid sachet, boxed in 20s', material: 'Plant-based mesh, FSC card box', qrPlacement: 'In-room card beside the kettle' },
    channel: 'All 6 properties, 480 guest rooms',
    status: 'on_sale',
    launchDate: '2026-08-28',
  },
  {
    id: 'prd-mc-sundowner',
    brandOrgId: 'org-brand-maracrest',
    name: 'Sundowner Reserve',
    line: 'Mara Crest Lodge Shop',
    teaType: 'Black tea, BP1 grade',
    description: 'A lodge-shop gift tin for guests to take home, planned for the December season.',
    packaging: { type: 'tin', size: '125 g loose leaf', material: 'Embossed tin with lodge artwork', qrPlacement: 'Inside the lid' },
    channel: 'Lodge shops, from December',
    status: 'in_development',
    launchDate: null,
  },
  // ── The Halden Grand ──────────────────────────────────────────────────────
  {
    id: 'prd-hg-afternoon',
    brandOrgId: 'org-brand-halden',
    name: 'Mount Kenya Afternoon Blend',
    line: 'The Halden Afternoon Tea',
    teaType: 'Black tea, single origin',
    description: 'The house tea of The Halden’s afternoon tea service, poured at the table and sold as a gift box in the boutique.',
    packaging: { type: 'box', size: '15 silk pyramids', material: 'Rigid gift box, foil-blocked', qrPlacement: 'Table card and inside the box lid' },
    channel: 'Afternoon tea lounge and hotel boutique',
    status: 'on_sale',
    launchDate: '2026-08-15',
  },
  {
    id: 'prd-hg-turndown',
    brandOrgId: 'org-brand-halden',
    name: 'Turndown Infusion',
    line: 'The Halden In-Room',
    teaType: 'To be confirmed',
    description: 'An evening tea for the turndown service. Recipe and source lot not chosen yet.',
    packaging: { type: 'sachet', size: 'Single sachet', material: 'To be confirmed', qrPlacement: 'Turndown card' },
    channel: 'Turndown service, all rooms',
    status: 'draft',
    launchDate: null,
  },
]

export const PRODUCT_STATUS_LABELS = {
  on_sale: 'On sale',
  in_development: 'In development',
  draft: 'Draft',
}

export const PACK_TYPE_LABELS = {
  tin: 'Tin',
  pouch: 'Pouch',
  box: 'Gift box',
  sachet: 'Sachets',
}
