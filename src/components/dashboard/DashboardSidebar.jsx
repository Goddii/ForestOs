import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  BookMarked,
  Boxes,
  ChevronsUpDown,
  ClipboardCheck,
  Coins,
  FileDown,
  TriangleAlert,
  Landmark,
  LayoutGrid,
  Leaf,
  Map,
  PackageSearch,
  QrCode,
  Radio,
  Satellite,
  ScanLine,
  Scale,
  ShieldCheck,
  Sprout,
  Trees,
  Users,
} from 'lucide-react'
import { ROLES, modulePath } from '../../lib/dashboard/roles'

// Icons by module label — the role data stays plain.
const NAV_ICON = {
  Overview: LayoutGrid,
  'EUDR Compliance': ShieldCheck,
  'Conservation Passports': BookMarked,
  'Fair Pay Telemetry': Coins,
  'Satellite Analytics': Satellite,
  'QR Scan Analytics': QrCode,
  'Campaign Drops': Radio,
  'Audience QR Scans': ScanLine,
  'Conservation Impact': Sprout,
  'Commission & Earnings': Coins,
  'Conservation Passport': BookMarked,
  'Batch Lookup': PackageSearch,
  'ESG Report Export': FileDown,
  'Operations & QC Hub': Boxes,
  'Verification Queue': ClipboardCheck,
  'Problem Reports': TriangleAlert,
  'Landscape Overview': Map,
  'Zone Comparison': Scale,
  'Buffer & Conservation Rollup': Trees,
  'Quality & Rejections': ShieldCheck,
  'Price Configurator': BarChart3,
  'Farmer Training Alerts': Users,
  'Buffer Maintenance': Sprout,
  'Fund Allocation': Landmark,
  'Capital Drawdowns': Coins,
  'Satellite Recovery': Satellite,
  'Impact Audit Logs': ShieldCheck,
}

function navLinkClass({ isActive }) {
  return (
    'group flex items-center gap-2.5 border-l-4 py-2 pl-2.5 pr-2 text-[13px] transition-colors ' +
    (isActive
      ? 'border-emerald-400 bg-emerald-900/60 font-medium text-white'
      : 'border-transparent text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white')
  )
}

const SIDEBAR_CARD = 'rounded-lg border border-emerald-800/50 bg-emerald-900/40 px-3 py-2.5'

function RoleSwitcher({ role }) {
  const navigate = useNavigate()
  return (
    <div className="block">
      <label
        htmlFor="role-view"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/45"
      >
        Role View
      </label>
      <p className="mt-0.5 text-[11px] leading-snug text-emerald-100/55">
        Switches the entire module set for this account.
      </p>
      <div className="relative mt-1.5">
        <select
          id="role-view"
          name="role-view"
          value={role.id}
          onChange={(event) => {
            const next = ROLES.find((entry) => entry.id === event.target.value)
            if (next) navigate(next.base)
          }}
          className="w-full appearance-none rounded-md border border-emerald-800/70 bg-emerald-900/60 py-2 pl-2.5 pr-8 text-[12px] font-medium text-white transition-colors hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          {ROLES.map((entry) => (
            <option key={entry.id} value={entry.id} className="bg-emerald-950 text-white">
              {entry.label}
            </option>
          ))}
        </select>
        <ChevronsUpDown
          className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-100/50"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export default function DashboardSidebar({ role }) {
  const { org } = role
  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 border-b border-emerald-800/50 bg-emerald-950 px-4 py-5 text-emerald-100 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:min-h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Leaf className="h-4 w-4 text-emerald-400" strokeWidth={2.25} aria-hidden="true" />
          ForestOS
        </Link>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-100/45">
          ESG &amp; Compliance Portal
        </p>
      </div>

      <RoleSwitcher role={role} />

      <div className={SIDEBAR_CARD}>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">
          {role.scopeLabel}
        </p>
        <p className="mt-1 text-[13px] font-medium leading-tight text-white">{org.scope}</p>
        <p className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-emerald-100/55">
          {org.code} · since {org.since}
        </p>
      </div>

      <nav className="-mx-1 flex gap-0.5 overflow-x-auto px-1 lg:mx-0 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-0">
        <p className="hidden px-2.5 pb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/40 lg:block">
          Modules
        </p>
        {role.modules.map((item) => {
          const Icon = NAV_ICON[item.label] ?? LayoutGrid
          return (
            <NavLink key={item.label} to={modulePath(role, item.to)} end={item.end} className={navLinkClass}>
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className={SIDEBAR_CARD}>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-100/50">
          Signed in as
        </p>
        <p className="mt-1 text-[13px] font-medium text-white">{org.name}</p>
        <p className="text-[11px] text-emerald-100/70">{org.role}</p>
        <Link
          to="/"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-100/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          Back to public site
        </Link>
      </div>
    </aside>
  )
}
