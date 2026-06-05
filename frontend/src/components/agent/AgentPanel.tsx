import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'
import { useAgent } from '@/hooks/useAgent'
import TaskInput from './TaskInput'
import AgentControls from './AgentControls'
import AgentStepList from './AgentStepList'
import AgentResultView from './AgentResultView'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import type { AgentType } from '@/types/agent'

const agentTypes = [
  { value: 'browser_use',   label: '🤖 Browser Use Agent' },
  { value: 'deep_research', label: '🔬 Deep Research Agent' },
]

export default function AgentPanel() {
  const [task, setTask] = useState('')
  const [agentType, setAgentType] = useState<AgentType>('browser_use')
  const { isRunning, isPaused, steps, currentStep, maxSteps, status } = useAgentStore()
  const { run, stop, pause, resume, loading } = useAgent()

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Control card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Agent Console</h2>
              <p className="text-xs text-slate-500">Configure and launch your AI agent</p>
            </div>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/30 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              <span className="text-xs font-mono text-brand-green font-semibold">RUNNING</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Select
            label="Agent Type"
            options={agentTypes}
            value={agentType}
            onChange={e => setAgentType(e.target.value as AgentType)}
            disabled={isRunning}
          />
          <TaskInput value={task} onChange={setTask} disabled={isRunning} />

          <AgentControls
            isRunning={isRunning}
            isPaused={isPaused}
            onRun={() => run(task, agentType)}
            onStop={stop}
            onPause={pause}
            onResume={resume}
            disabled={!task.trim() || loading}
          />

          {/* Progress */}
          {isRunning && (
            <div className="animate-fade-in">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono">Step {currentStep} of {maxSteps}</span>
                <span className="font-semibold text-brand-indigo">{Math.round((currentStep / maxSteps) * 100)}%</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full overflow-hidden border border-navy-700/50">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min((currentStep / maxSteps) * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                    boxShadow: '0 0 10px rgba(99,102,241,0.5)'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Steps Done', value: currentStep, icon: '⚡', color: 'text-brand-indigo', text: false },
          { label: 'Total Steps', value: maxSteps, icon: '🎯', color: 'text-brand-cyan', text: false },
          { label: 'Status', value: status, icon: '📊', color: 'text-brand-purple', text: true },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-3 text-center" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className={`text-lg font-bold font-mono ${stat.color}`}>
              {stat.text ? <span className="text-sm capitalize">{stat.value}</span> : stat.value}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <AgentResultView />

      {steps.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">⚡</span>
            <h3 className="text-sm font-bold text-white">Execution Timeline</h3>
            <span className="tag-indigo ml-auto">{steps.length} steps</span>
          </div>
          <AgentStepList steps={steps} />
        </Card>
      )}
    </div>
  )
}