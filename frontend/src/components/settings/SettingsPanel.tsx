import LLMSettings from './LLMSettings'
import BrowserSettings from './BrowserSettings'
import AgentSettings from './AgentSettings'

export default function SettingsPanel() {
  return (
    <div className="flex flex-col gap-6">
      {/* LLM - full width */}
      <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter p-7 shadow-sm">
        <LLMSettings />
      </div>

      {/* Browser + Agent side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter p-7 shadow-sm">
          <BrowserSettings />
        </div>
        <div className="bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter p-7 shadow-sm">
          <AgentSettings />
        </div>
      </div>
    </div>
  )
}
