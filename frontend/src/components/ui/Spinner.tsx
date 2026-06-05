export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-[3px]' }[size]
  return (
    <span
      className={`${s} rounded-full animate-spin inline-block`}
      style={{ borderTopColor: '#6366f1', borderColor: 'rgba(99,102,241,0.2)' }}
    />
  )
}