import { useConfigStore } from '@/store/configStore'

const providers = [
  { value: 'openai', label: '🟢 OpenAI' }, { value: 'anthropic', label: '🔵 Anthropic Claude' },
  { value: 'google', label: '🔴 Google Gemini' }, { value: 'groq', label: '⚡ Groq (Fast Inference)' },
  { value: 'deepseek', label: '🐋 DeepSeek' }, { value: 'ollama', label: '🏠 Ollama (Local)' },
  { value: 'azure_openai', label: '☁️ Azure OpenAI' }, { value: 'mistral', label: '🌫️ Mistral AI' },
  { value: 'alibaba', label: '🇨🇳 Alibaba Qwen' }, { value: 'moonshot', label: '🌙 Moonshot AI' },
  { value: 'siliconflow', label: '💎 SiliconFlow' }, { value: 'modelscope', label: '🔬 ModelScope' },
]
const defaultModels: Record<string, string> = { openai: 'gpt-4o', anthropic: 'claude-3-5-sonnet-20241022', google: 'gemini-2.0-flash', groq: 'llama-3.3-70b-versatile', deepseek: 'deepseek-chat', ollama: 'llama3.2', azure_openai: 'gpt-4o', mistral: 'mistral-large-latest', alibaba: 'qwen-max', moonshot: 'moonshot-v1-32k', siliconflow: 'Qwen/QwQ-32B', modelscope: 'Qwen/QwQ-32B' }
const groqModels = [
  { value: 'llama-3.3-70b-versatile', label: '⚡ Llama 3.3 70B' }, { value: 'llama-3.1-8b-instant', label: '🚀 Llama 3.1 8B' },
  { value: 'llama3-70b-8192', label: '🦙 Llama 3 70B' }, { value: 'mixtral-8x7b-32768', label: '🌀 Mixtral 8x7B' },
  { value: 'gemma2-9b-it', label: '💎 Gemma 2 9B' }, { value: 'deepseek-r1-distill-llama-70b', label: '🐋 DeepSeek R1 70B' },
]
const inputCls = "w-full bg-cream-100 dark:bg-night border border-cream-300 dark:border-night-lighter rounded-xl px-4 py-2.5 text-sm text-bark dark:text-white placeholder-bark/40 dark:placeholder-gray-500 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"

export default function LLMSettings() {
  const { llm, setLLM } = useConfigStore()
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 pb-3 border-b border-cream-300 dark:border-night-lighter">
        <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center text-lg">🧠</div>
        <div><h3 className="text-base font-semibold text-bark dark:text-white">LLM Configuration</h3><p className="text-xs text-bark/50 dark:text-gray-500">Select your AI model provider and credentials</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">Provider</label>
          <select value={llm.provider} onChange={e => setLLM({ provider: e.target.value, model_name: defaultModels[e.target.value] ?? llm.model_name })} className={inputCls}>{providers.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">Model</label>
          {llm.provider === 'groq' ? <select value={llm.model_name} onChange={e => setLLM({ model_name: e.target.value })} className={inputCls}>{groqModels.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
          : <input value={llm.model_name} onChange={e => setLLM({ model_name: e.target.value })} placeholder={defaultModels[llm.provider]} className={inputCls} />}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">API Key</label>
          <input type="password" value={llm.api_key ?? ''} onChange={e => setLLM({ api_key: e.target.value })} placeholder="sk-..." className={inputCls} /><p className="text-xs text-bark/40 dark:text-gray-500">Stored locally in your browser</p></div>
        {!['groq'].includes(llm.provider) ? <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">Base URL</label>
          <input value={llm.base_url ?? ''} onChange={e => setLLM({ base_url: e.target.value })} placeholder="https://api.openai.com/v1" className={inputCls} /></div> : <div />}
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <div className="flex justify-between items-center"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">Temperature</label><span className="text-sm font-mono font-bold text-gold">{llm.temperature}</span></div>
        <input type="range" min="0" max="2" step="0.1" value={llm.temperature} onChange={e => setLLM({ temperature: parseFloat(e.target.value) })} className="w-full h-2 rounded-full appearance-none cursor-pointer bg-cream-200 dark:bg-night-lighter accent-gold" />
        <div className="flex justify-between text-xs text-bark/40 dark:text-gray-500"><span>Precise</span><span>Balanced</span><span>Creative</span></div>
      </div>
    </div>
  )
}
