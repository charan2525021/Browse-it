import { NavLink, useNavigate } from 'react-router-dom'
import { useAgentStore } from '@/store/agentStore'
import { useUIStore } from '@/store/uiStore'

const links = [
  { to: '/agent', icon: '🤖', label: 'Agent' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
  { to: '/history', icon: '📋', label: 'History' },
]

export default function Sidebar() {
  const { isRunning } = useAgentStore()
  const { theme, toggleTheme } = useUIStore()
  const navigate = useNavigate()

  return (
    <aside className="flex flex-col items-center py-4 px-2 w-[72px] shrink-0 border-r border-cream-200 dark:border-night-lighter bg-cream-50 dark:bg-night-light backdrop-blur-xl">
      {/* Logo - clicking it goes to Home/landing page */}
      <button
        onClick={() => navigate('/')}
        title="Home"
        className="w-10 h-10 rounded-2xl bg-gold flex items-center justify-center text-bark text-sm font-bold shadow-lg shadow-gold/25 mb-6 hover:bg-gold-light hover:scale-105 transition-all duration-200"
      >
        B
      </button>

      {/* Nav Icons */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} title={l.label}
            className={({ isActive }) =>
              `relative w-10 h-10 flex items-center justify-center rounded-xl text-lg transition-all duration-200 group
              ${isActive ? 'bg-gold/20 dark:bg-gold/10' : 'hover:bg-cream-200 dark:hover:bg-night-lighter'}`
            }>
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-5 rounded-full bg-gold" />}
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>{l.icon}</span>
                <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-night dark:bg-night-lighter text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                  {l.label}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <div className={`w-2.5 h-2.5 rounded-full mb-2 transition-colors ${isRunning ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-cream-300 dark:bg-night-lighter'}`} />
        <button onClick={toggleTheme} title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream-200 dark:hover:bg-night-lighter transition-all duration-200 text-bark dark:text-white">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06z" /></svg>
          )}
        </button>
      </div>
    </aside>
  )
}
