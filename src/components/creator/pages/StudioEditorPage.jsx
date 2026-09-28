import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import PhonePreview from '../PhonePreview'
import { LinksPanel, MediaPanel, SectionsPanel, StatementsPanel, WordsPanel } from '../studio/CreativePanels'
import VerifiedPanel from '../studio/VerifiedPanel'
import PublishPanel from '../studio/PublishPanel'
import { inputClass } from '../../brand/Field'

const blockOf = (story) => story.landscape.find((fact) => fact.id === 'block').value

/**
 * The Studio editor for one experience: creative controls on the left, the
 * live mobile preview and publishing on the right. Every change is saved to
 * the session as it is made (there is no backend) through the creative-only
 * filter, and the preview redraws from the same data.
 *
 * Pack codes are issued per batch, so the verified layer a scanner sees
 * depends on the batch in their pack; the preview can show any batch this
 * experience is printed on.
 */
export default function StudioEditorPage() {
  const { experienceId } = useParams()
  const { experiences, packCodes, verified: defaultStory, verifiedByBatch, saveCreative, publish } = useCreator()
  const path = useCreatorPath()
  const [previewBatchId, setPreviewBatchId] = useState(null)
  const experience = experiences.find((entry) => entry.id === experienceId)
  if (!experience) return <Navigate to={path('studio')} replace />

  const { creative, template, campaign } = experience
  const onChange = (changes) => saveCreative(experience.id, changes)
  const codes = packCodes.filter((code) => code.experienceId === experience.id)
  const batchIds = [...new Set(codes.map((code) => code.batchId))]
  const activeBatchId = batchIds.includes(previewBatchId) ? previewBatchId : batchIds[0]
  const verified = (activeBatchId && verifiedByBatch[activeBatchId]) || defaultStory
  const productNames = [...new Set(codes.map((code) => code.product.name))].join(', ') || campaign.product

  return (
    <div>
      <Link to={path('studio')} className="inline-flex items-center gap-1.5 text-compact font-semibold text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Experience Studio
      </Link>
      <header className="mt-4">
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{experience.name}</h1>
        <p className="mt-2 text-compact text-ink-muted">
          {campaign.title}, on the {template.name} template, printed on {productNames}. Changes are kept for this session.
        </p>
      </header>

      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-8">
          <WordsPanel creative={creative} onChange={onChange} />
          <SectionsPanel creative={creative} template={template} onChange={onChange} />
          <MediaPanel creative={creative} onChange={onChange} />
          <LinksPanel creative={creative} onChange={onChange} />
          <StatementsPanel creative={creative} statements={defaultStory.statements} onChange={onChange} />
          <VerifiedPanel verified={verified} storyPath={path('story')} />
        </div>

        <aside className="grid content-start gap-6 xl:sticky xl:top-6 xl:self-start" aria-label="Preview and publish">
          {batchIds.length > 1 && (
            <label className="grid gap-1.5 text-compact font-semibold text-ink">
              Preview a pack from batch
              <select className={inputClass} value={activeBatchId} onChange={(event) => setPreviewBatchId(event.target.value)}>
                {batchIds.map((batchId) => (
                  <option key={batchId} value={batchId}>
                    #{batchId}, {blockOf(verifiedByBatch[batchId])}
                    {verifiedByBatch[batchId].isVerified ? '' : ' (awaiting verification)'}
                  </option>
                ))}
              </select>
            </label>
          )}
          <PhonePreview creative={creative} template={template} verified={verified} statements={verified.statements} product={productNames} />
          <PublishPanel experience={experience} codes={codes} qrPath={path('qr')} onPublish={() => publish(experience.id)} />
        </aside>
      </div>
    </div>
  )
}
