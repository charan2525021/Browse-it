import { client } from './client'
import type { AgentRunRequest, AgentStatus } from '@/types/agent'

export const agentApi = {
  run: (req: AgentRunRequest) => client.post('/api/agent/run', req).then(r => r.data),
  stop: () => client.post('/api/agent/stop').then(r => r.data),
  pause: () => client.post('/api/agent/pause').then(r => r.data),
  resume: () => client.post('/api/agent/resume').then(r => r.data),
  status: (): Promise<AgentStatus> => client.get('/api/agent/status').then(r => r.data),
  history: () => client.get('/api/agent/history').then(r => r.data),
}
