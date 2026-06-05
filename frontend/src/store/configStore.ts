import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LLMConfig, BrowserConfig, AgentConfig } from '@/types/agent'

interface ConfigState {
  llm: LLMConfig
  browser: BrowserConfig
  agent: AgentConfig
  setLLM: (c: Partial<LLMConfig>) => void
  setBrowser: (c: Partial<BrowserConfig>) => void
  setAgent: (c: Partial<AgentConfig>) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      llm: { provider: 'groq', model_name: 'llama-3.3-70b-versatile', temperature: 1.0 },
      browser: { headless: false, disable_security: true, window_width: 1280, window_height: 1100, use_own_browser: false },
      agent: { max_steps: 100, max_actions_per_step: 10, use_vision: false, tool_calling_method: 'auto', max_input_tokens: 128000, enable_recording: false },
      setLLM: (c) => set(s => ({ llm: { ...s.llm, ...c } })),
      setBrowser: (c) => set(s => ({ browser: { ...s.browser, ...c } })),
      setAgent: (c) => set(s => ({ agent: { ...s.agent, ...c } })),
    }),
    {
      name: 'browser-use-config',
      version: 2,
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<ConfigState>
        return {
          ...state,
          browser: {
            ...(state.browser ?? {}),
            headless: false,
          },
          agent: {
            ...(state.agent ?? {}),
            use_vision: false,
          },
        } as ConfigState
      },
    }
  )
)
