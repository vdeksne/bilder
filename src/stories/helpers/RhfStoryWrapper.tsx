import type { ReactNode } from 'react'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormRegister,
} from 'react-hook-form'

type RhfStoryWrapperProps<T extends FieldValues> = {
  defaultValues: DefaultValues<T>
  children: (register: UseFormRegister<T>) => ReactNode
}

export function RhfStoryWrapper<T extends FieldValues>({
  defaultValues,
  children,
}: RhfStoryWrapperProps<T>) {
  const { register } = useForm<T>({ defaultValues })

  return <>{children(register)}</>
}
