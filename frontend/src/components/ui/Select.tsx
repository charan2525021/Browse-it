import { type SelectHTMLAttributes } from 'react'
interface Props extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[] }

export default function Select({ label, options, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>}
      <select className={`select-field ${className}`} {...props}>
        {options.map(o => <option key={o.value} value={o.value} className="bg-navy-800">{o.label}</option>)}
      </select>
    </div>
  )
}