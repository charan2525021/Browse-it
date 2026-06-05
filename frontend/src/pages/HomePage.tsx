import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/* ─── Circulating Words ─── */
function CirculatingWords() {
  const words = ['AUTOMATION', 'BROWSER AGENT', 'WEB SCRAPING', 'AI TESTING', 'DATA EXTRACTION', 'ENTERPRISE', 'WORKFLOW', 'COLLABORATION']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin-slow" style={{ animationDuration: '25s', width: 400, height: 400 }}>
          {words.map((word, i) => {
            const angle = (i / words.length) * 360
            const rad = (angle * Math.PI) / 180
            const r = 160
            const x = Math.cos(rad) * r
            const y = Math.sin(rad) * r
            return (
              <div key={word} className="absolute" style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: `translate(-50%, -50%) rotate(${angle + 90}deg)` }}>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-bark/30 dark:text-gold/20 whitespace-nowrap">
                  {'• • •  '}{word}{'  • • •'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[320px] h-[320px] rounded-full border border-dashed border-bark/10 dark:border-gold/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[240px] h-[240px] rounded-full border border-dotted border-bark/8 dark:border-gold/8 animate-spin-slow" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
      </div>
    </div>
  )
}

/* ─── Interactive Paper Card ─── */
function InteractivePaper({ onClick }: { onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientY - (rect.top + rect.height / 2)) / 25
    const y = -(e.clientX - (rect.left + rect.width / 2)) / 25
    setRotation({ x: Math.max(-12, Math.min(12, x)), y: Math.max(-12, Math.min(12, y)) })
  }, [])
  useEffect(() => { window.addEventListener('mousemove', handleMouseMove); return () => window.removeEventListener('mousemove', handleMouseMove) }, [handleMouseMove])

  return (
    <div ref={cardRef} onClick={onClick} className="relative w-[360px] h-[460px] cursor-pointer group"
      style={{ transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotate(-5deg)`, transformStyle: 'preserve-3d', transition: 'transform 0.08s ease-out' }}>
      <div className="absolute inset-0 bg-cream-100 dark:bg-night-lighter rounded-xl shadow-2xl shadow-black/40 overflow-hidden group-hover:shadow-gold/20 transition-shadow duration-500">
        <div className="relative h-full flex flex-col items-center justify-center p-10">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] rounded-full border border-dashed border-bark/10 dark:border-gold/15" />
            <div className="absolute w-[200px] h-[200px] rounded-full border border-dotted border-bark/8 dark:border-gold/10 animate-spin-slow" style={{ animationDuration: '20s' }} />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Browser globe icon */}
            <div className="w-20 h-20 flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bark/50 dark:text-gold/50" />
                <ellipse cx="40" cy="40" rx="16" ry="34" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-bark/40 dark:text-gold/40" />
                <line x1="6" y1="40" x2="74" y2="40" stroke="currentColor" strokeWidth="1" className="text-bark/30 dark:text-gold/30" />
                <line x1="40" y1="6" x2="40" y2="74" stroke="currentColor" strokeWidth="1" className="text-bark/30 dark:text-gold/30" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-bark dark:text-white text-center leading-snug">Your AI Browser<br/>Agent</h3>
            <p className="text-[10px] text-bark/40 dark:text-gray-500 uppercase tracking-[0.3em] font-medium">Click to Open</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-all duration-500 rounded-xl" />
      </div>
      <div className="absolute -bottom-6 left-8 right-8 h-10 bg-black/15 blur-2xl rounded-full" />
    </div>
  )
}

/* ─── Full-screen Circle View ─── */
function CircleView({ onStart }: { onStart: () => void }) {
  const words = ['AUTOMATION', 'BROWSER AGENT', 'WEB SCRAPING', 'AI TESTING', 'DATA EXTRACTION', 'ENTERPRISE', 'WORKFLOW', 'COLLABORATION']
  return (
    <div className="fixed inset-0 z-50 bg-cream-100 dark:bg-night flex flex-col items-center justify-center overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-10">
        <span className="text-lg font-bold text-bark dark:text-white tracking-tight">BrowseIt</span>
        <button onClick={onStart} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-bark bg-gold hover:bg-gold-light rounded-lg transition-colors">
          Start Agent →
        </button>
      </div>
      <div className="relative w-[700px] h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-bark/10 dark:border-gold/10" />
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '40s' }}>
          {words.map((word, i) => {
            const angle = (i / words.length) * 360
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 310
            const y = Math.sin(rad) * 310
            return (
              <div key={word} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)` }}>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-bark/40 dark:text-gold/30 whitespace-nowrap">{word}</span>
              </div>
            )
          })}
        </div>
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
          {words.map((word, i) => {
            const angle = (i / words.length) * 360 + 22.5
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * 230
            const y = Math.sin(rad) * 230
            return (
              <div key={word + '-in'} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)` }}>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-bark/25 dark:text-gold/20 whitespace-nowrap">• • • {word} • • •</span>
              </div>
            )
          })}
        </div>
        <div className="absolute inset-[40px] rounded-full border border-dashed border-bark/10 dark:border-gold/15" />
        <div className="absolute inset-[100px] rounded-full border border-dotted border-bark/8 dark:border-gold/10" />
        <div className="relative z-10 flex flex-col items-center gap-6 cursor-pointer" onClick={onStart}>
          <h1 className="text-4xl font-serif font-bold text-bark dark:text-white text-center italic">Your AI Browser Agent</h1>
          <div className="w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full text-bark/60 dark:text-gold/50">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="50" cy="50" rx="20" ry="42" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="8" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="1.5" />
              <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 15 30 Q 50 25 85 30" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M 15 70 Q 50 75 85 70" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <p className="text-sm text-bark/40 dark:text-gray-500 uppercase tracking-[0.3em]">Click to Launch</p>
        </div>
      </div>
    </div>
  )
}

/* ─── AI Particles ─── */
function AIParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-gold/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />
      ))}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gold/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
    </div>
  )
}

/* ─── Landing Page (Home) ─── */
export default function HomePage() {
  const navigate = useNavigate()
  const [showCircle, setShowCircle] = useState(false)

  if (showCircle) {
    return <CircleView onStart={() => navigate('/agent')} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-night overflow-hidden relative">
      <AIParticles />
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-bark text-sm font-bold shadow-lg shadow-gold/20">B</div>
          <span className="text-lg font-bold text-white tracking-tight">BrowseIt</span>
        </div>
        <nav className="flex items-center gap-6">
          <button onClick={() => navigate('/agent')} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-bark bg-gold hover:bg-gold-light rounded-lg transition-colors shadow-lg shadow-gold/20">
            Start Agent
          </button>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex items-center px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl lg:text-6xl font-serif text-white leading-[1.1]">
              The automation<br/>layer for <span className="text-gold italic">AI</span><br/>browser teams
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              The browser automation, testing, and data extraction stack you'd build eventually — shipped today.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button onClick={() => navigate('/agent')} className="px-6 py-3 bg-gold hover:bg-gold-light text-bark font-bold text-sm uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-gold/20 hover:-translate-y-0.5">
                Launch Agent
              </button>
              <button onClick={() => setShowCircle(true)} className="px-6 py-3 border border-gray-600 hover:border-gold text-white hover:text-gold font-bold text-sm uppercase tracking-wider rounded-lg transition-all hover:-translate-y-0.5">
                Explore
              </button>
            </div>
            <div className="mt-8">
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-3">Trusted by companies like you</p>
              <div className="flex items-center gap-8 opacity-60">
                {['OpenAI', 'Anthropic', 'Google', 'Groq'].map(n => <span key={n} className="text-sm font-bold text-gray-400">{n}</span>)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <InteractivePaper onClick={() => setShowCircle(true)} />
          </div>
        </div>
      </div>
    </div>
  )
}
