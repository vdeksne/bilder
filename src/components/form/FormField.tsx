import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FormFieldProps = {
  label: string
  error?: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
