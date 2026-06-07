import { useState, useRef, useEffect } from 'react'
import { useAgent } from '@/hooks/useAgent'
import { useAgentStore } from '@/store/agentStore'
import BrowserView from '@/components/browser/BrowserView'
import MultiBrowserView from '@/components/browser/MultiBrowserView'
import AgentStepList from '@/components/agent/AgentStepList'
import AgentResultView from '@/components/agent/AgentResultView'
import PlanView from '@/components/agent/PlanView'
import type { AgentType } from '@/types/agent'

function AutoResizeTextarea({ value, onChange, onSubmit, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder: string; disabled?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px' }
  }, [value])
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() } }
  return (
    <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown}
      placeholder={placeholder} disabled={disabled} rows={1}
      className="flex-1 px-4 py-3 text-base text-bark dark:text-white placeholder-bark/40 dark:placeholder-gray-500 bg-transparent outline-none resize-none leading-relaxed disabled:opacity-50"
      style={{ minHeight: '24px', maxHeight: '200px' }} />
  )
}

export default function AgentPage() {
  const [task, setTask] = useState('')
  const [agentType, setAgentType] = useState<AgentType>('browser_use')
  const { run, stop, pause, resume, loading } = useAgent()
  const { isRunning, isPaused, steps, currentStep, maxSteps, status, screenshot, reset } = useAgentStore()

  const handleSubmit = () => { if (task.trim() && !isRunning) run(task, agentType) }
  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSubmit() }
  const handleNewChat = () => { reset(); setTask('') }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Idle - show chat input */}
      {!isRunning && !screenshot && steps.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 animate-fade-in overflow-y-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-sm font-medium text-bark dark:text-gold">AI-Powered Browser Automation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center text-bark dark:text-white leading-tight mb-4 max-w-3xl">
            What can I help you <span className="text-gold">automate</span> today?
          </h1>
          <p className="text-base text-bark/60 dark:text-gray-400 text-center max-w-xl mb-10">Describe any browser task in natural language.</p>

          <div className="flex items-center gap-1 p-1 bg-cream-200 dark:bg-night-lighter rounded-xl border border-cream-300 dark:border-night-lighter mb-6">
            <button onClick={() => setAgentType('browser_use')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${agentType === 'browser_use' ? 'bg-cream-50 dark:bg-night text-bark dark:text-white shadow-sm border border-cream-300 dark:border-night-lighter' : 'text-bark/60 dark:text-gray-400'}`}>
              🤖 Browser Agent
            </button>
            <button onClick={() => setAgentType('deep_research')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${agentType === 'deep_research' ? 'bg-cream-50 dark:bg-night text-bark dark:text-white shadow-sm border border-cream-300 dark:border-night-lighter' : 'text-bark/60 dark:text-gray-400'}`}>
              🔬 Deep Research
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="w-full max-w-2xl mb-6">
            <div className="relative flex items-end bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter shadow-lg shadow-bark/5 dark:shadow-black/20 hover:border-gold/40 transition-all p-2">
              <AutoResizeTextarea value={task} onChange={setTask} onSubmit={handleSubmit} placeholder="What would you like me to do in the browser?" />
              <button type="submit" disabled={!task.trim() || loading} className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold text-bark hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-md shadow-gold/25 mb-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" /></svg>
              </button>
            </div>
            <p className="text-xs text-bark/40 dark:text-gray-500 mt-2 text-center"><kbd className="px-1.5 py-0.5 rounded bg-cream-200 dark:bg-night-lighter font-mono text-xs">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-cream-200 dark:bg-night-lighter font-mono text-xs">Shift+Enter</kbd> new line</p>
          </form>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {[{ icon: '🔍', label: 'Search the web', prompt: 'Go to google.com and search for ' }, { icon: '📊', label: 'Extract data', prompt: 'Go to the website and extract ' }, { icon: '🧪', label: 'Test a website', prompt: 'Navigate to the website and test ' }, { icon: '📝', label: 'Fill a form', prompt: 'Go to the page and fill out the form with ' }].map((s, i) => (
              <button key={i} onClick={() => setTask(s.prompt)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream-50 dark:bg-night-light border border-cream-300 dark:border-night-lighter text-sm text-bark/70 dark:text-gray-300 hover:border-gold/50 hover:text-bark dark:hover:text-gold transition-all shadow-sm">
                <span>{s.icon}</span><span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Agent View */}
      {(isRunning || screenshot || steps.length > 0) && (
        <div className="flex-1 min-h-0 flex flex-col gap-4 p-6 animate-fade-in overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-0.5 bg-cream-200 dark:bg-night-lighter rounded-lg border border-cream-300 dark:border-night-lighter">
                <button onClick={() => setAgentType('browser_use')} disabled={isRunning} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-60 ${agentType === 'browser_use' ? 'bg-cream-50 dark:bg-night text-bark dark:text-white shadow-sm' : 'text-bark/60 dark:text-gray-400'}`}>🤖 Browser</button>
                <button onClick={() => setAgentType('deep_research')} disabled={isRunning} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-60 ${agentType === 'deep_research' ? 'bg-cream-50 dark:bg-night text-bark dark:text-white shadow-sm' : 'text-bark/60 dark:text-gray-400'}`}>🔬 Research</button>
              </div>
              {isRunning && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-sm font-medium text-green-700 dark:text-green-400">Step {currentStep}/{maxSteps}</span>
                </div>
              )}
              {!isRunning && status === 'completed' && <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20"><span>✅</span><span className="text-sm font-medium text-green-700 dark:text-green-400">Completed</span></div>}
              {!isRunning && status === 'error' && <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"><span>❌</span><span className="text-sm font-medium text-red-700 dark:text-red-400">Error</span></div>}
            </div>
            <div className="flex items-center gap-2">
              {isRunning && !isPaused && <button onClick={pause} className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 text-sm font-medium text-bark dark:text-gold hover:bg-gold/20 transition-colors">⏸ Pause</button>}
              {isRunning && isPaused && <button onClick={resume} className="px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm font-medium text-green-700 dark:text-green-400">▶ Resume</button>}
              {isRunning && <button onClick={stop} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm font-medium text-red-700 dark:text-red-400">⏹ Stop</button>}
              {!isRunning && (status === 'completed' || status === 'error' || steps.length > 0) && (
                <button onClick={handleNewChat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-bark text-sm font-semibold hover:bg-gold-light transition-colors shadow-sm shadow-gold/25">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z"/></svg>
                  New Chat
                </button>
              )}
            </div>
          </div>

          {isRunning && <div className="h-1 bg-cream-200 dark:bg-night-lighter rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-gold to-gold-dark" style={{ width: `${Math.min((currentStep / maxSteps) * 100, 100)}%` }} /></div>}

          <div className="flex-1 grid grid-cols-1 xl:grid-cols-5 gap-4 min-h-0 overflow-hidden">
            <div className="xl:col-span-3 min-h-0 overflow-hidden">{agentType === 'deep_research' ? <MultiBrowserView /> : <BrowserView />}</div>
            <div className="xl:col-span-2 flex flex-col gap-4 min-h-0 overflow-hidden">
              <AgentResultView />
              <PlanView />
              {steps.length > 0 && (
                <div className="flex-1 min-h-0 bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter p-4 overflow-hidden flex flex-col shadow-sm">
                  <div className="flex items-center justify-between mb-3 shrink-0"><h3 className="text-sm font-semibold text-bark dark:text-white">Steps</h3><span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-md">{steps.length}</span></div>
                  <div className="flex-1 min-h-0 overflow-y-auto"><AgentStepList steps={steps} /></div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="mt-auto shrink-0">
            <div className="relative flex items-end bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter shadow-sm p-2">
              <AutoResizeTextarea value={task} onChange={setTask} onSubmit={handleSubmit} placeholder={isRunning ? "Agent is working..." : "Send another task..."} disabled={isRunning} />
              <button type="submit" disabled={!task.trim() || loading || isRunning} className="flex items-center justify-center w-9 h-9 rounded-xl bg-gold text-bark hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 mb-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" /></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
