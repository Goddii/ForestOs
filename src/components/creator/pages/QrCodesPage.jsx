import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useCreator, useCreatorPath } from '../CreatorContext'
import { CodeStateBadge, PageHeader, formatDate } from '../ui'
import QrCode, { downloadQrSvg } from '../../brand/QrCode'
import { PACK_TYPE_LABELS } from '../../../data/creator/products'

const STATE_NOTE = {
  live: 'On shelves. Scans open this batch’s verified record.',
  proof: 'The experience is not published yet, so this code is a proof and counts nothing.',
  scheduled: 'Batch verified. The code goes on packs when packing starts.',
  blocked: 'This batch is not fully verified yet. The code cannot be printed until it is.',
}

/**
 * The pack codes ForestOS prints on each product, one per batch. A code
 * opens the product's experience with the verified record of the batch in
 * that pack underneath, so every batch has its own code and its own scans.
 */
export default function QrCodesPage() {
  const { campaigns } = useCreator()
  const path = useCreatorPath()
  const products = campaigns.flatMap((campaign) => campaign.products.map((product) => ({ ...product, campaign })))

  return (
    <div className="space-y-14">
      <PageHeader
        title="QR codes"
        lede="ForestOS prints one code per batch on every pack. A new batch gets a new code, so each scan shows the forest and the checks behind the exact tea in that pack."
      />

      {products.map((product) => (
        <section key={product.id} aria-labelledby={`codes-${product.id}`}>
          <div className="flex flex-wrap items-end gap-5">
            <img src={product.image.src} alt={product.image.alt} className="h-20 w-28 rounded-lg object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <h2 id={`codes-${product.id}`} className="font-display text-3xl leading-tight text-ink">
                {product.name}
              </h2>
              <p className="text-compact text-ink-muted">
                {product.campaign.title}, {product.packs.map((pack) => `${PACK_TYPE_LABELS[pack.type].toLowerCase()} ${pack.size}`).join(' and ')}
              </p>
            </div>
          </div>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            {product.codes.map((code) => {
              const url = `${window.location.origin}${code.destination}`
              const isLive = code.state === 'live'
              return (
                <li key={code.id} className="grid gap-6 py-6 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,15rem)] md:items-start">
                  <QrCode value={url} label={`QR code for ${product.name}, batch ${code.batchId}`} size={112} className={`border border-line ${isLive ? '' : 'opacity-45'}`} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-ink">Batch #{code.batchId}</h3>
                      <CodeStateBadge state={code.state} />
                    </div>
                    <p className="mt-1 text-compact text-ink-muted">{STATE_NOTE[code.state]}</p>
                    <dl className="mt-3 grid gap-x-6 gap-y-2 text-compact sm:grid-cols-2">
                      <div>
                        <dt className="text-ink-faint">From</dt>
                        <dd className="text-ink">{code.batch.landscape.find((fact) => fact.id === 'block').value}, sealed {formatDate(code.batch.sealedAt)}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-faint">{code.status === 'packed' ? 'Packed' : 'Packing scheduled'}</dt>
                        <dd className="text-ink">
                          {formatDate(code.date)}, {code.packs.toLocaleString('en-GB')} packs
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-ink-faint">Printed on</dt>
                        <dd className="text-ink">{product.packs.map((pack) => `${PACK_TYPE_LABELS[pack.type]}: ${pack.qrPlacement.toLowerCase()}`).join('. ')}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-ink-faint">Opens</dt>
                        <dd className="break-all font-mono text-compact text-ink">{url}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="grid gap-4">
                    <dl className="grid grid-cols-2 gap-4 text-compact">
                      <div>
                        <dt className="text-ink-faint">Scans</dt>
                        <dd className="text-xl font-semibold tabular-nums text-ink">{code.stats.scans.toLocaleString('en-GB')}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-faint">Last scan</dt>
                        <dd className="text-ink">{formatDate(code.stats.lastScan)}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-wrap gap-3 text-compact font-semibold">
                      {code.state !== 'blocked' && (
                        <button
                          type="button"
                          onClick={() => downloadQrSvg(url, `${code.id}.svg`)}
                          className="inline-flex items-center gap-1 text-forest-accent hover:text-forest-accent-dark"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" /> Download SVG
                        </button>
                      )}
                      <a href={code.batch.proofUrl} target="_blank" rel="noreferrer" className="text-forest-accent hover:text-forest-accent-dark">
                        Batch record
                      </a>
                      <Link to={path(`studio/${code.experienceId}`)} className="text-forest-accent hover:text-forest-accent-dark">
                        Experience
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
