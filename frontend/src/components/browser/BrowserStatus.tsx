import { useAgentStore } from '@/store/agentStore'

export default function BrowserStatus() {
  const { isRunning, browserUrl, currentStep, maxSteps } = useAgentStore()
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-gray-200">
      <div className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-600">
          {isRunning ? 'Browser Active' : 'Browser Inactive'}
        </span>
        {browserUrl && <span className="text-xs text-gray-400 ml-2 truncate">{browserUrl}</span>}
      </div>
      {isRunning && (
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
          {currentStep}/{maxSteps}
        </span>
      )}
    </div>
  )
}
