import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { normalizeCurrency } from '@/validation/currency'
import { FormField } from './FormField'

type CurrencyComboboxFieldProps<T extends FieldValues> = {
  label: string
  error?: string
  name: FieldPath<T>
  control: Control<T>
  currencies: string[]
  placeholder?: string
}

function limitCurrencyInput(value: string): string {
  return normalizeCurrency(value).slice(0, 3)
}

export function CurrencyComboboxField<T extends FieldValues>({
  label,
  error,
  name,
  control,
  currencies,
  placeholder = 'EUR',
}: CurrencyComboboxFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField label={label} error={error}>
          <Combobox
            items={currencies}
            value={field.value ? field.value : null}
            inputValue={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value ? limitCurrencyInput(String(value)) : '')
            }}
            onInputValueChange={(inputValue) => {
              field.onChange(limitCurrencyInput(inputValue))
            }}
          >
            <ComboboxInput
              className="w-full"
              placeholder={placeholder}
              aria-invalid={Boolean(error)}
              autoComplete="off"
              onBlur={field.onBlur}
            />
            <ComboboxContent>
              <ComboboxEmpty>No matching currency.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </FormField>
      )}
    />
  )
}
