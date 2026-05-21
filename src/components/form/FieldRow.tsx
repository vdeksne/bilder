import type { ReactNode } from 'react'

type FieldRowProps = {
  children: ReactNode
}

export function FieldRow({ children }: FieldRowProps) {
  return <div className="field-row">{children}</div>
}
