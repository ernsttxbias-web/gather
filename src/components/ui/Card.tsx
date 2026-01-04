import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', padding = 'md', hoverable = false, onClick }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        bg-[var(--surface-elevated)]
        border border-[var(--border)]
        shadow-sm
        ${paddings[padding]}
        ${hoverable ? 'cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
