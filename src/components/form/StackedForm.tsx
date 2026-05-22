import type { FormEventHandler, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StackedFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
  className?: string
}

export function StackedForm({ onSubmit, children, className }: StackedFormProps) {
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={onSubmit}
      noValidate
    >
      {children}
    </form>
  )
}
