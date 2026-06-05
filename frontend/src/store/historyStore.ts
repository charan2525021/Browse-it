import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgentStep } from '@/types/agent'

export interface HistoryEntry {
  id: string
  task: string
  agentType: string
  status: string
  steps: AgentStep[]
  result: string | null
  error: string | null
  startedAt: string
  finishedAt: string
  stepCount: number
}

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (entry: HistoryEntry) => void
  removeEntry: (id: string) => void
  clearAll: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set(s => ({ entries: [entry, ...s.entries].slice(0, 50) })),
      removeEntry: (id) => set(s => ({ entries: s.entries.filter(e => e.id !== id) })),
      clearAll: () => set({ entries: [] }),
    }),
    { name: 'browseit-history' }
  )
)
