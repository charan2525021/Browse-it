import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  activeTab: string
  sidebarOpen: boolean
  theme: 'dark' | 'light'
  notifications: { id: string; message: string; type: 'info' | 'error' | 'success' }[]
  setActiveTab: (tab: string) => void
  toggleSidebar: () => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  addNotification: (msg: string, type?: 'info' | 'error' | 'success') => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTab: 'agent',
      sidebarOpen: true,
      theme: 'light',
      notifications: [],
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      addNotification: (message, type = 'info') => set(s => ({
        notifications: [...s.notifications, { id: Date.now().toString(), message, type }]
      })),
      removeNotification: (id) => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })),
    }),
    { name: 'browseit-ui', partialize: (state) => ({ theme: state.theme }) }
  )
)
