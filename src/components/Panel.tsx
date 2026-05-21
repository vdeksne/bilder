import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  description: ReactNode
  children: ReactNode
}

export function Panel({ title, description, children }: PanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p className="hint">{description}</p>
      {children}
    </section>
  )
}
