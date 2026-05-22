import type { ReactNode } from 'react'
import {
  useForm,
  type Control,
  type DefaultValues,
  type FieldValues,
  type UseFormRegister,
} from 'react-hook-form'

type RhfStoryWrapperProps<T extends FieldValues> = {
  defaultValues: DefaultValues<T>
  children: (helpers: {
    register: UseFormRegister<T>
    control: Control<T>
  }) => ReactNode
}

export function RhfStoryWrapper<T extends FieldValues>({
  defaultValues,
  children,
}: RhfStoryWrapperProps<T>) {
  const { register, control } = useForm<T>({ defaultValues })

  return <>{children({ register, control })}</>
}
