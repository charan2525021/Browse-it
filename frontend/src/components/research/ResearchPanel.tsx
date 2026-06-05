import { useState } from 'react'
import { useAgent } from '@/hooks/useAgent'
import { useAgentStore } from '@/store/agentStore'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import AgentResultView from '@/components/agent/AgentResultView'

export default function ResearchPanel() {
  const [topic, setTopic] = useState('')
  const { run, loading } = useAgent()
  const { isRunning } = useAgentStore()

  return (
    <Card>
      <h2 className="text-base font-semibold mb-3">🔬 Deep Research Agent</h2>
      <div className="flex flex-col gap-3">
        <Textarea
          label="Research Topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          rows={3}
          placeholder="e.g. Latest advancements in quantum computing 2024..."
          disabled={isRunning}
        />
        <Button onClick={() => run(topic, 'deep_research')} disabled={!topic.trim() || isRunning} loading={loading}>
          🔍 Start Research
        </Button>
      </div>
      <div className="mt-4">
        <AgentResultView />
      </div>
    </Card>
  )
}
