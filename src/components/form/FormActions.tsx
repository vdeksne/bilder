import type { ReactNode } from 'react'

type FormActionsProps = {
  children: ReactNode
}

export function FormActions({ children }: FormActionsProps) {
  return <div className="actions">{children}</div>
}
