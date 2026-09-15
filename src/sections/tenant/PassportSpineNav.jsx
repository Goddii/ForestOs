import { PASSPORT_STAGES } from '../../lib/passportStages'

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * The literal "passport" device — a spine of numbered stops tracking which
 * of the 7 stages this visitor has scrolled through, plus a mobile
 * equivalent as a top strip (a fixed left rail doesn't fit a phone screen).
 * `TenantPassportView` drives `reached` via one `IntersectionObserver`
 * watching all 7 section wrappers.
 */
export default function PassportSpineNav({ reached, tenantKicker }) {
  return (
    <>
      <aside
        className="fixed left-0 top-0 z-50 hidden h-full w-16 flex-col items-center border-r border-forest-700 bg-forest-950/92 py-8 backdrop-blur-sm md:flex"
        aria-label="Passport progress"
      >
        <span
          className="mb-6 font-mono text-[8px] uppercase tracking-[0.25em] text-sage-500"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          ForestOS
        </span>

        <nav className="my-auto flex flex-col items-center">
          {PASSPORT_STAGES.map((stage, i) => {
            const done = reached.has(stage.id)
            return (
              <div key={stage.id} className="flex flex-col items-center">
                {i > 0 && (
                  <div className={`h-5 w-px transition-colors duration-700 ${done ? 'bg-amber-400/40' : 'bg-forest-700'}`} />
                )}
                <button
                  type="button"
                  onClick={() => jumpTo(stage.id)}
                  title={stage.label}
                  className="group relative flex flex-col items-center"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-700 ${
                      done ? 'border-amber-400 bg-amber-400/10' : 'border-forest-700 bg-transparent'
                    }`}
                  >
                    <span className={`font-mono text-[9px] transition-colors duration-700 ${done ? 'text-amber-400' : 'text-sage-500/60'}`}>
                      {stage.num}
                    </span>
                  </div>
                  <span className="pointer-events-none absolute left-10 whitespace-nowrap rounded border border-forest-700 bg-forest-800 px-2 py-1 font-mono text-[10px] text-sage-300 opacity-0 transition-opacity group-hover:opacity-100">
                    {stage.label}
                  </span>
                </button>
              </div>
            )
          })}
        </nav>

        <span
          className="mt-6 font-mono text-[8px] uppercase tracking-[0.25em] text-sage-500"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {tenantKicker}
        </span>
      </aside>

      <div
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-2 border-b border-forest-700 bg-forest-950/92 px-4 py-3 backdrop-blur-sm md:hidden"
        aria-label="Passport progress"
      >
        <span className="mr-1 font-mono text-[9px] uppercase tracking-widest text-sage-500">ForestOS</span>
        {PASSPORT_STAGES.map((stage) => {
          const done = reached.has(stage.id)
          return (
            <button key={stage.id} type="button" onClick={() => jumpTo(stage.id)} aria-label={stage.label}>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-500 ${
                  done ? 'border-amber-400 bg-amber-400/15' : 'border-forest-700 bg-transparent'
                }`}
              >
                <span className={`font-mono text-[7px] ${done ? 'text-amber-400' : 'text-sage-500/60'}`}>{stage.num}</span>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
