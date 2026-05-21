import type { FormEventHandler, ReactNode } from 'react'

type StackedFormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

export function StackedForm({ onSubmit, children }: StackedFormProps) {
  return (
    <form className="stacked-form" onSubmit={onSubmit} noValidate>
      {children}
    </form>
  )
}
