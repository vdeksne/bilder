import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from './FormField'

type TextFormFieldProps = {
  label: string
  error?: string
  registration: UseFormRegisterReturn
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>

export function TextFormField({
  label,
  error,
  registration,
  ...inputProps
}: TextFormFieldProps) {
  return (
    <FormField label={label} error={error}>
      <Input
        {...registration}
        {...inputProps}
        aria-invalid={Boolean(error)}
      />
    </FormField>
  )
}
