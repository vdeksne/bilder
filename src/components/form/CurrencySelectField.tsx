import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { SelectFormField } from './SelectFormField'

type CurrencySelectFieldProps<T extends FieldValues> = {
  label: string
  error?: string
  name: FieldPath<T>
  control: Control<T>
  currencies: string[]
}

export function CurrencySelectField<T extends FieldValues>({
  label,
  error,
  name,
  control,
  currencies,
}: CurrencySelectFieldProps<T>) {
  return (
    <SelectFormField
      label={label}
      error={error}
      name={name}
      control={control}
      options={currencies.map((currency) => ({
        value: currency,
        label: currency,
      }))}
    />
  )
}
