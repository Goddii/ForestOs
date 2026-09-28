import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import MacroNav from '../components/home/MacroNav'
import MacroFooter from '../components/home/MacroFooter'
import { audienceFrom, dashboardsFor } from '../data/demoDashboards'

function DashboardCard({ dashboard }) {
  return (
    <li
      className={`flex flex-col rounded-2xl border p-6 ${
        dashboard.recommended ? 'border-amber-400/50 bg-amber-400/[0.06]' : 'border-bone/12 bg-forest-900/60'
      }`}
    >
      {dashboard.recommended && (
        <span className="mb-3 self-start rounded-full bg-amber-400 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-forest-950">
          Recommended for you
        </span>
      )}
      <p className="font-display text-2xl leading-tight text-bone">{dashboard.name}</p>
      <p className="mt-1 text-[13px] text-sage-300">{dashboard.forWhom}</p>
      <p className="mt-4 flex-1 text-[14px] leading-relaxed text-bone-300">{dashboard.summary}</p>
      <Link
        to={dashboard.to}
        className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-amber-400/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-400 transition-colors duration-200 hover:border-amber-400 hover:bg-amber-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        Open the demo
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
      </Link>
    </li>
  )
}

/**
 * `/demo` — the one place the demo dashboards are offered from the public
 * site. Information pages link here with `?for=<audience>` so the visitor's
 * own dashboard is listed first. Open to everyone for now: a request form
 * (name, email, organisation) is to be added in front of it later.
 */
export default function RequestDemo() {
  const [params] = useSearchParams()
  const audience = audienceFrom(params.get('for'))
  const dashboards = dashboardsFor(audience)

  useEffect(() => {
    document.title = 'Demo dashboards — ForestOS'
  }, [])

  return (
    <>
      <MacroNav />
      <main className="min-h-svh bg-forest-950 px-6 pb-24 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sage-500">Demo dashboards</p>
          <h1 className="mt-3 max-w-[18ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">See ForestOS working on your side of the tea.</h1>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-sage-300">
            Open any of the dashboards below and explore. Every figure in them is demo data.
          </p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Demo dashboards">
            {dashboards.map((dashboard) => (
              <DashboardCard key={dashboard.id} dashboard={dashboard} />
            ))}
          </ul>

        </div>
      </main>
      <MacroFooter />
    </>
  )
}
