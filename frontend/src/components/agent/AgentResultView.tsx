import { useAgentStore } from '@/store/agentStore'
import ResultRenderer from './ResultRenderer'

export default function AgentResultView() {
  const { result, error } = useAgentStore()
  if (!result && !error) return null

  const copyResult = () => {
    if (result) navigator.clipboard.writeText(result)
  }

  const downloadResult = () => {
    if (!result) return
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `result-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className="rounded-2xl border p-4 bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">❌</span>
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Error</h3>
        </div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed font-mono p-3 rounded-xl border text-red-700 dark:text-red-300 bg-white dark:bg-gray-900 border-red-100 dark:border-red-500/10">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border p-4 bg-green-50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">✅</span>
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">Task Completed</h3>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={copyResult} title="Copy" className="w-7 h-7 flex items-center justify-center rounded-lg text-bark/50 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-500/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3 2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1V4a2 2 0 0 1 2-2h5V3a1 1 0 0 0-1-1H3Z"/><path d="M6 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5Z"/></svg>
          </button>
          <button onClick={downloadResult} title="Download" className="w-7 h-7 flex items-center justify-center rounded-lg text-bark/50 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-500/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 1a.75.75 0 0 1 .75.75v6.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.75A.75.75 0 0 1 8 1ZM3 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a.75.75 0 0 0-1.5 0v.5h-7V12A.75.75 0 0 0 3 12v1Z"/></svg>
          </button>
        </div>
      </div>
      <div className="p-3 rounded-xl border bg-white dark:bg-gray-900 border-green-100 dark:border-green-500/10 max-h-[500px] overflow-y-auto">
        <ResultRenderer text={result!} />
      </div>
    </div>
  )
}
