export type AgentType = 'browser_use' | 'deep_research'

export interface LLMConfig {
  provider: string
  model_name: string
  temperature: number
  base_url?: string
  api_key?: string
}

export interface BrowserConfig {
  headless: boolean
  disable_security: boolean
  window_width: number
  window_height: number
  use_own_browser: boolean
  chrome_instance_path?: string
  cdp_url?: string
  wss_url?: string
}

export interface AgentConfig {
  max_steps: number
  max_actions_per_step: number
  use_vision: boolean
  tool_calling_method: string
  max_input_tokens: number
  enable_recording: boolean
}

export interface AgentRunRequest {
  task: string
  agent_type: AgentType
  llm: LLMConfig
  browser: BrowserConfig
  agent: AgentConfig
  add_infos?: string
}

export interface AgentStep {
  step: number
  action: string
  result: string
  timestamp: string
  screenshot?: string
}

export interface AgentStatus {
  is_running: boolean
  is_paused: boolean
  current_step: number
  max_steps: number
  status: string
  task_id?: string
}
