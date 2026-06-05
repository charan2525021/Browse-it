import Sidebar from './Sidebar'
import ToastContainer from '@/components/ui/Toast'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-cream-100 dark:bg-night">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}
