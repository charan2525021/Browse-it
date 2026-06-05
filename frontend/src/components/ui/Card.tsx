export default function Card({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`glass-card gradient-border p-5 transition-all duration-300 ${glow ? 'shadow-glow-indigo' : ''} ${className}`}>
      {children}
    </div>
  )
}