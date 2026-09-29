import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, CircleAlert, MapPin } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { CodeStateBadge, PageHeader, SectionTitle, formatDate } from '../ui'
import Field, { inputClass } from '../../brand/Field'
import { PACK_TYPE_LABELS } from '../../../data/creator/products'
import { bookingCheck } from '../../../lib/creator/booking'

const DAY_MS = 86_400_000
const addDays = (iso, days) => new Date(Date.parse(iso) + days * DAY_MS).toISOString().slice(0, 10)
const factOf = (story, id) => story.landscape.find((fact) => fact.id === id)?.value

/** Where one batch came from, in a line a fan could read. */
function Origin({ story }) {
  return (
    <p className="flex items-start gap-1.5 text-compact text-ink">
      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-accent" aria-hidden="true" />
      <span>
        {factOf(story, 'block')}, {factOf(story, 'landscape')}, collected at {factOf(story, 'source-location')}
      </span>
    </p>
  )
}

function VerificationLine({ story }) {
  return story.isVerified ? (
    <p className="flex items-center gap-1.5 text-compact text-forest-accent-dark">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> {story.verification.standard}, verified
    </p>
  ) : (
    <p className="flex items-center gap-1.5 text-compact text-warning">
      <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" /> Verification in progress. {story.verification.satelliteCheck}
    </p>
  )
}

/**
 * The tea behind the campaigns, made visible: each product with where every
 * batch in it came from, then the sealed batches still free to book. A
 * booking becomes that product's pack code for the batch (codes are per
 * batch), ready to sell with the product's QR experience.
 */
export default function TeaPage() {
  const { campaigns, availableBatches } = useCreator()
  const path = useCreatorPath()
  // A booked batch leaves the available list at once, so the confirmation lives here.
  const [justBooked, setJustBooked] = useState(null)
  const products = campaigns.flatMap((campaign) => campaign.products.map((product) => ({ ...product, campaign })))

  return (
    <div className="space-y-16">
      <PageHeader
        title="Tea and batches"
        lede="The tea ForestOS packs for your campaigns, where every batch was grown, and the verified batches you can book next. Each batch you book gets its own QR code."
      />

      <section aria-labelledby="tea-yours">
        <SectionTitle>
          <span id="tea-yours">Your tea</span>
        </SectionTitle>
        <div className="mt-8 grid gap-14">
          {products.map((product) => (
            <article key={product.id} className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
              <div>
                <img src={product.image.src} alt={product.image.alt} className="aspect-[3/2] w-full rounded-2xl object-cover" loading="lazy" />
                <h3 className="mt-4 font-display text-3xl leading-tight text-ink">{product.name}</h3>
                <p className="text-compact text-ink-muted">
                  {product.teaType}, for {product.campaign.title}
                </p>
                <ul className="mt-3 grid gap-1 text-compact text-ink-muted">
                  {product.packs.map((pack) => (
                    <li key={pack.type}>
                      {PACK_TYPE_LABELS[pack.type]} {pack.size}, {pack.material.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">Where each batch comes from</h4>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {product.codes.map((code) => (
                    <li key={code.id} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                      <div className="grid gap-1.5">
                        <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                          Batch #{code.batchId} <CodeStateBadge state={code.state} />
                        </p>
                        <Origin story={code.batch} />
                        <p className="text-compact text-ink-muted">
                          Sealed {formatDate(code.batch.sealedAt)}, {code.packs.toLocaleString('en-GB')} packs {code.status === 'packed' ? `packed ${formatDate(code.date)}` : `scheduled for ${formatDate(code.date)}`}
                        </p>
                        <VerificationLine story={code.batch} />
                      </div>
                      <div className="flex gap-4 text-compact font-semibold sm:flex-col sm:items-end sm:gap-1">
                        <a href={code.batch.proofUrl} target="_blank" rel="noreferrer" className="text-forest-accent hover:text-forest-accent-dark">
                          Batch record
                        </a>
                        <Link to={path('qr')} className="text-forest-accent hover:text-forest-accent-dark">
                          QR code
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="tea-available">
        <SectionTitle>
          <span id="tea-available">Available batches</span>
        </SectionTitle>
        <p className="mt-2 max-w-[62ch] text-compact text-ink-muted">
          Sealed batches no buyer or brand holds. Book one for a product and ForestOS packs it with its own QR code, opening that product’s experience with this batch’s record.
        </p>
        {justBooked && (
          <p role="status" className="mt-6 rounded-xl bg-forest-accent-soft px-4 py-3 text-compact text-forest-accent-dark">
            Batch #{justBooked.batchId} booked for {justBooked.productName}. It is now listed under that product above, and its code is on the{' '}
            <Link to={path('qr')} className="font-semibold underline underline-offset-2">
              QR codes
            </Link>{' '}
            page{justBooked.isVerified ? ', scheduled for packing.' : ', blocked until verification completes.'}
          </p>
        )}
        {availableBatches.length === 0 ? (
          <p className="mt-6 rounded-xl bg-canvas px-4 py-3 text-compact text-ink-muted">No free batches right now. New batches appear here once they are sealed at the factory.</p>
        ) : (
          <ul className="mt-6 grid gap-6 lg:grid-cols-2">
            {availableBatches.map((batch) => (
              <li key={batch.batchId} className="rounded-2xl border border-line p-5">
                <AvailableBatch batch={batch} products={products} onBooked={setJustBooked} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function AvailableBatch({ batch, products, onBooked }) {
  const { bookBatch, asOf } = useCreator()
  const [form, setForm] = useState({ productId: products[0]?.id ?? '', packs: '', date: addDays(asOf, 14) })
  const [attempted, setAttempted] = useState(false)
  const product = products.find((entry) => entry.id === form.productId)
  const check = bookingCheck({ batch, bookedKg: batch.bookedKg, packs: Number(form.packs), packKg: product?.packKg ?? 0 })
  const dateError = form.date <= asOf ? 'Choose a packing date after today.' : null
  const leftKg = batch.madeTeaKg - batch.bookedKg

  const submit = (event) => {
    event.preventDefault()
    setAttempted(true)
    if (!check.ok || dateError || !product) return
    bookBatch({ productId: product.id, batchId: batch.batchId, packs: Number(form.packs), date: form.date })
    onBooked({ batchId: batch.batchId, productName: product.name, isVerified: batch.isVerified })
  }

  return (
    <div className="grid gap-4">
      <div>
        <p className="font-display text-2xl text-ink">Batch #{batch.batchId}</p>
        <div className="mt-1.5 grid gap-1.5">
          <Origin story={batch} />
          <p className="text-compact text-ink-muted">
            Sealed {formatDate(batch.sealedAt)}, {leftKg.toLocaleString('en-GB')} kg of made tea free
          </p>
          <VerificationLine story={batch} />
          <a href={batch.proofUrl} target="_blank" rel="noreferrer" className="text-compact font-semibold text-forest-accent hover:text-forest-accent-dark">
            Batch record
          </a>
        </div>
      </div>

      {batch.deliveryFlagged ? (
        <p className="rounded-xl bg-warning-soft px-4 py-3 text-compact text-ink">
          Not bookable yet: the delivery weigh-in for this batch is flagged and the reconciliation is still open.
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-3 border-t border-line pt-4 sm:grid-cols-3 sm:items-start">
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Product
            <select className={inputClass} value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })}>
              {products.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Packs" error={attempted && !check.ok ? check.reason : null}>
            {(props) => (
              <input {...props} type="number" min={1} step={1} inputMode="numeric" className={inputClass} value={form.packs} onChange={(event) => setForm({ ...form, packs: event.target.value })} />
            )}
          </Field>
          <Field label="Pack from" error={attempted ? dateError : null}>
            {(props) => <input {...props} type="date" className={inputClass} value={form.date} min={addDays(asOf, 1)} onChange={(event) => setForm({ ...form, date: event.target.value })} />}
          </Field>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
            <button type="submit" className="rounded-full bg-forest-accent px-5 py-2 text-compact font-semibold text-white transition-colors hover:bg-forest-accent-dark active:translate-y-px">
              Book this batch
            </button>
            {check.ok && <span className="text-compact text-ink-muted">Uses {check.kg.toLocaleString('en-GB')} kg of made tea</span>}
          </div>
        </form>
      )}
    </div>
  )
}
