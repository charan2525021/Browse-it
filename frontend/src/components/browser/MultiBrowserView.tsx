import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'

function domainOf(url: string) {
  try { return new URL(url).hostname } catch { return url || 'about:blank' }
}

export default function MultiBrowserView() {
  const { browsers, isRunning } = useAgentStore()
  const [maximizedId, setMaximizedId] = useState<string | null>(null)

  if (!browsers.length) {
    return (
      <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter flex flex-col items-center justify-center h-full min-h-[400px] shadow-sm gap-4">
        {isRunning ? (
          <>
            <div className="w-10 h-10 border-[3px] border-gold/20 border-t-gold rounded-full animate-spin" />
            <p className="text-sm text-bark/60 dark:text-gray-400 font-medium">Spawning research browsers...</p>
            <p className="text-xs text-bark/40 dark:text-gray-500">Parallel browser agents are starting up</p>
          </>
        ) : (
          <>
            <span className="text-4xl opacity-30">🔬</span>
            <p className="text-sm text-bark/50 dark:text-gray-500">No active research browsers</p>
          </>
        )}
      </div>
    )
  }

  const maximized = browsers.find(b => b.id === maximizedId)

  return (
    <>
      <div className={`grid gap-3 h-full ${browsers.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {browsers.map((b, i) => (
          <div key={b.id} className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter flex flex-col overflow-hidden shadow-sm min-h-0">
            {/* Mini chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-cream-200 dark:bg-night-lighter border-b border-cream-300 dark:border-night-lighter shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex items-center gap-1.5 flex-1 min-w-0 bg-cream-50 dark:bg-night rounded px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span className="text-[11px] text-bark/60 dark:text-gray-400 font-mono truncate">{domainOf(b.url)}</span>
              </span>
              <span className="text-[10px] font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded shrink-0">#{i + 1}</span>
              <button onClick={() => setMaximizedId(b.id)} title="Maximize" className="w-6 h-6 flex items-center justify-center rounded text-bark/50 dark:text-gray-400 hover:bg-cream-300 dark:hover:bg-night transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 0-.75.75v2a.75.75 0 0 1-1.5 0v-2ZM11.75 2a2.25 2.25 0 0 1 2.25 2.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-2a.75.75 0 0 1 0-1.5h2ZM2.75 9.5a.75.75 0 0 1 .75.75v2c0 .414.336.75.75.75h2a.75.75 0 0 1 0 1.5h-2A2.25 2.25 0 0 1 2 12.25v-2a.75.75 0 0 1 .75-.75ZM14 10.25a.75.75 0 0 0-1.5 0v2a.75.75 0 0 1-.75.75h-2a.75.75 0 0 0 0 1.5h2A2.25 2.25 0 0 0 14 12.25v-2Z"/></svg>
              </button>
            </div>
            {/* Query label */}
            {b.query && <div className="px-3 py-1.5 text-[11px] text-bark/60 dark:text-gray-400 bg-cream-100 dark:bg-night border-b border-cream-200 dark:border-night-lighter truncate shrink-0">🔍 {b.query}</div>}
            {/* Screenshot */}
            <div className="flex-1 min-h-0 bg-white dark:bg-[#1c1c1c] overflow-hidden">
              <img src={`data:image/jpeg;base64,${b.screenshot}`} alt={`Browser ${i + 1}`} className="w-full h-full object-contain object-top" />
            </div>
          </div>
        ))}
      </div>

      {/* Maximized modal */}
      {maximized && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={() => setMaximizedId(null)}>
          <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-cream-200 dark:bg-night-lighter border-b border-cream-300 dark:border-night-lighter shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 text-xs text-bark/60 dark:text-gray-400 font-mono truncate ml-2">{maximized.url}</span>
              <button onClick={() => setMaximizedId(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-bark/50 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors">✕</button>
            </div>
            {maximized.query && <div className="px-4 py-2 text-xs text-bark/70 dark:text-gray-300 bg-cream-100 dark:bg-night border-b border-cream-200 dark:border-night-lighter shrink-0">🔍 {maximized.query}</div>}
            <div className="flex-1 min-h-0 bg-white dark:bg-[#1c1c1c] overflow-auto">
              <img src={`data:image/jpeg;base64,${maximized.screenshot}`} alt="Maximized browser" className="w-full object-contain object-top" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
