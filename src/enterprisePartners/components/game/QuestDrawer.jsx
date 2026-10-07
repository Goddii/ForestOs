import { Check, Compass, Eye, Gift, Mountain, Zap } from 'lucide-react'
import { ConceptTag } from '../ui'

const ICONS = {
  'origin-explorer': Compass,
  'ridge-witness': Mountain,
  'plot-detective': Eye,
  'pledge-plant': Gift,
  'pledge-cup': Gift,
  crossover: Zap,
}

/**
 * The quest drawer (brief 5.4): at most three quests, each tied to a real
 * feature, plus exactly one "next best action" nudge — never more than one
 * prompt per session.
 */
export default function QuestDrawer({ quests = [], nextAction = null, className = '' }) {
  return (
    <section className={className} aria-label="Quests">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage-500">
          Quests · this session
        </p>
        <ConceptTag>Illustrative XP</ConceptTag>
      </div>

      {quests.length === 0 ? (
        <p className="mt-3 text-[13px] text-bone-500">Verify a pack to unlock quests.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {quests.map(({ quest, current, target, complete, pct }) => {
            const Icon = ICONS[quest.id] ?? Compass
            return (
              <li
                key={quest.id}
                className={
                  'rounded-xl border p-3 ' +
                  (complete ? 'border-river-400/40 bg-river-400/8' : 'border-bone/12 bg-forest-900/50')
                }
              >
                <div className="flex items-start gap-3">
                  <span
                    className={
                      'grid h-8 w-8 shrink-0 place-items-center rounded-full border ' +
                      (complete ? 'border-river-400/45 bg-river-400/12 text-river-400' : 'border-bone/15 text-sage-500')
                    }
                    aria-hidden="true"
                  >
                    {complete ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <Icon className="h-4 w-4" strokeWidth={1.8} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[13px] font-semibold text-bone">{quest.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-bone-500">
                      {quest.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-forest-800">
                        <div
                          className={'h-full rounded-full ' + (complete ? 'bg-river-400' : 'bg-amber-400')}
                          style={{ width: `${Math.round(pct * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] tabular-nums text-sage-500">
                        {complete ? 'done' : `${current}/${target}`}
                      </span>
                      <span className="font-mono text-[10px] tabular-nums text-bone-500">
                        +{quest.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
                {nextAction?.quest.id === quest.id ? (
                  <p className="mt-2 border-t border-bone/10 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400">
                    Next best action ↑
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
