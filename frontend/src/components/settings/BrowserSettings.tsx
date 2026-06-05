import { useConfigStore } from '@/store/configStore'
const inputCls = "w-full bg-cream-100 dark:bg-night border border-cream-300 dark:border-night-lighter rounded-xl px-4 py-2.5 text-sm text-bark dark:text-white placeholder-bark/40 dark:placeholder-gray-500 outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"

export default function BrowserSettings() {
  const { browser, setBrowser } = useConfigStore()
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 pb-3 border-b border-cream-300 dark:border-night-lighter">
        <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center text-lg">🌐</div>
        <div><h3 className="text-base font-semibold text-bark dark:text-white">Browser Settings</h3><p className="text-xs text-bark/50 dark:text-gray-500">Configure browser behavior</p></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Headless Mode', key: 'headless', icon: '👻', desc: 'No visible window' }, { label: 'Disable Security', key: 'disable_security', icon: '🔓', desc: 'Cross-origin requests' }].map(item => (
          <label key={item.key} className={`flex flex-col gap-2 p-3 rounded-xl cursor-pointer border transition-all ${(browser as unknown as Record<string, unknown>)[item.key] ? 'bg-gold/10 border-gold/30' : 'bg-cream-100 dark:bg-night border-cream-300 dark:border-night-lighter hover:border-gold/20'}`}>
            <div className="flex items-center justify-between"><span>{item.icon}</span>
              <div className={`w-9 h-5 rounded-full relative transition-all ${(browser as unknown as Record<string, unknown>)[item.key] ? 'bg-gold' : 'bg-cream-300 dark:bg-night-lighter'}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${(browser as unknown as Record<string, unknown>)[item.key] ? 'left-[18px]' : 'left-0.5'}`} /></div></div>
            <div><div className="text-xs font-semibold text-bark dark:text-white">{item.label}</div><div className="text-xs text-bark/40 dark:text-gray-500">{item.desc}</div></div>
            <input type="checkbox" className="hidden" checked={!!(browser as unknown as Record<string, unknown>)[item.key]} onChange={e => setBrowser({ [item.key]: e.target.checked } as Parameters<typeof setBrowser>[0])} />
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">Width</label><input type="number" value={browser.window_width} onChange={e => setBrowser({ window_width: parseInt(e.target.value) })} className={inputCls} /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">Height</label><input type="number" value={browser.window_height} onChange={e => setBrowser({ window_height: parseInt(e.target.value) })} className={inputCls} /></div>
      </div>
      <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-bark/60 dark:text-gray-400 uppercase tracking-wide">CDP URL</label><input value={browser.cdp_url ?? ''} onChange={e => setBrowser({ cdp_url: e.target.value })} placeholder="http://localhost:9222" className={inputCls} /></div>
    </div>
  )
}
