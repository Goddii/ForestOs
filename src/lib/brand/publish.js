/**
 * Whether a QR experience can go live, as a checklist a brand can act on.
 * The brand controls the presentation checks; ForestOS controls the
 * verification checks, and a brand cannot publish past a failing one.
 * Pure: reads the experience and its context, returns a new result.
 */

const isFilled = (text) => typeof text === 'string' && text.trim().length > 0

const normalise = (text) => text.toLowerCase().replace(/[’']/g, "'").replace(/[.\s]+$/, '').replace(/\s+/g, ' ')

/**
 * The brand's submitted claims that a story repeats word for word (ignoring
 * case and the closing full stop): a claim does not become safe by being
 * pasted into an experience instead of onto a pack.
 *
 * @template {{ statement: string }} T
 * @param {string} story
 * @param {T[]} claims
 * @returns {T[]}
 */
export function claimsRepeatedIn(story, claims) {
  const text = normalise(story ?? '')
  return claims.filter((claim) => text.includes(normalise(claim.statement)))
}
const isLink = (href) => isFilled(href) && /^https?:\/\//.test(href.trim())

/**
 * @param {{ productId: string | null, batchTraceId: string | null, customisation: { title: string, story: string, metricIds: string[], cta: { label: string, href: string } } }} experience
 * @param {{ products: Array<{ id: string }>, lotStatus: (traceId: string) => string | null, approvedMetricIds: Set<string>, claimsInStory: Array<{ status: string }> }} context
 * @returns {{ canPublish: boolean, checks: Array<{ key: string, label: string, ok: boolean, owner: 'brand' | 'forestos', detail: string }> }}
 */
export function publishReadiness(experience, context) {
  const { customisation } = experience
  const lotStatus = experience.batchTraceId ? context.lotStatus(experience.batchTraceId) : null
  const unapprovedMetrics = customisation.metricIds.filter((id) => !context.approvedMetricIds.has(id))
  const blockedClaims = context.claimsInStory.filter((claim) => claim.status !== 'approved')
  const optionalLinks = [customisation.musicLink, customisation.communityLink, ...(customisation.socialLinks ?? []).map((link) => link.href)].filter(isFilled)
  const badLinks = optionalLinks.filter((href) => !isLink(href))

  const checks = [
    {
      key: 'product',
      label: 'Connected to a product',
      owner: 'brand',
      ok: context.products.some((product) => product.id === experience.productId),
      detail: 'Pick the product this QR code is printed on.',
    },
    {
      key: 'batch',
      label: 'Connected to a verified lot',
      owner: 'forestos',
      ok: lotStatus === 'Verified',
      detail: lotStatus ? `The connected lot is ${lotStatus.toLowerCase()}, not verified.` : 'Connect the lot this product is packed from.',
    },
    {
      key: 'metrics',
      label: 'Impact statements approved',
      owner: 'forestos',
      ok: unapprovedMetrics.length === 0,
      detail: `${unapprovedMetrics.length} selected statement${unapprovedMetrics.length === 1 ? ' is' : 's are'} not approved for this product’s lot.`,
    },
    {
      key: 'claims',
      label: 'Story claims approved',
      owner: 'forestos',
      ok: blockedClaims.length === 0,
      detail: `The story repeats ${blockedClaims.length} claim${blockedClaims.length === 1 ? '' : 's'} ForestOS has not approved. Use the approved wording.`,
    },
    { key: 'title', label: 'Campaign title', owner: 'brand', ok: isFilled(customisation.title), detail: 'Add a title.' },
    { key: 'story', label: 'Brand story', owner: 'brand', ok: isFilled(customisation.story), detail: 'Write the story guests read under your logo.' },
    {
      key: 'cta',
      label: 'Call to action',
      owner: 'brand',
      ok: isFilled(customisation.cta.label) && isLink(customisation.cta.href),
      detail: 'Give the button a label and a full https:// link.',
    },
    {
      key: 'links',
      label: 'Links are web addresses',
      owner: 'brand',
      ok: badLinks.length === 0,
      detail: `${badLinks.length} social, music or community link${badLinks.length === 1 ? ' does' : 's do'} not start with https:// or http://.`,
    },
  ]

  return { canPublish: checks.every((check) => check.ok), checks }
}
