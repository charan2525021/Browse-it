import { type TextareaHTMLAttributes } from 'react'
interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string }

export default function Textarea({ label, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>}
      <textarea className={`input-field resize-none ${className}`} {...props} />
    </div>
  )
}