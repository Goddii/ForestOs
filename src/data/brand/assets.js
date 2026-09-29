// DEMO DATA — the asset library. Two kinds of asset, kept apart on purpose:
//
//  - ForestOS assets: landscape and field photography and the verification
//    mark, supplied to brands for use alongside verified records. Photos
//    reuse the funder console's media records (data/investor/media.js),
//    which carry each image's real author and licence and flag images that
//    show people. Every one is illustrative, not a photo of this programme.
//  - Brand assets: files the brand team uploaded. Pack renders and QR codes
//    are generated from the product and experience records, not stored here.

import { getMediaById } from '../investor'

const FOREST_PHOTO = (id, landscape, alt) => ({
  id: `fos-${id}`,
  kind: 'photo',
  src: `/media/forests/${id}`,
  width: 1000,
  height: 563,
  alt,
  caption: `${landscape} forest block`,
  landscape,
  isIllustrative: true,
  showsPeople: false,
  credit: null,
  licenceNote: 'ForestOS site photography; licence for external use to be confirmed',
})

const FROM_MEDIA = (mediaId, assetId, landscape) => {
  const media = getMediaById(mediaId)
  return {
    id: assetId,
    kind: 'photo',
    src: media.src,
    width: media.width,
    height: media.height,
    alt: media.alt,
    caption: media.caption,
    landscape,
    isIllustrative: media.isIllustrative,
    showsPeople: Boolean(media.showsPeople),
    credit: media.credit,
    licenceNote: null,
  }
}

/** Photography ForestOS supplies for experiences and campaigns. */
export const FORESTOS_PHOTOS = [
  FOREST_PHOTO('mau', 'South West Mau', 'Forest canopy of the Mau Forest Complex above the tea buffer'),
  FOREST_PHOTO('mt-kenya', 'Mount Kenya', 'Forest on the eastern slopes of Mount Kenya'),
  FROM_MEDIA('mau-forest', 'fos-mau-forest', 'South West Mau'),
  FROM_MEDIA('tea-landscape', 'fos-tea-landscape', 'Nyayo Tea Zone'),
  FROM_MEDIA('tea-pickers', 'fos-tea-pickers', 'Nyayo Tea Zone'),
  FROM_MEDIA('farmer-training', 'fos-training', 'Nyayo Tea Zone'),
  FROM_MEDIA('seedling-planted', 'fos-planting', 'Buffer restoration'),
  FROM_MEDIA('nursery-beds', 'fos-nursery', 'Buffer restoration'),
]

/** The mark a brand may place next to verified content, and the rules for it. */
export const VERIFICATION_MARK = {
  id: 'mark-verified-origin',
  name: 'ForestOS verified origin',
  rules: [
    'Only on a pack or page whose QR code resolves to a ForestOS batch record.',
    'Never next to a claim that is not approved in the Content page.',
    'Never recoloured, cropped or redrawn; minimum width 18 mm in print.',
  ],
}

/** Files each brand team uploaded. */
export const BRAND_UPLOADS = [
  { id: 'up-kil-01', brandOrgId: 'org-brand-kilele', name: 'Kilele logo, primary', type: 'SVG', sizeKb: 14, uploadedBy: 'tm-kil-4', uploadedAt: '2026-06-12', usage: 'Logo' },
  { id: 'up-kil-02', brandOrgId: 'org-brand-kilele', name: 'Kilele logo, one colour', variant: 'mono', type: 'SVG', sizeKb: 9, uploadedBy: 'tm-kil-4', uploadedAt: '2026-06-12', usage: 'Logo' },
  { id: 'up-kil-03', brandOrgId: 'org-brand-kilele', name: 'Mau Highland Black tin label, print-ready', type: 'PDF', sizeKb: 4820, uploadedBy: 'tm-kil-3', uploadedAt: '2026-08-18', usage: 'Packaging' },
  { id: 'up-kil-04', brandOrgId: 'org-brand-kilele', name: 'Mau Mornings table talker, A6', type: 'PDF', sizeKb: 2210, uploadedBy: 'tm-kil-4', uploadedAt: '2026-08-27', usage: 'Campaign' },
  { id: 'up-kil-05', brandOrgId: 'org-brand-kilele', name: 'Chai pouch front panel, draft 3', type: 'PDF', sizeKb: 3940, uploadedBy: 'tm-kil-4', uploadedAt: '2026-09-16', usage: 'Packaging' },
  { id: 'up-mc-01', brandOrgId: 'org-brand-maracrest', name: 'Mara Crest crest mark', type: 'SVG', sizeKb: 21, uploadedBy: 'tm-mc-4', uploadedAt: '2026-07-02', usage: 'Logo' },
  { id: 'up-mc-02', brandOrgId: 'org-brand-maracrest', name: 'In-room tea card, 6 properties', type: 'PDF', sizeKb: 1680, uploadedBy: 'tm-mc-2', uploadedAt: '2026-08-21', usage: 'Campaign' },
  { id: 'up-mc-03', brandOrgId: 'org-brand-maracrest', name: 'Sundowner tin artwork, concept', type: 'PNG', sizeKb: 6120, uploadedBy: 'tm-mc-3', uploadedAt: '2026-09-18', usage: 'Packaging' },
  { id: 'up-hg-01', brandOrgId: 'org-brand-halden', name: 'The Halden monogram', type: 'SVG', sizeKb: 11, uploadedBy: 'tm-hg-4', uploadedAt: '2026-08-05', usage: 'Logo' },
  { id: 'up-hg-02', brandOrgId: 'org-brand-halden', name: 'Afternoon tea table card', type: 'PDF', sizeKb: 940, uploadedBy: 'tm-hg-3', uploadedAt: '2026-08-11', usage: 'Campaign' },
  { id: 'up-hg-03', brandOrgId: 'org-brand-halden', name: 'Gift box dieline', type: 'PDF', sizeKb: 2330, uploadedBy: 'tm-hg-2', uploadedAt: '2026-08-09', usage: 'Packaging' },
]

export function getForestosPhoto(id) {
  return FORESTOS_PHOTOS.find((photo) => photo.id === id) ?? null
}
