import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FormActionsProps = {
  children: ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
    </div>
  )
}
