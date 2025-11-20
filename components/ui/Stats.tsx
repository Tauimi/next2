import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatProps {
  value: string | number
  label: string
  icon?: ReactNode
  className?: string
}

export function Stat({ value, label, icon, className }: StatProps) {
  return (
    <div className={cn('text-center', className)}>
      {icon && (
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          {icon}
        </div>
      )}
      <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
        {value}
      </div>
      <div className="text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

interface StatsGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }

  return (
    <div className={cn('grid gap-8', gridCols[columns], className)}>
      {children}
    </div>
  )
}
