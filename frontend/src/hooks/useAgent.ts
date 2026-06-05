import { useState } from 'react'
import { agentApi } from '@/api/agentApi'
import { useAgentStore } from '@/store/agentStore'
import { useConfigStore } from '@/store/configStore'
import type { AgentType } from '@/types/agent'

export function useAgent() {
  const [loading, setLoading] = useState(false)
  const { reset, setStatus, setError, setTask } = useAgentStore()
  const { llm, browser, agent } = useConfigStore()

  const run = async (task: string, agentType: AgentType = 'browser_use') => {
    try {
      setLoading(true)
      reset()
      setTask(task, agentType)
      setStatus({ is_running: true, status: 'running' })
      await agentApi.run({ task, agent_type: agentType, llm, browser, agent })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const stop = async () => { await agentApi.stop(); setStatus({ is_running: false, status: 'stopped' }) }
  const pause = async () => { await agentApi.pause(); setStatus({ is_paused: true, status: 'paused' }) }
  const resume = async () => { await agentApi.resume(); setStatus({ is_paused: false, status: 'running' }) }

  return { run, stop, pause, resume, loading }
}
