import { type InputHTMLAttributes } from 'react'
interface Props extends InputHTMLAttributes<HTMLInputElement> { label?: string; hint?: string }

export default function Input({ label, hint, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>}
      <input className={`input-field ${className}`} {...props} />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}