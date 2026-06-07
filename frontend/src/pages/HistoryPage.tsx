import { useState } from 'react'
import { useHistoryStore } from '@/store/historyStore'
import ResultRenderer from '@/components/agent/ResultRenderer'

export default function HistoryPage() {
  const { entries, removeEntry, clearAll } = useHistoryStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-bark dark:text-white">Task History</h1>
            <p className="text-bark/60 dark:text-gray-400 mt-2">Review your past agent executions ({entries.length})</p>
          </div>
          {entries.length > 0 && (
            <button onClick={clearAll} className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
              Clear All
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter p-16 flex flex-col items-center gap-4 text-center shadow-sm">
            <span className="text-5xl opacity-30 animate-float">📋</span>
            <h3 className="text-lg font-semibold text-bark/50 dark:text-gray-500">No tasks yet</h3>
            <p className="text-sm text-bark/40 dark:text-gray-500">Run an agent to see history here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map(entry => (
              <div key={entry.id} className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-cream-100 dark:hover:bg-night transition-colors"
                  onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
                  <span className="text-xl">{entry.agentType === 'deep_research' ? '🔬' : '🤖'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bark dark:text-white truncate">{entry.task}</p>
                    <p className="text-xs text-bark/40 dark:text-gray-500 mt-0.5">
                      {new Date(entry.startedAt).toLocaleString()} · {entry.stepCount} steps
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize shrink-0
                    ${entry.status === 'completed' ? 'bg-green-500/10 text-green-700 dark:text-green-400' :
                      entry.status === 'error' ? 'bg-red-500/10 text-red-700 dark:text-red-400' :
                      'bg-gold/10 text-gold'}`}>
                    {entry.status}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); removeEntry(entry.id) }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-bark/40 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0">
                    ✕
                  </button>
                  <span className={`text-bark/40 dark:text-gray-500 transition-transform shrink-0 ${expanded === entry.id ? 'rotate-180' : ''}`}>▾</span>
                </div>

                {/* Expanded detail */}
                {expanded === entry.id && (
                  <div className="border-t border-cream-300 dark:border-night-lighter p-4 flex flex-col gap-3">
                    {entry.result && (
                      <div className="bg-green-500/5 rounded-xl p-3 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2"><span>✅</span><span className="text-xs font-semibold text-green-700 dark:text-green-400">Result</span></div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-green-100 dark:border-green-500/10 max-h-[400px] overflow-auto">
                          <ResultRenderer text={entry.result} />
                        </div>
                      </div>
                    )}
                    {entry.error && (
                      <div className="bg-red-500/5 rounded-xl p-3 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-1"><span>❌</span><span className="text-xs font-semibold text-red-700 dark:text-red-400">Error</span></div>
                        <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono leading-relaxed">{entry.error}</p>
                      </div>
                    )}
                    {entry.steps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide mb-2">Execution Steps ({entry.steps.length})</p>
                        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                          {entry.steps.map((s, i) => (
                            <div key={i} className="flex gap-3 p-2.5 rounded-lg bg-cream-100 dark:bg-night border border-cream-200 dark:border-night-lighter">
                              <div className="w-6 h-6 rounded-md bg-gold/20 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-gold">{s.step}</span></div>
                              <div className="flex-1 min-w-0">
                                {s.action && <p className="text-xs text-bark dark:text-gray-300 font-mono break-all">{s.action}</p>}
                                {s.result && <p className="text-xs text-bark/50 dark:text-gray-400 mt-1 break-all">{s.result}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
