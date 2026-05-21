import type { UseFormRegisterReturn } from 'react-hook-form'
import { SelectFormField } from './SelectFormField'

type CurrencySelectFieldProps = {
  label: string
  error?: string
  registration: UseFormRegisterReturn
  currencies: string[]
}

export function CurrencySelectField({
  label,
  error,
  registration,
  currencies,
}: CurrencySelectFieldProps) {
  return (
    <SelectFormField
      label={label}
      error={error}
      registration={registration}
      options={currencies.map((currency) => ({
        value: currency,
        label: currency,
      }))}
    />
  )
}
