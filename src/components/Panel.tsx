import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type PanelProps = {
  title: string
  description: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, description, children, className }: PanelProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">{children}</CardContent>
    </Card>
  )
}
