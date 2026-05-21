import type { SelectHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FormField } from './FormField'

export type SelectOption = {
  value: string
  label: string
}

type SelectFormFieldProps = {
  label: string
  error?: string
  registration: UseFormRegisterReturn
  options: SelectOption[]
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'>

export function SelectFormField({
  label,
  error,
  registration,
  options,
  ...selectProps
}: SelectFormFieldProps) {
  return (
    <FormField label={label} error={error}>
      <select
        {...registration}
        {...selectProps}
        aria-invalid={Boolean(error)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
