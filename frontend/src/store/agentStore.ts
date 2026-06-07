import { create } from 'zustand'
import type { AgentStep, AgentStatus } from '@/types/agent'

interface AgentState {
  isRunning: boolean
  isPaused: boolean
  currentStep: number
  maxSteps: number
  status: string
  taskId: string | null
  task: string
  agentType: string
  startedAt: string | null
  plan: string[]
  steps: AgentStep[]
  screenshot: string | null
  browserUrl: string
  browsers: { id: string; screenshot: string; url: string; query: string }[]
  result: string | null
  error: string | null
  setStatus: (s: Partial<AgentStatus>) => void
  setTask: (task: string, agentType: string) => void
  setPlan: (plan: string[]) => void
  addStep: (step: AgentStep) => void
  setScreenshot: (screenshot: string, url: string) => void
  setBrowsers: (browsers: { id: string; screenshot: string; url: string; query: string }[]) => void
  setResult: (result: string) => void
  setError: (error: string) => void
  reset: () => void
}

export const useAgentStore = create<AgentState>((set) => ({
  isRunning: false,
  isPaused: false,
  currentStep: 0,
  maxSteps: 100,
  status: 'idle',
  taskId: null,
  task: '',
  agentType: 'browser_use',
  startedAt: null,
  plan: [],
  steps: [],
  screenshot: null,
  browserUrl: '',
  browsers: [],
  result: null,
  error: null,
  setStatus: (s) => set(state => ({
    isRunning: s.is_running ?? state.isRunning,
    isPaused: s.is_paused ?? state.isPaused,
    currentStep: s.current_step ?? state.currentStep,
    maxSteps: s.max_steps ?? state.maxSteps,
    status: s.status ?? state.status,
    taskId: s.task_id ?? state.taskId,
  })),
  setTask: (task, agentType) => set({ task, agentType, startedAt: new Date().toISOString() }),
  setPlan: (plan) => set({ plan }),
  addStep: (step) => set(s => ({ steps: [...s.steps, step], currentStep: step.step })),
  setScreenshot: (screenshot, url) => set({ screenshot, browserUrl: url }),
  setBrowsers: (browsers) => set({ browsers }),
  setResult: (result) => set({ result, isRunning: false, status: 'completed' }),
  setError: (error) => set({ error, isRunning: false, status: 'error' }),
  reset: () => set({ steps: [], screenshot: null, result: null, error: null, currentStep: 0, browserUrl: '', plan: [], browsers: [] }),
}))
