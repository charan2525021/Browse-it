import type { AgentStep } from '@/types/agent'

export default function AgentStepList({ steps }: { steps: AgentStep[] }) {
  if (!steps.length) return (
    <div className="flex flex-col items-center gap-2 py-8 text-bark/40 dark:text-gray-500">
      <span className="text-2xl opacity-50">⚡</span>
      <p className="text-sm">Awaiting execution...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-2 overflow-y-auto pr-1">
      {[...steps].reverse().map((s, i) => (
        <div key={s.step}
          className={`relative p-3 rounded-xl border transition-all duration-200
            ${i === 0
              ? 'bg-gold/5 border-gold/20'
              : 'bg-cream-100 dark:bg-night border-cream-200 dark:border-night-lighter'
            }`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold
              ${i === 0 ? 'bg-gold/20 text-gold' : 'bg-cream-200 dark:bg-night-lighter text-bark/60 dark:text-gray-400'}`}>
              {s.step}
            </div>
            <span className="text-xs text-bark/40 dark:text-gray-500 font-mono ml-auto">
              {new Date(s.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {s.action && (
            <p className="text-xs text-bark/80 dark:text-gray-300 font-mono break-all leading-relaxed">
              {s.action.length > 150 ? s.action.slice(0, 150) + '…' : s.action}
            </p>
          )}
          {s.result && (
            <p className="text-xs text-bark/50 dark:text-gray-400 mt-1 break-all leading-relaxed border-t border-cream-200 dark:border-night-lighter pt-1">
              {s.result.length > 120 ? s.result.slice(0, 120) + '…' : s.result}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
