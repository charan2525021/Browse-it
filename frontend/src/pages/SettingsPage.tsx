import SettingsPanel from '@/components/settings/SettingsPanel'

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bark dark:text-white">Settings</h1>
          <p className="text-bark/60 dark:text-gray-400 mt-2 text-base">Configure your AI agent, LLM provider, and browser behavior</p>
        </div>
        <SettingsPanel />
      </div>
    </div>
  )
}
