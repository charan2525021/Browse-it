import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from '@/pages/HomePage'
import AgentPage from '@/pages/AgentPage'
import SettingsPage from '@/pages/SettingsPage'
import HistoryPage from '@/pages/HistoryPage'
import AppLayout from '@/components/layout/AppLayout'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useUIStore } from '@/store/uiStore'
import { useAgentStore } from '@/store/agentStore'
import { agentApi } from '@/api/agentApi'

function AppInner() {
  useWebSocket()
  const theme = useUIStore(s => s.theme)
  const navigate = useNavigate()
  const location = useLocation()
  const { setStatus, isRunning } = useAgentStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // On mount, check if agent is running on backend and redirect to /agent
  useEffect(() => {
    agentApi.status().then(status => {
      if (status.is_running) {
        setStatus({
          is_running: true,
          is_paused: status.is_paused,
          current_step: status.current_step,
          max_steps: status.max_steps,
          status: status.status,
          task_id: status.task_id,
        })
        if (location.pathname === '/') {
          navigate('/agent', { replace: true })
        }
      }
    }).catch(() => {})
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/agent" element={<AppLayout><AgentPage /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
      <Route path="/history" element={<AppLayout><HistoryPage /></AppLayout>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
