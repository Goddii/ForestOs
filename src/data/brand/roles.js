// DEMO DATA — the roles a person on a brand team can hold, and what each may
// do in the Brand Portal. Applied at the workspace boundary
// (data/brand/workspace.js) the same way the offtaker workspace applies its
// roles: a control a role may not use is replaced by a plain note, never
// hidden with CSS.
//
// No role can edit ForestOS-verified data. Evidence, verification states and
// approved metric values come from NTZDC and ForestOS records; a brand only
// chooses which approved items to show and how to present them.

/**
 * @typedef {Object} BrandPermissions
 * @property {boolean} manageProducts      create and edit products and their sourcing
 * @property {boolean} manageCampaigns     create and edit campaigns
 * @property {boolean} editContent         write brand content and submit claims for review
 * @property {boolean} publishExperiences  publish or unpublish a QR experience
 * @property {boolean} viewAnalytics       scan and engagement analytics
 * @property {boolean} manageTeam          invite people and change roles
 */

/** @type {Record<string, { label: string, description: string, permissions: BrandPermissions }>} */
export const BRAND_ROLE_CONFIG = {
  brand_lead: {
    label: 'Brand lead',
    description: 'Owns the brand’s tea products and signs off what goes in front of guests and customers.',
    permissions: { manageProducts: true, manageCampaigns: true, editContent: true, publishExperiences: true, viewAnalytics: true, manageTeam: false },
  },
  marketing: {
    label: 'Marketing',
    description: 'Plans campaigns, writes content and submits claims for ForestOS review.',
    permissions: { manageProducts: false, manageCampaigns: true, editContent: true, publishExperiences: false, viewAnalytics: true, manageTeam: false },
  },
  product: {
    label: 'Product',
    description: 'Develops products, packaging and the batches each product is packed from.',
    permissions: { manageProducts: true, manageCampaigns: false, editContent: true, publishExperiences: false, viewAnalytics: true, manageTeam: false },
  },
  agency: {
    label: 'Agency partner',
    description: 'An outside creative agency: drafts content and campaign material for the brand team to approve.',
    permissions: { manageProducts: false, manageCampaigns: false, editContent: true, publishExperiences: false, viewAnalytics: true, manageTeam: false },
  },
  admin: {
    label: 'Workspace admin',
    description: 'Manages the workspace and its team; can do everything the brand is permitted to do.',
    permissions: { manageProducts: true, manageCampaigns: true, editContent: true, publishExperiences: true, viewAnalytics: true, manageTeam: true },
  },
}

export const BRAND_PERMISSION_LABELS = {
  manageProducts: 'Create and edit products',
  manageCampaigns: 'Create and edit campaigns',
  editContent: 'Write content and submit claims',
  publishExperiences: 'Publish QR experiences',
  viewAnalytics: 'View scan analytics',
  manageTeam: 'Invite people and change roles',
}

/** What every brand may and may not do, whatever the role. Shown on Settings. */
export const BRAND_DATA_POLICY = {
  brandControls: [
    'Logo, colours, campaign title, hero media and story on each QR experience',
    'Which approved impact statements appear, and in what order',
    'Calls to action, social, music and community links',
    'Product names, packaging and the campaigns products belong to',
  ],
  forestosControls: [
    'Batch origin, plot, harvest and processing records',
    'Verification states and who verified each record',
    'Every impact figure and the wording that figure supports',
    'Whether a claim is approved, needs rewording or cannot be made yet',
  ],
  analyticsFloor: 10,
  analyticsNotes: [
    'Scans are counted without cookies and without collecting names, phone numbers or emails.',
    'Location is resolved to county or country only, never to a street or device.',
    'Any location with fewer than 10 scans is folded into “Other locations”.',
  ],
}
