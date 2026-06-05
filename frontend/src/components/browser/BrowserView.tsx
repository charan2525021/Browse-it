import { useAgentStore } from '@/store/agentStore'
import { useState, useRef } from 'react'

export default function BrowserView() {
  const { screenshot, browserUrl, isRunning } = useAgentStore()
  const contentRef = useRef<HTMLDivElement>(null)
  const [maximized, setMaximized] = useState(false)

  const domain = browserUrl ? (() => { try { return new URL(browserUrl).hostname } catch { return browserUrl } })() : ''

  const containerClass = maximized
    ? 'fixed inset-0 z-50 flex flex-col bg-cream-100 dark:bg-night'
    : 'bg-cream-50 dark:bg-night-light rounded-2xl border border-cream-300 dark:border-night-lighter flex flex-col h-full overflow-hidden shadow-lg dark:shadow-black/30'

  return (
    <div className={containerClass}>
      {/* Title Bar */}
      <div className="flex items-center px-4 py-2 bg-cream-200 dark:bg-night-lighter border-b border-cream-300 dark:border-night-lighter shrink-0">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] cursor-pointer" onClick={() => setMaximized(!maximized)} title={maximized ? 'Exit fullscreen' : 'Maximize'} />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cream-50 dark:bg-night rounded-t-lg border border-b-0 border-cream-300 dark:border-night-lighter max-w-[200px]">
          {browserUrl && <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`} alt="" className="w-3.5 h-3.5" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          <span className="text-xs text-bark dark:text-gray-300 truncate font-medium">{domain || 'New Tab'}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {/* Maximize button */}
          <button onClick={() => setMaximized(!maximized)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-cream-300 dark:hover:bg-night text-bark/50 dark:text-gray-500 transition-colors" title={maximized ? 'Exit fullscreen' : 'Maximize'}>
            {maximized ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M5.75 1a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5A2.25 2.25 0 0 0 6.5 4.25v-2.5A.75.75 0 0 0 5.75 1ZM10.25 1a.75.75 0 0 0-.75.75v2.5A2.25 2.25 0 0 0 11.75 6.5h2.5a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75ZM5.75 15a.75.75 0 0 0 .75-.75v-2.5A2.25 2.25 0 0 0 4.25 9.5h-2.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 0 .75.75ZM10.25 15a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 0 0-1.5h-2.5A2.25 2.25 0 0 0 9.5 11.75v2.5a.75.75 0 0 0 .75.75Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M2.75 4a.75.75 0 0 0-.75.75v6.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75v-6.5a.75.75 0 0 0-.75-.75H2.75ZM1 4.75A1.75 1.75 0 0 1 2.75 3h10.5A1.75 1.75 0 0 1 15 4.75v6.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 11.25v-6.5Z" clipRule="evenodd" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-cream-50 dark:bg-night border-b border-cream-300 dark:border-night-lighter shrink-0">
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-bark/30 dark:text-gray-600" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z" clipRule="evenodd" /></svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md text-bark/30 dark:text-gray-600" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" /></svg>
          </button>
          {isRunning && <div className="w-3.5 h-3.5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />}
        </div>
        <div className="flex-1 flex items-center gap-2 bg-cream-100 dark:bg-night-lighter rounded-lg px-3 py-1.5 border border-cream-300 dark:border-night-lighter">
          {browserUrl && browserUrl.startsWith('https') && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-green-500 shrink-0"><path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" /></svg>}
          <span className="text-xs text-bark/60 dark:text-gray-400 font-mono truncate flex-1">{browserUrl || 'about:blank'}</span>
          {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />}
        </div>
      </div>

      {/* Page Content */}
      <div ref={contentRef} className="flex-1 min-h-0 relative bg-white dark:bg-[#1c1c1c] overflow-hidden">
        {screenshot ? (
          <img src={`data:image/png;base64,${screenshot}`} alt="Browser" className="w-full h-full object-contain object-top bg-white" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 min-h-[300px]">
            {isRunning ? (
              <>
                <div className="w-10 h-10 border-[3px] border-gold/20 border-t-gold rounded-full animate-spin" />
                <p className="text-sm text-bark/60 dark:text-gray-400 font-medium">Navigating...</p>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 dark:bg-night-lighter flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-bark/20 dark:text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-bark/50 dark:text-gray-500">No active session</p>
                <p className="text-xs text-bark/30 dark:text-gray-600 mt-1">Start a task to launch the browser</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
