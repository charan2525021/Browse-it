import Button from '@/components/ui/Button'

interface Props {
  isRunning: boolean; isPaused: boolean
  onRun: () => void; onStop: () => void; onPause: () => void; onResume: () => void
  disabled?: boolean
}

export default function AgentControls({ isRunning, isPaused, onRun, onStop, onPause, onResume, disabled }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {!isRunning ? (
        <Button onClick={onRun} disabled={disabled} variant="primary" size="md" className="flex-1">
          <span>▶</span> Launch Agent
        </Button>
      ) : (
        <>
          {!isPaused ? (
            <Button onClick={onPause} variant="warning" size="md">⏸ Pause</Button>
          ) : (
            <Button onClick={onResume} variant="success" size="md">▶ Resume</Button>
          )}
          <Button onClick={onStop} variant="danger" size="md">⏹ Stop</Button>
        </>
      )}
    </div>
  )
}