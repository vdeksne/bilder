import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

type FormRootErrorProps = {
  message?: string
}

export function FormRootError({ message }: FormRootErrorProps) {
  if (!message) {
    return null
  }

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
