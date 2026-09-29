import { useState } from 'react'
import { BadgeCheck, EyeOff } from 'lucide-react'
import { useCreator } from '../CreatorContext'
import { LockedTag, PageHeader, SectionTitle } from '../ui'

/**
 * The verified conservation story behind the creator's packs, one batch at a
 * time (codes are per batch, so each batch has its own story): the
 * landscape, what was done there, how it was checked, the statements
 * approved for creative use and the imagery that goes with them. What is
 * deliberately withheld is listed too, so the gap is not a surprise.
 */
export default function StoryPage() {
  const { verified: defaultStory, verifiedByBatch, withheld, assets } = useCreator()
  const [batchId, setBatchId] = useState(defaultStory.batchId)
  const verified = verifiedByBatch[batchId] ?? defaultStory
  const statements = verified.statements
  const lead = assets.forestos[0]

  return (
    <div className="space-y-16">
      <PageHeader
        title="The conservation story"
        lede="What ForestOS has verified for each batch of tea in your packs. Use it freely in your own voice; the facts themselves stay as recorded."
        actions={<LockedTag />}
      />

      <div role="group" aria-label="Batch" className="flex flex-wrap gap-2">
        {Object.values(verifiedByBatch).map((story) => (
          <button
            key={story.batchId}
            type="button"
            aria-pressed={story.batchId === batchId}
            onClick={() => setBatchId(story.batchId)}
            className={`rounded-full border px-4 py-1.5 text-compact transition-colors ${
              story.batchId === batchId ? 'border-forest-accent bg-forest-accent text-white' : 'border-line text-ink-muted hover:border-forest-accent/40 hover:text-ink'
            }`}
          >
            Batch #{story.batchId}
            {!story.isVerified && ' (awaiting verification)'}
          </button>
        ))}
      </div>
      {!verified.isVerified && (
        <p className="rounded-xl bg-warning-soft px-4 py-3 text-compact text-ink">
          <span className="font-semibold">Batch #{verified.batchId} is not fully verified yet.</span> Nothing from it can be quoted, and its pack code stays blocked until the checks are complete.
        </p>
      )}

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        {lead && <img src={lead.src} alt={lead.alt} width={lead.width} height={lead.height} className="aspect-[16/9] w-full rounded-2xl object-cover" />}
        <div>
          <SectionTitle>{verified.landscape[0].value}</SectionTitle>
          <dl className="mt-5 grid gap-4">
            {verified.landscape.slice(1).map((fact) => (
              <div key={fact.id} className="grid grid-cols-[9rem_1fr] gap-3 text-compact">
                <dt className="text-ink-faint">{fact.label}</dt>
                <dd className="text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="story-activity">
        <SectionTitle>
          <span id="story-activity">What was done on the ground</span>
        </SectionTitle>
        <dl className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {verified.activity.map((fact) => (
            <div key={fact.id} className="flex flex-col-reverse border-t border-line pt-4">
              <dt className="mt-1 text-compact text-ink-muted">
                {fact.label}
                <span className="block text-compact text-ink-faint">{fact.source}</span>
              </dt>
              <dd className="text-3xl font-semibold tabular-nums text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {verified.pending.map((fact) => (
          <p key={fact.id} className="mt-8 rounded-xl bg-warning-soft px-4 py-3 text-compact text-ink">
            <span className="font-semibold">{fact.label} is not ready to use.</span> {fact.source}. It will appear here once the method is agreed.
          </p>
        ))}
      </section>

      <section aria-labelledby="story-checks" className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionTitle>
            <span id="story-checks">How it was checked</span>
          </SectionTitle>
          <ul className="mt-5 grid gap-3 text-compact">
            {[verified.verification.fieldCheck, verified.verification.satelliteCheck].map((line) => (
              <li key={line} className="flex gap-2.5">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-hidden="true" />
                <span className="text-ink">{line}</span>
              </li>
            ))}
          </ul>
          <a href={verified.proofUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
            Open the public proof record for batch {verified.batchId}
          </a>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink">Not shared with creative partners</h3>
          <ul className="mt-4 grid gap-2 text-compact text-ink-muted">
            {withheld.map((item) => (
              <li key={item} className="flex gap-2.5">
                <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="story-statements">
        <SectionTitle>
          <span id="story-statements">Statements you can quote</span>
        </SectionTitle>
        <p className="mt-2 max-w-[60ch] text-compact text-ink-muted">Approved word for word. Quote them as they are, or pick them in the Studio to place them in an experience.</p>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {statements.map((statement) => (
            <li key={statement.id}>
              <blockquote className="font-display text-2xl leading-snug text-ink">“{statement.text}”</blockquote>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="story-imagery">
        <SectionTitle>
          <span id="story-imagery">Approved imagery</span>
        </SectionTitle>
        <ul className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {assets.forestos.map((photo) => (
            <li key={photo.id} className="mb-4 break-inside-avoid">
              <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" className="h-auto w-full rounded-xl" />
              <p className="mt-2 text-compact text-ink-faint">{photo.title}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
