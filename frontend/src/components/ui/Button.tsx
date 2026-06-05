import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost' | 'success' | 'warning'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: 'sm' | 'md' | 'lg'; loading?: boolean
}

export default function Button({ variant = 'primary', size = 'sm', loading, className = '', children, disabled, ...props }: Props) {
  const cls = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
    success: 'btn-success',
    warning: 'btn-warning',
  }[variant]

  const sz = { sm: 'px-4 py-2 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' }[size]

  return (
    <button className={`${cls} ${sz} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}