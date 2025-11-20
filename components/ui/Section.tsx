import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  variant?: 'default' | 'muted' | 'gradient' | 'dark'
  className?: string
}

export function Section({ children, variant = 'default', className }: SectionProps) {
  const variants = {
    default: 'bg-white text-secondary-900',
    muted: 'bg-secondary-50 text-secondary-900',
    gradient: 'bg-gradient-to-r from-primary-600 to-accent-500 text-white',
    dark: 'bg-secondary-900 text-white'
  }

  return (
    <section className={cn('py-16', variants[variant], className)}>
      {children}
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-12', className)}>
      <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
      {subtitle && (
        <p className="text-xl opacity-90 max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

interface SectionContainerProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function SectionContainer({ children, size = 'lg', className }: SectionContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn('container mx-auto px-4', sizes[size], className)}>
      {children}
    </div>
  )
}
