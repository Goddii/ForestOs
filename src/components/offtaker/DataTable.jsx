import EmptyState from '../investor/EmptyState'

/**
 * The portal's one table: the funder console's evidence-table styling
 * (`EvidenceTable`) generalised to any column set. Rows are links when
 * `rowHref`/`onRowClick` is given; numbers right-align with tabular figures.
 *
 * @param {{
 *   columns: Array<{ key: string, header: string, cell: (row: any) => import('react').ReactNode, align?: 'left' | 'right', className?: string }>,
 *   rows: any[],
 *   rowKey: (row: any) => string,
 *   onRowClick?: (row: any) => void,
 *   empty?: string,
 *   minWidth?: string,
 *   caption?: string,
 * }} props
 */
export default function DataTable({ columns, rows, rowKey, onRowClick, empty = 'Nothing matches these filters.', minWidth = '48rem', caption }) {
  if (rows.length === 0) return <EmptyState message={empty} />
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-card">
      <table className="w-full border-collapse text-left text-compact text-ink" style={{ minWidth }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-line bg-canvas font-mono text-label uppercase tracking-label text-ink-faint">
            {columns.map((column) => (
              <th key={column.key} scope="col" className={`px-4 py-3 font-medium ${column.align === 'right' ? 'text-right' : ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              {...(onRowClick
                ? {
                    tabIndex: 0,
                    onClick: () => onRowClick(row),
                    onKeyDown: (event) => event.key === 'Enter' && onRowClick(row),
                    className:
                      'cursor-pointer border-b border-line last:border-b-0 transition-colors duration-150 hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/50',
                  }
                : { className: 'border-b border-line last:border-b-0' })}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 align-top ${column.align === 'right' ? 'text-right tabular-nums' : ''} ${column.className ?? ''}`}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
