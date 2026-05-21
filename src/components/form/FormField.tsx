import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label>
      {label}
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}
