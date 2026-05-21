type FormRootErrorProps = {
  message?: string
}

export function FormRootError({ message }: FormRootErrorProps) {
  if (!message) {
    return null
  }

  return <p className="error">{message}</p>
}
