import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'muted' | 'white' | 'hover'
  className?: string
}

export function Card({ children, variant = 'default', className }: CardProps) {
  const variants = {
    default: 'bg-white border border-secondary-200 shadow-sm',
    muted: 'bg-muted/50',
    white: 'bg-white',
    hover: 'bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
  }

  return (
    <div className={cn('rounded-xl p-6', variants[variant], className)}>
      {children}
    </div>
  )
}

interface IconCardProps {
  icon: ReactNode
  title: string
  description?: string
  children?: ReactNode
  className?: string
  centered?: boolean
}

export function IconCard({ icon, title, description, children, className, centered = false }: IconCardProps) {
  return (
    <Card variant="muted" className={cn(centered && 'text-center', className)}>
      <div className={cn('w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6', centered && 'mx-auto')}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      {children}
    </Card>
  )
}

interface StepCardProps {
  step: number | string
  title: string
  description: string
  className?: string
}

export function StepCard({ step, title, description, className }: StepCardProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {step}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
