import { useUIStore } from '@/store/uiStore'

const icons = { info: 'ℹ️', error: '❌', success: '✅' }

export default function ToastContainer() {
  const { notifications, removeNotification } = useUIStore()
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50 max-w-sm">
      {notifications.map(n => (
        <div key={n.id} onClick={() => removeNotification(n.id)}
          className="flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg cursor-pointer animate-slide-up bg-cream-50 dark:bg-night-light border-cream-300 dark:border-night-lighter text-bark dark:text-white">
          <span>{icons[n.type]}</span>
          <p className="text-sm flex-1">{n.message}</p>
          <button className="text-bark/40 dark:text-gray-500 hover:text-bark dark:hover:text-white text-xs">✕</button>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  return { toast: useUIStore(s => s.addNotification) }
}
