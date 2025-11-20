import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ children, variant = 'primary', size = 'md', className }: BadgeProps) {
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary-100 text-secondary-900',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    accent: 'bg-accent-500 text-white'
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

interface CategoryBadgeProps {
  children: ReactNode
  className?: string
}

export function CategoryBadge({ children, className }: CategoryBadgeProps) {
  return (
    <Badge variant="primary" size="sm" className={cn('rounded-full', className)}>
      {children}
    </Badge>
  )
}
