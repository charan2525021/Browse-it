import { useAgentStore } from '@/store/agentStore'

export default function PlanView() {
  const { plan, currentStep, status } = useAgentStore()
  if (!plan.length) return null

  return (
    <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🧭</span>
        <h3 className="text-sm font-semibold text-bark dark:text-white">Execution Plan</h3>
        {status === 'planning' && (
          <span className="ml-auto text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-md animate-pulse">Planning...</span>
        )}
      </div>
      <ol className="flex flex-col gap-2">
        {plan.map((step, i) => {
          // Roughly map progress: each plan item corresponds to a portion of steps
          const done = status === 'completed' || (currentStep > 0 && i < Math.floor((currentStep / Math.max(plan.length, 1))))
          const active = !done && status === 'running' && i === Math.floor((currentStep / Math.max(plan.length, 1)))
          return (
            <li key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all
                ${done ? 'bg-green-500 text-white' : active ? 'bg-gold text-bark animate-pulse' : 'bg-cream-200 dark:bg-night-lighter text-bark/50 dark:text-gray-500'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-sm leading-relaxed pt-0.5 ${done ? 'text-bark/50 dark:text-gray-500 line-through' : active ? 'text-bark dark:text-white font-medium' : 'text-bark/70 dark:text-gray-300'}`}>
                {step}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
