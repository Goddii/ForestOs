import { Search } from 'lucide-react'

/**
 * Generic filter row: one search box plus N labeled `<select>` filters, all
 * in one row above the data (dataviz skill's interaction convention). Fully
 * controlled — owns no state itself.
 *
 * @param {{
 *   search: string,
 *   onSearchChange: (value: string) => void,
 *   searchPlaceholder?: string,
 *   filters: Array<{ key: string, label: string, value: string, options: Array<{ value: string, label: string }>, onChange: (value: string) => void }>,
 * }} props
 */
export default function FilterBar({ search, onSearchChange, searchPlaceholder = 'Search…', filters }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[14rem] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="search"
          name="evidence-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-full border border-line bg-card py-2 pl-9 pr-3 text-compact text-ink shadow-sm outline-none transition-all duration-200 ease-in-out placeholder:text-ink-faint hover:border-line-strong focus:border-forest-accent/50 focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.key}
          name={filter.key}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          aria-label={filter.label}
          className="cursor-pointer rounded-full border border-line bg-card px-3.5 py-2 font-mono text-label uppercase tracking-label text-ink-muted shadow-sm outline-none transition-all duration-200 ease-in-out hover:border-line-strong focus:border-forest-accent/50 focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}
