import Textarea from '@/components/ui/Textarea'

interface Props { value: string; onChange: (v: string) => void; disabled?: boolean }

export default function TaskInput({ value, onChange, disabled }: Props) {
  return (
    <div className="relative">
      <Textarea
        label="Task Description"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        disabled={disabled}
        placeholder="e.g. Go to google.com, search for 'latest AI news', and summarize the top 3 results..."
        className="font-mono text-sm pr-12"
      />
      <div className="absolute bottom-3 right-3 text-xs text-slate-600 font-mono">
        {value.length}
      </div>
    </div>
  )
}