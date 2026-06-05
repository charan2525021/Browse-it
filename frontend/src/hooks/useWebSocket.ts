import { useEffect } from 'react'
import { agentWS } from '@/api/websocket'
import { useAgentStore } from '@/store/agentStore'
import { useHistoryStore } from '@/store/historyStore'

export function useWebSocket() {
  const { addStep, setScreenshot, setResult, setError, setStatus, setPlan } = useAgentStore()

  useEffect(() => {
    agentWS.connect()

    const saveToHistory = (status: string, result: string | null, error: string | null) => {
      const s = useAgentStore.getState()
      if (!s.task) return // nothing to save
      useHistoryStore.getState().addEntry({
        id: s.taskId ?? Date.now().toString(),
        task: s.task,
        agentType: s.agentType,
        status,
        steps: s.steps,
        result,
        error,
        startedAt: s.startedAt ?? new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        stepCount: s.currentStep,
      })
    }

    const unsub = agentWS.onEvent((event) => {
      switch (event.type) {
        case 'agent_step':
          addStep({ step: event.step, action: event.action, result: event.result, timestamp: event.timestamp })
          break
        case 'browser_state':
          setScreenshot(event.screenshot, event.url)
          break
        case 'agent_output':
          setResult(event.result)
          saveToHistory('completed', event.result, null)
          break
        case 'error':
          setError(event.message)
          saveToHistory('error', null, event.message)
          break
        case 'status':
          setStatus({ status: event.status, is_running: event.status === 'running' || event.status === 'planning', is_paused: event.status === 'paused' })
          break
        case 'plan':
          setPlan(event.steps)
          break
      }
    })
    return () => { unsub(); agentWS.disconnect() }
  }, [])
}
