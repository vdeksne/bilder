import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from './FormField'

export type SelectOption = {
  value: string
  label: string
}

type SelectFormFieldProps<T extends FieldValues> = {
  label: string
  error?: string
  name: FieldPath<T>
  control: Control<T>
  options: SelectOption[]
}

export function SelectFormField<T extends FieldValues>({
  label,
  error,
  name,
  control,
  options,
}: SelectFormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField label={label} error={error}>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              className="w-full"
              aria-invalid={Boolean(error)}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  )
}
