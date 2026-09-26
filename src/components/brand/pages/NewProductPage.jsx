import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ShieldCheck, TreePine } from 'lucide-react'
import { PACK_TYPE_LABELS } from '../../../data/brand/products'
import { formatKg } from '../../../lib/offtaker/format'
import { useBrand, useBrandPath } from '../BrandWorkspaceContext'
import PageHeader from '../../offtaker/PageHeader'
import ActionButton from '../../investor/ui/ActionButton'
import PermissionNote from '../PermissionNote'
import PackRender from '../PackRender'
import Field, { ChoiceCard, ChoiceGroup, inputClass } from '../Field'
import { LotVerificationBadge } from '../StatusBadges'

const EMPTY = {
  name: '',
  line: '',
  teaType: '',
  description: '',
  packType: 'tin',
  size: '',
  material: '',
  qrPlacement: '',
  channel: '',
  lotTraceId: '',
  kg: '',
  createExperience: true,
}

/** Field-level problems, keyed by field; empty when the form can be saved. */
function validate(form, lots) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Give the product a name.'
  if (!form.teaType.trim()) errors.teaType = 'Say what tea it is, for example “Black tea, CTC”.'
  if (!form.size.trim()) errors.size = 'Add the pack size.'
  if (!form.qrPlacement.trim()) errors.qrPlacement = 'Say where the QR code is printed.'
  if (form.lotTraceId) {
    const lot = lots.find((entry) => entry.traceId === form.lotTraceId)
    const kg = Number(form.kg)
    if (!Number.isFinite(kg) || kg <= 0) errors.kg = 'Enter how many kilograms of this lot to reserve.'
    else if (lot && kg > lot.remainingKg) errors.kg = `Only ${formatKg(lot.remainingKg)} of this lot is unallocated.`
  }
  return errors
}

export default function NewProductPage() {
  const ws = useBrand()
  const path = useBrandPath()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))

  if (!ws.permissions.manageProducts) {
    return (
      <div>
        <PageHeader title="New product" />
        <PermissionNote permission="manageProducts" />
      </div>
    )
  }

  const selectedLot = ws.availableLots.find((lot) => lot.traceId === form.lotTraceId) ?? null
  const preview = {
    name: form.name || 'Product name',
    line: form.line,
    packaging: { type: form.packType, size: form.size || 'Pack size' },
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(form, ws.availableLots)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const id = ws.addProduct({
      product: {
        name: form.name.trim(),
        line: form.line.trim() || 'Unassigned range',
        teaType: form.teaType.trim(),
        description: form.description.trim(),
        packaging: { type: form.packType, size: form.size.trim(), material: form.material.trim() || 'To be confirmed', qrPlacement: form.qrPlacement.trim() },
        channel: form.channel.trim() || 'To be confirmed',
        status: 'draft',
        launchDate: null,
      },
      sourcing: selectedLot ? { batchTraceId: selectedLot.traceId, allocatedKg: Number(form.kg), status: 'scheduled', date: ws.asOf } : null,
      createExperience: form.createExperience,
    })
    navigate(path(`products/${id}`))
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link to={path('products')} className="inline-flex items-center gap-1 text-compact text-ink-muted hover:text-forest-accent">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Products
        </Link>
      </nav>
      <PageHeader
        title="New product"
        description="Describe the product and packaging, then connect the lot it will be packed from. The lot’s origin and conservation record come from ForestOS; you cannot edit them."
      />

      <form onSubmit={handleSubmit} noValidate className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section className="space-y-5" aria-label="The product">
            <h2 className="text-lg font-bold text-ink">The product</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Product name" error={errors.name}>
                {(props) => <input {...props} className={inputClass} value={form.name} onChange={set('name')} autoComplete="off" />}
              </Field>
              <Field label="Range" optional helper="The line it sits in, for example “Origin Teas”.">
                {(props) => <input {...props} className={inputClass} value={form.line} onChange={set('line')} />}
              </Field>
              <Field label="Tea" error={errors.teaType}>
                {(props) => <input {...props} className={inputClass} value={form.teaType} onChange={set('teaType')} />}
              </Field>
              <Field label="Where it is sold or served" optional>
                {(props) => <input {...props} className={inputClass} value={form.channel} onChange={set('channel')} />}
              </Field>
              <Field label="Description" optional helper="Your words. Claims about origin or conservation belong in Content & claims, where ForestOS checks them." className="md:col-span-2">
                {(props) => <textarea {...props} rows={3} className={inputClass} value={form.description} onChange={set('description')} />}
              </Field>
            </div>
          </section>

          <section className="space-y-5" aria-label="Packaging">
            <h2 className="text-lg font-bold text-ink">Packaging</h2>
            <ChoiceGroup legend="Pack type">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Object.entries(PACK_TYPE_LABELS).map(([key, label]) => (
                  <ChoiceCard key={key} name="packType" value={key} checked={form.packType === key} onChange={set('packType')}>
                    <span className="text-compact font-semibold text-ink">{label}</span>
                  </ChoiceCard>
                ))}
              </div>
            </ChoiceGroup>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Pack size" error={errors.size}>
                {(props) => <input {...props} className={inputClass} value={form.size} onChange={set('size')} placeholder="100 g loose leaf" />}
              </Field>
              <Field label="Material" optional>
                {(props) => <input {...props} className={inputClass} value={form.material} onChange={set('material')} />}
              </Field>
              <Field label="QR code placement" error={errors.qrPlacement}>
                {(props) => <input {...props} className={inputClass} value={form.qrPlacement} onChange={set('qrPlacement')} placeholder="Back label" />}
              </Field>
            </div>
          </section>

          <section className="space-y-5" aria-label="Tea source">
            <h2 className="text-lg font-bold text-ink">Tea source</h2>
            <ChoiceGroup
              legend="Lot to pack from"
              helper={`Lots ${ws.packer.name} holds for its customers, with the volume no other brand has reserved. You can connect a lot later.`}
            >
              <div className="grid gap-2 lg:grid-cols-2">
                <ChoiceCard name="lot" value="" checked={form.lotTraceId === ''} onChange={set('lotTraceId')}>
                  <span className="text-compact font-semibold text-ink">Connect a lot later</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">The product stays a draft and cannot carry a QR experience until it has a lot.</span>
                </ChoiceCard>
                {ws.availableLots.map((lot) => (
                  <ChoiceCard key={lot.traceId} name="lot" value={lot.traceId} checked={form.lotTraceId === lot.traceId} onChange={set('lotTraceId')}>
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-compact font-semibold text-ink">
                        Lot #{lot.code}, {lot.block}
                      </span>
                      <LotVerificationBadge status={lot.verificationStatus} />
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                      {lot.region}. Grade {lot.grade}, {lot.harvestMonth}. {formatKg(lot.remainingKg)} unallocated of {formatKg(lot.madeTeaKg)}.
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
                      {lot.centre?.segmentIds.length > 0 ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 text-forest-accent" aria-hidden="true" /> Beside verified buffer conservation work
                        </>
                      ) : (
                        <>
                          <TreePine className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" /> Verified origin only; no conservation work linked yet
                        </>
                      )}
                    </span>
                  </ChoiceCard>
                ))}
              </div>
            </ChoiceGroup>
            {selectedLot && (
              <Field label="Kilograms to reserve" error={errors.kg} helper={`Up to ${formatKg(selectedLot.remainingKg)}.`} className="max-w-xs">
                {(props) => <input {...props} type="number" inputMode="numeric" min={1} max={selectedLot.remainingKg} className={inputClass} value={form.kg} onChange={set('kg')} />}
              </Field>
            )}
          </section>

          <label className="flex items-start gap-3 rounded-xl border border-line p-4">
            <input type="checkbox" checked={form.createExperience} onChange={set('createExperience')} className="mt-0.5 h-4 w-4 accent-[var(--color-forest-accent)]" />
            <span>
              <span className="text-compact font-semibold text-ink">Start a QR experience for this product</span>
              <span className="mt-0.5 block text-xs text-ink-muted">A draft on the Verified batch story template. Nothing is published until you publish it.</span>
            </span>
          </label>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="text-compact font-medium text-danger">
              Fix the {Object.keys(errors).length} highlighted field{Object.keys(errors).length === 1 ? '' : 's'} to save the product.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <ActionButton type="submit" variant="primary" icon={null}>
              Save product
            </ActionButton>
            <ActionButton to={path('products')} variant="ghost" icon={null}>
              Cancel
            </ActionButton>
          </div>
        </div>

        <aside className="xl:sticky xl:top-8 xl:self-start" aria-label="Pack preview">
          <PackRender product={preview} kit={ws.kit} />
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">A generated render in your brand colours. Upload real pack artwork in Assets.</p>
        </aside>
      </form>
    </div>
  )
}
